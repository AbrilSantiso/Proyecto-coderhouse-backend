import { Router } from "express";
import ProductsManager from "../dao/ProductsManager2.js";
import { isValidObjectId } from 'mongoose';


const router = Router();

export default (io) => {
  router.get("/", async (req, res) => {
    let products;
   const {limit, page, sort, category} = req.query
    try {
      products = await ProductsManager.getProducts(page, limit, sort ? (sort === "asc" ? {price: 1}: {price: -1}): {}, category ? {category: category}: {});
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      let result = {
        status: "error",
        payload: null,
        totalPages: 0,
        prevPage: null,
        nextPage: null,
        page: null,
        hasPrevPage: false,
        hasNextPage: false,
        prevLink: null,
        nextLink: null,
      };
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ result: { ...result, error: error.message }
      });
    }
   
    let result = {
      status: products.totalDocs > 0 ? "success" : "error",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}` : null,
      nextLink: products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}` : null,
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ result });
  });

  router.get("/:id", async (req, res) => {
    let { id } = req.params;
    if (!isValidObjectId(id)) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `El id no es válido` });
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
    let product = products.docs.find((p) => p.id === id);
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
      typeof category !== "string" /*||
      !Array.isArray(thumbnails) ||
      !thumbnails.every((item) => typeof item === "string")*/
    ) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({
        error: `No es posible agregar el producto porque alguno de los campos no tiene el formato indicado.`,
      });
    }

    try {
      // Agrego verificación para que no sea posible agregar un producto con un nombre ya existente
      const existingProduct = await ProductsManager.getProductByTitle(title);
      if (existingProduct) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({
          error: `El producto con el nombre '${title}' ya existe. Por favor, elija un nombre diferente.`,
        });
      }

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

      // Si el producto se agrega con exito vamos a emitir un evento para que se actualicen los productos en tiempo real

      io.emit("nuevo-producto", newProduct);

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
    if (!isValidObjectId(id)) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `El id no es válido` });
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
    let product = products.docs.find((p) => p.id === id);
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
      io.emit("modificar-producto", updatedProduct,  id);
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
    if (!isValidObjectId(id)) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `El id no es válido` });
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
    let product = products.docs.find((p) => p.id === id);
    if (!product) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `No existe ningún producto con el id ${id}` });
    }

    try {
      let result = await ProductsManager.deleteProduct(id);
      if (result !== null) {
        // Si el producto se elimina con exito vamos a emitir un evento para que se actualicen los productos en tiempo real sin el producto eliminado
        io.emit("eliminar-producto", id);
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
  return router;
};
