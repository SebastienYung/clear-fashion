const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimart = require('./sources/montlimart');
const adresse = require('./sources/adresse');


const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://sebyg:jLWoyjf9aGOSCAwT@cluster0.6wcdw.mongodb.net/clearfashion?retryWrites=true&w=majority';
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

async function getByBrand(collection, brand) {
    var products = []
    if (['montlimart', 'dedicatedbrand', 'adresse'].includes(brand)) {
        const products = await collection.find({ link: { $regex: brand } }).toArray();;
        console.log(products)
    }
    else {
        console.log('not a listed brand')
    }
    return products
}

async function Main() {

    client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true });
    const db = await client.db(MONGODB_DB_NAME)

    const collection = await db.collection('products');

    //await RemoveAll(collection)

    // INSERT PRODUCTS
    //await InsertAllProducts(collection)
    const brand = "dedicatedbrand";
    const products = await getByBrand(collection, brand)

    await client.close()
}

Main()
