const express = require("express");
const {
  orderPlacing,
  orderCheck,
} = require("../controllers/paymentControls.js");
const {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControls.js");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
} = require("../controllers/userControls.js");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// user routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/me", isAuthenticatedUser, getUserDetails);

// product routes
router.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  createProduct
);
router.get("/products", getAllProducts);
router.get("/product/:id", getProductDetails);
router.put(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateProduct
);
router.delete(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteProduct
);

// payment routes
router.post("/order", isAuthenticatedUser, orderPlacing);
router.post("/is-order-complete", orderCheck);
