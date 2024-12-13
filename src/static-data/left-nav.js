const navMap = [
   {
      to: "/sale-panel",
      text: "Sale Panel",
      access: ["pharmacist", "", ""],
   }, {
      to: "/dashboard",
      text: "Dashboard",
      access: ["pharmacist", "", ""],
   },
   {
      to: "/drugs/stock",
      text: "Drugs",
      sub: true,
      access: ["pharmacist", "", ""],
      options: [
         {
            to: "/drugs/stock",
            text: "Stock",
            access: ["pharmacist", "", ""]
         }, {
            to: "/drugs/brands",
            text: "Brands",
            access: ["pharmacist", "", ""]
         }, {
            to: "/drugs/generics",
            text: "Generics",
            access: ["pharmacist", "", ""]
         }, {
            to: "/drugs/groups",
            text: "Groups",
            access: ["pharmacist", "", ""]
         }, {
            to: "/drugs/manufacturers",
            text: "Manufacturers",
            access: ["pharmacist", "", ""]
         },
         {
            to: "/drugs/formulations",
            text: "Formulations",
            access: ["pharmacist", "", ""]

         },
         {
            to: "/drugs/units",
            text: "Units",
            access: ["pharmacist", "", ""]
         }
      ]
   }, {
      to: "/purchases",
      text: "Purchases",
      access: ["pharmacist", "", ""],
   }, {
      to: "sales",
      text: "Sales",
      access: ["pharmacist", "", ""],
   }, {
      to: "/staff/members",
      text: "Staff",
      sub: true,
      access: ["pharmacist", "", ""],
      options: [{
         to: "/staff/members",
         text: "Members",
         access: ["pharmacist", "", ""],
      }, {
         to: "/staff/salaries",
         text: "Salaries",
         access: ["pharmacist", "", ""],
      }]
   }
]

export default navMap;