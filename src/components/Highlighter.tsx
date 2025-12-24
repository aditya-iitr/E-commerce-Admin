'use client';
import { useSearch } from '@/context/SearchContext';

export default function Highlighter({ text }: { text: string | number }) {
  const { searchQuery } = useSearch();
  const content = text.toString();

  // If search is empty, just return the plain text
  if (!searchQuery) return <>{content}</>;

  // Split text by the search query (Case Insensitive)
  const regex = new RegExp(`(${searchQuery})`, 'gi');
  const parts = content.split(regex);

  return (
    <span>
      {parts.map((part, index) => 
        // If this part matches the search query, highlight it
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <mark key={index} className="bg-yellow-300 rounded-sm px-0.5 text-black">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}