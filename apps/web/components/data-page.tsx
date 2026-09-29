"use client"

import { useCallback, useEffect, useState } from "react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@workspace/ui/components/select"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { ApiError, Paged } from "@/lib/api"
import {
  Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle,
} from "@workspace/ui/components/empty"

interface Props<T> {
  title: string
  description?: string
  fetcher: (query: string) => Promise<Paged<T>>
  columns: string[]
  row: (item: T) => React.ReactNode
  statusOptions?: string[]
  searchPlaceholder?: string
  emptyTitle?: string
}

/** Shared list page: search + status filter + server-side pagination. */
export function DataPage<T extends object>({
  title, description, fetcher, columns, row,
  statusOptions, searchPlaceholder, emptyTitle,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // debounce search 300ms — never hammer the API per keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const q = new URLSearchParams({ page: String(page), page_size: "25" })
      if (status) q.set("status", status)
      if (debounced) q.set("search", debounced)
      const res = await fetcher(`?${q}`)
      setItems(res.results)
      setCount(res.count)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load.")
    } finally {
      setLoading(false)
    }
  }, [fetcher, page, status, debounced])

  useEffect(() => {
    void load()
  }, [load])

  const pages = Math.max(1, Math.ceil(count / 25))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder={searchPlaceholder ?? "Search…"}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-64"
        />
        {statusOptions && (
          <Select
            value={status || "all"}
            onValueChange={(v) => { setStatus(v === "all" || v == null ? "" : v); setPage(1) }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button variant="outline" onClick={() => void load()}
          disabled={loading}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-500/40">
          <CardContent className="p-4 text-sm text-red-500">{error}</CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground border-b text-left text-xs uppercase tracking-wide">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="px-4 py-3 font-medium">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {columns.map((c) => (
                      <td key={c} className="px-4 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <Empty className="py-10">
                      <EmptyHeader>
                        <EmptyTitle>{emptyTitle ?? "Nothing here yet"}</EmptyTitle>
                        <EmptyDescription>
                          Records will appear here once provider activity flows in.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent />
                    </Empty>
                  </td>
                </tr>
              ) : (
                items.map((item) => row(item))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-muted-foreground px-3 text-sm">
                Page {page} of {pages} · {count} total
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                aria-disabled={page === pages}
                className={page === pages ? "pointer-events-none opacity-40" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
