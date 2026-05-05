import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiFillCaretRight } from "react-icons/ai";
import navMap from "../../ui-config/left-nav";

const STORAGE_KEY = "nav.expansion";

const readInitialExpansion = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === "object") return saved;
  } catch {
    // fall through
  }
  return { Drugs: false, Staff: false };
};

const isAllowed = (item, role) =>
  !item.isAccessControlled || (item.access?.includes(role) ?? false);

export default function NavLeft() {
  const location = useLocation();
  const userRole = useSelector((state) => state.user.userRole);
  const [expansion, setExpansion] = useState(readInitialExpansion);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expansion));
  }, [expansion]);

  const toggle = (key) =>
    setExpansion((prev) => ({ ...prev, [key]: !prev[key] }));

  const isSectionActive = (item) =>
    location.pathname.startsWith(item.to) ||
    Object.values(item.options ?? {}).some((opt) =>
      location.pathname.startsWith(opt.to)
    );

  return (
    <ul className="nav-left-container">
      {Object.values(navMap)
        .filter((item) => isAllowed(item, userRole))
        .map((item) => {
          const expanded = !!expansion[item.text];
          const active = isSectionActive(item);

          return (
            <li className="flex flex-col w-full" key={item.text}>
              <NavLink
                to={item.to}
                onClick={() => item.options && toggle(item.text)}
                className={`nav-main-item ${active ? "nav-main-item-active" : ""}`}
              >
                <span>{item.text}</span>
                {item.options && (
                  <AiFillCaretRight
                    aria-hidden
                    className={`nav-caret ${expanded ? "nav-caret-expanded" : ""}`}
                  />
                )}
              </NavLink>

              {item.options && (
                <ul
                  className={`nav-submenu ${expanded ? "nav-submenu-visible" : "nav-submenu-hidden"}`}
                >
                  {Object.values(item.options)
                    .filter((opt) => isAllowed(opt, userRole))
                    .map((opt) => (
                      <li key={opt.to}>
                        <NavLink
                          to={opt.to}
                          end
                          className={({ isActive }) =>
                            `nav-sub-item ${isActive ? "nav-sub-item-active" : ""}`
                          }
                        >
                          <span>{opt.text}</span>
                        </NavLink>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          );
        })}
    </ul>
  );
}
