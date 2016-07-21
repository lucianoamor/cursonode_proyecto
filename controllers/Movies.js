/* eslint-disable semi */
"use strict";

const fdebug = require("../lib/fdebug");
const debug  = fdebug("movies:controllers:movies");


function Movies(main) {
    debug("init.");
    return {

        'search': (req, res, next)=>{
            debug(".search called");

            var title = req.swagger.params.title ? req.swagger.params.title.value : null;
            var year  = req.swagger.params.year ? req.swagger.params.year.value : null;
            var id    = req.swagger.params.id ? req.swagger.params.id.value : null;

            main.libs.Movies.search({title: title, year: year, id: id})
            .then((movies)=>{
                    res.json(movies);
                })
            .catch(next);
        },

        'save': (req, res, next)=>{
            debug(".save called");

            var movie = req.swagger.params.movie.value ? req.swagger.params.movie.value : null;

            main.libs.Movies.save(movie)
            .then((movies)=>{
                    res.json(movies);
                })
            .catch(next);
        }

    };//end return
}

module.exports = Movies;
