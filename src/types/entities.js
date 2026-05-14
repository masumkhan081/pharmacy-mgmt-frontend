/**
 * Shared JSDoc typedefs for backend entity contracts.
 *
 * These mirror the Mongoose models in b/src/models/*.model.ts.
 * Import via:
 *   /** @typedef {import("../types/entities").Drug} Drug *\/
 *
 * @module types/entities
 */

/**
 * @typedef {"ADMIN"|"SELLER"|"BIDDER"} UserRole
 * @typedef {"MALE"|"FEMALE"|"OTHER"} Gender
 * @typedef {"admin"|"manager"|"pharmacist"|"salesman"} StaffDesignation
 * @typedef {"Hourly"|"Weekly"|"Monthly"} SalaryType
 * @typedef {"Morning"|"Afternoon"|"Night"} StaffShift
 * @typedef {"Daily"|"Weekly"|"Monthly"|"On-demand"} DeliveryFrequency
 */

/**
 * @typedef {Object} ApiEnvelope
 * @property {number} statusCode
 * @property {boolean} success
 * @property {string} message
 * @property {*} [data]
 * @property {{ pagination?: PaginationMeta }} [meta]
 * @property {Array<{field: string, message: string}>} [errors]
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} total
 * @property {number} limit
 * @property {number} page
 * @property {number} skip
 * @property {string} [sortBy]
 * @property {"asc"|"desc"} [sortOrder]
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {UserRole} role
 * @property {string} staff
 * @property {boolean} isVerified
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} Staff
 * @property {string} id
 * @property {string} fullName
 * @property {string} phone
 * @property {string} altPhone
 * @property {Gender} [gender]
 * @property {string} email
 * @property {StaffDesignation} designation
 * @property {string} [address]
 * @property {StaffShift} shift
 * @property {SalaryType} salaryType
 * @property {number} [hourlySalary]
 * @property {number} [weeklySalary]
 * @property {number} [monthlySalary]
 * @property {number} hoursPerDay
 * @property {number} daysPerWeek
 * @property {boolean} [isUser]
 * @property {string} [user]
 */

/**
 * @typedef {Object} Group
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} Unit
 * @property {string} id
 * @property {string} shortName
 * @property {string} longName
 */

/**
 * @typedef {Object} Formulation
 * @property {string} id
 * @property {string} shortName
 * @property {string} longName
 */

/**
 * @typedef {Object} Manufacturer
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} Generic
 * @property {string} id
 * @property {string|Group} group
 * @property {string} name
 */

/**
 * @typedef {Object} Brand
 * @property {string} id
 * @property {string|Generic} generic
 * @property {string|Manufacturer} manufacturer
 * @property {string} name
 */

/**
 * @typedef {Object} Drug
 * @property {string} id
 * @property {string|Brand} brand
 * @property {string|Formulation} formulation
 * @property {number} strength
 * @property {string|Unit} unit
 * @property {number} available
 * @property {number} mrp
 */

/**
 * @typedef {Object} Supplier
 * @property {string} id
 * @property {string} fullName
 * @property {string} phone
 * @property {string} altPhone
 * @property {Gender} [gender]
 * @property {string} email
 * @property {string|Manufacturer} manufacturer
 * @property {string} [address]
 * @property {DeliveryFrequency} deliveryFrequency
 * @property {boolean} isActive
 * @property {string} [notes]
 */

/**
 * @typedef {Object} PurchaseLine
 * @property {string|Drug} drug
 * @property {number} quantity
 * @property {number} unitPrice
 */

/**
 * @typedef {Object} Purchase
 * @property {string} id
 * @property {string} purchaseAt
 * @property {PurchaseLine[]} drugs
 * @property {number} bill
 */

/**
 * @typedef {Object} SaleLine
 * @property {string|Drug} drug
 * @property {number} quantity
 * @property {number} mrp
 */

/**
 * @typedef {Object} Sale
 * @property {string} id
 * @property {string} saleAt
 * @property {SaleLine[]} drugs
 * @property {number} bill
 */

/**
 * @typedef {Object} Salary
 * @property {string} id
 * @property {string|Staff} staff
 * @property {number} month
 * @property {number} year
 * @property {number} dueAmount
 * @property {number} paidAmount
 */

/**
 * @typedef {Object} AttendanceSlot
 * @property {string} start
 * @property {string} end
 */

/**
 * @typedef {Object} Attendance
 * @property {string} id
 * @property {string|Staff} staff
 * @property {string} date
 * @property {"day"|"evening"|"night"|""} shift
 * @property {AttendanceSlot[]} slots
 */

export {};
