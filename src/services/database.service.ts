import * as SQLite from 'expo-sqlite';

const DB_NAME = 'docusafe.db';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = () => {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
};

export const initializeDatabase = async () => {
  try {
    const database = getDatabase();

    // Use execAsync instead of withTransactionSync
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY NOT NULL,
        image_uri TEXT NOT NULL,
        thumbnail_uri TEXT,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'XAF',
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        vendor_name TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name_en TEXT NOT NULL,
        name_fr TEXT NOT NULL,
        icon TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Helper functions for CRUD operations
export const insertDocument = async (document: any) => {
  const database = getDatabase();
  const result = await database.runAsync(
      `INSERT INTO documents (id, image_uri, thumbnail_uri, amount, currency, date, category, vendor_name, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        document.id,
        document.image_uri,
        document.thumbnail_uri,
        document.amount,
        document.currency,
        document.date,
        document.category,
        document.vendor_name,
        document.notes,
        document.created_at,
        document.updated_at,
      ]
  );
  return result;
};

export const getAllDocuments = async () => {
  const database = getDatabase();
  const result = await database.getAllAsync('SELECT * FROM documents ORDER BY date DESC');
  return result;
};

export const getDocumentById = async (id: string) => {
  const database = getDatabase();
  const result = await database.getFirstAsync('SELECT * FROM documents WHERE id = ?', [id]);
  return result;
};

export const updateDocument = async (id: string, updates: any) => {
  const database = getDatabase();
  const result = await database.runAsync(
      `UPDATE documents SET 
      amount = ?, 
      date = ?, 
      category = ?, 
      vendor_name = ?, 
      notes = ?,
      updated_at = ?
    WHERE id = ?`,
      [
        updates.amount,
        updates.date,
        updates.category,
        updates.vendor_name,
        updates.notes,
        new Date().toISOString(),
        id,
      ]
  );
  return result;
};

export const deleteDocument = async (id: string) => {
  const database = getDatabase();
  const result = await database.runAsync('DELETE FROM documents WHERE id = ?', [id]);
  return result;
};