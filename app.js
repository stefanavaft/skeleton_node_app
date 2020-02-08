const express = require('express');
const bodyParser = require('body-parser');        //middleware to allow me use the info stored in my req and res
const app = express();
const port = 3000;
const request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));  
app.use(express.static('public'));                

app.get('/', (req, res) => {
  request("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20", function (error, response, body) {
    if(!error && response.statusCode == 200){
      const countData = JSON.parse(body)
      res.render("index", {countData: countData});
    }
  });
});    

//defining my route to call the html file
app.set('view engine', 'ejs');                   

app.post('/', function (req, res) {            
  res.render('index');

  console.log(req.body.pokemon);           
});
  
app.listen(port, () => console.log(`Example app listening on port ${port}!`));