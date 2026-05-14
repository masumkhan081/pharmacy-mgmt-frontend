import { useEffect, useState } from "react";
import PageTitle from "../components/common-ui/PageTitle";
import { getHandler } from "../utils/handlerReqRes";
import {
  AiOutlineWarning,
  AiOutlineShoppingCart,
  AiOutlineClockCircle,
  AiOutlineMoneyCollect,
} from "react-icons/ai";

const entityCards = [
  { key: "drugs", label: "Drugs", endpoint: "/drugs?limit=1" },
  { key: "customers", label: "Customers", endpoint: "/customers?limit=1" },
  { key: "suppliers", label: "Suppliers", endpoint: "/suppliers?limit=1" },
  { key: "sales", label: "Sales", endpoint: "/sales?limit=1" },
  { key: "invoices", label: "Invoices", endpoint: "/invoices?limit=1" },
  { key: "returns", label: "Returns", endpoint: "/returns?limit=1" },
];

const EMPTY_OP_STATS = {
  todaySalesAmount: 0,
  lowStockCount: 0,
  expiringBatchesCount: 0,
  unpaidInvoicesCount: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [opStats, setOpStats] = useState(EMPTY_OP_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    setLoading(true);

    (async () => {
      const [entityResults, opResults] = await Promise.all([
        Promise.all(
          entityCards.map(async (c) => {
            try {
              const res = await getHandler(c.endpoint, {
                signal: controller.signal,
              });
              const total =
                res?.meta?.pagination?.total ?? res?.meta?.total ?? 0;
              return [c.key, total];
            } catch {
              return [c.key, "—"];
            }
          })
        ),
        getHandler("/dashboard/stats", { signal: controller.signal }).catch(
          () => null
        ),
      ]);
      if (cancelled) return;
      setStats(Object.fromEntries(entityResults));
      setOpStats(opResults?.data ?? EMPTY_OP_STATS);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 md:px-6 pt-6">
      <PageTitle title="Dashboard Overview" />

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5 flex items-center gap-4">
          <div className="bg-primary-50 p-3 rounded-full text-primary-600">
            <AiOutlineShoppingCart size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Today's Sales</span>
            <span className="text-2xl font-bold text-neutral-900">${opStats.todaySalesAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4 ${opStats.lowStockCount > 0 ? "border-warning-200" : "border-neutral-200"}`}>
          <div className={`p-3 rounded-full ${opStats.lowStockCount > 0 ? "bg-warning-50 text-warning-600" : "bg-neutral-50 text-neutral-400"}`}>
            <AiOutlineWarning size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Low Stock Drugs</span>
            <span className={`text-2xl font-bold ${opStats.lowStockCount > 0 ? "text-warning-700" : "text-neutral-900"}`}>
              {opStats.lowStockCount}
            </span>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4 ${opStats.expiringBatchesCount > 0 ? "border-error-200" : "border-neutral-200"}`}>
          <div className={`p-3 rounded-full ${opStats.expiringBatchesCount > 0 ? "bg-error-50 text-error-600" : "bg-neutral-50 text-neutral-400"}`}>
            <AiOutlineClockCircle size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Expiring Batches</span>
            <span className={`text-2xl font-bold ${opStats.expiringBatchesCount > 0 ? "text-error-700" : "text-neutral-900"}`}>
              {opStats.expiringBatchesCount}
            </span>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4 ${opStats.unpaidInvoicesCount > 0 ? "border-amber-200" : "border-neutral-200"}`}>
          <div className={`p-3 rounded-full ${opStats.unpaidInvoicesCount > 0 ? "bg-amber-50 text-amber-600" : "bg-neutral-50 text-neutral-400"}`}>
            <AiOutlineMoneyCollect size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Unpaid Invoices</span>
            <span className={`text-2xl font-bold ${opStats.unpaidInvoicesCount > 0 ? "text-amber-700" : "text-neutral-900"}`}>
              {opStats.unpaidInvoicesCount}
            </span>
          </div>
        </div>
      </div>

      <div className="divider text-neutral-300">Quick Stats</div>

      {/* Entity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {entityCards.map((c) => (
          <div
            key={c.key}
            className="bg-white rounded-lg border border-neutral-100 p-4 flex flex-col gap-1 transition-hover hover:border-primary-200 hover:shadow-sm"
          >
            <span className="text-xs text-neutral-400 font-medium">{c.label}</span>
            <span className="text-xl font-bold text-neutral-700">
              {loading ? "—" : stats[c.key] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
