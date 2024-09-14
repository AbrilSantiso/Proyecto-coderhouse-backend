const productsList = document.getElementById("products-list");
const socket = io();

const addProduct = async () => {
  const title = document.querySelector("#new-title").value;
  const description = document.querySelector("#new-description").value;
  const price = parseInt(document.querySelector("#new-price").value);
  const code = document.querySelector("#new-code").value;
  const stock = parseInt(document.querySelector("#new-stock").value);
  const category = document.querySelector("#new-category").value;

  const info = { title, description, price, code, stock, category };

  await fetch("/api/products", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  });

  // Limpio los campos luego de agregar producto
  document.querySelector("#new-title").value = "";
  document.querySelector("#new-description").value = "";
  document.querySelector("#new-price").value = "";
  document.querySelector("#new-code").value = "";
  document.querySelector("#new-stock").value = "";
  document.querySelector("#new-category").value = "";
};

const updateProduct = async () => {
  const id = document.querySelector("#edit-id").value;
  const title = document.querySelector("#edit-title").value;
  const description = document.querySelector("#edit-description").value;
  const price = parseInt(document.querySelector("#edit-price").value);
  const code = document.querySelector("#edit-code").value;
  const stock = parseInt(document.querySelector("#edit-stock").value);
  const category = document.querySelector("#edit-category").value;

  const info = { title, description, price, code, stock, category };

  await fetch(`/api/products/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  });

  // Limpio los campos luego de agregar producto
  document.querySelector("#edit-id").value = "";
  document.querySelector("#edit-title").value = "";
  document.querySelector("#edit-description").value = "";
  document.querySelector("#edit-price").value = "";
  document.querySelector("#edit-code").value = "";
  document.querySelector("#edit-stock").value = "";
  document.querySelector("#edit-category").value = "";
};

const deleteProduct = async (id) => {
  await fetch(`/api/products/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

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

