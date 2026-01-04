import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '../screens/HomeScreen';

jest.mock('../hooks/useDocuments', () => ({
  useDocuments: () => ({
    documents: [],
    query: '',
    setQuery: jest.fn(),
    selectedCategory: null,
    setSelectedCategory: jest.fn(),
    categoryOptions: [],
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('../theme', () => ({
  useAppTheme: () => ({ colors: { background: '#fff', text: '#000' } }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

jest.mock('../components/Fab', () => ({
  Fab: () => null,
}));

jest.mock('../components/DocumentCard', () => ({
  DocumentCard: () => null,
}));

jest.mock('../components/CategoryFilter', () => ({
  CategoryFilter: () => null,
}));

jest.mock('../components/SearchBar', () => ({
  SearchBar: () => null,
}));

describe('HomeScreen', () => {
  it('renders empty state title', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('home.title')).toBeTruthy();
  });
});
