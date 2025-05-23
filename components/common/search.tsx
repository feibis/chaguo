"use client"

import { getUrlHostname } from "@curiousleaf/utils"
import { type HotkeyItem, useDebouncedState, useHotkeys } from "@mantine/hooks"
import { LoaderIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import posthog from "posthog-js"
import { type ReactNode, useEffect, useRef, useState } from "react"
import type { inferServerActionReturnData } from "zsa"
import { useServerAction } from "zsa-react"
import { searchItems } from "~/actions/search"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "~/components/common/command"
import { Kbd } from "~/components/common/kbd"
import { useSearch } from "~/contexts/search-context"
import { useSession } from "~/lib/auth-client"

type SearchResultsProps<T> = {
  name: string
  items: T[] | undefined
  onItemSelect: (url: string) => void
  getHref: (item: T) => string
  renderItemDisplay: (item: T) => ReactNode
}

const SearchResults = <T extends { slug: string; name: string }>({
  name,
  items,
  onItemSelect,
  getHref,
  renderItemDisplay,
}: SearchResultsProps<T>) => {
  if (!items?.length) return null

  return (
    <CommandGroup heading={name}>
      {items.map(item => (
        <CommandItem
          key={item.slug}
          value={`${name.toLowerCase()}:${item.slug}`}
          onSelect={() => onItemSelect(getHref(item))}
        >
          {renderItemDisplay(item)}
        </CommandItem>
      ))}
    </CommandGroup>
  )
}

type CommandSection = {
  name: string
  items: {
    label: string
    path: string
    shortcut?: boolean
  }[]
}

export const Search = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearch()
  const [results, setResults] = useState<inferServerActionReturnData<typeof searchItems>>()
  const [query, setQuery] = useDebouncedState("", 250)
  const listRef = useRef<HTMLDivElement>(null)

  const isAdmin = session?.user.role === "admin"
  const isAdminPath = pathname.startsWith("/admin")
  const hasQuery = !!query.length

  const clearSearch = () => {
    setTimeout(() => {
      setResults(undefined)
      setQuery("")
    }, 250)
  }

  const handleOpenChange = (open: boolean) => {
    open ? search.open() : search.close()
    if (!open) clearSearch()
  }

  const navigateTo = (path: string) => {
    router.push(path)
    handleOpenChange(false)
  }

  const commandSections: CommandSection[] = []
  const hotkeys: HotkeyItem[] = [["mod+K", () => search.open()]]

  // Admin command sections & hotkeys
  if (isAdmin) {
    commandSections.push({
      name: "Create",
      items: [
        {
          label: "New Tool",
          path: "/admin/tools/new",
          shortcut: true,
        },
        {
          label: "New Category",
          path: "/admin/categories/new",
          shortcut: true,
        },
        {
          label: "New Tag",
          path: "/admin/tags/new",
          shortcut: true,
        },
      ],
    })

    for (const [i, { path, shortcut }] of commandSections[0].items.entries()) {
      shortcut && hotkeys.push([`mod+${i + 1}`, () => navigateTo(path)])
    }

    // User command sections & hotkeys
  } else {
    commandSections.push({
      name: "Quick Links",
      items: [
        { label: "Tools", path: "/" },
        { label: "Categories", path: "/categories" },
        { label: "Tags", path: "/tags" },
      ],
    })
  }

  useHotkeys(hotkeys, [], true)

  const { execute, isPending } = useServerAction(searchItems, {
    onSuccess: ({ data }) => {
      setResults(data)
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    },

    onError: ({ err }) => {
      console.error(err)
      setResults(undefined)
    },
  })

  useEffect(() => {
    const performSearch = async () => {
      if (hasQuery) {
        execute({ query })
        posthog.capture("search", { query })
      } else {
        setResults(undefined)
      }
    }

    performSearch()
  }, [query, execute])

  return (
    <CommandDialog open={search.isOpen} onOpenChange={handleOpenChange} shouldFilter={false}>
      <CommandInput
        placeholder="Type to search..."
        onValueChange={setQuery}
        className="pr-10"
        prefix={isPending && <LoaderIcon className="animate-spin" />}
        suffix={<Kbd meta>K</Kbd>}
      />

      {hasQuery && !isPending && <CommandEmpty>No results found.</CommandEmpty>}

      <CommandList ref={listRef}>
        {!hasQuery &&
          commandSections.map(({ name, items }) => (
            <CommandGroup key={name} heading={name}>
              {items.map(({ path, label, shortcut }, i) => (
                <CommandItem key={path} onSelect={() => navigateTo(path)}>
                  {label}
                  {shortcut && <CommandShortcut meta>{i + 1}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

        <SearchResults
          name="Tools"
          items={results?.tools}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdminPath ? "/admin/tools" : ""}/${slug}`}
          renderItemDisplay={({ name, faviconUrl, websiteUrl }) => (
            <>
              {faviconUrl && <img src={faviconUrl} alt="" width={16} height={16} />}
              <span className="flex-1 truncate">{name}</span>
              <span className="opacity-50">{getUrlHostname(websiteUrl)}</span>
            </>
          )}
        />

        <SearchResults
          name="Categories"
          items={results?.categories}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdminPath ? "/admin" : ""}/categories/${slug}`}
          renderItemDisplay={({ name }) => name}
        />

        <SearchResults
          name="Tags"
          items={results?.tags}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdminPath ? "/admin" : ""}/tags/${slug}`}
          renderItemDisplay={({ name }) => name}
        />
      </CommandList>
    </CommandDialog>
  )
}
