const projectObjectives = [
  "Pharmacy management system: Express + Prisma + PostgreSQL on the backend; React + Tailwind on the frontend. Operational domain covers inventory, sales (POS), purchases, returns (with approve/reject workflow), payments, and audit logging.",
  "Authenticated, role-gated CRUD across drugs/brands/generics/units/formulations/manufacturers/groups; transactional inventory pipeline (FIFO deduction, batch-level adjustments) is the single authoritative source of stock truth.",
];
const projectFeatures = [
  "Transactional sale, purchase, return-approval, payment, and stock-adjustment flows backed by Prisma `$transaction`",
  "FIFO batch deduction with denormalized `Drug.available` kept consistent inside the same transaction",
  "JWT-based auth with role gates (ADMIN / MANAGER / SALESMAN) on protected routes",
  "TanStack Query for cache invalidation, paginated tables with debounced search",
];

const usedTechAndTools = {
  frontEnd: ["react", "tailwind", "redux toolkit", "axios"],
  backEnd: ["express", "typescript", "prisma", "zod", "jsonwebtoken", "bcryptjs"],
  dataTier: ["postgresql via prisma"],
};

export { projectObjectives, projectFeatures, usedTechAndTools };
