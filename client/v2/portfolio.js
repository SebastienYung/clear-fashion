// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const recentProduct = document.querySelector('#recent-product');
const reasonablePrice = document.querySelector('#reasonable-price')
const selectSort = document.querySelector('#sort-select')
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */

 function groupArrayOfObjects(list, key) {
  return (list.result).reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const getRecentProduct = (products) => {
  var recentProduct = [];
  var twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  for(var i in products.result){
    if(new Date(products.result[i]['released']) >= twoWeeksAgo){
      recentProduct.push(products.result[i]);
    }
  }
  
  products.result = recentProduct

  return products
}

const getReasonableProduct = (products) => {
  var reasonableProduct = [];
  for(var i in products.result){
    console.log(products.result[i]['price'])
    if(products.result[i]['price'] <= 50){
      reasonableProduct.push(products.result[i]);
    }
  }
  products.result = reasonableProduct

  return products
}

const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};  


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div'); // <div></div>
  const template = products
    .map(product => {
      return `
      <div class="product" id="${product.uuid}">
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

// 1. Render option
// renderBrands()
// map -> brands
// <option value="${brand.uuid}">${brand.name}</option>
// selectBrand.appendChild ^

// 2. document.querySelector('#my-button').addEventListener('click')

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const renderBrand = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */



selectShow.addEventListener('change', event => {
  currentPagination.pageSize = parseInt(event.target.value);
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));

    populateBrandSelector()

    recentProduct.setAttribute("style", "color:black;");
    reasonablePrice.setAttribute("style", "color:black;")
    onlyReasonable = false;
    onlyRecent = false;
});

selectPage.addEventListener('change', event => {
  currentPagination.currentPage = parseInt(event.target.value);
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
  .then(setCurrentProducts)
  .then(() => render(currentProducts, currentPagination));

  populateBrandSelector();

  recentProduct.setAttribute("style", "color:black;");
  reasonablePrice.setAttribute("style", "color:black;");
  onlyReasonable = false;
  onlyRecent = false;
});

selectBrand.addEventListener('change', event => {
  if(event.target.value === 'All'){
    fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
  }
  else{
    fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then((data) => {
      data.result = groupArrayOfObjects(data, 'brand')[event.target.value];
      return data;
    })
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
  }
  
  recentProduct.setAttribute("style", "color:black;");
  reasonablePrice.setAttribute("style", "color:black;")
  onlyReasonable = false;
  onlyRecent = false;
});

const filter = (onlyRecent, onlyReasonable) => {
  if(onlyRecent === true){
    if(onlyReasonable === true){
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then((data) => {return getRecentProduct(data);})
      .then((data) => {return getReasonableProduct(data);})
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
      reasonablePrice.setAttribute("style", "color:#33FF36;");

    }
    else{
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then((data) => {return getRecentProduct(data);})
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
      reasonablePrice.setAttribute("style", "color:black;")
    }
    recentProduct.setAttribute("style", "color:#33FF36;");
  }
  else{
    if(onlyReasonable === true){
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then((data) => {return getReasonableProduct(data);})
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
      reasonablePrice.setAttribute("style", "color:#33FF36;");
    }
    else{
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
      reasonablePrice.setAttribute("style", "color:black;")
    }
    recentProduct.setAttribute("style", "color:black;");
  }
}

// Améliorable en donnant la possibilité d'afficher les articles récents et raisonnable
var onlyRecent = false;
recentProduct.addEventListener('click', event => {
  onlyRecent = !onlyRecent;
  filter(onlyRecent, onlyReasonable);
});

// Améliorable en donnant la possibilité d'afficher les articles récents et raisonnable
var onlyReasonable = false
reasonablePrice.addEventListener('click', event => {
  onlyReasonable = !onlyReasonable;
  filter(onlyRecent, onlyReasonable);
});

selectSort.addEventListener('change', event => {
  console.log(event.target.value)
  switch(event.target.value){
    case 'price-asc':
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then((data) => { data.result.sort((a, b) => (a.price > b.price) ? 1 : -1);
                        return data;})
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
      break;
    case 'price-desc':
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then((data) => { data.result.sort((a, b) => (a.price > b.price) ? -1 : 1);
                        return data;})
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
      break;
    case 'date-desc':
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then((data) => { data.result.sort((a, b) => (a.released > b.released) ? 1 : -1);
                        console.log(data.result)
                        return data;})
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
      break;
    case 'date-asc':
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then((data) => { data.result.sort((a, b) => (a.released > b.released) ? -1 : 1);
                        console.log(data.result)
                        return data;})
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
      break;
    default:
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then(setCurrentProducts)
      .then(() => render(currentProducts, currentPagination));
      break;
  }
});


const populateBrandSelector = async() => {
  selectBrand.innerHTML = "";

  //brands = fetchProducts(currentPagination.currentPage, currentPagination.pageSize).then(getUniqueBrands);
  var uniqueBrand = await getUniqueBrands()
  var newOption = document.createElement("option")
    newOption.value = "All"
    newOption.innerHTML = "All"
    selectBrand.options.add(newOption)
  for(var brand in uniqueBrand){
    var newOption = document.createElement("option")
    newOption.value = uniqueBrand[brand]
    newOption.innerHTML = uniqueBrand[brand]
    selectBrand.options.add(newOption)
  }
}

const getUniqueBrands = async () => {
  var data = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
  //console.log([... new Set(data.result.map(obj => obj.brand))])
  return await [... new Set(data.result.map(obj => obj.brand))];
};

fetchProducts(currentPagination.currentPage, currentPagination.pageSize).then(getUniqueBrands)

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);

populateBrandSelector()