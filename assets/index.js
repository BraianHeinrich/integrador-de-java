const productsContainer = document.querySelector(".products-container");
const showMoreBtn = document.querySelector('.btn-load');
const categoriesContainer = document.querySelector(".categories");
const categoriesList = document.querySelectorAll(".category");



const createProductsTemplate = (products) => {
    const { cardImg, name, user, bid, id } = products;
    return `
    <div class="products">
      <img src=${cardImg} alt=${name} />
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
   </div>
  `;
};



const renderProducts = (productsList) => {
  productsContainer.innerHTML += productsList
    .map(createProductTemplate)
    .join("");
};
      /*----VER MAS ----------*/ 

const isLastIndexOf = () => {
    return appState.currenProductsIndex === appState.productsLimit - 1;
};

const shoMoreProdcuts = () => {
    appState.currenProductsIndex += 1
    let { products, currenProductsIndex } = appState
    renderProducts(products[currenProductsIndex]);
    if (isLastIndexOf())
        showMoreBtn.classList.add("hidden")
};







const isInactiveFilterBtn = (element) => {
    return(
    element.classList.contains("category") &&
   !element.classList.contains("active")

    );
};

const changeBtnActiveState = (selecteCategory) => {
    const categories = [...categoriesList];
    categories.forEach((categoryBtn) => {
        if(categoryBtn.dataset.category !== selecteCategory) {
            categoryBtn.classList.remove("active");
            return;
        }
        categoryBtn.classList.add("active");
    });
};

const setShowMoreVisibility = () => {
    if (!appState.activeFilter){
        showMoreBtn.classList.remove("hidden");
        return;
    }
    showMoreBtn.classList.add("hidden");
};

const changeFilterState = (btn) => {
    appState.activeFilter = btn.dataset.category;
    changeBtnActiveState(appState.activeFilter);
    setShowMoreVisibility();
};

const renderFilteredProducts = () => {
    const FilteredProducts = productsData.filter((product)=>{
        return product.category === appState.activeFilter;
    });
    renderProducts(FilteredProducts);
};

const applyFilter = ({target}) => {
   if(isInactiveFilterBtn(target)) return;
    changeFilterState(target);
    productsContainer.innerHTML = "";
    if(appState.activeFilter){
        renderFilteredProducts();
        appState.currenProductsIndex = 0;
        return;
    }
    renderProducts(appState.products[0]);   
};

const init = () => {
    renderProducts(appState.products[0]);
    showMoreBtn.addEventListener("click", shoMoreProducts);
    categoriesContainer.addEventListener('click', applyFilter) 

};
init();

