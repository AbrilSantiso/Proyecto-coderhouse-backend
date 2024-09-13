import { productsModel } from "./models/productModel.js";

export default class ProductsManager {

  static async getProducts(page = 1, limit = 10, sort = {}, query = {}) {
    return await productsModel.paginate(query, {
      lean: true,
      page,
      limit,
      sort: sort,
    });
  }

  static async getBy(filter = {}) {
    return await productsModel.findOne(filter).lean();
  }

  static async addProduct(product = {}) {
    return await productsModel.create(product);
  }

  static async updateProduct(id, productToUpdate = {}) {
    return await productsModel
      .findByIdAndUpdate(id, productToUpdate, { new: true })
      .lean();
  }

  static async deleteProduct(id) {
    return await productsModel.findByIdAndDelete(id, { new: true }).lean();
  }

  static async getProductByTitle(title) {
    return await productsModel.findOne({ title: title }).lean();
  }
}
