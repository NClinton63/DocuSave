import { getDatabase } from './database.service';
import { DocumentInput, DocumentModel } from '../models/types';
import * as Crypto from 'expo-crypto';

const mapRowToDocument = (row: any): DocumentModel => ({
  id: row.id,
  imageUri: row.image_uri,
  thumbnailUri: row.thumbnail_uri ?? undefined,
  amount: row.amount,
  currency: row.currency,
  date: row.date,
  category: row.category,
  vendorName: row.vendor_name ?? undefined,
  notes: row.notes ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const fetchDocuments = async (): Promise<DocumentModel[]> => {
  const db = getDatabase();
  const result = db.getAllSync('SELECT * FROM documents ORDER BY date DESC');
  return result.map(mapRowToDocument);
};

export const insertDocument = async (input: DocumentInput): Promise<DocumentModel> => {
  const db = getDatabase();
  const now = new Date().toISOString();
  const record: DocumentModel = {
    id: Crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...input,
  };

  db.runSync(
      `INSERT INTO documents (id, image_uri, thumbnail_uri, amount, currency, date, category, vendor_name, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      record.id,
      record.imageUri,
      record.thumbnailUri ?? null,
      record.amount,
      record.currency,
      record.date,
      record.category,
      record.vendorName ?? null,
      record.notes ?? null,
      record.createdAt,
      record.updatedAt
  );

  return record;
};

export const updateDocumentRecord = async (id: string, payload: Partial<DocumentModel>) => {
  const db = getDatabase();
  const current = db.getFirstSync('SELECT * FROM documents WHERE id = ?', id);
  if (!current) return null;
  const updated = { ...mapRowToDocument(current), ...payload, updatedAt: new Date().toISOString() };

  db.runSync(
      `UPDATE documents SET image_uri=?, thumbnail_uri=?, amount=?, currency=?, date=?, category=?, vendor_name=?, notes=?, updated_at=? WHERE id=?`,
      updated.imageUri,
      updated.thumbnailUri ?? null,
      updated.amount,
      updated.currency,
      updated.date,
      updated.category,
      updated.vendorName ?? null,
      updated.notes ?? null,
      updated.updatedAt,
      updated.id
  );

  return updated;
};

export const deleteDocumentRecord = async (id: string) => {
  const db = getDatabase();
  db.runSync('DELETE FROM documents WHERE id = ?', id);
};

export const deleteAllDocuments = async () => {
  const db = getDatabase();
  db.runSync('DELETE FROM documents');
};