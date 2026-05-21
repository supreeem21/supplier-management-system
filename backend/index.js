import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const PORT = process.env.PORT;
const mongodb_url = process.env.mongodb_url;
const JWT_SECRET = process.env.JWT_SECRET;

// ------------------- MIDDLEWARES -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/productImages", express.static("public/images/productImages"));

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // format: "Bearer token"
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ------------------- MONGODB CONNECTION -------------------
mongoose
  .connect(mongodb_url)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------- START SERVER -------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

const deleteImageFile = async (filename) => {
  if (!filename) return;

  const filePath = path.join(
    process.cwd(),
    "public/images/productImages",
    filename,
  );

  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
    console.log(`🗑️ Deleted image: ${filename}`);
  } catch (err) {
    console.warn(`⚠️ Image not found or already deleted: ${filename}`);
  }
};

const uploadDir = "./public/images/productImages";

if (!fsSync.existsSync(uploadDir)) {
  fsSync.mkdirSync(uploadDir, { recursive: true });
}

// ------------------- MULTER SETUP -------------------
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/productImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const productUpload = multer({ storage: productStorage });

// ------------------- SCHEMAS -------------------
import { clientSchema } from "./schemas/clientSchema.js";
import { orderSchema } from "./schemas/orderSchema.js";
import { productSchema } from "./schemas/productSchema.js";
import { userSchema } from "./schemas/userSchema.js";

// ------------------- MODELS -------------------
const Client = mongoose.model("clients", clientSchema);
const Order = mongoose.model("orders", orderSchema);
const Product = mongoose.model("products", productSchema);
const User = mongoose.model("users", userSchema);

// ------------------- ROUTES -------------------
// --------- OTHER ROUTE (numbers, description) ---------
app.get("/admin/numbers", verifyToken, async (req, res) => {
  try {
    const numberOfClients = await Client.countDocuments();
    const numberOfProducts = await Product.countDocuments();
    const numberOfPendingOrders = await Order.countDocuments({
      status: "pending",
    });
    const numberOfCompletedOrders = await Order.countDocuments({
      status: "completed",
    });

    res.json({
      clients: numberOfClients,
      products: numberOfProducts,
      pending: numberOfPendingOrders,
      completed: numberOfCompletedOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching numbers" });
  }
});

app.get("/admin/yearlyRevenue", verifyToken, async(req, res) => {
  try{
    const orders = await Order.aggregate([
      {
        $match: {
          status: "completed"
        }
      },
      {
        $group: {
          _id: { $year: "$ordered_date"},
          totalRevenue: {
            $sum: { $multiply: ["$price", "$quantity"]}
          }
        }
      },
      {
        $sort: { _id: 1}
      }
    ]);

    res.json({
      revenue: orders
    });
  } catch(err){
    console.error(err);
    res.status(500).json({message: "Cannot get yearly amount"})
  }
});

// --------- ADMIN ROUTES ---------
app.get("/admin/me", verifyToken, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({
    email: user.email,
    id: user._id,
  });
});

app.get("/admin/admin-details", verifyToken, async (req, res) => {
  try {
    const admins = await User.find();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admins data" });
  }
});

// register API or add admin
app.post("/admin/add-admin", verifyToken, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "Email and password are mandatory" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      let hashedPassword = await bcrypt.hash(password, 10);

      await User.create({ email, password: hashedPassword });
      res.json({
        message: "Admin registered successfully",
      });
    } else {
      return res.status(404).json({
        message: "User with this email already exists. Try different email",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN API
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // check user is registered or not
    let foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      return res.json({
        message: "User with this email is not Registered yet. Login failed...!",
        status: "Failed",
      });
    }
    // if the user is found
    if (foundUser) {
      //  check if the password matches
      let isMatch = await bcrypt.compare(password, foundUser.password);

      if (!isMatch) {
        return res.json({ message: "Incorrect Password", status: "Failed" });
      }
      if (isMatch) {
        const payload = { email };
        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: "1d",
        });
        return res.json({ message: "Login Succcessful", token });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/admin/edit-admin/:adminId", verifyToken, async (req, res) => {
  const id = req.params.adminId;
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      {
        email,
        password: hashedPassword,
      },
      { new: true, runValidators: true },
    );

    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ message: "Admin details updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating admin data" });
  }
});

