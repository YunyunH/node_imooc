//index page
exports.index = function(req, res) {
    res.render('admin_index', {
        title: '管理員首頁'
    })
}