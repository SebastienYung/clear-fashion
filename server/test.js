const cheerio = require('cheerio');
const request = require('request');
const ps = require('prompt-sync');
const prompt = ps();

var string = prompt("link : ");

// https://www.dedicatedbrand.com/en/men/all-men
// https://www.dedicatedbrand.com/en/women/all-women
// https://www.montlimart.com/toute-la-collection.html
// https://adresse.paris/630-toute-la-collection

if(string.includes("dedicatedbrand")){
    request(string, (error, response, html) => {
        if(!error && response.statusCode == 200){
            const $ = cheerio.load(html);

            listProduct = []

            $('.productList').each((i, el) => {
                const title = $(el)
                    .find('.productList-title')
                    .text();
                const price = parseFloat($(el)
                    .find('.productList-price')
                    .text()
                    .replace(/\n/, '')
                    .replace(/ EUR/, ''));

                const link = "https://www.dedicatedbrand.com" + $(el)
                    .find('.productList-link')
                    .attr('href')

                listProduct.push({title, price, link})
            })

            console.log(listProduct)

        }
    });
}
else {
    if(string.includes("montlimart")){
        request(string, (error, response, html) => {
            if(!error && response.statusCode == 200){
                const $ = cheerio.load(html);
    
                listProduct = []
    
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
    
                console.log(listProduct)
    
            }
        });
    }
    else{
        if(string.includes("adresse")){
            request(string, (error, response, html) => {
                if(!error && response.statusCode == 200){
                    const $ = cheerio.load(html);
        
                    listProduct = []
        
                    $('.product-container').each((i, el) => {
                        var title = $(el)
                            .find('.product-name')
                            .text()
                            .replace(/\t+/g, '')
                            .replace(/\n/g, '')
                        
                        title = title.substring(0, title.length/2)

                        const price = parseFloat($(el)
                            .find('.content_price')
                            .find('span')
                            .text()
                            .replace(/\s\s+/g, '')
                            .replace(/ €/g, '')
                            .replace(/,/, '.'));

                            const link = $(el)
                            .find('.product_img_link')
                            .attr('href')

                            listProduct.push({title, price, link})
                    })
        
                    console.log(listProduct)
        
                }
            });
        }
    }
}
    