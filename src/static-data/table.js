const tblOptionsDrugsPage = [
  "stock",
  "brands",
  "groups",
  "generics",
  "formulations",
  "units",
  "manufacturers",
];

const tblOptionsStaffPage = [
  "members", "salaries", "attendance"
]

const tblHeaderDrugs = [
  "Serial",
  "Brand Name",
  "Generic",
  "Available",
  "Strength",
  "Formulation",
  "Manufacturer",
];

const tblHeaderBrands = ["#","Name", "Generic", "Group", "Manufacturer"];
const tblHeaderGenerics = ["Serial", "Generic Name", "Group"];
const tblHeadergroups = ["Serial", "Group Name"];
const tblHeaderFormulations = ["#", "Full Name", "Short Name"];
const tblHeaderMfrs = ["Serial", "Name"];
const tblHeaderUnits = ["Serial", "Name"];
const tblHeaderStaff = ["Serial", "Name", "Role"];
const tblHeaderSales = ["Date Time", "Bill", "Action"];
const tblHeaderSalaries = ["Paid To", "Month-Year", "Payment Date", "Amount"];
const tblHeaderPurch = ["Date Time", "Bill", "Action"];

const brands = [
  {
    id: 1,
    name: "Napa",
    generic: "gen-name",
    group: "grp-name",
    mfr: "mfr ",
  },
];
const drugs = [
  {
    id: 1,
    serial: 1,
    name: "BRAND",

    generic: {
      id: 1,
      name: "gen-1",
      group: {
        id: 1,
        name: "grp name -1",
      },
    },
    available: 123,
    unit: {
      id: 1,
      name: "ml",
    },
    strength: "Strength",
    formulation: {
      id: 1,
      name: "Tablet",
    },
    manufacturer: "Mrf",
    checked: true,
  },
  {
    id: 2,
    name: "BRAND 2",
    generic: {
      id: 2,
      name: "gen-2",
      group: {
        id: 2,
        name: "grp name -2",
      },
    },
    unit: {
      id: 1,
      name: "ml",
    },
    strength: "Strength",
    formulation: {
      id: 2,
      name: "Tablet",
    },
    manufacturer: "Mrf",
    checked: false,
  },
  {
    id: 3,
    name: "BRAND 3",
    generic: {
      id: 3,
      name: "gen-3",
      group: {
        id: 3,
        name: "grp name -3",
      },
    },
    unit: {
      id: 1,
      name: "ml",
    },
    strength: "Strength",
    formulation: {
      id: 3,
      name: "Syrup",
    },
    manufacturer: "Mrf",
    checked: false,
  },
];
const groups = [
  {
    id: 1,
    name: "grp name",
  },
  {
    id: 2,
    name: "grp name -2",
  },
  {
    id: 3,
    name: "grp name -3",
  },
];
const generics = [
  {
    id: 1,
    name: "gen-1",
    group: {
      id: 1,
      name: "grp name -1",
    },
  },
  {
    id: 2,
    name: "gen-2",
    group: {
      id: 2,
      name: "grp name -2",
    },
  },
  {
    id: 3,
    name: "gen-3",
    group: {
      id: 3,
      name: "grp name -3",
    },
  },
];
const formulations = [
  {
    id: 1,
    fullName: "frm name -1",
    shortName: "frm -1",
  },
  {
    id: 2,
    fullName: "frm name -2",
    shortName: "frm -2",
  },
  {
    id: 3,
    fullName: "frm name -3",
    shortName: "frm -3",
  },
];

const companies = [
  {
    id: 1,
    name: "cmp name -1",
  },
  {
    id: 2,
    name: "cmp name -2",
  },
  {
    id: 3,
    name: "cmp name -3",
  },
];
const units = [
  {
    id: 1,
    name: "unt name -1",
  },
  {
    id: 2,
    name: "unt name -2",
  },
  {
    id: 3,
    name: "unt name -3",
  },
];
const salaries = [
  {
    id: 1,
    salaryTo: "stf member name",
    salaryOf: "July-2023",
    paymentDate: "date-time",
    amount: 12000,
  },
];
const purchases = [
  {
    id: 1,
    purchDate: "12.10.2023",
    bill: 120000,
  },
];

const sales = [
  {
    id: 1,
    dateTime: "date-time",
    bill: 120,
  },
];
const staff = [
  {
    id: 1,
    name: "stf name",
    role: "Salesman",
  },
];

//
//
export {
  tblOptionsDrugsPage,
  tblOptionsStaffPage,
  tblHeaderBrands,
  tblHeaderDrugs,
  tblHeaderFormulations,
  tblHeaderGenerics,
  tblHeaderMfrs,
  tblHeaderPurch,
  tblHeaderSalaries,
  tblHeaderSales,
  tblHeaderStaff,
  tblHeaderUnits,
  tblHeadergroups,
  drugs,
  brands,
  groups,
  generics,
  formulations,
  companies,
  units,
  salaries,
  sales,
  purchases,
  staff,
};
