import { Router } from "express";
import ProductsManager from "../dao/ProductsManager.js";

const router = Router();

ProductsManager.path = "./src/data/products.json";

router.get("/", async (req, res) => {
  let products;
  try {
    products = await ProductsManager.getProducts();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible obtener los productos debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  let { limit } = req.query;
  if (limit) {
    limit = Number(limit);
    if (isNaN(limit)) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `El argumento limit tiene que ser de tipo numerico` });
    }
  } else {
    limit = products.length;
  }

  let result = products.slice(0, limit);

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ result });
});

router.get("/:id", async (req, res) => {
  let { id } = req.params;
  id = Number(id);
  if (isNaN(id)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El parametro id debe ser de tipo numerico` });
  }
  let products;
  try {
    products = await ProductsManager.getProducts();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible obtener el producto debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  let product = products.find((p) => p.id === id);
  if (!product) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún producto con el id ${id}` });
  }
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: product });
});

router.post("/", async (req, res) => {
  let { title, description, code, price, stock, category, thumbnails } =
    req.body;
  if (
    !title ||
    !description ||
    !code ||
    price === undefined ||
    stock === undefined ||
    !category
  ) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      error: `No es posible agregar el producto porque faltan campos requeridos en la solicitud. Los campos: title, description, code, price, status, stock, category  son necesarios para crear un producto `,
    });
  }

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof code !== "string" ||
    typeof price !== "number" ||
    price < 0 ||
    typeof stock !== "number" ||
    stock < 0 ||
    typeof category !== "string" ||
    !Array.isArray(thumbnails) ||
    !thumbnails.every((item) => typeof item === "string")
  ) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      error: `No es posible agregar el producto porque alguno de los campos no tiene el formato indicado.`,
    });
  }

  try {
    let newProduct = await ProductsManager.addProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      status: true,
    });
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ newProduct });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible agregar el producto debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
});

router.put("/:id", async (req, res) => {
  let { id } = req.params;
  id = Number(id);
  if (isNaN(id)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El parametro id debe ser de tipo numerico` });
  }

  let products;
  try {
    products = await ProductsManager.getProducts();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible actualizar el producto debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  let product = products.find((p) => p.id === id);
  if (!product) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún producto con el id ${id}` });
  }

  let productToUpdate = req.body;

  delete productToUpdate.id;

  try {
    let updatedProduct = await ProductsManager.updateProduct(
      id,
      productToUpdate
    );
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ updatedProduct });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible actualizar el producto debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
});

router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  id = Number(id);
  if (isNaN(id)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El parametro id debe ser de tipo numerico` });
  }

  let products;
  try {
    products = await ProductsManager.getProducts();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible eliminar el producto debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  let product = products.find((p) => p.id === id);
  if (!product) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún producto con el id ${id}` });
  }

  try {
    let result = await ProductsManager.deleteProduct(id);
    if (result > 0) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(200)
        .json({ payload: "El producto fue eliminado con éxito" });
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `No fue posible eliminar el producto debido a un error inesperado. Intentelo más tarde`,
      });
    }
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible eliminar el producto debido a un error inesperado. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
});

export default router;
