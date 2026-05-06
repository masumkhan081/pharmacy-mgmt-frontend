import { useEffect, useRef, useState } from "react";
import Input from "./Input";
import Button from "./Button";

const DEBOUNCE_MS = 400;

export default function TableSearch({
  value,
  onSearch,
  placeholder = "Search...",
}) {
  const [draft, setDraft] = useState(value ?? "");
  const timerRef = useRef(null);
  const lastFiredRef = useRef(value ?? "");

  useEffect(() => {
    const incoming = value ?? "";
    if (incoming !== lastFiredRef.current) {
      lastFiredRef.current = incoming;
      setDraft(incoming);
    }
  }, [value]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (draft !== lastFiredRef.current) {
        lastFiredRef.current = draft;
        onSearch(draft);
      }
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [draft, onSearch]);

  const fireNow = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (draft !== lastFiredRef.current) {
      lastFiredRef.current = draft;
      onSearch(draft);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="text"
        value={draft}
        style="border"
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            fireNow();
          }
        }}
      />
      <Button txt="Search" onClick={fireNow} />
    </div>
  );
}
