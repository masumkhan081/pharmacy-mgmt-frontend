const navMap = [
  {
    to: "/sale-panel",
    text: "Sale Panel",
    isAccessControlled: true,
    access: ["pharmacist", "salesman", "admin", "accountant", "manager"],
  },
  {
    to: "/dashboard",
    text: "Dashboard",
    isAccessControlled: true,
    access: ["pharmacist", "manager", "admin", "accountant"],
  },
  {
    to: "/drugs/stock",
    text: "Drugs",
    isAccessControlled: false,
    existSubOptions: true,
    options: [
      {
        to: "/drugs/stock",
        text: "Stock",
        isAccessControlled: false,
      },
      {
        to: "/drugs/brands",
        text: "Brands",
        isAccessControlled: false,
      },
      {
        to: "/drugs/generics",
        text: "Generics",
        isAccessControlled: false,
      },
      {
        to: "/drugs/groups",
        text: "Groups",
        isAccessControlled: false,
      },
      {
        to: "/drugs/manufacturers",
        text: "Manufacturers",
        isAccessControlled: false,
      },
      {
        to: "/drugs/formulations",
        text: "Formulations",
        isAccessControlled: false,
      },
      {
        to: "/drugs/units",
        text: "Units",
        isAccessControlled: false,
      },
    ],
  },
  {
    to: "/purchases",
    text: "Purchases",
    isAccessControlled: true,
    access: ["pharmacist", "manager", "admin", "accountant"],
  },
  {
    to: "sales",
    text: "Sales",
    isAccessControlled: true,
    access: ["pharmacist", "manager", "admin", "accountant", "salesman"],
  },
  {
    to: "/staff/members",
    text: "Staff",
    isAccessControlled: true,
    access: ["admin", "manager", "salesman"],
    existSubOptions: true,
    options: [
      {
        to: "/staff/members",
        text: "Members",
        isAccessControlled: false,
      },
      {
        to: "/staff/salaries",
        text: "Salaries",
        isAccessControlled: true,
        access: ["admin", "manager"],
      },
      {
        to: "/staff/attendances",
        text: "Attendances",
        isAccessControlled: true,
        access: ["admin", "manager"],
      },
    ],
  },
];

export default navMap;
