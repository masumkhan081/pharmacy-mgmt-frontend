import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../common-ui/Button";

const tabs = [
  { key: "batches", label: "Batches" },
  { key: "alerts", label: "Alerts" },
];

export default function ViewFilterInventory() {
  const navigate = useNavigate();
  const currentView = useSelector((s) => s.inventoryView.currentView);
  const activeStyle = (k) =>
    k === currentView ? "bg-primary-100 text-primary-700 border-primary-300" : "";

  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((t) => (
        <Button
          key={t.key}
          txt={t.label}
          onClick={() => navigate(`/inventory/${t.key}`)}
          style={`btn-test-data capitalize ${activeStyle(t.key)}`}
        />
      ))}
    </div>
  );
}
