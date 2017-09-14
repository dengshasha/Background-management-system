/**
 * Created by Melody.Deng on 2016/12/19.
 */
var express = require('express');
var router = express.Router();
router.get('/',function (req,res) {
    res.render('news_manage',{title:'新闻下线'});
});
module.exports = router;