"use client"

import { useDebouncedState } from "@mantine/hooks"
import type { Category, Tool } from "@prisma/client"
import { LoaderIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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

type SearchResult = {
  tools: Tool[]
  categories: Category[]
}

type CommandMenuProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const CommandMenu = ({ isOpen, onOpenChange }: CommandMenuProps) => {
  const router = useRouter()
  const [query, setQuery] = useDebouncedState("", 100)
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)

  const { execute, isPending } = useServerAction(searchItems, {
    onSuccess: ({ data }) => {
      setSearchResults(data)
    },

    onError: ({ err }) => {
      console.error(err)
      setSearchResults(null)
    },
  })

  useEffect(() => {
    const performSearch = async () => {
      if (query.length > 1) {
        execute({ query })
      } else {
        setSearchResults(null)
      }
    }

    performSearch()
  }, [query])

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)

    // Clear search results
    !newOpen && clearSearch()
  }

  const handleSelect = (url: string) => {
    handleOpenChange(false)
    router.push(url)
  }

  const clearSearch = () => {
    setTimeout(() => {
      setSearchResults(null)
      setQuery("")
    }, 250)
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <CommandInput placeholder="Type to search..." onValueChange={setQuery} />

      {isPending && (
        <div className="absolute top-4 left-3 bg-background text-muted-foreground">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      )}

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Create">
          <CommandItem onSelect={() => handleSelect("/admin/tools/new")}>
            New Tool
            <CommandShortcut meta>1</CommandShortcut>
          </CommandItem>

          <CommandItem onSelect={() => handleSelect("/admin/categories/new")}>
            New Category
            <CommandShortcut meta>2</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        {!!searchResults?.tools.length && (
          <CommandGroup heading="Tools">
            {searchResults.tools.map(tool => (
              <CommandItem key={tool.id} onSelect={() => handleSelect(`/admin/tools/${tool.slug}`)}>
                {tool.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!!searchResults?.categories.length && (
          <CommandGroup heading="Categories">
            {searchResults.categories.map(category => (
              <CommandItem
                key={category.id}
                onSelect={() => handleSelect(`/admin/categories/${category.slug}`)}
              >
                {category.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
