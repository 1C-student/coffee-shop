const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const productRoot = document.getElementById("product-root");

function renderProductPage() {
  const product = PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    productRoot.innerHTML = "<p>Товар не найден.</p>";
    return;
  }

  productRoot.innerHTML = `
    <img class="product-image" src="${product.image}" alt="${product.name}">
    <div class="product-panel">
      <h1>${product.name}</h1>
      <p class="muted">${product.category === "coffee" ? "Категория: Кофе" : "Категория: Десерты"}</p>
      <p>${product.description}</p>
      <p class="price">${product.price} ₽</p>
      <button id="add-product-btn" class="add-btn" type="button">Добавить в корзину</button>
    </div>
  `;

  document.getElementById("add-product-btn").addEventListener("click", () => {
    addProductToCart(product.id);
  });
}

renderProductPage();
