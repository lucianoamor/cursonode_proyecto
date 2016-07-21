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
            var id = req.swagger.params.id ? req.swagger.params.id.value : null;

            main.libs.Movies.searchDB({title: title, id: id})
            .then((movies)=>{
                if(movies.length > 0) {
                    res.json(movies);
                }
                else {
                    main.libs.Movies.searchAPI({title: title})
                    .then((movies)=>{
                        if(!movies.Search) {
                            // res.json(movies);
                            res.json({error: 'nothing found...'});
                        }
                        movies.Search.forEach((movie)=>{
                            let movieOk = {name: movie.Title, year: movie.Year, imdbID: movie.imdbID, image: movie.Poster};
                            main.libs.Movies.save(movieOk)
                            .then((movies)=>{
                                res.json(movieOk);
                            })
                        })
                    })
                }
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
