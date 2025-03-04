// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}];

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);



/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
const cheapest_tshirt = 'https://www.adresse.paris/t-shirts-et-polos/4238-t-shirt-ranelagh-1300000262026.html'
// I can find on these e-shops
// 2. Log the variable
console.log(cheapest_tshirt)

/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */

// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
var number_of_product = marketplace.length
// 2. Log the variable
console.log(number_of_product)

// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
var brand_names = []

for(var i = 0; i < marketplace.length; i++){
  if(!(brand_names.includes(marketplace[i].brand))){ // includes : true si la valeur est dedans sinon false
    brand_names.push(marketplace[i].brand)
  }
}
//marketplace.forEach(obj=> brand_names.push(obj.brand))

// 2. Log the variable
console.log(brand_names)
// 3. Log how many brands we have
console.log(brand_names.length)


// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
function sort_by_price_asc(marketplace){
  return marketplace.sort((a, b) => (a.price > b.price) ? 1 : -1)
}
// 2. Create a variable and assign it the list of products by price from lowest to highest
var sorted_product_by_price = marketplace
sorted_product_by_price = sort_by_price_asc(marketplace)
// 3. Log the variable
console.log(sorted_product_by_price)

// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
function sort_by_date_asc(marketplace){
  return marketplace.sort((a, b) => (a.date > b.date) ? 1 : -1)
}
// 2. Create a variable and assign it the list of products by date from recent to old
var sorted_product_by_date = marketplace
sorted_product_by_date = sort_by_date_asc(marketplace)
// 3. Log the variable
console.log(sorted_product_by_date)

// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
var filter_50_100 = []
marketplace.forEach(obj => (obj.price>50 && obj.price<100) ? filter_50_100.push(obj) : null)
// 2. Log the list
console.log(filter_50_100)


// 🎯 TODO: Average price
// 1. Determine the average price of the marketplace
var baskets = []
marketplace.forEach(obj => (obj.name.includes('basket')?baskets.push(obj):null))

var count = 0, sumPrice = 0;
for (var key in baskets) {
  sumPrice += baskets[key].price;
  count += 1;
}

// 2. Log the average
console.log(sumPrice/count);

/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
function groupArrayOfObjects(list, key) {
  return list.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

var brands=groupArrayOfObjects(marketplace,"brand");

// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
console.log(brands)
// 3. Log the number of products by brands
for(var obj in brands){
  console.log(obj)
  console.log(brands[obj].length)
}

// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
function sort_by_price_desc(marketplace){
  return marketplace.sort((a, b) => (a.price > b.price) ? -1 : 1)
}

var brands_sorted_by_price_desc = brands
for(var obj in brands_sorted_by_price_desc){
  brands_sorted_by_price_desc[obj] = sort_by_price_desc(brands_sorted_by_price_desc[obj])
}
// 2. Log the sort
console.log(brands_sorted_by_price_desc)


// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
var brands_sorted_by_date_asc = brands
for(var obj in brands_sorted_by_date_asc){
  brands_sorted_by_date_asc[obj] = sort_by_date_asc(brands_sorted_by_date_asc[obj])
}
// 2. Log the sort
console.log(brands_sorted_by_date_asc)

/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products
var brands_sorted_by_price_asc = brands
for(var obj in brands_sorted_by_price_asc){
  brands_sorted_by_price_asc[obj] = sort_by_price_asc(brands_sorted_by_price_asc[obj])
}

for(var obj in brands_sorted_by_price_asc){
  console.log(obj)
  console.log(brands_sorted_by_price_asc[obj][Math.trunc(brands_sorted_by_price_asc[obj].length*0.9)])
}

/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.


// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
var is_reasonable = true
COTELE_PARIS.forEach(obj => (obj.price>100)?is_reasonable=false:null)
// // A reasonable price if all the products are less than 100€
console.log(is_reasonable)

// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
var tmp = null
COTELE_PARIS.forEach(obj => (obj.uuid=="b56c6d88-749a-5b4c-b571-e5b5c6483131")?tmp=obj:null)
// 2. Log the product
console.log(tmp)

// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
for( var i = 0; i < COTELE_PARIS.length; i++){ 
                                   
  if ( COTELE_PARIS[i].uuid == "b56c6d88-749a-5b4c-b571-e5b5c6483131") { 
      COTELE_PARIS.splice(i, 1); 
      i--; 
  }
}
// 2. Log the new list of product    
console.log(COTELE_PARIS)

// 🎯 TODO: Save the favorite product
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;

jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
console.log(blueJacket)
console.log(jacket)
// 2. What do you notice?
// Copy didn't work because both are linked by the same variable address

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties
jacket = {...blueJacket}
jacket.favorite = true

console.log(blueJacket)
console.log(jacket)


/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage
