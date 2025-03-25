import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Create a new database connection
const db = new Database("./sqlite.db");

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Read and execute the migration file
const migrationPath = path.join(process.cwd(), "better-auth_migrations");
const migrationFiles = fs.readdirSync(migrationPath);

migrationFiles.forEach((file) => {
  const migration = fs.readFileSync(path.join(migrationPath, file), "utf8");
  db.exec(migration);
});

console.log("Database initialized successfully!");

// Close the database connection
db.close();
