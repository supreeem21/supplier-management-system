import mongoose from "mongoose";
export const clientSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", required: true },
    address: { type: Object, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { collection: "clients" }
);