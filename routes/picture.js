/**
 * Created by Melody.Deng on 2017/1/10.
 */
var express = require('express');
var router = express.Router();

router.get('/',function (req,res) {
   res.render('picture',{title:'图片管理'});
});

module.exports = router;