const menuGrid = document.getElementById("menu-grid");
const resultCount = document.getElementById("menu-result-count");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");
const favoritesOnly = document.getElementById("favorites-only");
const randomProductButton = document.getElementById("random-product");

function getFilteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const sort = sortFilter.value;
  const onlyFavorites = favoritesOnly.checked;
  const favorites = loadFavorites();

  let list = PRODUCTS.filter((item) => {
    const byName = item.name.toLowerCase().includes(query);
    const byCategory = category === "all" || item.category === category;
    const byFavorite = !onlyFavorites || favorites.includes(item.id);
    return byName && byCategory && byFavorite;
  });

  if (sort === "price-asc") {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    list = [...list].sort((a, b) => b.price - a.price);
  } else if (sort === "name-asc") {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }

  return list;
}

function renderMenu() {
  const products = getFilteredProducts();

  menuGrid.innerHTML = products
    .map(
      (item) => `
        <a class="card-link" href="product.html?id=${item.id}">
          <article class="card">
            <img class="card-image" src="${item.image}" alt="${item.name}">
            <div class="card-body">
              <h3>${item.name}</h3>
              <p class="muted">${item.shortDescription}</p>
              <p class="price">${item.price} ₽</p>
              <div class="card-actions">
                <button class="add-btn" type="button" data-id="${item.id}">Добавить в корзину</button>
                <button class="favorite-btn" type="button" data-id="${item.id}">
                  ${isFavorite(item.id) ? "★ В избранном" : "☆ В избранное"}
                </button>
              </div>
            </div>
          </article>
        </a>
      `
    )
    .join("");

  resultCount.textContent = `Показано позиций: ${products.length}`;

  menuGrid.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      addProductToCart(button.dataset.id);
    });
  });

  menuGrid.querySelectorAll(".favorite-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const nowFavorite = toggleFavorite(button.dataset.id);
      showToast(nowFavorite ? "Добавлено в избранное" : "Удалено из избранного");
      renderMenu();
    });
  });
}

searchInput.addEventListener("input", renderMenu);
categoryFilter.addEventListener("change", renderMenu);
sortFilter.addEventListener("change", renderMenu);
favoritesOnly.addEventListener("change", renderMenu);
randomProductButton.addEventListener("click", () => {
  if (PRODUCTS.length === 0) {
    return;
  }
  const randomItem = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  window.location.href = `product.html?id=${randomItem.id}`;
});

renderMenu();
