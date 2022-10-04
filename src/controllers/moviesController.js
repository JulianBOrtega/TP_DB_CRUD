const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
         
        db.Movie.findByPk(req.params.id, 
            {
                include: 
                [
                    { association: 'genre' },
                    { association: 'actors' }
                ]
            },)
            .then(movie => {
                return res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({order:['name']})
            .then(allGenres => res.render('moviesAdd', {allGenres}))
            .catch(err => console.log(err))
    },
    create: function (req,res) {
        db.Movie.create(
            {
                ...req.body,
                title: req.body.title.trim()
            })
                .then(newMovie => res.redirect('/movies/detail/' + newMovie.id))
                .catch(err => console.log(err));
    },
    edit: function(req,res) {
        let movie = db.Movie.findByPk(req.params.id);
        let allGenres = db.Genre.findAll({order:['name']});

        Promise.all([movie, allGenres])
            .then(([movie, allGenres]) => res.render('moviesEdit', {movie, allGenres, moment}))
            .catch(err => console.log(err))
    },
    update: function (req,res) {
        db.Movie.update(
            {
                ...req.body
            },
            {
                where:
                {
                    id: req.params.id
                }
            })
                .then(r => res.redirect('/movies/detail/' + req.params.id))
                .catch(err => console.log(err));
    },
    delete: function (req,res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => res.render('moviesDelete', {movie}))
    },
    destroy: function (req,res) {
        db.Movie.destroy(
            {
                where: 
                {
                    id: req.params.id
                }
            })
                .then(r => res.redirect('/movies'))
                .catch(err => console.log(err))
    }
}

module.exports = moviesController;