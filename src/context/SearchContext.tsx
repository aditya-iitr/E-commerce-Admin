'use client';

import { createContext, useContext, useState } from 'react';

// 1. Create the Context
const SearchContext = createContext<any>(null);

// 2. Create the Provider (The Broadcaster)
export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

// 3. Create a Hook (The Receiver)
export const useSearch = () => useContext(SearchContext);