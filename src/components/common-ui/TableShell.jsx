import TableSearch from "./TableSearch";
import TablePagination from "./TablePagination";

export default function TableShell({
  query,
  searchPlaceholder,
  toolbar,
  empty = "No records found.",
  children,
}) {
  const {
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    meta,
    loading,
    error,
    data,
  } = query;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TableSearch
          value={search}
          onSearch={setSearch}
          placeholder={searchPlaceholder}
        />
        {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
      </div>

      {error && (
        <div className="text-error-600 text-sm py-1">
          {error.message || "Failed to load data."}
        </div>
      )}

      <div className="relative min-h-[320px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex flex-col items-center justify-center gap-3 text-sm text-gray-600">
            <div className="w-10 h-10 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        )}
        {children}
        {!loading && (data?.length ?? 0) === 0 && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            {empty}
          </div>
        )}
      </div>

      <TablePagination
        page={meta?.page || page}
        pageSize={meta?.limit || pageSize}
        total={meta?.total || 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
