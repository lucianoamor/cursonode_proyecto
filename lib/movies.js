/* eslint-disable semi */
"use strict";

const http = require('http'); // pasar a app.js para respetar pattern

const fdebug = require("./fdebug");
const debug = fdebug("movies:lib:movies");

function Movies(main) {
    this.db = main.db;
    debug('init');
}


Movies.prototype.searchDB = function(obj){
    var self = this;

    debug("searchDB called: "+JSON.stringify(obj));

    return new Promise((resolve, rejec)=>{

        let query = {};

        if(obj.title) query.name = new RegExp('.*'+obj.title+'.*', 'gi');
        if(obj.id) query.imdbID  = obj.id;

        self.db.movies.find(query, {}, (err, docs)=>{
            err ? reject(err) : resolve(docs);
        })
    });
}

Movies.prototype.searchAPI = function(obj){
    var self = this;

    debug("searchAPI called: "+JSON.stringify(obj));

    return new Promise((resolve, rejec)=>{

        if(!obj.title) {
            resolve({});
        }
        var options = {
          hostname: 'www.omdbapi.com',
          port: 80,
          path: '/?s='+obj.title,
          method: 'GET'
        };
        var omdbres = '';
        var req = http.request(options, (res) => {
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            omdbres += chunk;
          });
          res.on('end', () => {
            resolve(JSON.parse(omdbres));
          });
        });

        req.on('error', (e) => {
          console.log(`problem with request: ${e.message}`);
        });

        req.end();
    });
}

Movies.prototype.save = function(obj){
    var self = this;

    debug("save called: "+JSON.stringify(obj));

    return new Promise((resolve, rejec)=>{
        self.db.movies.save(obj, {}, (err, docs)=>{
            err ? reject(err) : resolve(docs);
        })
    });
}

module.exports = Movies;
