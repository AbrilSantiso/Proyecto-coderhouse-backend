const productsList = document.getElementById("products-list");
const socket = io();
const CART_ID = "66e37cd4bae80d56bc96ea23";

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

const goToPage = async (url) => {
  await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      updateProductList(data.result);
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
};

const filterByPrice = async (sort) => {
  await fetch(`http://localhost:8080/api/products?sort=${sort}`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      updateProductList(data.result);
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
};

const filterByCategory = async (category) => {
  await fetch(`http://localhost:8080/api/products?category=${category}`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      updateProductList(data.result);
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
};

function updateProductList(data) {
  const productList = document.getElementById("products-list");
  const pageInfo = document.getElementById("page-info");

  productList.innerHTML = "";

  data.payload.forEach((product) => {
    const item = document.createElement("li");
    item.className = "product-item";
    item.id = product.id;

    item.innerHTML = `
      <h3 class="product-title">${product.title}</h3>
      <p class="product-description"><strong>${product.description}</strong></p>
      <p class="product-price">Precio: $${product.price}</p>
      <p class="product-stock">Stock: ${product.stock} unidades</p>
      <div class="product-thumbnails">
        ${product.thumbnails
          .map(
            (thumbnail) =>
              `<img src="${thumbnail}" alt="Imagen de producto" class="thumbnail" />`
          )
          .join("")}
      </div>
         <button class="add-to-cart-button" onclick="addToCart('${product.id}')">Agregar al Carrito</button>
    `;

    productList.appendChild(item);
  });

  pageInfo.textContent = `Página ${data.page} de ${data.totalPages}`;

  document.getElementById("prev-page").style.display = data.prevPage
    ? "inline"
    : "none";
  document.getElementById("next-page").style.display = data.nextPage
    ? "inline"
    : "none";

  if (data.prevPage) {
    document.getElementById("prev-page").onclick = () =>
      goToPage(data.prevLink);
  }
  if (data.nextPage) {
    document.getElementById("next-page").onclick = () =>
      goToPage(data.nextLink);
  }
}

const addToCart = async (productId) => {
  await fetch(
    `http://localhost:8080/api/carts/${CART_ID}/product/${productId}`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      alert("¡Producto agregado!\nEl producto ha sido agregado a tu carrito.");
    })
    .catch((error) => {
      console.error("Error al agregar el producto los productos:", error);
    });
};
