const fetch = require('node-fetch');
const cheerio = require('cheerio');
const e = require('cors');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = async data => {
  
  productList = []

  var filtered = data.products.filter(function(x) {
    return x !== undefined;
  });
  
  filtered.forEach(el => {
    if(el != undefined){
      var title = el.name;
      var brand = "dedicatedbrand"
      if(el.price != undefined){
        var price = el.price.priceAsNumber
      }
      var link = "https://www.dedicatedbrand.com/" + el.canonicalUri
      productList.push({title, brand, price, link})
    }
  });
  cleanedList = []
  productList.forEach(el => {
    if(el.title !== undefined && el.price!==undefined && el.link!==undefined){
      cleanedList.push(el)
    }
  })
  return cleanedList
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(
      `https://www.dedicatedbrand.com/en/loadfilter`
    );
    if (response.ok) {
      const body = await response.json();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
