const STORAGE_KEY = "coffeeShopCart";
const FAVORITES_KEY = "coffeeShopFavorites";

function loadCart() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadFavorites() {
  const raw = localStorage.getItem(FAVORITES_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(productId) {
  return loadFavorites().includes(productId);
}

function toggleFavorite(productId) {
  const favorites = loadFavorites();
  const index = favorites.indexOf(productId);
  if (index >= 0) {
    favorites.splice(index, 1);
    saveFavorites(favorites);
    return false;
  }
  favorites.push(productId);
  saveFavorites(favorites);
  return true;
}

function getCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count-badge");

  if (!badge) {
    return;
  }

  const cart = loadCart();
  badge.textContent = String(getCartCount(cart));
}

function addProductToCart(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const cart = loadCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartBadge();
  showToast(`${product.name} добавлен в корзину`);
}

function createReceiptText(customerName, customerPhone, customerComment, cart) {
  const rows = cart.map(
    (item) => `- ${item.name}: ${item.quantity} x ${item.price} ₽ = ${item.quantity * item.price} ₽`
  );
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return [
    "Чек кофейни \"Теплый Зерновой\"",
    `Дата: ${new Date().toLocaleString("ru-RU")}`,
    "",
    `Клиент: ${customerName || "Не указан"}`,
    `Телефон: ${customerPhone || "Не указан"}`,
    `Комментарий: ${customerComment || "Нет"}`,
    "",
    "Состав заказа:",
    ...rows,
    "",
    `Итого: ${total} ₽`
  ].join("\n");
}

function downloadReceipt(content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "coffee-order-receipt.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

updateCartBadge();
