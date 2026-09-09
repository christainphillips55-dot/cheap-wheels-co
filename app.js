const makes = [
  ["Toyota", ["Corolla", "Camry", "RAV4", "Prius"]],
  ["Honda", ["Civic", "Accord", "CR-V", "Fit"]],
  ["Mazda", ["3", "6", "CX-5", "CX-3"]],
  ["Ford", ["Focus", "Fusion", "Escape", "Maverick"]],
  ["Hyundai", ["Elantra", "Sonata", "Tucson", "Kona"]],
  ["Subaru", ["Impreza", "Legacy", "Forester", "Crosstrek"]],
  ["Kia", ["Forte", "Optima", "Soul", "Sportage"]],
  ["Volkswagen", ["Jetta", "Passat", "Golf", "Tiguan"]],
  ["Nissan", ["Sentra", "Altima", "Rogue", "Kicks"]],
  ["Chevrolet", ["Cruze", "Malibu", "Equinox", "Trax"]],
  ["Volvo", ["S60", "V60", "XC40", "XC60"]],
  ["Acura", ["ILX", "TLX", "RDX", "MDX"]],
  ["Lexus", ["IS 250", "ES 350", "UX 250h", "NX 300"]],
  ["Mini", ["Cooper", "Clubman", "Countryman", "Hardtop"]],
  ["Buick", ["Encore", "Verano", "Regal", "Envision"]],
  ["Mitsubishi", ["Mirage", "Lancer", "Outlander", "Eclipse Cross"]],
  ["Chrysler", ["200", "300", "Pacifica", "Voyager"]],
];
const colors = [
  "#d8e6e0",
  "#d9e0e8",
  "#e8dfd5",
  "#dce4d5",
  "#e4dce5",
  "#d8e1e5",
];
const cart = [];
const inventory = Array.from({ length: 68 }, (_, index) => {
  const [make, models] = makes[index % makes.length];
  const year = 2016 + (index % 9);
  const model = models[Math.floor(index / makes.length) % models.length];
  const price = Math.min(14800, 3200 + ((index * 823) % 11600));
  const mileage = 28000 + ((index * 7311) % 92000);
  const transmission = index % 4 === 0 ? "Manual" : "Automatic";
  return {
    id: index + 1,
    make,
    model,
    year,
    price,
    mileage,
    transmission,
    mpg: 24 + (index % 15),
    status: "available",
    color: colors[index % colors.length],
  };
});

const pages = {
  gallery: document.querySelector("#gallery-page"),
  browse: document.querySelector("#browse-page"),
  cart: document.querySelector("#cart-page"),
  why: document.querySelector("#why-page"),
};
const browseGrid = document.querySelector("#browse-grid");
const searchInput = document.querySelector("#search-input");
const transmissionFilter = document.querySelector("#transmission-filter");
const priceFilter = document.querySelector("#price-filter");
const priceValue = document.querySelector("#price-value");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const checkoutModal = document.querySelector("#checkout-modal");
const successScreen = document.querySelector("#order-success-screen");
const cartCount = document.querySelector("#cart-count");
const cartItemsContainer = document.querySelector("#cart-items-container");

