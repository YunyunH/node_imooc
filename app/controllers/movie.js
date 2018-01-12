var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment')
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

//detail page
exports.detail = function(req, res) {
    var id = req.params.id;
    Movie.findById(id, function(err, movie) {
        Movie.update({ _id: id }, { $inc: { pv: 1 } }, function(err) {
            if (err) {
                console.log(err)
            }
        });
        Comment
            .find({ movie: id })
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments) {
                console.log(comments)
                res.render('detail', {
                    title: 'mooc詳情頁',
                    movie: movie,
                    comments: comments
                })
            })
    })

}

//admin page
exports.new = function(req, res) {
    Category.find({}, function(err, categories) {
        res.render('admin', {
            title: 'mooc 後台錄入頁',
            categories: categories,
            movie: {}
        })
    })

}

//admin update movie
exports.update = function(req, res) {
    var id = req.params.id;
    if (id) {

        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, categories) {
                res.render('admin', {
                    title: 'mooc update!',
                    movie: movie,
                    categories: categories
                })
            })
        })

    }
}


exports.savePoster = function(req, res, next) {
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;

    console.log(req.files)
    if (originalFilename) {
        fs.readFile(filePath, function(err, data) {
            var timestamp = Date.now();
            var type = posterData.type.split('/')[1];
            var poster = timestamp + '.' + type;
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);

            fs.writeFile(newPath, data, function(err) {
                req.poster = poster;
                next();
            })
        })
    } else {
        next();
    }
}

//admin post movie
exports.save = function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (req.poster) {
        movieObj.poster = req.poster;
    }
    if (id) {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err)
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
        _movie = new Movie(movieObj);

        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;

        if (categoryId) {
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movie._id);
            });

        } else if (categoryName) {
            var category = new Category({
                name: categoryName
            });
            category.save(function(err, category) {
                _movie.category = category._id;
                _movie.save(function(err, movie) {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/movie/' + movie._id);
                });
            });
        }


    }
}


//list page
exports.list = function(req, res) {
    var page = parseInt(req.query.page);
    var cont = 10;
    Movie
        .find({})
        .skip(page * cont)
        .limit(cont)
        .exec(function(err, movies) {
            if (err) {
                console.log(err)
            }
            res.render('list', {
                title: 'mooc列表',
                movies: movies,
                page: page,
                lastPage: movies.length < cont
            });
        });
}

//list delete
exports.del = function(req, res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({ _id: id }, function(err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({ success: 1 })
            }
        })
    }
}