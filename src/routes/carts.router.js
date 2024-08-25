import { Router } from "express";
import CartsManager from "../dao/CartsManager.js";
import ProductsManager from "../dao/ProductsManager.js";
const router = Router();

CartsManager.path = "./src/data/carts.json";
ProductsManager.path = "./src/data/products.json";


router.get("/:id", async (req, res) => {
  let { id } = req.params;
  id = Number(id);
  if (isNaN(id)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El parametro id debe ser de tipo numerico` });
  }
  let carts;
  try {
    carts = await CartsManager.getCarts();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible obtener el carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  let cart = carts.find((c) => c.id === id);
  if (!cart) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún carrito con el id ${id}` });
  }
  const cartProducts = []
  try {
   const products = await ProductsManager.getProducts();
    cart.products.forEach((cartProduct)=>{
       let product = products.find((p) => p.id === cartProduct.product);
        cartProducts.push(product ? {id: cartProduct.product, quantity: cartProduct.quantity} : {id: cartProduct.product, description: "El producto ya no existe"})
    })
   
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible obtener los productos del carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
 
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: cartProducts });
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
  cid = Number(cid);
  pid = Number(pid);
  if (isNaN(cid) || isNaN(pid)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `El parametro id debe ser de tipo numerico` });
  }

  let carts;
  try {
    carts = await CartsManager.getCarts();

  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible agregar el producto al carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  let cart = carts.find((c) => c.id === cid);
  if (!cart) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún carrito con el id ${cid}` });
  }
  
  let products;
  try {
    products = await ProductsManager.getProducts();

  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `No fue posible agregar el producto al carrito debido a un error inesperado en el servidor. Intentelo más tarde`,
      detalle: `${error.message}`,
    });
  }
  let product = products.find((p) => p.id === pid);
  if (!product) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: `No existe ningún producto con el id ${cid}` });
  }

  const productExistsInCart = cart.products.some((product)=>product.product === pid)
  if(productExistsInCart){
    cart.products = cart.products.map((product)=>product.product === pid ? {...product, quantity:product.quantity +1}: product)
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

export default router;