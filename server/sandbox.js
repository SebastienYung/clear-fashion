/* eslint-disable no-console, no-process-exit */
const cheerio = require('cheerio');
const request = require('request');


const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimart = require('./sources/montlimart');
const adresse = require('./sources/adresse');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    var products = []
    console.log(`🕵️‍♀️  browsing ${eshop} source`);
    if(eshop.includes('dedicatedbrand')){

      products = await dedicatedbrand.scrape(eshop);
    }
    else if(eshop.includes('montlimart')){
      products = await montlimart.scrape(eshop);
    }
    else if(eshop.includes('adresse')){
      console.log("ADRESSE")
      products = await adresse.scrape(eshop);
    }

    console.log(products);
    console.log(products.length)
    process.exit(0);
  } catch (e) {
    console.log("ERROR")
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
