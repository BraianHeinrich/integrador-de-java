import{productsData}from"./data.js";

const productsContainer = document.querySelector(".products-container");
const showMoreBtn = document.querySelector('.btn-load');
const categoriesContainer = document.querySelector(".categories");
const categoriesList = document.querySelectorAll(".category");

const cartLabel = document.querySelector(".cart-label");
const cartElement = document.querySelector(".cart");
const cartContainer = document.querySelector(".cart-container");
const cartBubble = document.querySelector(".cart-bubble");
const totalSpan = document.querySelector(".total");
const btnDelete = document.querySelector(".btn-delete");



const appState = {
    products: productsData,         //arrray entero al inicio
    currenProductsIndex: 0,
    perPage: 6,
    activeFilter: null,
};

const cartOverlay = document.querySelector('.cart-overlay');
cartOverlay.addEventListener('click', () => {
  cartElement.classList.remove('open-cart');
});

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const savecart = () => localStorage.setItem("cart",JSON.stringify(cart));

const updateCartBubble = () => {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBubble.textContent = totalQty;
};

const renderCart = () => {
    cartContainer.innerHTML = "";
    let sum = 0;

    cart.forEach(item => {
        const price = parseInt(item.bid.replace(/\D/g, "")) * item.qty;
        sum += price;

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

const createProductsTemplate = ( { cardImg, name, user, bid, id } ) => `


    < div class="products" >
      <img src="${cardImg}" alt="${name}" />
     <div class="product-info">
         <div class="product-nombre">
             <h3>${name}</h3>
         </div>

         <div class="product-inf">
             <p>@${user}</p>
             <span>${bid}</span>
         </div>

         <div class="product-botton">
             <button class="btn-add"
             data-id='${id}'
             data-name='${name}'
             data-bid='${bid}'>Comprar</button>
         </div>
      </div>
   </div >
    `;

const renderProducts = (productsList, reset = false) => {
  if (reset) productsContainer.innerHTML = "";
    productsContainer.innerHTML += productsList.map(createProductsTemplate).join("");
};
     
const applyPagination = () => {
    const start = appState.currenProductsIndex * appState.perPage;
    const end = start + appState.perPage;
    return appState.activeFilter
    ? productsData.filter(p => p.category === appState.activeFilter).slice(start, end)
    : productsData.slice(start, end);
};
const updateShowMoreBtn = () => {
    const total = appState.activeFilter
    ? productsData.filter(p => p.category === appState.activeFilter).length
    : productsData.length;
    const shown = (appState.currenProductsIndex + 1) * appState.perPage;
    showMoreBtn.style.display = shown >= total ? 'none' : 'block';
};

const shoMoreProdcuts = () => {
    appState.currenProductsIndex++;
    const nextBatch = applyPagination();
    renderProducts(nextBatch);
    updateShowMoreBtn();
};

const changeFilterState = (newFilter) => {
    appState.activeFilter = newFilter;
    appState.currenProductsIndex = 0;
    categoriesList.forEach(btn =>
      btn.classList.toggle("active", btn.dataset.category === newFilter)
    );
};

const applyFilter = (e) => {
    const target = e.target;
    if (!target.classList.contains('category')) return;
    const newFilter = target.dataset.category || null;
    changeFilterState(newFilter);
    renderProducts(applyPagination(), true);
    updateShowMoreBtn();
};



cartLabel.addEventListener('click', () => {
  cartElement.classList.toggle('open-cart');
});

const init = () => {
    renderProducts(applyPagination(), true);
    updateShowMoreBtn();
    showMoreBtn.addEventListener("click", shoMoreProdcuts);
    categoriesContainer.addEventListener('click', applyFilter);
};

productsContainer.addEventListener("click", e =>{
    if (!e.target.classList.contains("btn-add")) return;
    const {id, name, bid } = e.target.dataset;
    const existing = cart.find(p => p.id === id);
    if (existing) existing.qty++;
    else cart.push({ id, name, bid, qty: 1});
    savecart();
    renderCart();
    updateCartBubble();
});

cartContainer.addEventListener("click", e => {
    if (!e.target.classList.contains("remove-item")) return;
    cart = cart.filter(item => item.id !== e.target.dataset.id);
    saveCart();
    renderCart();
    updateCartBubble();
  });
  
  btnDelete.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
    updateCartBubble();
  });
  // 🚀 Iniciar todo
  document.addEventListener("DOMContentLoaded", () => {
    init();
    renderCart();
    updateCartBubble();
});

const form = document.getElementById("contact-form");
const successMsg = document.getElementById("contact-success");

const isValidEmail = email =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

form.addEventListener("submit", event => {
  event.preventDefault();
  let isValid = true;
  successMsg.textContent = "";

  // Limpiar errores previos
  ["name", "email", "message"].forEach(id => {
    document.getElementById(`error-${id}`).textContent = "";
  });

  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();

  if (!name) {
    document.getElementById("error-name").textContent = "El nombre es obligatorio.";
    isValid = false;
  }
  if (!email || !isValidEmail(email)) {
    document.getElementById("error-email").textContent = "Email inválido.";
    isValid = false;
  }
  if (!message) {
    document.getElementById("error-message").textContent = "El mensaje no puede estar vacío.";
    isValid = false;
  }

  if (isValid) {
    form.reset();
    successMsg.textContent = "¡Mensaje enviado correctamente!";
  }
});














