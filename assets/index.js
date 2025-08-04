import { productsData } from "./data.js";

const productsContainer = document.querySelector(".products-container");
const showMoreBtn = document.querySelector('.btn-load');
const btnLess = document.querySelector('.btn-less');
const categoriesContainer = document.querySelector(".categories");
const categoriesList = document.querySelectorAll(".category");

const cartLabel = document.querySelector(".cart-label");
const cartElement = document.querySelector(".cart");
const cartContainer = document.querySelector(".cart-container");
const cartBubble = document.querySelector(".cart-bubble");
const totalSpan = document.querySelector(".total");
const btnDelete = document.querySelector(".btn-delete");
const cartOverlay = document.querySelector('.cart-overlay');



const form = document.getElementById('contacto-form');
const successMsg = document.getElementById("contact-success"); 



const appState = {
  //products: productsData,         //arrray entero al inicio
  currenProductsIndex: 0,
  perPage: 6,
  activeFilter: null,
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const savecart = () => localStorage.setItem("cart", JSON.stringify(cart));


const updateCartBubble = () => {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBubble.textContent = totalQty;
};

const renderCart = () => {
  cartContainer.innerHTML = "";
  let sum = 0;

  cart.forEach(item => {
    const bidStr = item.bid ?? "0";
    const priceNum = parseInt(bidStr.replace(/\D/g, ""), 10);
    const itemTotal = priceNum * item.qty;
    sum += itemTotal;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <p>${item.name} x${item.qty} - $${itemTotal.toLocaleString()}</p>
      <button class="remove-item" data-id="${item.id}">X</button>
    `;
    cartContainer.appendChild(div);
  });

  totalSpan.textContent = `$${sum.toLocaleString()}`;
};


const createProductsTemplate = ({ cardImg, name, user, bid, id }) => `
 <div class="product-card">
   <img src="${cardImg}" alt="${name}" />
   <div class="product-info">
      <h3>${name}</h3>
      <p>@${user}</p>
      <span>${bid}</span>
      <button class="btn-add" data-id="${id}" data-name="${name}" data-bid="${bid}">Comprar</button>
     </div>
 </div>
`;

const renderProducts = (productsList, reset = false) => {
  if (reset) productsContainer.innerHTML = "";
  productsContainer.innerHTML += productsList.map(createProductsTemplate).join("");
};


const applyPagination = () => {
  const start = appState.currenProductsIndex * appState.perPage;
  const filtered = appState.activeFilter
    ? productsData.filter(p => p.category === appState.activeFilter)
    : productsData;
  return filtered.slice(start, start + appState.perPage);
};

const updateShowMoreBtn = () => {
  const filtered = appState.activeFilter
    ? productsData.filter(p => p.category === appState.activeFilter)
    : productsData;
  const shown = (appState.currenProductsIndex + 1) * appState.perPage;
  showMoreBtn.style.display = shown >= filtered.length ? 'none' : 'block';
};

const showMoreProducts = () => {
  appState.currenProductsIndex++;
  renderProducts(applyPagination(), false);
  updateShowMoreBtn();
  toggleLessButton();
};

const showLessProducts = ()  => {
  appState.currenProductsIndex = 0;
  renderProducts(applyPagination(), true);
  updateShowMoreBtn();
  toggleLessButton();
};

function toggleLessButton() {
  if (btnLess) {
    btnLess.style.display = appState.currenProductsIndex > 0 ? 'inline-block' : 'none';
  }
}

const changeFilterState = newFilter => {
  appState.activeFilter = newFilter;
  appState.currenProductsIndex = 0;
  categoriesList.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.category === newFilter)
  );
};

const applyFilter = e => {
  const btn = e.target;
  if (!btn.classList.contains('category')) return;
  const newFilter = btn.dataset.category || null;
  changeFilterState(newFilter);
  renderProducts(applyPagination(), true);
  updateShowMoreBtn();
  const firstCard = productsContainer.querySelector('.product-card');
  if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth' });
};

const init = () => {
  renderProducts(applyPagination(), true);
  updateShowMoreBtn();
  toggleLessButton();

  showMoreBtn.addEventListener("click", showMoreProducts);
  if (btnLess) btnLess.addEventListener("click", showLessProducts);

  categoriesContainer.addEventListener("click", applyFilter);

  cartLabel.addEventListener("click", () => {
    cartElement.classList.toggle("open-cart");
  });
  cartOverlay.addEventListener("click", () => {
    cartElement.classList.remove("open-cart");
  });

  const btnBuy = cartElement.querySelector(".btn-buy");
  if (btnBuy) {
    btnBuy.addEventListener("click", () => alert("Procesando compra..."));
  }
};

document.addEventListener("DOMContentLoaded", () => {
  init();
  renderCart();
  updateCartBubble();
});


productsContainer.addEventListener("click", e => {
  if (!e.target.classList.contains("btn-add")) return;
  const { id, name, bid } = e.target.dataset;
  const existing = cart.find(p => p.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, name, bid, qty: 1 });
  savecart();
  renderCart();
  updateCartBubble();
});

cartContainer.addEventListener("click", e => {
  if (!e.target.classList.contains("remove-item")) return;
  cart = cart.filter(item => item.id !== e.target.dataset.id);
  savecart();
  renderCart();
  updateCartBubble();
});

btnDelete.addEventListener("click", () => {
  cart = [];
  savecart();
  renderCart();
  updateCartBubble();
});


form.addEventListener('submit', function(event){
  event.preventDefault();
  let isValid = true;
  successMsg.textContent = '';

  ['name', 'email', 'message'].forEach(field => {
    const input = form.elements[field];
    const err = document.getElementById(`error-${field}`);
    err.textContent = '';
    if (!input.value.trim() || (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value))) {
      err.textContent = field === 'email' ? 'Email inválido.' : 'Este campo es obligatorio.';
      isValid = false;
    }
  });

  if (isValid) {
    form.reset();
    successMsg.textContent = '¡Mensaje enviado correctamente!';
    successMsg.style.color = 'green';
  
    setTimeout(() => {
      successMsg.textContent = '';
    }, 4000);
  }
});