app.delete("/admin/delete-admin/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedAdmin = await User.findByIdAndDelete(id);
    if (!deletedAdmin)
      return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --------- CLIENT ROUTES ---------
app.get("/admin/clients", verifyToken, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching clients data" });
  }
});

app.post("/admin/add-client", verifyToken, async (req, res) => {
  const { name, email, address, phone } = req.body;
  const { country, city, postal_code, state, district, house_no } =
    address || {};
  try {
    const newClient = await Client.create({
      name,
      email,
      phone,
      address: {
        country: country || "",
        state: state || "",
        city: city || "",
        district: district || "",
        postal_code: postal_code || "",
        house_no: house_no || "",
      },
    });
    res.status(200).json({ message: "Client added", client: newClient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding client" });
  }
});

app.put("/admin/edit-client/:clientId", verifyToken, async (req, res) => {
  const id = req.params.clientId;
  const { name, email, address, phone } = req.body;
  const { country, city, postal_code, state, district, house_no } =
    address || {};
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        address: {
          country: country || "",
          state: state || "",
          city: city || "",
          district: district || "",
          postal_code: postal_code || "",
          house_no: house_no || "",
        },
      },
      { new: true, runValidators: true },
    );
    if (!updatedClient)
      return res.status(404).json({ message: "Client not found" });

    res
      .status(200)
      .json({ message: "Client details updated", client: updatedClient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating client data" });
  }
});

app.delete("/admin/delete-client/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient)
      return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --------- ORDER ROUTES ---------
app.get("/admin/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders data" });
  }
});

app.post("/admin/order-complete/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id },
      { status: "completed" },
      { new: true },
    );
    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order" });
  }
});

app.post("/admin/add-order", verifyToken, async (req, res) => {
  const { name, color, quantity, price, ordered_by, ordered_date, category } =
    req.body;
  try {
    const newOrder = await Order.create({
      name,
      color,
      quantity: Number(quantity),
      price: Number(price),
      ordered_by,
      ordered_date: Date(ordered_date),
      category,
    });
    res.status(200).json({ message: "Order added", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding order" });
  }
});

app.put("/admin/edit-order/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const { name, color, quantity, price, orderedBy, orderedDate, category } =
    req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        name,
        color,
        quantity,
        price,
        ordered_by: orderedBy,
        ordered_date: orderedDate,
        category,
      },
      { new: true, runValidators: true },
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res
      .status(200)
      .json({ message: "Order details updated", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order data" });
  }
});

app.delete("/admin/delete-order/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order" });
  }
});

// --------- PRODUCT ROUTES ---------
app.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.post("/admin/generate-description", verifyToken, async (req, res) => {
  try {
    const { name, category } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });

    const prompt = `
Write a short, attractive product description.

Product Name: ${name}
Category: ${category}

Make it:
- Simple English
- Engaging
- Suitable for marketing
- 30 words only
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error("no text generated from model");
    }

    res.status(200).json({
      description: text,
    });
  } catch (error) {
    console.error("Gemini Error:", error.message);
    console.error(error);
    res.status(500).json({
      message: "AI generation failed",
    });
  }
});

app.get("/admin/product-category-count", verifyToken, async (req, res) => {
  try {
    const result = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// --------- EDIT PRODUCT ---------
app.put(
  "/admin/edit-product/:id",
  productUpload.single("image"),
  verifyToken,
  async (req, res) => {
    const { name, price, category, description } = req.body;
    const newImage = req.file ? req.file.filename : null;
    const id = req.params.id;

    try {
      const existingProduct = await Product.findById(id);

      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      // delete old image if new image uploaded
      if (newImage && existingProduct.image) {
        await deleteImageFile(existingProduct.image);
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name,
          price,
          category,
          description,
          ...(newImage && { image: newImage }),
        },
        { new: true, runValidators: true },
      );

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating product" });
    }
  },
);

// --------- UPLOAD PRODUCT ---------
app.post(
  "/admin/upload-product-details",
  productUpload.single("productImage"),
  verifyToken,
  async (req, res) => {
    const { productName, productCategory, productPrice, productDescription } =
      req.body;
    try {
      const newProduct = await Product.create({
        name: productName,
        category: productCategory,
        price: productPrice,
        description: productDescription,
        image: req.file ? req.file.filename : "",
      });
      res
        .status(200)
        .json({ message: "Product added successfully!", product: newProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding product" });
    }
  },
);

app.delete("/admin/delete-product/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // delete image from folder
    await deleteImageFile(product.image);

    // delete from DB
    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
