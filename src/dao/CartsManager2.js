import { cartsModel } from "./models/cartModel.js";

export default class CartsManager {

  static async addCart(cart = {}) {
    return await cartsModel.create(cart);
  }

  static async getCart(id = string) {
    return await cartsModel.findOne({_id : id}).lean();  }

  static async getCarts() {
    return await cartsModel.find().lean()
  }

  static async updateCart(id, cartToUpdate = {}) {
    return await cartsModel
    .findByIdAndUpdate(id, cartToUpdate, { new: true })
    .lean();
  }

}
