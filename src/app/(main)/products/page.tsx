'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";
import Image from "next/image";
import Button from "../../../components/Button"; 
import { useSearch } from "@/context/SearchContext";

// 🟢 1. DEFINE THE EXACT CSS STYLES FROM TEAM PAGE
const customStyles = `
  /* Search Bar Styles */
  .search-wrapper {
    width: 100%;
    max-width: 600px;
    margin: 32px auto; /* Added 'auto' to force center alignment */
    display: flex;
    justify-content: center;
  }
  .search-container {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    background: linear-gradient(to bottom, rgb(227, 213, 255), rgb(255, 231, 231));
    border-radius: 30px;
    padding: 0 5px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.075);
  }
  .search-input {
    width: 100%;
    height: 40px;
    border: none;
    outline: none;
    background: white;
    border-radius: 30px;
    padding-left: 20px;
    font-size: 14px;
    color: #333;
  }
`;

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get 'setSearchQuery' to update text
  const { searchQuery, setSearchQuery } = useSearch();

  // Fetch Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter Logic
  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <>
      {/* 🟢 2. Inject Styles */}
      <style>{customStyles}</style>

      {/* Page Header */}
      <div className="head-title">
        <div className="left">
          <h1>My Store</h1>
          <ul className="breadcrumb">
            <li><Link href="/">Dashboard</Link></li>
            <li><i className="bx bx-chevron-right"></i></li>
            <li><span className="active">Products</span></li>
          </ul>
        </div>
        <Link href="/products/add" className="btn-download">
          <Plus className="h-5 w-5 mr-2" />
          <span className="text">Add Product</span>
        </Link>
      </div>

      {/* 🟢 3. THE NEW SEARCH BAR (Replaces the old form) */}
      <div className="search-wrapper">
        <div className="search-container">
          <input 
            placeholder="Search products..." 
            className="search-input" 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>All Products</h3>
            
          </div>

          <table className="w-full table-fixed text-left border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
              <tr className="border-b">
                <th className="p-4 w-[300px]">Product</th>
                <th className="p-4 w-[200px]">Description</th>
                <th className="p-4 w-[100px]">Price</th>
                <th className="p-4 w-[150px]">Stock</th>
                <th className="p-4 w-[150px]">Category</th>
                <th className="p-4 w-[100px] text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    {searchQuery 
                      ? `No products found matching "${searchQuery}"`
                      : 'No products found.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product: any, index: number) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="object-cover w-full h-full" priority={index < 4} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-[10px] text-center">No Img</div>
                          )}
                        </div>
                        <div style={{ marginLeft: '20px' }} className="font-semibold text-gray-800 text-sm truncate pr-2">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="w-full break-words whitespace-normal text-gray-500 text-xs leading-relaxed line-clamp-3">
                        {product.description || "No description provided."}
                      </div>
                    </td>
                    <td className="p-4 text-gray-900 font-medium text-sm">${product.price}</td>
                    <td className="p-4">
                      <span
                        style={{ padding: "5px 20px", borderRadius: "50px", border: "1px solid" }}
                        className={`inline-block text-xs font-bold ${
                          product.stock > 0 ? "bg-[#def7ec] text-[#03543f] border-[#03543f]" : "bg-[#fde8e8] text-[#9b1c1c] border-[#9b1c1c]"
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 rounded text-[14px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {product.category || "General"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button href={`/products/${product._id}`} title="Edit Product" />
                        <DeleteButton 
                          id={product._id}
                          onDelete={() => {
                            setProducts(products.filter((p) => p._id !== product._id));
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}