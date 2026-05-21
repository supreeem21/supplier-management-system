import mongoose from "mongoose";
export const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default:"" },
    image: { type: String, default: "" },
    
  },
  { collection: "products" }
);