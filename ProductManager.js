class ProductManager {
  constructor() {
    this.products = [];
  }
  addProduct = (title, description, price, thumbnail, code, stock) => {};
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
