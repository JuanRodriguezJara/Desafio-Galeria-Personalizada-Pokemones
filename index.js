// Importación de datos
const axios = require("axios");
const http = require("http");
const fs = require("fs");


//1. Hacer uso de Async/Await para las funciones que consulten los endpoints de la pokeapi.

async function pokemonesGet() {
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=75");
  return data.results;
}

async function pokemonesG2() {
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=75&offset=150");
  return data.results;
}

async function getFullData(name) {
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  return data;
}

// 2. Usar el Promise.all() para ejecutar y obtener la data de las funciones asincronas generando un nuevo arreglo con la data a entregar en el siguiente requerimiento.
// 3. Disponibilizar la ruta http://localhost:3000/pokemones que devuelva un JSON con elnombre y la url de una imagen de 150 pokemones, asi como veras en la siguiente// imagen.

http
  .createServer((req, res) => {
    let pokepromise = [];
    let pokeLista = [];
    if (req.url == "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.readFile("index.html", "utf-8", (err, file) => {
        if (err) throw err;
        res.write(file);
        res.end();
      });
    }
    if (req.url == "/pokemones") {
      pokemonesGet().then((results) => {
        results.forEach((p) => {
          let pokemonName = p.name;
          pokepromise.push(getFullData(pokemonName));
        });
        pokemonesG2().then((results) => {
          results.forEach((p) => {
            let pokemonName = p.name;
            pokepromise.push(getFullData(pokemonName));
          });
          Promise.all(pokepromise).then((data) => { // Aqui se hace el llamado al promise.all() del punto 2.
            data.forEach((p) => {
              pokeLista.push({ nombre: p.name, img: p.sprites.front_default });
            });
            res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }); // Con esto se devuelve el JSON del punto 3
            let dJson = JSON.stringify(pokeLista);
            res.end(dJson);
          });
        });
      });
    }

    if (req.url == "/galeria") {
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.readFile("index.html", "utf-8", (err, file) => {
        if (err) throw err;
        res.write(file);
        res.end();
      });
    }
  })
  .listen(3000, () => console.log("Escuchando el puerto 3000"));
