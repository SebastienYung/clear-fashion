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
        
        var brand = "montlimart"
        const price = parseFloat($(el)
        .find('.price')
        .text()
        .replace(/ €/, '')
        .replace(/,/, '.'))
        
        const link = $(el)
            .find('.product-image')
            .find('a')
            .attr('href')
        
        listProduct.push({title, brand, price, link});
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
    var body;
    var data = [];
    try {
        for(var i = 1; i < 9; i++){
            var response = await fetch(`https://www.montlimart.com/toute-la-collection.html?page=${i}`);

            if (response.ok) {
                body = await response.text();
                data = data.concat(await parse(body))
            }
        }

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
