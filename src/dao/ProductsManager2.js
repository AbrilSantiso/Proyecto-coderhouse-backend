import  fs  from "fs";
import { productsModel } from "./models/productModel.js";

export default class ProductsManager {
  static path

  static async getProducts(page=1, limit=10, sort={}, query={}){
    return await productsModel.paginate(query, {lean:true, page, limit, sort: sort})
}

static async getBy(filter={}){
    return await productsModel.findOne(filter).lean()
}

static async addProduct(product={}){
    return await productsModel.create(product)
}

static async updateProduct(id, productToUpdate={}){
  let products=await this.getProducts()
  let productIndex=products.findIndex(p=>p.id===id)
  if(productIndex===-1){
      throw new Error(`Error: no existe ningún producto con id ${id}`)
  }
  products[productIndex]={
      ...products[productIndex],
      ...productToUpdate,
      id
  }
  await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
  return products[productIndex]
}

static async deleteProduct(id){
  let products=await this.getProducts()
  let productIndex=products.findIndex(p=>p.id===id)
  if(productIndex===-1){
    throw new Error(`Error: no existe ningún producto con id ${id}`)
  }
  let cantidad0=products.length
  products=products.filter(p=>p.id!==id)   
  let cantidad1=products.length
 
  await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))

  return cantidad0-cantidad1
}

static async getProductByTitle(title) {
  let products = await this.getProducts();
  return products.docs.find(product => product.title === title) || null;
}

}

