import { Router } from "express";
import CartsManager from "../dao/CartsManager2.js";
import ProductsManager from "../dao/ProductsManager2.js";
import { isValidObjectId } from 'mongoose';


const router = Router();

CartsManager.path = "./src/data/carts.json";
ProductsManager.path = "./src/data/products.json";


router.get("/:id", async (req, res) => {
  let { id } = req.params;
  if (!isValidObjectId(id)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El id no es válido` });
  }
  let cart;
  try {
    cart = await CartsManager.getCart(id);
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible obtener el carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  if (!cart) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún carrito con el id ${id}` });
  }
 
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: cart });
});

router.post("/", async (req, res) => {
  try {
    let newCart = await CartsManager.addCart({
        products: []
    });
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ newCart });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible agregar el carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;

  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El id no es válido` });
  }

  let cart;
  try {
    cart = await CartsManager.getCart(cid);

  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible agregar el producto al carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }

  if (!cart) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún carrito con el id ${cid}` });
  }
  
  let products;
  try {
    products = await ProductsManager.getProducts(undefined, 500);

  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible agregar el producto al carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  let product = products.docs.find((p) => p.id === pid);
  if (!product) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún producto con el id ${cid}` });
  }

  const productExistsInCart = cart.products.some((product)=>product.product._id.toHexString() === pid)
  if(productExistsInCart){
    cart.products = cart.products.map((product)=>product.product._id.toHexString()  === pid ? {...product, quantity:product.quantity +1}: product)
  }else{
    cart.products = [...cart.products, {product: pid, quantity: 1}]
  }

  try {
    let updatedcart = await CartsManager.updateCart(
      cid,
      cart
    );
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ updatedcart });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible actualizar el carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  let { cid, pid } = req.params;

  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El id no es válido` });
  }

  let cart;
  try {
    cart = await CartsManager.getCart(cid);

  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible eliminar el producto al carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  if (!cart) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún carrito con el id ${cid}` });
  }
  

  const productExistsInCart = cart.products.some((product)=>product.product._id.toHexString()  === pid)
  if(productExistsInCart){
    cart.products = cart.products.filter((product)=>product.product._id.toHexString()  !== pid)
  }

  try {
    let updatedcart = await CartsManager.updateCart(
      cid,
      cart
    );
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ updatedcart });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible actualizar el carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
});

router.put("/:cid", async (req, res) => {
  let { cid} = req.params;
  let { products} = req.body;
  if (!isValidObjectId(cid) ) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El id no es válido` });
  }

  let cart;
  try {
    cart = await CartsManager.getCart(cid);

  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible agregar el producto al carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  if (!cart) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún carrito con el id ${cid}` });
  }

  cart.products = [...cart.products, ...products]
  try {
    let updatedcart = await CartsManager.updateCart(
      cid,
      cart
    );
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ updatedcart });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible actualizar el carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  let { quantity } = req.body;

  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El id no es válido` });
  }

  let cart;
  try {
    cart = await CartsManager.getCart(cid);

  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible agregar el producto al carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  if (!cart) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún carrito con el id ${cid}` });
  }
  
  const productExistsInCart = cart.products.some((product)=>product.product._id.toHexString()  === pid)
  if(productExistsInCart){
    cart.products = cart.products.map((product)=>product.product._id.toHexString()  === pid ? {...product, quantity: quantity }: product)
  }else{
    cart.products = [...cart.products, {product: pid, quantity: 1}]
  }

  try {
    let updatedcart = await CartsManager.updateCart(
      cid,
      cart
    );
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ updatedcart });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible actualizar el carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
});

router.delete("/:cid", async (req, res) => {
  let { cid} = req.params;
  if (!isValidObjectId(cid)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El id no es válido` });
  }

  let cart;
  try {
    cart = await CartsManager.getCart(cid);

  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible eliminar el producto al carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  if (!cart) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún carrito con el id ${cid}` });
  }
  
 cart.products = []
  try {
    let updatedcart = await CartsManager.updateCart(
      cid,
      cart
    );
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ updatedcart });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible actualizar el carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
});

export default router;