const path = require("path");
const express = require("express");

//root dir
const rootDir = require("../util/path");
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admins");

//express router
const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", getAddProduct);

// /admin/productS => GET
router.get("/products", getProducts);

// /admin/add-product => POST
router.post("/add-product", postAddProduct);

// /admin/edit-product => GET
router.get("/edit-product/:productId", getEditProduct);

// /admin/edit-product => POST
router.post("/edit-product", postEditProduct);

// /admin/delete-product => POST
router.post("/delete-product", postDeleteProduct);

module.exports = router; // export the route
