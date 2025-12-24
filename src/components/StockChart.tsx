"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8",
  "#82ca9d", "#87ff58ff", "#8dd1e1", "#a4de6c", "#d0ed57", "#484", "rgba(136, 68, 68, 1)"
];


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div 
        className="text-sm rounded-lg"
        style={{
          backgroundColor: '#22aaf3a5', //  Forces  Background
          border: '1px solid #e5e7eb', // Light Gray Border
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Strong Shadow
          padding: '12px',
          minWidth: '160px',
          zIndex: 1000
        }}
      >
        {/* Title */}
        <p className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">
          {label}
        </p>
        
        {/* List */}
        <div className="space-y-2">
          {/* Stock */}
          <div className="flex items-center justify-between">
             <span className="flex items-center text-gray-500 text-xs uppercase font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                Stock
             </span>
             <span className="font-bold text-gray-700">{data.stock}</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
             <span className="flex items-center text-gray-500 text-xs uppercase font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Price
             </span>
             <span className="font-bold text-green-600">${data.price}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function StockChart({ data }: { data?: any[] }) {
  const [products, setProducts] = useState<any[]>(data ?? []);
  const [isLoading, setIsLoading] = useState(!Boolean(data));

  // If parent passes data, keep local products in sync
  useEffect(() => {
    if (data) {
      setProducts(data);
      setIsLoading(false);
    }
  }, [data]);

  // Fetch only when no data prop provided
  useEffect(() => {
    if (data) return;

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data]);

  // Stats
  const totalStock = products.reduce((acc, curr) => acc + (curr?.stock || 0), 0);
  const totalValue = products.reduce((acc, curr) => acc + ((curr?.price || 0) * (curr?.stock || 0)), 0);
  const averagePrice = totalStock > 0 ? totalValue / totalStock : 0;

  // Chart Data Preparation
  const stockData = products
    .map(p => ({ name: p?.name ?? "Unknown", value: p?.stock ?? 0 }))
    .filter(item => item.value > 0);

  const valueData = products
    .map(p => ({ name: p?.name ?? "Unknown", value: (p?.price ?? 0) * (p?.stock ?? 0) }))
    .filter(item => item.value > 0);

  const unitPriceData = products
    .map(p => ({ name: p?.name ?? "Unknown", value: (p?.price ?? 0) }))
    .filter(item => item.value > 0);

  const chartWidth = Math.max(products.length * 130, 1000);

  if (isLoading) {
    return (
      <div className="flex h-56 items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  // Combine data for the Bar Chart
  const chartData = products
    .map(p => ({
      name: p?.name ?? "Unknown",
      stock: p?.stock ?? 0,
      price: p?.price ?? 0 
    }))
    .filter(item => item.stock > 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
{/* 1. Bar Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm w-full h-full">

        <h2 className="text-xl font-bold text-gray-800 mb-4">Stock Levels</h2>
        <p className="text-sm text-gray-400 mb-4">
          Hover over bars to see Stock & Price • Scroll right to see all products
        </p>
        
        {/*  SCROLL WRAPPER */}
        <div className="w-full overflow-x-auto pb-4 border-b border-gray-100">
          
          {/*  THE WIDTH ENFORCER */}
          {/* We set minWidth to ensure it never shrinks below the calculated size */}
          <div style={{ width: chartWidth, minWidth: chartWidth, height: 500 }}>
            
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }} barCategoryGap="20%" >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    interval={0} 
                    angle={-45} 
                    textAnchor="end" 
                    height={100} // Extra space for tilted labels
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#eaeabd6f' }} />
                
                <Legend />
                
                {/*  CHANGE 3: Use 'stock' as the key */}
                <Bar dataKey="stock" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Stock Units" />
              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>
      </div>



      {/* Pie Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
       <hr className="border-t-2 border-gray-200 dark:border-gray-700 my-8" />

        {/* Pie 1: Stock Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm  flex flex-col items-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Stock Distribution</h2>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={160}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

       <hr className="border-t-2 border-gray-200 dark:border-gray-700 my-8" />


        {/* Pie 2: Value Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm  flex flex-col items-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Total Value Share ($)</h2>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={valueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={160}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {valueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

       <hr className="border-t-2 border-gray-200 dark:border-gray-700 my-8" />
  
        {/* Pie 3: Unit Price Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Unit Price Share ($)</h2>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={unitPriceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={160}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {unitPriceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}