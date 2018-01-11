var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var app = express();
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);

var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty');

var dbUrl = 'mongodb://localhost:27017/mooc';


mongoose.connect(dbUrl, { useMongoClient: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use('/static', serveStatic('public'));
app.locals.moment = require('moment');


//設置視圖的根目錄
app.set('views', './app/views/pages');
//設置默認的模板引擎
app.set('view engine', 'jade');
//監聽上設端口
app.use(cookieParser());
app.use(multipart());
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

if('development' === app.get('dev')) {
    app.set('showStackError', true);
    app.use(express.logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require('./config/routes')(app);
app.listen(port);
console.log('mooc start!' + port);

//以下是路由
//


