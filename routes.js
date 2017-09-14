/**
 * Created by Fred.Lu on 2016/11/9.
 */
var home = require('./routes/home');
var index = require('./routes/index');

var configuration = require('./routes/configuration');
var picture = require('./routes/picture');
var works_sethot = require('./routes/works_sethot');
var works_manage = require('./routes/works_manage');
var products_sethot = require('./routes/products_sethot');
var products_manage = require('./routes/products_manage');
var news_sethot = require('./routes/news_sethot');
var news_manage = require('./routes/news_manage');
var news_add = require('./routes/news_add');
var getQiniuToken = require('./routes/getQiniuToken');

module.exports.use=function (app) {
    app.use('/', home);
    app.use('/index', index);
    app.use('/configuration',configuration);
    app.use('/picture',picture);
    app.use('/works_sethot',works_sethot);
    app.use('/works_manage',works_manage);
    app.use('/products_sethot',products_sethot);
    app.use('/products_manage',products_manage);
    app.use('/news_sethot',news_sethot);
    app.use('/news_manage',news_manage);
    app.use('/news_add',news_add);
    app.use('/getQiniuToken',getQiniuToken);
};