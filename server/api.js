const { is } = require('cheerio/lib/api/traversing');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db')

const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://sebyg:BY5y7okJhdT459u4@cluster0.6wcdw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack' : True});
});

app.get('/count', async (request, response) => {
  client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true });
  const data = await client.db(MONGODB_DB_NAME)
  console.log(`Connected to database ${data.databaseName}`)

  const products = data.collection('products')

  let searchCursor

  searchCursor = await products.countDocuments()

  let result = []

  result.push(searchCursor)

  response.send(result)

} )

app.get('/products', async (request, response) => {
  client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true });
  const data = await client.db(MONGODB_DB_NAME)
  console.log(`Connected to database ${data.databaseName}`)

  const products = data.collection('products')

  let searchCursor

  if('brand' in request.query && 'maxPrice' in request.query && parseInt(request.query['maxPrice']) !== 0 && request.query['brand'] !== 'All'){
    searchCursor = await products.find({
      'brand':request.query['brand'],
      'price':{$lte:parseInt(request.query['maxPrice'])}
    })

  }else if('brand' in request.query && 'maxPrice' in request.query && request.query['brand'] !== 'All' && parseInt(request.query['maxPrice']) === 0){
    searchCursor = await products.find({'brand':request.query['brand']})

  }else if('brand' in request.query && 'maxPrice' in request.query && parseInt(request.query['maxPrice']) !== 0 && request.query['brand'] === 'All'){
    searchCursor = await products.find({'price':{$lte:parseInt(request.query['maxPrice'])}})

  }
  else{
    searchCursor = await products.find()
  }
  let result = []
  while (await searchCursor.hasNext()){
    result.push(await searchCursor.next())
  }

  if('reasonablePrice' in request.query){
    let reasonablePrice = parseInt(request.query['reasonablePrice'])
    if(reasonablePrice ){
      result = db.getReasonableProducts(result)
    }
  }
  if('recent' in request.query){
    let recent = parseInt(request.query['recent'])
    if(recent){
      result = db.getRecentProducts(result)
    }
  }
  //----------------------------------------- PAGE/SIZE AT THE END ----------------------------------------------------------
  if('page' in request.query && 'size' in request.query){
    let page = parseInt(request.query['page'])
    let size = parseInt(request.query['size'])

    const indexFirstProduct = (page-1)*size

    var myPage = []

    for(var i = indexFirstProduct; i<indexFirstProduct+size; i++){
      myPage.push(result[i])
    }
    result = myPage

  }

  result = result.filter(n => n);

  response.send(result)
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
