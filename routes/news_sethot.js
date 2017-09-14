/**
 * Created by Melody.Deng on 2016/12/19.
 */
var express = require('express');
var router = express.Router();
router.get('/',function (req,res) {
   res.render('news_sethot',{title:'热门设置'});
});

module.exports = router;