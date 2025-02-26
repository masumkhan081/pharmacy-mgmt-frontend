import { ENTITIES } from "./entities";
import { ROLES } from "./user.roles";

const navMap = {
  [ENTITIES.sale]: {
    to: "/sale-panel",
    text: "Sale Panel",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.SALESMAN, ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.MANAGER],
  },
  [ENTITIES.dashboard]: {
    to: "/dashboard",
    text: "Dashboard",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN, ROLES.ACCOUNTANT],
  },
  [ENTITIES.drug]: {
    to: "/drugs/stock",
    text: "Drugs",
    isAccessControlled: false,
    options: {
      [ENTITIES.stock]: {
        to: "/drugs/stock",
        text: "Stock",
        isAccessControlled: false,
      },
      [ENTITIES.brand]: {
        to: "/drugs/brands",
        text: "Brands",
        isAccessControlled: false,
      },
      [ENTITIES.generic]: {
        to: "/drugs/generics",
        text: "Generics",
        isAccessControlled: false,
      },
      [ENTITIES.group]: {
        to: "/drugs/groups",
        text: "Groups",
        isAccessControlled: false,
      },
      [ENTITIES.manufacturer]: {
        to: "/drugs/manufacturers",
        text: "Manufacturers",
        isAccessControlled: false,
      },
      [ENTITIES.formulation]: {
        to: "/drugs/formulations",
        text: "Formulations",
        isAccessControlled: false,
      },
      [ENTITIES.unit]: {
        to: "/drugs/units",
        text: "Units",
        isAccessControlled: true,
        access: [ROLES.ADMIN],
      },
    },
  },
  [ENTITIES.purchase]: {
    to: "/purchases",
    text: "Purchases",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN, ROLES.ACCOUNTANT],
  },
  [ENTITIES.sale]: {
    to: "sales",
    text: "Sales",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.SALESMAN],
  },
  [ENTITIES.staff]: {
    to: "/staff/members",
    text: "Staff",
    isAccessControlled: true,
    access: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SALESMAN],
    options: {
      [ENTITIES.member]: {
        to: "/staff/members",
        text: "Members",
        isAccessControlled: false,
      },
      [ENTITIES.salary]: {
        to: "/staff/salaries",
        text: "Salaries",
        isAccessControlled: true,
        access: [ROLES.ADMIN, ROLES.MANAGER],
      },
      [ENTITIES.attendance]: {
        to: "/staff/attendances",
        text: "Attendances",
        isAccessControlled: true,
        access: [ROLES.ADMIN, ROLES.MANAGER],
      },
    },
  },
}

export default navMap;
