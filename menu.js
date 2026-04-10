const menuGrid = document.getElementById("menu-grid");
const resultCount = document.getElementById("menu-result-count");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");

function getFilteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  let list = PRODUCTS.filter((item) => {
    const byName = item.name.toLowerCase().includes(query);
    const byCategory = category === "all" || item.category === category;
    return byName && byCategory;
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
}

searchInput.addEventListener("input", renderMenu);
categoryFilter.addEventListener("change", renderMenu);
sortFilter.addEventListener("change", renderMenu);

renderMenu();
