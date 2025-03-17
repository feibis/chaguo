"use client"

import { type Values, useQueryStates } from "nuqs"
import { type PropsWithChildren, createContext, use, useTransition } from "react"
import { toolsFilterParamsSchema } from "~/server/web/tools/schemas"

export type FiltersContextType = {
  filters: Values<typeof toolsFilterParamsSchema>
  isLoading: boolean
  updateFilters: (values: Partial<Values<typeof toolsFilterParamsSchema>>) => void
}

const FiltersContext = createContext<FiltersContextType>(null!)

const FiltersProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, startTransition] = useTransition()

  const [filters, setFilters] = useQueryStates(toolsFilterParamsSchema, {
    shallow: false,
    throttleMs: 300,
    startTransition,
  })

  const updateFilters = (values: Partial<Values<typeof toolsFilterParamsSchema>>) => {
    setFilters(prev => ({ ...prev, ...values, page: null }))
  }

  return (
    <FiltersContext.Provider value={{ filters, isLoading, updateFilters }}>
      {children}
    </FiltersContext.Provider>
  )
}

const useFilters = () => {
  const context = use(FiltersContext)

  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider")
  }

  return context
}

export { FiltersProvider, useFilters }
