const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");
const clearCartButton = document.getElementById("clear-cart");
const exportCartButton = document.getElementById("export-cart");
const checkoutForm = document.getElementById("checkout-form");
const promoInput = document.getElementById("promo-code");
const applyPromoButton = document.getElementById("apply-promo");
const discountLine = document.getElementById("discount-line");

let discountPercent = 0;

function changeQuantity(index, delta) {
  const cart = loadCart();
  const item = cart[index];

  if (!item) {
    return;
  }

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function removeItem(index) {
  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function renderCartPage() {
  const cart = loadCart();
  cartItems.innerHTML = "";

  let rawTotal = 0;

  cart.forEach((item, index) => {
    rawTotal += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <span class="muted">${item.price} ₽ x ${item.quantity}</span>
      </div>
      <div class="item-controls">
        <button class="qty-btn" type="button" data-action="dec">-</button>
        <button class="qty-btn" type="button" data-action="inc">+</button>
        <button class="remove-btn" type="button" data-action="remove">Удалить</button>
      </div>
    `;

    li.querySelector('[data-action="dec"]').addEventListener("click", () => changeQuantity(index, -1));
    li.querySelector('[data-action="inc"]').addEventListener("click", () => changeQuantity(index, 1));
    li.querySelector('[data-action="remove"]').addEventListener("click", () => removeItem(index));
    cartItems.appendChild(li);
  });

  const discountValue = Math.round(rawTotal * (discountPercent / 100));
  const total = rawTotal - discountValue;
  cartTotal.textContent = String(total);
  discountLine.textContent =
    discountPercent > 0 ? `Скидка ${discountPercent}%: -${discountValue} ₽` : "";
  cartEmpty.style.display = cart.length === 0 ? "block" : "none";
}

clearCartButton.addEventListener("click", () => {
  saveCart([]);
  updateCartBadge();
  renderCartPage();
  showToast("Корзина очищена");
});

exportCartButton.addEventListener("click", () => {
  const cart = loadCart();

  if (cart.length === 0) {
    showToast("Корзина пуста");
    return;
  }

  const text = createReceiptText("", "", "", cart);
  downloadReceipt(text);
  showToast("Чек скачан");
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cart = loadCart();

  if (cart.length === 0) {
    showToast("Добавьте товары в корзину");
    return;
  }

  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const comment = document.getElementById("customer-comment").value.trim();

  const text = createReceiptText(name, phone, comment, cart);
  downloadReceipt(text);
  showToast("Заказ оформлен");
  checkoutForm.reset();
});

applyPromoButton.addEventListener("click", () => {
  const code = promoInput.value.trim().toUpperCase();
  if (code === "COFFEE10") {
    discountPercent = 10;
    showToast("Промокод применен");
  } else if (code === "SWEET15") {
    discountPercent = 15;
    showToast("Промокод применен");
  } else {
    discountPercent = 0;
    showToast("Промокод не найден");
  }
  renderCartPage();
});

renderCartPage();
