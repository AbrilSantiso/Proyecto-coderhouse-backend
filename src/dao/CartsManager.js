import fs from "fs";

export default class CartsManager {
  static path;

  static async getCarts() {
    if (fs.existsSync(this.path)) {
      let carts = JSON.parse(
        await fs.promises.readFile(this.path, { encoding: "utf-8" })
      );
      return carts;
    } else {
      return [];
    }
  }
  static async addCart(cart = {}) {
    let carts = await this.getCarts();
    let id = 1;
    if (carts.length > 0) {
      id = Math.max(...carts.map((p) => p.id)) + 1;
    }

    let newCart = {
      id,
      ...cart,
    };

    carts.push(newCart);

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5));

    return newCart;
  }

  static async updateCart(id, cartToUpdate = {}) {
    let carts = await this.getCarts();
    let cartIndex = carts.findIndex((p) => p.id === id);
    if (cartIndex === -1) {
      throw new Error(`Error: no existe ningún carrito con id ${id}`);
    }
    carts[cartIndex] = {
      ...cartToUpdate,
      id,
    };
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5));
    return carts[cartIndex];
  }

}
