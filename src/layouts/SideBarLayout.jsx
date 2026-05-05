import { useState } from "react";
import { Outlet } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import NavLeft from "../components/partials/NavLeft";

export default function SideBarLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex flex-1 min-h-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden fixed bottom-4 right-4 z-30 bg-primary-600 text-white rounded-full p-3 shadow-lg hover:bg-primary-700 transition-colors"
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        {open ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-neutral-900/40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          fixed md:static inset-y-0 left-0 z-20 w-64 md:w-auto md:basis-1/5
          transition-transform duration-200 ease-in-out
          bg-white overflow-y-auto`}
        onClick={() => setOpen(false)}
      >
        <NavLeft />
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto px-4 py-4 bg-neutral-50">
        <Outlet />
      </main>
    </div>
  );
}
