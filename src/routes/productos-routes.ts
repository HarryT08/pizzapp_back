import { Router } from "express";
const router = Router();

import {
  getProduct,
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct
} from "../controllers/products-controller";

router.route("/")
        .get(getProducts)
        .post(createProduct);

router.route("/:id")
        .get(getProduct)
        .delete(deleteProduct)
        .put(updateProduct);

export default router;
