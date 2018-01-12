var Category = require('../models/category');
var _ = require('underscore');

//admin page
exports.new = function(req, res) {
    res.render('category_admin', {
        title: '電影分類錄入頁',
        category: {}
    })
}

//admin post movie
exports.save = function(req, res) {
    var _category = req.body.category;
    var category = new Category(_category);
    var id = req.body._id;
    console.log(id)
    if (id) {
        Category.findById(id, function(err, category) {
            if (err) {
                console.log(err)
            }
            console.log(category);
            console.log(_category);
            _category = _.extend(category, _category);
            console.log(_category);
            _category.save(function(err, category) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/admin/category/list');
            })
        })
    } else {
        category.save(function(err, category) {
            if (err) {
                console.log(err)
            }
            res.redirect('/admin/category/list');
        })
    }


}


//list page
exports.list = function(req, res) {
    Category.fetch(function(err, categories) {
        if (err) {
            console.log(err)
        }
        res.render('categorylist', {
            title: '電影分類列表',
            categories: categories
        })
    });
}

//category update
exports.update = function(req, res) {
    var id = req.params.id;
    if (id) {
        Category.findById(id, function(err, category) {
            if (err) {
                console.log(err);
            } else {
                res.render('category_admin', {
                    title: 'mooc update!',
                    category: category
                })
            }
        })

    }
}

// list delete
exports.del = function(req, res) {
    var id = req.query.id;
    if (id) {
        Category.remove({ _id: id }, function(err, category) {
            if (err) {
                console.log(err)
            } else {
                res.json({ success: 1 })
            }
        })
    }
}