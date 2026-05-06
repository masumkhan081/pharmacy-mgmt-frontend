import { useCallback, useEffect, useRef, useState } from "react";
import { getHandler } from "../utils/handlerReqRes";

const DEFAULT_PAGE_SIZE = 10;

export function useTableQuery({
  endpoint,
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

  const reqIdRef = useRef(0);
  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    const id = ++reqIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(pageSize));
      if (search) params.set("search", search);
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
      const res = await getHandler(`${endpoint}?${params.toString()}`);
      if (id !== reqIdRef.current) return;
      const rows = Array.isArray(res?.data) ? res.data : [];
      const pagination = res?.meta?.pagination ?? res?.meta ?? {};
      setData(rows);
      setMeta({
        total: Number(pagination.total ?? rows.length) || 0,
        page: Number(pagination.page ?? page) || page,
        limit: Number(pagination.limit ?? pageSize) || pageSize,
      });
      if (typeof onLoadedRef.current === "function") {
        onLoadedRef.current(rows, pagination);
      }
    } catch (e) {
      if (id !== reqIdRef.current) return;
      setError(e);
      setData([]);
      setMeta((m) => ({ ...m, total: 0 }));
    } finally {
      if (id === reqIdRef.current) setLoading(false);
    }
  }, [endpoint, page, pageSize, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    refetch: fetchData,
  };
}
