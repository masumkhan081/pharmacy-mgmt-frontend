import Button from "./Button";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) {
  const safeTotal = Number(total) || 0;
  const safeSize = Number(pageSize) || 10;
  const totalPages = Math.max(1, Math.ceil(safeTotal / safeSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = safeTotal === 0 ? 0 : (safePage - 1) * safeSize + 1;
  const end = Math.min(safePage * safeSize, safeTotal);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
      <div className="text-gray-600">
        {safeTotal > 0 ? `${start}-${end} of ${safeTotal}` : "No results"}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-gray-600">Rows:</label>
        <select
          className="border rounded px-2 py-1"
          value={safeSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <Button
          txt="Prev"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        />
        <span className="text-gray-700">
          Page {safePage} / {totalPages}
        </span>
        <Button
          txt="Next"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
        />
      </div>
    </div>
  );
}
