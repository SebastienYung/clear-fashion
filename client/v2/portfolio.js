// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let favoriteProducts = [];

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const recentProduct = document.querySelector('#recent-product');
const reasonablePrice = document.querySelector('#reasonable-price')
const selectSort = document.querySelector('#sort-select')
const numberNewProducts = document.querySelector("#nbNewProducts")
const spanNbProducts = document.querySelector('#nbProducts');
const spanP50Value = document.querySelector('#p50Value')
const spanP90Value = document.querySelector('#p90Value')
const spanP95Value = document.querySelector('#p95Value')
const spanLastReleasedDate = document.querySelector('#lastReleasedDate')
const sectionProducts = document.querySelector('#products');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ( result ) => {
  currentProducts = result;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @param  {String}  [brand='All'] - brand filter
 * @param  {Number}  [maxPrice=0] - brand filter
* @return {Object}
 */


function getNumberOfNewProduct(products) {
  var countNewProduct = 0
  var twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 31);
  for (var i in products) {
    if (new Date(products[i]['released']) >= twoWeeksAgo) {
      countNewProduct++;
    }
  }

  return countNewProduct;
}

function groupArrayOfObjects(list, key) {
  return (list).reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const getRecentProduct = (products) => {
  var recentProduct = [];
  var twoWeeksAgo = new Date();

  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 31); // sortie le dernier mois  

  for (var i in products) {

    if (new Date(products[i]['released']) >= twoWeeksAgo) {
      recentProduct.push(products[i]);
    }

  }


  products = recentProduct
  return products
}

const getReasonableProduct = (products) => {

  var reasonableProduct = [];
  for (var i in products) {
    if (products[i]['price'] <= 50) {
      reasonableProduct.push(products[i]);
    }
  }
  products = reasonableProduct

  return products
}

const fetchProducts = async (page = 1, size = 12, brand='All', maxPrice = 0) => {
  try {
    //console.log(page)
    //console.log(size)
    //console.log(brand)
    //console.log(maxPrice)

    const response = await fetch(
      `https://clear-fashion-lilac.vercel.app/products?brand=${brand}&maxPrice=${maxPrice}&page=${page}&size=${size}`
    );
    const body = await response.json();
    currentPagination.pageSize = size
    currentPagination.currentPage = page
    currentPagination.brand = brand
    currentPagination.maxPrice = maxPrice
    //console.log(getRecentProduct(body.data).length);
    return body;
  } catch (error) {
    console.error(error);
    return { currentProducts, currentPagination };
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
<div class="product" id="${product._id}">
<span>${product.brand}</span>
<a href="${product.link}" target="_blank">${product.title}</a>
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
// <option value="${brand._id}">${brand.name}</option>
// selectBrand.appendChild ^

// 2. document.querySelector('#my-button').addEventListener('click')

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = async (pagination) => {
  const response = await fetch(
    `https://clear-fashion-lilac.vercel.app/count`
  );
  const body = await response.json();
  const pageCount = pagination.pageSize
  const currentPage = pagination.currentPage
  console.log(parseInt(body[0]/pageCount)+1)
  let options = ""

  for(var i = 0; i < parseInt(body[0]/pageCount); i++){
    options = options.concat('', `<option value="${i+1}">${i+1}</option>`)
  }

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const renderBrand = pagination => {
  const { currentPage, pageCount } = pagination;
  const options = Array.from(
    { 'length': pageCount },
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */

function getP(products, value) {
  products.sort((a, b) => (a.price > b.price) ? 1 : -1);
  return products[Math.trunc(products.length * (value / 100))].price
}

function getLastReleasedDate(products) {
  products.sort((a, b) => (a.released > b.released) ? -1 : 1);
  return products[0].released
}

const renderIndicators = (products, pagination) => {
  const { count } = pagination;

  spanNbProducts.innerHTML = count;
  numberNewProducts.innerHTML = getNumberOfNewProduct(products);
  spanP50Value.innerHTML = getP(products, 50)
  spanP90Value.innerHTML = getP(products, 90)
  spanP95Value.innerHTML = getP(products, 95)
  spanLastReleasedDate.innerHTML = getLastReleasedDate(products)


};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(products, pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */

selectShow.addEventListener('change', event => {
  currentPagination.pageSize = parseInt(event.target.value);
  filter(onlyRecent, onlyReasonable);



});

selectPage.addEventListener('change', event => {
  currentPagination.currentPage = parseInt(event.target.value);
  filter(onlyRecent, onlyReasonable);

});

selectBrand.addEventListener('change', async (event) => {
  currentPagination.brand = String(event.target.value)
  filter(onlyRecent, onlyReasonable);

});

const filter = (onlyRecent, onlyReasonable) => {
  if (onlyRecent === true) {
    if (onlyReasonable === true) {
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentPagination.brand)
        .then((data) => { return getRecentProduct(data); })
        .then((data) => { return getReasonableProduct(data); })
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));

    }
    else {
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentPagination.brand)
        .then((data) => { return getRecentProduct(data); })
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
    }
  }
  else {
    if (onlyReasonable === true) {
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentPagination.brand)
        .then((data) => { return getReasonableProduct(data); })
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
    }
    else {

      fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentPagination.brand)
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
    }
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
  switch (event.target.value) {
    case 'price-asc':
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentPagination.brand)
        .then((data) => {
          data.sort((a, b) => (a.price > b.price) ? 1 : -1);
          return data;
        })
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
      break;
    case 'price-desc':
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentPagination.brand)
        .then((data) => {
          data.sort((a, b) => (a.price > b.price) ? -1 : 1);
          return data;
        })
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
      break;
    case 'date-desc':
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentPagination.brand)
        .then((data) => {
          data.sort((a, b) => (a.released > b.released) ? 1 : -1);
          return data;
        })
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
      break;
    case 'date-asc':
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentPagination.brand)
        .then((data) => {
          data.sort((a, b) => (a.released > b.released) ? -1 : 1);
          return data;
        })
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
      break;
    default:
      fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentPagination.brand)
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
      break;
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  await setCurrentProducts(products);
  await render(currentProducts, currentPagination);
});

