import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function setupDatabaseUrl(): string {
  // On Vercel or serverless environments, SQLite must reside in writable /tmp
  if (process.env.VERCEL) {
    const tmpDbPath = "/tmp/dev.db";

    if (!fs.existsSync(tmpDbPath)) {
      const templatePath = path.join(process.cwd(), "prisma", "template.db");
      if (fs.existsSync(templatePath)) {
        try {
          fs.copyFileSync(templatePath, tmpDbPath);
          console.log("Successfully initialized /tmp/dev.db from template.db");
        } catch (e) {
          console.error("Failed to copy template.db to /tmp:", e);
        }
      }
    }

    process.env.DATABASE_URL = `file:${tmpDbPath}`;
    return `file:${tmpDbPath}`;
  }

  return process.env.DATABASE_URL || "file:./dev.db";
}

const dbUrl = setupDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: dbUrl,
    log: process.env.NODE_ENV === "development" ? ["query"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
