const db = require('../database/models')

module.exports = 
{
    list: (req, res) => 
    {
        db.Actor.findAll()
            .then((actors) =>
            {
                return res.render('actorsList', {actors})
            })
            .catch(err => console.log(err));
    },
    detail: (req, res) => 
    {
        const associations = 
        {
            include:
            [
                {
                    association: 'movies'
                }
            ]
        }

        db.Actor.findByPk(req.params.id, associations)
            .then(actor => res.render('actorsDetail', {actor}))
            .catch(err => console.log(err))
    },
    add: function (req, res) {
        db.Movie.findAll({order:['title']})
            .then(movies => res.render('actorsAdd', {movies}))
            .catch(err => console.log(err));
    },
    create: function (req,res) {
        db.Actor.create(
            {
                ...req.body,
                first_name: req.body.first_name.trim(),
                last_name: req.body.last_name.trim()
            })
            .then((actor) => res.redirect('/actors/detail/' + actor.id))
            .catch(err => console.log(err));
    },
    edit: function(req,res) 
    {
        let actor = db.Actor.findByPk(req.params.id);
        let movies = db.Movie.findAll({order:['title']});

        Promise.all([actor, movies])
            .then(([actor, movies]) => res.render('actorsEdit', {actor, movies}))
            .catch(err => console.log(err));
    },
    update: function (req,res) 
    {
        db.Actor.update(
            {
                ...req.body
            },
            {
                where:
                {
                    id: req.params.id
                }
            })
            .then(() => res.redirect('/actors/detail/' + req.params.id))
            .catch(err => console.log(err));
    },
    delete: function (req,res) 
    {
        db.Actor.findByPk(req.params.id)
            .then(actor => res.render('actorsDelete', {actor}))
    },
    destroy: function (req,res) 
    {
        db.Actor.destroy(
            {
                where:
                {
                    id: req.params.id
                }
            })
            .then(() => res.redirect('/actors'))
            .catch(err => console.log(err));
    }
}