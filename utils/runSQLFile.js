import fs from "fs";
import path from "path";
import db from "../config/db.js";

export const runSQLSetup = () => {
  const filePath = path.resolve("sql/databaseSetup.sql");

  const sql = fs.readFileSync(filePath, "utf8");

  db.query(sql, (err) => {
    if (err) {
      console.error("❌ SQL Setup Error:", err);
    } else {
      console.log("✅ Database tables checked/created successfully.");
    }
  });
};
