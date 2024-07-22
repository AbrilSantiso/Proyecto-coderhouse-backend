export default class ProductManager {
  constructor() {
    this.products = [];
  }
  addProduct = (title, description, price, thumbnail, code, stock) => {
    let id = 1;
    if (this.products.length > 0) {
      id = this.products[this.products.length - 1].id + 1;
    }
    const isCodeRepeated = code && this.products.some(
      (product) => product.code === code
    );
    if (
      !isCodeRepeated &&
      title &&
      description &&
      price &&
      thumbnail &&
      stock !== undefined
    ) {
      this.products.push({
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
    }
  };

  getProducts = () => {
    return this.products;
  };
  getProductById = (id) => {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      console.error("Not found");
    }
  };
}
