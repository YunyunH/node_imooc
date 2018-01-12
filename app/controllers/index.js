var Movie = require('../models/movie');
var Category = require('../models/category');
//index page
exports.index = function(req, res) {
    Category.find({}, function(err, categories) {
        if (err) {
            console.log(err)
        }
        Movie.find({}, function(err, movies) {
            res.render('index', {
                title: '首頁',
                categories: categories,
                movies: movies
            })
        })
    });

    Movie.fetch(function(err, movies) {

    });
}

// search page
exports.search = function(req, res) {
    var catId = req.query.cat;
    var q = req.query.q;

    if (catId) {
        Movie.find({ category: catId }, function(err, movies) {
            if (err) {
                console.log(err);
            }
            Category.findOne({ _id: catId }, function(err, category) {
                if (err) {
                    console.log(err);
                }
                res.render('results', {
                    title: '結果列表頁面',
                    keyword: category.name,
                    query: 'cat=' + catId,
                    movies: movies
                })
            })

        });

        Movie.fetch(function(err, movies) {

        });
    } else {
        Movie
            .find({ title: new RegExp(q + '.*', 'i') })
            .exec(function(err, movies) {
                if (err) {
                    console.log(err)
                }

                var results = movies;

                res.render('results', {
                    title: '結果列表頁面',
                    keyword: q,
                    query: 'q=' + q,
                    movies: results
                })
            })
    }

}