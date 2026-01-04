import { useEffect, useMemo, useState } from 'react';
import { categories } from '../constants/categories';
import { useDocumentStore } from '../store/documentStore';

export const useDocuments = () => {
  const documents = useDocumentStore((state) => state.documents);
  const loadDocuments = useDocumentStore((state) => state.loadDocuments);
  const refreshDocuments = useDocumentStore((state) => state.refreshDocuments);
  const loading = useDocumentStore((state) => state.loading);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesQuery =
        `${doc.vendorName ?? ''} ${doc.notes ?? ''} ${doc.amount}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory ? doc.category === selectedCategory : true;
      return matchesQuery && matchesCategory;
    });
  }, [documents, query, selectedCategory]);

  const categoryOptions = categories;

  return {
    documents: filteredDocuments,
    allDocuments: documents,
    loading,
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    refreshDocuments,
    categoryOptions,
  };
};
