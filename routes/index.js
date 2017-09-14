/**
 * Created by Melody.Deng on 2017/2/10.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req,res) {
    res.render('index',{title:'Home Index'});
});

module.exports = router;
