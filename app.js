const express = require('express');
const bodyParser = require('body-parser');        //middleware to allow me use the info stored in my req and res
const app = express();
const port = 3000;
const request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));  
app.use(express.static('public'));                

app.get('/', (req, res) => {
  request("https://pokeapi.co/api/v2/pokemon/", function (error, response, body) {
    console.error('error:', error); 
    console.log('statusCode:', response && response.statusCode);
    const parsedData = JSON.parse(body);
    console.log(parsedData["name"]); 
    console.log(parsedData.results);
    res.render("index")
  });
});    

//defining my route to call the html file
app.set('view engine', 'ejs');                   

app.post('/', function (req, res) {            
  res.render('index');

  console.log(req.body.pokemon);           
});
  
app.listen(port, () => console.log(`Example app listening on port ${port}!`));