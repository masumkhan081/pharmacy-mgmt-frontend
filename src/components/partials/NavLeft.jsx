import React, { useEffect, useState } from "react";
import {
  Outlet,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import navMap from "../../ui-config/left-nav";
import { AiFillCaretRight } from "react-icons/ai";
import { useSelector } from "react-redux";
//
export default function NavLeft() {

  const location = useLocation();
  const userRole = useSelector((state) => state.user.userRole);

  const initialState = JSON.parse(localStorage.getItem("expansion")) || {
    Drugs: "hidden",
    Staff: "hidden",
  };

  const [expansion, setExpansion] = useState(initialState);

  function setView(ofWhat) {
    expansion[ofWhat] == "block"
      ? setExpansion({ ...expansion, [ofWhat]: "hidden" })
      : setExpansion({ ...expansion, [ofWhat]: "block" });
  }
  const isExtpanded = (what) => (expansion[what] == "block" ? true : false);

  useEffect(() => {
    localStorage.setItem("expansion", JSON.stringify(expansion));
  }, [expansion]);

  // active navlink has a horizontal piece of shit at it's left of yellow color
  const sty_log_hr = (str) =>
    location.pathname.endsWith(str) ? "bg-primary-500" : "";
  // active navlink has a horizontal piece of shit at it's left of yellow color
  const sty_log_hr2 = (str) =>
    location.pathname.includes(str) ? "bg-primary-500" : "";
  // icon color changes based on navlink status
  const sty_log_icn = (str) =>
    location.pathname.endsWith(str) ? "active" : "idle";
  const sty_log_icn2 = (str) =>
    location.pathname.includes(str) ? "active" : "idle";
  // classes: based on active status of navlink; brought out here to shorten code in jsx form
  const sty_logic_link = ({ isActive }) =>
    isActive ? cmn_sty + " " + act_sty : cmn_sty;
  // classes specificly for active navlink
  const act_sty = "bg-pr/600 text-wh ";
  // common classes for all active & non-active navlink
  const cmn_sty =
    "rounded-md font-inter text-1/1.5 py-0.5 px-0.75 h-full w-full ml-1";
  //
  return (
    <ul className="nav-left-container">
      {Object.values(navMap)
        .filter(
          (navItem) =>
            // Check the main item access control
            !navItem.isAccessControlled ||
            navItem.noAccessControl ||
            navItem?.access?.includes(userRole)
        )
        .map((navItem, ind) => {
          const isActive = location.pathname.includes(navItem.to) || 
                          (navItem.options && Object.values(navItem.options).some(opt => location.pathname.includes(opt.to)));
          
          return (
            <li className="flex flex-col w-full" key={ind}>
              <NavLink
                to={navItem.to}
                onClick={() => setView(navItem.text)}
                className={`nav-main-item ${isActive ? 'nav-main-item-active' : ''}`}
              >
                <span>{navItem.text}</span>
                {navItem.options && (
                  <AiFillCaretRight
                    className={`nav-caret ${isExtpanded(navItem.text) ? 'nav-caret-expanded' : ''}`}
                  />
                )}
              </NavLink>

              {navItem.options && (
                <ul
                  className={`nav-submenu ${expansion[navItem.text] === 'block' ? 'nav-submenu-visible' : 'nav-submenu-hidden'}`}
                >
                  {Object.values(navItem.options)
                    .filter(
                      (item) =>
                        item.isAccessControlled === false ||
                        item?.access?.includes(userRole)
                    )
                    .map((item, index) => {
                      const isSubActive = location.pathname === item.to;
                      
                      return (
                        <li key={index}>
                          <NavLink 
                            to={item.to}
                            className={`nav-sub-item ${isSubActive ? 'nav-sub-item-active' : ''}`}
                          >
                            <span>{item.text}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                </ul>
              )}
            </li>
          );
        })}
    </ul>
  );

  {
    /* <ul className="col-span-1 min-h-screen flex flex-col gap-4 pt-8 pr-2 border ">
      
      <li className="flex items-center w-full ">
        <hr className={"h-2.5 w-0.25  rounded-lg " + sty_log_hr("admin")} />
        <NavLink to={"/admin"} className={sty_logic_link} end>
          <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
            <Db_dashboard status={sty_log_icn("dashboard")} />
            Dashboard
          </span>
        </NavLink>
      </li>

     
      <li className="flex items-center w-full ">
        <hr className={"h-2.5 w-0.25  rounded-lg " + sty_log_hr("idle")} />
        <NavLink
          to={"/admin/orders"}
          className={cmn_sty}
          onClick={() => {
            navigate("/admin/orders");
            handle_expansion("orders");
          }}
          end
        >
          <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
            <Db_order status={"idle"} />
            Orders
            <DB_right
              status={state.orders == "hidden" ? "idle" : "active"}
            />
          </span>
        </NavLink>
      </li> 
      <ul className={" flex flex-col gap-3" + " " + state.orders}>
        
        <li className="flex items-center w-full ">
          <hr
            className={
              "h-2.5 w-0.25 rounded-lg " + sty_log_hr("item-request")
            }
          />
          <NavLink
            to={"/admin/item-request"}
            className={sty_logic_link}
            end
          >
            <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
              <Db_dashboard visibility="invisible" />
              Item request
            </span>
          </NavLink>
        </li>

        <li className="flex items-center w-full ">
          <hr
            className={"h-2.5 w-0.25 rounded-lg " + sty_log_hr("orders")}
          />
          <NavLink to={"/admin/orders"} className={sty_logic_link} end>
            <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
              <Db_dashboard visibility="invisible" />
              All Orders
            </span>
          </NavLink>
        </li>

        <li className="flex items-center w-full ">
          <hr
            className={
              "h-2.5 w-0.25 rounded-lg " + sty_log_hr("payment-list")
            }
          />

          <NavLink
            to={"/admin/orders/payment-list"}
            className={sty_logic_link}
            end
          >
            <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
              <Db_dashboard visibility="invisible" />
              Payment List
            </span>
          </NavLink>
        </li>
      </ul>

      <li className="flex items-center w-full ">
        <hr className={"h-2.5 w-0.25  rounded-lg " + sty_log_hr("idle")} />
        <NavLink
          to={"/admin/products"}
          className={cmn_sty}
          onClick={() => {
            handle_expansion("products");
          }}
          end
        >
          <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
            <Db_products status={"idle"} />
            Products
            <DB_right
              status={state.products == "hidden" ? "idle" : "active"}
            />
          </span>
        </NavLink>
      </li>
      <ul className={" flex flex-col gap-3" + " " + state.products}>
        <li className="flex items-center w-full ">
          <hr
            className={"h-2.5 w-0.25 rounded-lg " + sty_log_hr("products")}
          />
          <NavLink to={"/admin/products"} className={sty_logic_link} end>
            <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
              <Db_dashboard visibility="invisible" />
              All Products
            </span>
          </NavLink>
        </li>

        <li className="flex items-center w-full ">
          <hr
            className={"h-2.5 w-0.25 rounded-lg " + sty_log_hr("discount")}
          />
          <NavLink
            to={"/admin/products/discount"}
            className={sty_logic_link}
            end
          >
            <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
              <Db_dashboard visibility="invisible" />
              Discount
            </span>
          </NavLink>
        </li>

        <li className="flex items-center w-full ">
          <hr
            className={"h-2.5 w-0.25 rounded-lg " + sty_log_hr("category")}
          />
          <NavLink
            to={"/admin/products/category"}
            className={sty_logic_link}
            end
          >
            <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
              <Db_dashboard visibility="invisible" />
              Category
            </span>
          </NavLink>
        </li>
      </ul>
      <li className="flex items-center w-full ">
        <hr
          className={"h-2.5 w-0.25  rounded-lg " + sty_log_hr2("customers")}
        />
        <NavLink to={"/admin/customers"} className={sty_logic_link}>
          <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
            <Db_customer status={sty_log_icn2("customers")} />
            Customers
          </span>
        </NavLink>
      </li>

      <li className="flex items-center w-full ">
        <hr
          className={"h-2.5 w-0.25  rounded-lg " + sty_log_hr2("support")}
        />
        <NavLink to={"/admin/support"} className={sty_logic_link} end>
          <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
            <DB_support status={sty_log_icn2("support")} />
            Support
          </span>
        </NavLink>
      </li>

      <li className="flex items-center w-full ">
        <hr
          className={"h-2.5 w-0.25  rounded-lg " + sty_log_hr2("staff")}
        />
        <NavLink to={"/admin/staff"} className={sty_logic_link} end>
          <span className=" ml-1 my-auto flex gap-0.5 rounded-md">
            <Db_staff status={sty_log_icn2("staff")} />
            Staff
          </span>
        </NavLink>
      </li>
    </ul> */
  }
}
