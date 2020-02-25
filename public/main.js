const request = require('request');




{/* <div id="mainData">      
<% countData["results"].forEach(function(Pokemon) { %>
  <li><%= Pokemon["name"] %> - <%= Pokemon["url"] %></li>
<% }) %>
</div> */}

const pokeContent = document.getElementById("mainData");

function dropDown(){
    const selectElement = document.getElementById("searchPoke");
    console.log(document);

    pokeContent.forEach(function(search){
        let opt = document.createElement ('option');
        opt.value = search.url;
        opt.innerHTML = search.name;
        selectElement.appendChild(opt);
    });

    selectElement.onchange = function(e){
        const search = e.target.value;
        const selected_poke_element = document.getElementById("selected_poke");
        selected_poke_element.textContent = `Selected Pokemon is: ${search}`;
        console.log(search);
        fetchPokemon(search);
    }
}

function fetchPokemon(search){
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=`;
    request (url, function(err, response, body){
        if(err) console.log('Error: ', err);
        const pokemonContent = JSON.parse(body)

        const get_poke = document.getElementById("name");
        get_poke.textContent = `${pokemonContent.main.name}`
        console.log(JSON.parse(body)); 
    });
}
}