function showPage(pageName) {
  Object.entries(pages).forEach(([name, page]) =>
    page.classList.toggle("active-page", name === pageName),
  );
  document
    .querySelectorAll("[data-page]")
    .forEach((link) =>
      link.classList.toggle("active", link.dataset.page === pageName),
    );
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function formatPrice(value) {
  return `$${value.toLocaleString("en-US")}`;
}

function drawCar(canvas, vehicle, hero = false) {
  const context = canvas.getContext("2d");
  const width = (canvas.width = canvas.clientWidth * devicePixelRatio);
  const height = (canvas.height = canvas.clientHeight * devicePixelRatio);
  context.scale(devicePixelRatio, devicePixelRatio);
  const scale = Math.min(canvas.clientWidth / 400, canvas.clientHeight / 220);
  const x = canvas.clientWidth / 2;
  const y = canvas.clientHeight * (hero ? 0.62 : 0.65);
  context.fillStyle = vehicle?.color || "#153737";
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  context.fillStyle = hero ? "rgba(16,185,129,.08)" : "rgba(255,255,255,.16)";
  context.beginPath();
  context.arc(x * 0.8, y * 0.5, 90 * scale, 0, Math.PI * 2);
  context.fill();
  context.save();
  context.translate(x - 175 * scale, y - 42 * scale);
  context.scale(scale, scale);
  context.fillStyle = hero ? "#183c3a" : "#183433";
  context.beginPath();
  context.moveTo(22, 78);
  context.lineTo(55, 74);
  context.lineTo(94, 31);
  context.quadraticCurveTo(103, 20, 124, 20);
  context.lineTo(252, 20);
  context.quadraticCurveTo(276, 22, 292, 45);
  context.lineTo(331, 56);
  context.quadraticCurveTo(346, 60, 350, 79);
  context.lineTo(350, 90);
  context.lineTo(22, 90);
  context.closePath();
  context.fill();
  context.fillStyle = "#80a9a1";
  context.beginPath();
  context.moveTo(105, 28);
  context.lineTo(129, 28);
  context.lineTo(143, 56);
  context.lineTo(92, 56);
  context.closePath();
  context.fill();
  context.beginPath();
  context.moveTo(151, 28);
  context.lineTo(244, 28);
  context.quadraticCurveTo(263, 29, 276, 56);
  context.lineTo(157, 56);
  context.closePath();
  context.fill();
  context.fillStyle = "#071b1c";
  context.beginPath();
  context.arc(88, 88, 28, 0, Math.PI * 2);
  context.arc(282, 88, 28, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#cce5dc";
  context.beginPath();
  context.arc(88, 88, 12, 0, Math.PI * 2);
  context.arc(282, 88, 12, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#9ef5d1";
  context.fillRect(317, 61, 18, 8);
  context.restore();
}

function renderCard(vehicle) {
  const card = document.createElement("article");
  card.className = `vehicle-card ${vehicle.status === "sold" ? "sold" : ""}`;
  card.innerHTML = `<div class="vehicle-image"><canvas aria-label="Illustration of ${vehicle.year} ${vehicle.make} ${vehicle.model}"></canvas>${vehicle.status === "sold" ? '<span class="stock-badge">🔥 PENDING SALE</span>' : ""}</div><div class="vehicle-info"><h3>${vehicle.year} ${vehicle.make} ${vehicle.model}</h3><p class="vehicle-meta">${vehicle.mileage.toLocaleString()} mi · ${vehicle.transmission} · ${vehicle.mpg} MPG</p><div class="vehicle-bottom"><div class="vehicle-price">${formatPrice(vehicle.price)}<small>Save ${formatPrice(Math.max(300, Math.round(vehicle.price * 0.12)))}</small></div><button class="add-button" type="button" aria-label="Add ${vehicle.make} ${vehicle.model} to shortlist" data-car-id="${vehicle.id}" ${vehicle.status === "sold" ? "disabled" : ""}>+</button></div></div>`;
  drawCar(card.querySelector("canvas"), vehicle);
  return card;
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const transmission = transmissionFilter.value;
  const maxPrice = Number(priceFilter.value);
  const filtered = inventory.filter((vehicle) => {
    const matchesQuery = `${vehicle.make} ${vehicle.model}`
      .toLowerCase()
      .includes(query);
    return (
      matchesQuery &&
      (transmission === "all" || vehicle.transmission === transmission) &&
      vehicle.price <= maxPrice
    );
  });
  browseGrid.replaceChildren(...filtered.map(renderCard));
  resultCount.textContent = filtered.length;
  emptyState.hidden = filtered.length > 0;
  priceValue.textContent = formatPrice(maxPrice);
}

function updateCartCount() {
  cartCount.textContent = cart.length;
}
function calculateTotals() {
  const subtotal = cart.reduce(
    (total, id) => total + inventory.find((vehicle) => vehicle.id === id).price,
    0,
  );
  const tax = Math.round(subtotal * 0.07);
  const grandTotal = subtotal + 499 + tax;
  document.querySelector("#subtotal-value").textContent = formatPrice(subtotal);
  document.querySelector("#doc-fee-value").textContent = formatPrice(499);
  document.querySelector("#tax-value").textContent = formatPrice(tax);
  document.querySelector("#grand-total-value").textContent =
    formatPrice(grandTotal);
}
function renderCart() {
  updateCartCount();
  calculateTotals();
  document.querySelector("#cart-item-label").textContent =
    `${cart.length} vehicle${cart.length === 1 ? "" : "s"}`;
  if (!cart.length) {
    cartItemsContainer.innerHTML =
      '<div class="cart-empty"><div><span>◌</span><h3>Your cart is currently empty.</h3><p>Browse collections to secure a deal!</p></div></div>';
    return;
  }
  cartItemsContainer.innerHTML = cart
    .map((id) => {
      const vehicle = inventory.find((item) => item.id === id);
      return `<article class="cart-row"><div class="cart-thumb"><canvas aria-label="Illustration of ${vehicle.year} ${vehicle.make} ${vehicle.model}"></canvas></div><div><h3>${vehicle.year} ${vehicle.make} ${vehicle.model}</h3><p>${vehicle.mileage.toLocaleString()} mi · ${vehicle.transmission} · ${vehicle.mpg} MPG</p></div><strong class="cart-row-price">${formatPrice(vehicle.price)}</strong><button class="remove-button" type="button" data-remove-id="${vehicle.id}">Remove</button></article>`;
    })
    .join("");
  cartItemsContainer.querySelectorAll("canvas").forEach((canvas, index) =>
    drawCar(
      canvas,
      inventory.find((vehicle) => vehicle.id === cart[index]),
    ),
  );
}
function openCheckout() {
  checkoutModal.hidden = false;
  document.querySelector("#checkout-form input").focus();
}
function resetFilters() {
  searchInput.value = "";
  transmissionFilter.value = "all";
  priceFilter.value = 15000;
  applyFilters();
}

function drawHero() {
  drawCar(document.querySelector("#hero-canvas"), { color: "#123535" }, true);
}

document.querySelectorAll("[data-page]").forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.page);
  }),
);
searchInput.addEventListener("input", applyFilters);
transmissionFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("input", applyFilters);
document
  .querySelector("#reset-filters")
  .addEventListener("click", resetFilters);
