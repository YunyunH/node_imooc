var Category = require('../models/category');

//admin page
exports.new = function(req, res) {
    res.render('category_admin', {
        title: 'mooc 後台分類錄入頁',
        category: {}
    })
}

//admin post movie
exports.save = function(req, res) {
    var _category = req.body.category;
    var category = new Category(_category);

    category.save(function(err, movie) {
        if (err) {
            console.log(err)
        }
        res.redirect('/admin/category/list');
    })
}


//list page
exports.list = function(req, res) {
    Category.fetch(function(err, categories) {
        if (err) {
            console.log(err)
        }
        res.render('categorylist', {
            title: 'mooc 分類列表頁',
            categories: categories
        })
    });
}

// //list delete
// exports.del = function(req, res) {
//     // app.delete('/admin/list', function(req, res) {
//     var id = req.query.id;
//     if (id) {
//         Movie.remove({ _id: id }, function(err, movie) {
//             if (err) {
//                 console.log(err)
//             } else {
//                 res.json({ success: 1 })
//             }
//         })
//     }
// }