// src/app/(main)/analytics/page.tsx
import connectToDB from "@/lib/db";
import Product from "@/models/Product";
import StockChart from "@/components/StockChart";
import Highlighter from "@/components/Highlighter";
import { DollarSign, Package, Tag } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  await connectToDB();

  const rawProducts = await Product.find({});
  
  const products = rawProducts.map((doc) => {
    const p = doc.toObject();
    return { 
        ...p, 
        _id: p._id.toString(),
        stock: p.stock || 0,
        price: p.price || 0 
    };
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((sum: number, p: any) => sum + p.stock, 0);
  const totalValue = products.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0);

  const chartData = products
    .map((p: any) => ({ name: p.name, stock: p.stock, price: p.price }))
    .sort((a: any, b: any) => b.stock - a.stock);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <DollarSign size={18} />
            <span className="text-sm font-semibold">Inventory Value</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            ${totalValue.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <Package size={18} />
            <span className="text-sm font-semibold">Total Stock</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            <Highlighter text={totalStock} />
            <span className="text-lg text-gray-400 font-normal ml-2">units</span>
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-2 text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            <Tag size={18} />
            <span className="text-sm font-semibold">Unique Products</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalProducts}
          </h2>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <StockChart data={chartData} />
      </div>
    </div>
  );
}