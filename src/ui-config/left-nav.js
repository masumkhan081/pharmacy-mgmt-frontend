import { ENTITIES } from "./entities";
import { ROLES } from "./user.roles";

const navMap = {
  salePanel: {
    to: "/sale-panel",
    text: "Sale Panel",
    isAccessControlled: true,
    access: [
      ROLES.PHARMACIST,
      ROLES.SALESMAN,
      ROLES.ADMIN,
      ROLES.ACCOUNTANT,
      ROLES.MANAGER,
    ],
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
  [ENTITIES.inventory]: {
    to: "/inventory/batches",
    text: "Inventory",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN],
    options: {
      [ENTITIES.inventoryBatch]: {
        to: "/inventory/batches",
        text: "Batches",
        isAccessControlled: false,
      },
      [ENTITIES.inventoryAlert]: {
        to: "/inventory/alerts",
        text: "Alerts",
        isAccessControlled: false,
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
    to: "/sales",
    text: "Sales",
    isAccessControlled: true,
    access: [
      ROLES.PHARMACIST,
      ROLES.MANAGER,
      ROLES.ADMIN,
      ROLES.ACCOUNTANT,
      ROLES.SALESMAN,
    ],
  },
  [ENTITIES.return]: {
    to: "/returns",
    text: "Returns",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN],
  },
  [ENTITIES.finance]: {
    to: "/finance/invoices",
    text: "Finance",
    isAccessControlled: true,
    access: [ROLES.MANAGER, ROLES.ADMIN, ROLES.ACCOUNTANT],
    options: {
      [ENTITIES.invoice]: {
        to: "/finance/invoices",
        text: "Invoices",
        isAccessControlled: false,
      },
      [ENTITIES.payment]: {
        to: "/finance/payments",
        text: "Payments",
        isAccessControlled: false,
      },
    },
  },
  [ENTITIES.customer]: {
    to: "/customers",
    text: "Customers",
    isAccessControlled: true,
    access: [
      ROLES.PHARMACIST,
      ROLES.MANAGER,
      ROLES.ADMIN,
      ROLES.SALESMAN,
    ],
  },
  [ENTITIES.doctor]: {
    to: "/doctors",
    text: "Doctors",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN],
  },
  [ENTITIES.prescription]: {
    to: "/prescriptions",
    text: "Prescriptions",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN],
  },
  [ENTITIES.supplier]: {
    to: "/suppliers",
    text: "Suppliers",
    isAccessControlled: true,
    access: [ROLES.MANAGER, ROLES.ADMIN],
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
  [ENTITIES.notification]: {
    to: "/notifications",
    text: "Notifications",
    isAccessControlled: true,
    access: [ROLES.PHARMACIST, ROLES.MANAGER, ROLES.ADMIN, ROLES.ACCOUNTANT],
  },
};

export default navMap;
