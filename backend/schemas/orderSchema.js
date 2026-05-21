import mongoose from "mongoose";

export const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String},
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    ordered_by: { type: String, required: true },
    ordered_date: { type: Date, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    }
  },
  { collection: "orders" }
);

