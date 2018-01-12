var User = require('../models/user');

//signin page
exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登錄'
    });
}

//signup page
exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '註冊'
    });
}

//signup
exports.signup = function(req, res) {
    var _user = req.body.user;


    User.findOne({ name: _user.name }, function(err, user) {
        if (err) {
            console.log(err)
        }

        if (user) {
            return res.redirect('/signin');
        } else {
            var user = new User(_user);

            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/signin');
            })
        }
    });

}

//signin
exports.signin = function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({ name: name }, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (!user) {
            return res.redirect('/signup');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }

            if (isMatch) {
                req.session.user = user;

                return res.redirect('/');

            } else {
                return res.redirect('/signin');
            }
        })
    })
}

//logout
exports.logout = function(req, res) {
    delete req.session.user;
    res.redirect('/');
}

//userlist page
exports.list = function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err)
        }
        res.render('userlist', {
            title: '用戶列表',
            users: users
        })
    });

}

//signin require
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;


    if (!user) {
        return res.redirect('/signin')
    }
    next();
}


//userlist page
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;

    if (user.role <= 10) {
        return res.redirect('/signin')
    }

    next();
}


//del user
exports.del = function(req, res) {
    var id = req.query.id;
    if (id) {
        User.findOne({ _id: id }, function(err, user) {
            console.log(user)
            if (err) {
                console.log(err)
            } else if (user.role > 10) {
                res.json({ success: 0, msg: '禁止刪除管理員' })

            } else {
                User.remove({ _id: id }, function(err, user) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.json({ success: 1 })
                    }
                })
            }

        })


    }
}