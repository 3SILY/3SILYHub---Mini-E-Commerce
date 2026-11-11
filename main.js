let searchInput = document.getElementById("search-input");
let categoryFilter = document.getElementById("category-filter");
let cartCount = document.getElementById("cart-count");
let proContainer = document.getElementById("products-container");

let cartModal = document.getElementById("cart-modal");
let cartItems = document.getElementById("cart-items");
let closeCart = document.getElementById("close-cart");
let cartIcon = document.querySelector(".cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let products;

async function getProducts() {
  let response = await fetch("https://dummyjson.com/products");
  let data = await response.json();
  products = data.products;
  displayProducts(products);
  displayCategories();
}
getProducts();

function displayProducts(products) {
  proContainer.innerHTML = "";
  products.forEach((pro) => {
    proContainer.innerHTML += `
        <div class="card-div">
        <img src="${pro.thumbnail}">
        <h3>${pro.title}</h3>
        <p>${pro.price}</p>
        <button class="add-to-cart" data-id="${pro.id}">
  Add to Cart
</button>
        </div>
        
        `;
  });
}

function searchProduct() {
  let searchValue = searchInput.value;
  let filterdProducts = products.filter((pro) => {
    return pro.title.toLowerCase().includes(searchValue.toLowerCase());
  });

  displayProducts(filterdProducts);
}

searchInput.addEventListener("input", searchProduct);

function displayCategories() {
  let category = products.map((pro) => {
    return pro.category;
  });

  let uniqueCategories = new Set(category);
  let result = Array.from(uniqueCategories);

  result.forEach((pro) => {
    let option = document.createElement("option");
    option.textContent = pro;
    categoryFilter.appendChild(option);
    option.value = pro;
  });
}

function filterByCategory() {
  let filterd = products.filter((pro) => {
    return pro.category === categoryFilter.value;
  });
  displayProducts(filterd);
}

categoryFilter.addEventListener("change", filterByCategory);

proContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    let productId = event.target.dataset.id;
    let found = products.find((pro) => {
      return pro.id === Number(productId);
    });

    let existingProduct = cart.find((pro) => {
      return pro.id === found.id;
    });

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({ ...found, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    displayCart();
  }
});

cartIcon.addEventListener("click", () => {
  cartModal.style.display = "block";
});

closeCart.addEventListener("click", () => {
  cartModal.style.display = "none";
});

function displayCart() {
  cartItems.innerHTML = "";
  cart.forEach((pro) => {
    cartItems.innerHTML += `
  <div class="cart-item">
  <img src="${pro.thumbnail}">
  <div>
    <h3>${pro.title}</h3>
    <p>${pro.price}</p>
    <p>Quantity: ${pro.quantity}</p>
     <button class="remove-from-cart" data-id="${pro.id}">
            Remove
          </button>

  </div>
</div>
  `;
  });
}

cartItems.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart")) {
    let itemId = event.target.dataset.id;
    let filterd = cart.filter((pro) => {
      return pro.id != itemId;
    });
    cart = filterd;
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  displayCart();
  updateCartCount();
});

function updateCartCount() {
  let count = cart.reduce((a, b) => {
    return a + b.quantity;
  }, 0);

  cartCount.textContent = count;
}

updateCartCount();
displayCart();
