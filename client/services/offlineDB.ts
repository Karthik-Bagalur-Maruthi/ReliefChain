import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("reliefchain.db");

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS offline_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      disasterType TEXT,
      severity TEXT,
      resources TEXT
    );
  `);
};

export const saveOfflineReport = (
  disasterType: string,
  severity: string,
  resources: string,
) => {
  db.runSync(
    `INSERT INTO offline_reports (disasterType, severity, resources)
     VALUES (?, ?, ?)`,
    [disasterType, severity, resources],
  );
};

export const getOfflineReports = () => {
  return db.getAllSync(`SELECT * FROM offline_reports ORDER BY id DESC`);
};

export const deleteOfflineReport = (id: number) => {
  db.runSync(`DELETE FROM offline_reports WHERE id = ?`, [id]);
};
