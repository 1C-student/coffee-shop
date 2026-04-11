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
  const encoder = new TextEncoder();
  const body = encoder.encode(content);
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const bytes = new Uint8Array(bom.length + body.length);
  bytes.set(bom, 0);
  bytes.set(body, bom.length);
  const blob = new Blob([bytes], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chek-zakaza-utf8.txt";
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

function enhanceImages(root = document) {
  const fallback =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>" +
        "<rect width='100%' height='100%' fill='#efe3d8'/>" +
        "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' " +
        "font-family='Arial' font-size='28' fill='#7a5a45'>Изображение недоступно</text>" +
      "</svg>"
    );

  root.querySelectorAll("img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.src = fallback;
      },
      { once: true }
    );
  });
}

updateCartBadge();
