const fetch = require('node-fetch');
const cheerio = require('cheerio');
const e = require('cors');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = async data => {
    const listProduct = []
    const cleanedList = []

    const $ = cheerio.load(data);

    $('.item').each((i, el) => {
        const title = $(el)
            .find('.product-name')
            .find('a')
            .text()
            .replace(/\s\s+/g, '');
        
        const price = parseFloat($(el)
        .find('.price')
        .text()
        .replace(/ €/, '')
        .replace(/,/, '.'))
        
        const link = $(el)
            .find('.product-image')
            .find('a')
            .attr('href')
        
        listProduct.push({title, price, link});
    })

    listProduct.forEach(el => {
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
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
