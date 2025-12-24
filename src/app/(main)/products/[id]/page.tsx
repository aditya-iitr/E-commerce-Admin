"use client";

import { use, useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import ProductWizardForm from "@/components/ProductWizardForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProductData(data);
      } catch (error) {
        console.error("Failed to fetch");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  // Pass data and enable edit mode
  return (
    <ProductWizardForm 
      initialData={productData!} 
      productId={id} 
      isEditMode={true} 
    />
  );
}