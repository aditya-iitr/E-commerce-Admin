import connectToDB from "@/lib/db";
import Product from "@/models/Product";
import StockChart from "@/components/StockChart";
import Highlighter from "@/components/Highlighter";
// ❌ Removed unused "AnalyticsDashboard" import since we aren't using it here

import { DollarSign, Package, Tag } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  await connectToDB();

  // 1. Fetch ALL Data
  const rawProducts = await Product.find({});
  
  // 2. Serialize Data
  const products = rawProducts.map((doc) => {
    const p = doc.toObject();
    return { 
        ...p, 
        _id: p._id.toString(),
        stock: p.stock || 0,
        price: p.price || 0 
    };
  });

  // 3. Calculate Metrics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum: number, p: any) => sum + p.stock, 0);
  const totalValue = products.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0);

  // 4. Prepare Chart Data (ALL products, sorted by stock)
  const chartData = products
    .map((p: any) => ({ name: p.name, stock: p.stock, price: p.price }))
    .sort((a: any, b: any) => b.stock - a.stock);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Analytics Dashboard
      </h1>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Value */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
          <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
            <DollarSign size={18} />
            <span className="text-sm font-semibold">Inventory Value</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            ${totalValue.toLocaleString()}
          </h2>
        </div>
      <hr />
        {/* Card 2: Stock */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
          <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            <Package size={18} />
            <span className="text-sm font-semibold">Total Stock</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            <Highlighter text={totalStock} />
            <span className="text-lg text-gray-400 dark:text-gray-500 font-normal ml-2">
                <Highlighter text=" units" />
            </span>
          </h2>
        </div>

<hr />

        {/* Card 3: Products */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
          <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
            <Tag size={18} />
            <span className="text-sm font-semibold">Unique Products</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalProducts}
          </h2>
        </div>
      </div>
      <hr />
      {/* --- Chart Section --- */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl dark:border-gray-700 shadow-sm transition-colors">
        
        <StockChart data={chartData} />
      </div>
    </div>
  );
}