/**
 * Created by Melody.Deng on 2016/12/14.
 */
var express = require('express');
var router = express.Router();

router.get('/',function (req,res) {
    res.render('configuration',{title:'分类管理'});
});

module.exports = router;