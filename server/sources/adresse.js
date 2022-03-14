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

    $('.product-container').each((i, el) => {
        var title = $(el)
            .find('.product-name')
            .text()
            .replace(/\t+/g, '')
            .replace(/\n/g, '')
        
        var brand = 'adresse'
        title = title.substring(0, title.length/2)

        const price = parseFloat($(el)
            .find('.prixright')
            .text().trim())

        const link = $(el)
        .find('.product_img_link')
        .attr('href')

        listProduct.push({title, brand, price, link})
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
    const response = await fetch('https://adresse.paris/630-toute-la-collection?n=116');

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
