const CART_ID = "66e37cd4bae80d56bc96ea23";
const cartContainer = document.querySelector(".cart-container");

const deleteProduct = async (id) => {
  await fetch(`/api/carts/${CART_ID}/products/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        const product = document.getElementById(id);
        if (product) {
          cartContainer.removeChild(product);
        }
      }
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
};

const deleteAllProducts = async () => {
  await fetch(`/api/carts/${CART_ID}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        cartContainer.innerHTML = "";
        const noProductsMessage = document.createElement("p");
        noProductsMessage.textContent = "No hay productos";
        cartContainer.appendChild(noProductsMessage);
      }
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
};

const updateQuantity = async (productId, number) => {
    const quantityElement = document.getElementById(`quantity-${productId}`)
    let currentQuantity = parseInt(quantityElement.textContent);
    await fetch(`/api/carts/${CART_ID}/products/${productId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: currentQuantity + parseInt(number)
       }) 
    })
      .then((response) => {
        if (response.ok) {
            if (quantityElement) {
                quantityElement.innerHTML = "";
                quantityElement.textContent = currentQuantity + parseInt(number)
            }
        }
      })
      .catch((error) => {
        console.error("Error al cargar los productos:", error);
      });
  };