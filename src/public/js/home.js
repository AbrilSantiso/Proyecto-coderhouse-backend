const productsList = document.getElementById("products-list");
const socket = io();

socket.on("nuevo-producto", (product) => {
  let productLi = document.createElement("li");
  productLi.classList.add("product-item");

  // Título del producto
  let productTitle = document.createElement("h3");
  productTitle.classList.add("product-title");
  productTitle.textContent = product.title;

  // Descripción del producto
  let productDescription = document.createElement("p");
  productDescription.classList.add("product-description");
  let strongDesc = document.createElement("strong");
  strongDesc.textContent = product.description;
  productDescription.appendChild(strongDesc);

  // Precio del producto
  let productPrice = document.createElement("p");
  productPrice.classList.add("product-price");
  productPrice.textContent = `Precio: $${product.price}`;

  // Stock del producto
  let productStock = document.createElement("p");
  productStock.classList.add("product-stock");
  productStock.textContent = `Stock: ${product.stock} unidades`;

  // Imagenes del producto
  let productThumbnails = document.createElement("div");
  productThumbnails.classList.add("product-thumbnails");

  /*  if(product?.thumbnails && product?.thumbnails.length > 0){
        console.log("entra")
        product?.thumbnails?.forEach((thumbnail) => {
          let img = document.createElement("img");
          img.src = thumbnail;
          img.alt = "Imagen de producto";
          img.classList.add("thumbnail");
          productThumbnails.appendChild(img);
        });
      }*/

  productLi.appendChild(productTitle);
  productLi.appendChild(productDescription);
  productLi.appendChild(productPrice);
  productLi.appendChild(productStock);
  productLi.appendChild(productThumbnails);

  productsList.appendChild(productLi);
});

socket.on("modificar-producto", (product, id) => {
  const productLi = document.getElementById(id);
  console.log(productLi);
  console.log(product);
  productLi.innerHTML = "";
  // Título del producto
  let productTitle = document.createElement("h3");
  productTitle.classList.add("product-title");
  productTitle.textContent = product.title;

  // Descripción del producto
  let productDescription = document.createElement("p");
  productDescription.classList.add("product-description");
  let strongDesc = document.createElement("strong");
  strongDesc.textContent = product.description;
  productDescription.appendChild(strongDesc);

  // Precio del producto
  let productPrice = document.createElement("p");
  productPrice.classList.add("product-price");
  productPrice.textContent = `Precio: $${product.price}`;

  // Stock del producto
  let productStock = document.createElement("p");
  productStock.classList.add("product-stock");
  productStock.textContent = `Stock: ${product.stock} unidades`;

  // Imagenes del producto
  let productThumbnails = document.createElement("div");
  productThumbnails.classList.add("product-thumbnails");

  /*   product.thumbnails.forEach((thumbnail) => {
      let img = document.createElement("img");
      img.src = thumbnail;
      img.alt = "Imagen de producto";
      img.classList.add("thumbnail");
      productThumbnails.appendChild(img);
    });*/

  productLi.appendChild(productTitle);
  productLi.appendChild(productDescription);
  productLi.appendChild(productPrice);
  productLi.appendChild(productStock);
  productLi.appendChild(productThumbnails);

  productsList.appendChild(productLi);
});

socket.on("eliminar-producto", (id) => {
  const productLi = document.getElementById(id);
  if (productLi) {
    productsList.removeChild(productLi); 
  } else {
    console.log(`No se encontró el producto con ID: ${id}`);
  }
});
