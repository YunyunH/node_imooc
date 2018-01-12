var User = require('../models/user');

//signin page
exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '注登录页面'
    });
}

//signup page
exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册页面'
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
            title: 'mooc 用户列表',
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

// {
//     "_id": ObjectId("5a5876b2edf81358ca3e2a0f"),
//     "title": "寻梦环游记",
//     "doctor": "李·昂克里奇",
//     "country": "美国",
//     "lan": "",
//     "poster": "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2503997609.jpg",
//     "year": 2017,
//     "flash": "http://www.iqiyi.com/w_19ru03rlz5.html",
//     "summary": "热爱音乐的米格尔（安东尼·冈萨雷兹 Anthony Gonzalez 配音）不幸地出生在一个视·布拉特 Benjamin Bratt 配音），因为他很有可能就是自己的祖父。途中，米格尔邂逅了落魄乐手埃克托（盖尔·加西亚·贝纳尔 Gael García Bernal 配音），也渐渐发现了德拉库斯隐藏已久的秘密。©豆瓣",
//     "meta": { "updateAt": ISODate("2018-01-12T08:49:54.700Z"), "createAt": ISODate("2018-01-12T08:49:54.700Z") },
//     "pv": 2,
//     "__v": 0
// }