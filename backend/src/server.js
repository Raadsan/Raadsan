import "dotenv/config";
import app from "./modules/index.js";
import { prisma } from "./lib/prisma.js";

const port = Number(process.env.PORT) || 8006;

async function start() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error(
      "Database connection failed:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

start();
