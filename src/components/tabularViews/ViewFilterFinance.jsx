import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../common-ui/Button";

const tabs = [
  { key: "invoices", label: "Invoices" },
  { key: "payments", label: "Payments" },
];

export default function ViewFilterFinance() {
  const navigate = useNavigate();
  const currentView = useSelector((s) => s.financeView.currentView);
  const activeStyle = (k) =>
    k === currentView ? "bg-primary-100 text-primary-700 border-primary-300" : "";

  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((t) => (
        <Button
          key={t.key}
          txt={t.label}
          onClick={() => navigate(`/finance/${t.key}`)}
          style={`btn-test-data capitalize ${activeStyle(t.key)}`}
        />
      ))}
    </div>
  );
}
