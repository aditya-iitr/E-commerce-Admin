"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import styled from "styled-components";
import { Upload, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
// --- VALIDATION SCHEMA ---
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  category: z.string().min(2, "Category is required"),
  imageUrl: z.string().min(1, "Product image is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Props {
  initialData?: ProductFormValues; // Data passed if editing
  productId?: string; // ID passed if editing
  isEditMode?: boolean;
}

export default function ProductWizardForm({
  initialData,
  productId,
  isEditMode = false,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      price: 0,
      stock: 0,
      name: "",
      description: "",
      category: "",
      imageUrl: "",
    },
  });

  // --- NAVIGATION ---
  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(["name", "description", "category"]);
    if (step === 2) valid = await trigger(["price", "stock"]);

    if (valid) {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  // --- SUBMISSION ---
  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (isEditMode && productId) {
        // EDIT MODE: PUT request
        await axios.put(`/api/products/${productId}`, data);
      } else {
        // ADD MODE: POST request
        await axios.post("/api/products", data);
      }
      router.push("/products");
      router.refresh();
    } catch (err) {
      alert("Error saving product");
    }
  };

  // --- IMAGE UPLOAD ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecommerce_preset"); // Check your preset name!

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dahkwl0tj/image/upload",
        formData
      );
      setValue("imageUrl", res.data.secure_url, { shouldValidate: true });
    } catch (error) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // --- ANIMATIONS ---
  const variants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "50%" : "-50%",
      opacity: 0,
      scale: 0.8,
      position: "absolute", // 'as const' is not strictly needed if typed as Variants
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
      position: "relative",
      transition: { duration: 0.6, type: "spring", bounce: 0.3 },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-50%" : "50%",
      opacity: 0,
      scale: 0.8,
      zIndex: 0,
      position: "absolute",
      transition: { duration: 0.6 },
    }),
  };

  return (
    <StyledWrapper>
      <div className="bg-gradient"></div>

      <div id="msform">
        <h1 className="main-title">
          {isEditMode ? "Edit Product" : "New Product"}
        </h1>

        <ul id="progressbar">
          <li className={step >= 1 ? "active" : ""}>Basic Info</li>
          <li className={step >= 2 ? "active" : ""}>Pricing</li>
          <li className={step >= 3 ? "active" : ""}>Image</li>
        </ul>

        <div style={{ position: "relative", minHeight: "420px" }}>
          <AnimatePresence custom={direction} mode="popLayout">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.fieldset
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <h2 className="fs-title">Basic Details</h2>
                <h3 className="fs-subtitle">Tell us about your product</h3>

                <input {...register("name")} placeholder="Product Name" />
                {errors.name && (
                  <span className="error">{errors.name.message}</span>
                )}

                <textarea
                  {...register("description")}
                  placeholder="Description"
                  rows={3}
                />
                {errors.description && (
                  <span className="error">{errors.description.message}</span>
                )}

                <select {...register("category")}>
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home</option>
                </select>
                {errors.category && (
                  <span className="error">{errors.category.message}</span>
                )}

                <button
                  type="button"
                  className="action-button"
                  onClick={nextStep}
                >
                  Next
                </button>
              </motion.fieldset>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.fieldset
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <h2 className="fs-title">Pricing & Stock</h2>
                <h3 className="fs-subtitle">Define value and inventory</h3>

                <input
                  type="number"
                  step="0.01"
                  {...register("price")}
                  placeholder="Price ($)"
                />
                {errors.price && (
                  <span className="error">{errors.price.message}</span>
                )}

                <input
                  type="number"
                  {...register("stock")}
                  placeholder="Stock Quantity"
                />
                {errors.stock && (
                  <span className="error">{errors.stock.message}</span>
                )}

                <div className="btn-group">
                  <button
                    type="button"
                    className="action-button previous"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="action-button"
                    onClick={nextStep}
                  >
                    Next
                  </button>
                </div>
              </motion.fieldset>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.fieldset
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <h2 className="fs-title">Product Image</h2>
                <h3 className="fs-subtitle">Upload a catchy image</h3>

                {/* 👇 UPDATED CONTAINER WITH RELATIVE POSITION */}
                <div
                  className="image-upload-container"
                  style={{ position: "relative" }}
                >
                  {/* 🟢 OVERLAY LOADER: Shows whenever isUploading is true */}
                  {isUploading && (
                    <div className="upload-overlay">
                      <Loader2
                        className="animate-spin"
                        size={32}
                        color="#ffffff"
                      />
                      <span>Uploading...</span>
                    </div>
                  )}

                  {preview || watch("imageUrl") ? (
                    <div className="preview-box">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview || watch("imageUrl")} alt="Preview" />

                      {/* Disable remove button while uploading */}
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setValue("imageUrl", "");
                        }}
                        disabled={isUploading}
                        style={{ opacity: isUploading ? 0.5 : 1 }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <Upload size={32} />
                      <span>Click to Upload</span>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        hidden
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>

                {errors.imageUrl && (
                  <span className="error">{errors.imageUrl.message}</span>
                )}

                <div className="btn-group">
                  <button
                    type="button"
                    className="action-button previous"
                    onClick={prevStep}
                    disabled={isUploading}
                  >
                    Previous
                  </button>

                  {/* Disable Submit if Uploading */}
                  <button
                    type="button"
                    className="action-button submit"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || isUploading} // 👈 Critical for preventing errors
                  >
                    {isSubmitting
                      ? "Saving..."
                      : isUploading
                      ? "Wait..."
                      : "Submit"}
                  </button>
                </div>
              </motion.fieldset>
            )}
          </AnimatePresence>
        </div>
      </div>
    </StyledWrapper>
  );
}

