const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimart = require('./sources/montlimart');
const adresse = require('./sources/adresse');


const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://sebyg:BY5y7okJhdT459u4@cluster0.6wcdw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

let client;

async function RemoveAll(collection) {
    await collection.remove({})
}

async function InsertAllProducts(collection) {
    var products = await dedicatedbrand.scrape('');
    products = products.concat(await adresse.scrape(''));
    products = products.concat(await montlimart.scrape(''));

    const result = await collection.insertMany(products);
    console.log(result);
}

module.exports.getProducts = async() => {
    client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true });
    const db = await client.db(MONGODB_DB_NAME)
    console.log(`Connected to database ${db.databaseName}`)
    const collections = await db.collection('products');

    const products = db.collection('products')
    const searchCursor = await products.find()
    
    let a = []
    while (await searchCursor.hasNext()){
        a.push(await searchCursor.next())
    }

    //console.log(a)

    return a
}

function groupArrayOfObjects(list, key) {
    return (list).reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

module.exports.getProductsByBrand = (products, brand) => {
    products = groupArrayOfObjects(products, 'brand')[brand]
    return products
}

module.exports.getReasonableProducts = (products) => {
    var reasonableProduct = [];
    for (var i in products) {
      if (products[i]['price'] <= 50) {
        reasonableProduct.push(products[i]);
      }
    }
    products = reasonableProduct
  
    return products
}

module.exports.aaa = (a) =>{
  console.log(a)
}

module.exports.getRecentProducts = (products) => {
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

async function Main() {
    client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true });
    const db = await client.db(MONGODB_DB_NAME)
    console.log(`Connected to database ${db.databaseName}`)
    const collections = await db.collection('products');
    //await RemoveAll(collections)

    // INSERT PRODUCTS
    //await InsertAllProducts(collections)
}

Main()
