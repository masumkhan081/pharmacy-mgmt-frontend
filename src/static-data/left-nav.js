import { ROLES } from "./user.roles";

const navMap = [
  {
    to: "/sale-panel",
    text: "Sale Panel",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.SALESMAN, ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.MANAGER],
  },
  {
    to: "/dashboard",
    text: "Dashboard",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN, ROLES.ACCOUNTANT],
  },
  {
    to: "/drugs/stock",
    text: "Drugs",
    isAccessControlled: false,
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
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN, ROLES.ACCOUNTANT],
  },
  {
    to: "sales",
    text: "Sales",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.SALESMAN],
  },
  {
    to: "/staff/members",
    text: "Staff",
    isAccessControlled: true,
    access: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SALESMAN],
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
        access: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        to: "/staff/attendances",
        text: "Attendances",
        isAccessControlled: true,
        access: [ROLES.ADMIN, ROLES.MANAGER],
      },
    ],
  },
];

export default navMap;