// --- STYLED COMPONENTS ---
const StyledWrapper = styled.div`

  min-height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: "Montserrat", arial, verdana;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(79, 116, 248, 0.6),
      rgba(155, 89, 182, 0.6)
    );
    z-index: 0;
  }

.upload-overlay {
  position: absolute;
  inset: 0; /* Covers the whole upload box */
  background: rgba(0, 0, 0, 0.7); /* Semi-transparent black */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  gap: 10px;
}

/* Update existing container to ensure overlay fits */
.image-upload-container {
  border: 2px dashed #ccc;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 5px;
  position: relative; /* Needed for absolute overlay */
  overflow: hidden;   /* Keeps overlay inside rounded corners */
  min-height: 200px;  /* Prevents jumping height */
  display: flex;
  align-items: center;
  justify-content: center;
}

  .main-title {
    color: white;
    font-size: clamp(1.2rem, 5vw, 2rem);
    margin-bottom: 20px;
    font-weight: 900;
    text-transform: uppercase;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  #msform {
    width: 100%; max-width: 420px; padding: 0 20px;
    margin: 50px auto;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  fieldset {
    background: white;
    border: 0 none;
    border-radius: 3px;
    box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.4);
    padding: 20px; 
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  input,
  textarea,
  select {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-bottom: 10px;
    width: 100%;
    box-sizing: border-box;
    font-family: "Montserrat";
    color: #2c3e50;
    font-size: 13px;
    outline: none;
  }

  .btn-group {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .action-button {
    width: 100px;
    background: #27ae60;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 1px;
    cursor: pointer;
    padding: 10px;
    margin: 0 5px;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s;
  }
  .action-button:hover {
    box-shadow: 0 0 0 2px white, 0 0 0 3px #27ae60;
  }

  .previous {
    background: #7d7d7d;
  }
  .previous:hover {
    box-shadow: 0 0 0 2px white, 0 0 0 3px #7d7d7d;
  }

  .fs-title {
    font-size: 15px;
    text-transform: uppercase;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .fs-subtitle {
    font-weight: normal;
    font-size: 13px;
    color: #666;
    margin-bottom: 20px;
  }

  #progressbar {
    margin-bottom: 30px;
    overflow: hidden;
    counter-reset: step;
    display: flex;
    justify-content: center;
    padding: 0;
  }
  #progressbar li {
    list-style-type: none;
    color: white;
    text-transform: uppercase;
    font-size: 9px;
    flex: 1;
    position: relative;
    text-align: center;
    font-weight: bold;
  }
  #progressbar li:before {
    content: counter(step);
    counter-increment: step;
    width: 20px;
    line-height: 20px;
    display: block;
    font-size: 10px;
    color: #333;
    background: white;
    border-radius: 3px;
    margin: 0 auto 5px auto;
  }
  #progressbar li:after {
    content: "";
    width: 100%;
    height: 2px;
    background: white;
    position: absolute;
    left: -50%;
    top: 9px;
    z-index: -1;
  }
  #progressbar li:first-child:after {
    content: none;
  }
  #progressbar li.active:before,
  #progressbar li.active:after {
    background: #27ae60;
    color: white;
  }

  .error {
    color: #e74c3c;
    font-size: 11px;
    margin-bottom: 10px;
    display: block;
    text-align: left;
  }

  .image-upload-container {
    border: 2px dashed #ccc;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 5px;
  }
  .upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    color: #666;
  }
  .preview-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .preview-box img {
    max-width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .preview-box button {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
  }


  /* 1. Define the rotation animation */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* 2. Target the Loader icon inside the overlay */
  .upload-overlay svg {
    animation: spin 1s linear infinite; /* Forces it to rotate */
  }

  /* Optional: Ensure the icon is big enough to see clearly */
  .upload-overlay {
    /* ... keep existing styles ... */
    backdrop-filter: blur(2px); /* Adds a nice blur effect behind loader */
  }
`;