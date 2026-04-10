const featuredIds = ["latte", "tiramisu", "cappuccino", "cheesecake"];
const featuredGrid = document.getElementById("featured-grid");

function renderFeatured() {
  const featuredProducts = PRODUCTS.filter((item) => featuredIds.includes(item.id));

  featuredGrid.innerHTML = featuredProducts
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

  featuredGrid.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      addProductToCart(button.dataset.id);
    });
  });
}

renderFeatured();
