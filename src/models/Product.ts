import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    // 👇 This field was likely causing the crash if it was missing in your DB schema
    imageUrl: {
      type: String, 
      required: false,
    },
  },
  { timestamps: true }
);

// This check is crucial for Next.js to prevent "OverwriteModelError"
const Product = models.Product || model("Product", ProductSchema);

export default Product;