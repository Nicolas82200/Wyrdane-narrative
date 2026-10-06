import mysql from "mysql2/promise";
import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not defined.");
}

const client = mysql.createPool(connectionString);

export const db = drizzle(client);
