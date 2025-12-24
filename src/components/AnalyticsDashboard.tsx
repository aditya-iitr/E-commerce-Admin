"use client";

import { useMemo } from 'react';
import { useSearch } from "@/context/SearchContext";
import StockChart from "@/components/StockChart";
import Highlighter from "@/components/Highlighter";
import { DollarSign, Package, Tag } from "lucide-react";

export default function AnalyticsDashboard({ products }: { products: any[] }) {
  const { searchQuery } = useSearch();

  // ⚡ FAST FILTERING: Updates numbers instantly when you type
  
  const filteredData = useMemo(() => {
    if (!searchQuery) return products;
    
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter((p) => 
      p.name.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, products]);

  // Recalculate Metrics based on filtered results
  const totalProducts = filteredData.length;
  const totalStock = filteredData.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = filteredData.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Analytics Dashboard
      </h1>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Value */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
          <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
            <DollarSign size={18} />
            <span className="text-sm font-semibold">Inventory Value</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            ${totalValue.toLocaleString()}
          </h2>
        </div>

        {/* Card 2: Stock */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
          <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            <Package size={18} />
            <span className="text-sm font-semibold">Total Stock</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            <Highlighter text={totalStock} />
            <span className="text-lg text-gray-400 dark:text-gray-500 font-normal ml-2">
                <Highlighter text="units" />
            </span>
          </h2>
        </div>

        {/* Card 3: Products */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
          <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
            <Tag size={18} />
            <span className="text-sm font-semibold">Unique Products</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalProducts}
          </h2>
        </div>

      </div>

      {/* --- Chart Section --- */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
            {searchQuery ? `Search Results: "${searchQuery}"` : "Stock Overview"}
        </h3>
        
        {/* 👇 WE PASS THE FULL LIST HERE. Your StockChart will handle the scrolling! */}
        <StockChart data={filteredData} />
      </div>
    </div>
  );
}