document.querySelector("#empty-reset").addEventListener("click", resetFilters);
document.querySelector("#browse-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-car-id]");
  if (!button) return;
  const vehicle = inventory.find(
    (item) => item.id === Number(button.dataset.carId),
  );
  if (!cart.includes(vehicle.id)) cart.push(vehicle.id);
  renderCart();
  button.textContent = "✓";
  button.disabled = true;
});
cartItemsContainer.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-id]");
  if (!removeButton) return;
  const index = cart.indexOf(Number(removeButton.dataset.removeId));
  if (index !== -1) cart.splice(index, 1);
  renderCart();
});
document.querySelector("#proceed-checkout").addEventListener("click", () => {
  if (cart.length) openCheckout();
});
document.querySelector("#menu-toggle").addEventListener("click", () => {
  const menu = document.querySelector("#main-nav");
  const isOpen = menu.classList.toggle("menu-open");
  document
    .querySelector("#menu-toggle")
    .setAttribute("aria-expanded", String(isOpen));
  document
    .querySelector("#menu-toggle")
    .setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
});
document.querySelector("#close-modal").addEventListener("click", () => {
  checkoutModal.hidden = true;
});
checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) checkoutModal.hidden = true;
});
document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.checkValidity()) {
    event.currentTarget.reportValidity();
    return;
  }
  cart.length = 0;
  renderCart();
  event.currentTarget.reset();
  checkoutModal.hidden = true;
  successScreen.hidden = false;
});
document.querySelector("#back-to-inventory").addEventListener("click", () => {
  successScreen.hidden = true;
  showPage("browse");
});
document.querySelectorAll("[data-page]").forEach((link) =>
  link.addEventListener("click", () => {
    document.querySelector("#main-nav").classList.remove("menu-open");
    document
      .querySelector("#menu-toggle")
      .setAttribute("aria-expanded", "false");
  }),
);
window.addEventListener("resize", drawHero);

applyFilters();
renderCart();
drawHero();
