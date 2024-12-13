const projectObjectives = [
  "The primary objective is to implement a crud using express on back-end, mongodb atlas as data-tier. But as data of different kinds (drugs, gnerics etc) has interrelation, so implementation is not like a simple crud. Perhaps using PostgreSQL would've been more accurate to take advantage of RDBMS.",
  "Making a case for using json-web-token was another objective where edit and delete operation would be under protected routes.",
];
const projectFeatures = [
  "Add,Edit,Delete in Mongodb cloud using mongoose",
  "Use of Json Web Token, Sign in before action like: delete,edit",
  "Cheking existance bedore addition, correlation before deletion",
];

const usedTechAndTools = {
   frontEnd: ["react", "tailwind"],
   backEnd: [
     "mongoose",
     "nodemailer",
     "passport",
     "crypto",
     "custom modal",
     "custom hook",
   ],
   dataTier: ["mongodb with mongoose"],
 };

export { projectObjectives, projectFeatures,usedTechAndTools };
