import { useEffect, useState } from "react";
import PageTitle from "../components/common-ui/PageTitle";
import { getHandler } from "../utils/handlerReqRes";

const cards = [
  { key: "drugs", label: "Drugs", endpoint: "/drugs?limit=1" },
  { key: "customers", label: "Customers", endpoint: "/customers?limit=1" },
  { key: "suppliers", label: "Suppliers", endpoint: "/suppliers?limit=1" },
  { key: "doctors", label: "Doctors", endpoint: "/doctors?limit=1" },
  { key: "sales", label: "Sales", endpoint: "/sales?limit=1" },
  { key: "purchases", label: "Purchases", endpoint: "/purchases?limit=1" },
  { key: "prescriptions", label: "Prescriptions", endpoint: "/prescriptions?limit=1" },
  { key: "invoices", label: "Invoices", endpoint: "/invoices?limit=1" },
  { key: "payments", label: "Payments", endpoint: "/payments?limit=1" },
  { key: "returns", label: "Returns", endpoint: "/returns?limit=1" },
  { key: "alerts", label: "Inventory Alerts", endpoint: "/inventory-alerts?limit=1" },
  { key: "staff", label: "Staff", endpoint: "/staff?limit=1" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          cards.map(async (c) => {
            try {
              const res = await getHandler(c.endpoint);
              const total = res?.meta?.pagination?.total ?? res?.meta?.total ?? 0;
              return [c.key, total];
            } catch {
              return [c.key, "—"];
            }
          })
        );
        if (!cancelled) {
          setStats(Object.fromEntries(results));
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-5 md:px-6 pt-6">
      <PageTitle title="Dashboard" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.key}
            className="bg-white rounded-xl shadow border border-neutral-200 p-4 flex flex-col gap-1"
          >
            <span className="text-sm text-neutral-500">{c.label}</span>
            <span className="text-2xl font-semibold text-neutral-800">
              {loading ? "..." : stats[c.key] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
