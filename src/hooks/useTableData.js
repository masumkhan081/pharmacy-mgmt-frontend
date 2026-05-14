import { useCallback, useEffect, useRef, useState } from "react";
import { getHandler } from "../utils/handlerReqRes";

const DEFAULT_PAGE_SIZE = 10;

// Plain useEffect-driven paginated fetcher.
// - Listens to an external `refreshKey` (typically `state.<slice>.refreshKey`)
//   so a `bumpRefresh()` dispatch after a mutation reloads the table.
// - Aborts the in-flight request on dependency changes / unmount to avoid
//   stale writes overwriting fresh state.
// - Search debouncing lives in `TableSearch`, not here — when `search` flips
//   it's already the debounced value.
export function useTableData({
  endpoint,
  refreshKey = 0,
  initialPageSize = DEFAULT_PAGE_SIZE,
  initialSortBy = "createdAt",
  initialSortOrder = "desc",
  onLoaded,
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [search, setSearchState] = useState("");
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: initialPageSize,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [internalKey, setInternalKey] = useState(0);

  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  useEffect(() => {
    if (!endpoint) return undefined;
    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(pageSize));
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    (async () => {
      try {
        const res = await getHandler(`${endpoint}?${params.toString()}`, {
          signal: controller.signal,
        });
        if (cancelled) return;
        const rows = Array.isArray(res?.data) ? res.data : [];
        const pagination = res?.meta?.pagination ?? res?.meta ?? {};
        const nextMeta = {
          total: Number(pagination.total ?? rows.length) || 0,
          page: Number(pagination.page ?? page) || page,
          limit: Number(pagination.limit ?? pageSize) || pageSize,
        };
        setData(rows);
        setMeta(nextMeta);
        if (typeof onLoadedRef.current === "function") {
          onLoadedRef.current(rows, pagination);
        }
      } catch (err) {
        if (cancelled) return;
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [endpoint, page, pageSize, search, sortBy, sortOrder, refreshKey, internalKey]);

  const setSearch = useCallback((next) => {
    setSearchState(next ?? "");
    setPage(1);
  }, []);

  const setPageSize = useCallback(
    (next) => {
      setPageSizeState(Number(next) || initialPageSize);
      setPage(1);
    },
    [initialPageSize]
  );

  const refetch = useCallback(() => setInternalKey((k) => k + 1), []);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    data,
    meta,
    loading,
    error,
    refetch,
  };
}
