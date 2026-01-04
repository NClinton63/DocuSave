import { create } from 'zustand';
import { DocumentInput, DocumentModel } from '../models/types';
import {
  deleteAllDocuments,
  deleteDocumentRecord,
  fetchDocuments,
  insertDocument,
  updateDocumentRecord,
} from '../services/document.service';

interface DocumentStoreState {
  documents: DocumentModel[];
  loading: boolean;
  initialized: boolean;
  loadDocuments: () => Promise<void>;
  refreshDocuments: () => Promise<void>;
  addDocument: (input: DocumentInput) => Promise<DocumentModel>;
  updateDocument: (id: string, payload: Partial<DocumentModel>) => Promise<DocumentModel | null>;
  deleteDocument: (id: string) => Promise<void>;
  clearDocuments: () => Promise<void>;
}

export const useDocumentStore = create<DocumentStoreState>((set, get) => ({
  documents: [],
  loading: false,
  initialized: false,
  loadDocuments: async () => {
    if (get().initialized) return;
    await get().refreshDocuments();
  },
  refreshDocuments: async () => {
    set({ loading: true });
    try {
      const docs = await fetchDocuments();
      set({ documents: docs, initialized: true, loading: false });
    } catch (error) {
      console.warn('Failed to load documents', error);
      set({ loading: false });
    }
  },
  addDocument: async (input) => {
    try {
      const document = await insertDocument(input);
      set((state) => ({ documents: [document, ...state.documents] }));
      return document;
    } catch (error) {
      console.warn('Failed to add document', error);
      throw error;
    }
  },
  updateDocument: async (id, payload) => {
    try {
      const updated = await updateDocumentRecord(id, payload);
      if (updated) {
        set((state) => ({
          documents: state.documents.map((doc) => (doc.id === id ? updated : doc)),
        }));
      }
      return updated;
    } catch (error) {
      console.warn('Failed to update document', error);
      throw error;
    }
  },
  deleteDocument: async (id) => {
    try {
      await deleteDocumentRecord(id);
      set((state) => ({ documents: state.documents.filter((doc) => doc.id !== id) }));
    } catch (error) {
      console.warn('Failed to delete document', error);
      throw error;
    }
  },
  clearDocuments: async () => {
    try {
      await deleteAllDocuments();
      set({ documents: [], initialized: true });
    } catch (error) {
      console.warn('Failed to clear documents', error);
      throw error;
    }
  },
}));
