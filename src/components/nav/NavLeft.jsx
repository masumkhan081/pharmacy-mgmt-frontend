import React, { useState } from "react"; import { useDispatch, useSelector } from "react-redux";
import {
  Outlet,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import navMap from '../../static-data/left-nav'
import { AiFillCaretRight } from 'react-icons/ai'

export default function NavLeft() {

  const [expansion, setExpansion] = useState({
    Drugs: "hidden",
    Staff: "hidden"
  })
  function setView(ofWhat) {
    expansion[ofWhat] == "block" ? setExpansion({ ...expansion, [ofWhat]: "hidden" }) :
      setExpansion({ ...expansion, [ofWhat]: "block" })
  }
  const isExtpanded = (what) => expansion[what] == "block" ? true : false
  // 
  const user = {
    name: "some khan",
    email: "blabla@gmail.com",
    role2: "admin",
    role: "pharmacist",
    role3: "manager",
    role4: "salesman",
  };
  const location = useLocation();


  // active navlink has a horizontal piece of shit at it's left of yellow color
  const sty_log_hr = (str) =>
    location.pathname.endsWith(str) ? "bg-yellow-400" : "";
  // active navlink has a horizontal piece of shit at it's left of yellow color
  const sty_log_hr2 = (str) =>
    location.pathname.includes(str) ? "bg-yellow-400" : "";
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
  return (
    <ul className="col-span-1 h-full flex flex-col gap-3 pt-6 px-2 border ">

      {navMap
        .filter((Pok) => Pok.access.includes(user.role))
        .map((navItem, ind) => {
          return (
            <li className="flex flex-col w-full  " key={ind}>
              <NavLink to={navItem.to} onClick={() => setView(navItem.text)}
                className="bg-green-100 w-full flex justify-between items-center rounded-md border border-slate-500 px-2 py-0.25">
                <span >{navItem.text}</span>
                {navItem.sub && <AiFillCaretRight className={isExtpanded(navItem.text) ? "rotate-90" : "rotate-0"} />}
              </NavLink>

              {navItem.sub && (
                <ul className={` py-1 space-y-1 w-full  ${expansion[navItem.text]}`}>
                  {navItem.options.map((item, index) => {
                    return (
                      <li key={index} className="text-center text-sm rounded-md border border-slate-200 py-0.125">
                        <NavLink to={item.to}>
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
