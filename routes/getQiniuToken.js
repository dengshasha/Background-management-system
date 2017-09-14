/* 获取七牛上传token */
const express = require('express');
const router = express.Router();
const rp = require('request-promise');
var request = require('request');
router.get('/', (req, res) =>{
  var options = {
    method: 'GET',
    uri: 'http://cmadmin.api.v.vidahouse.com/v1/qiniu/token',
    qs: {
      fileName: req.query.fileName,
      slug: req.query.slug
    },
    json: true
  };
  rp(options)
      .then(function(body){
        console.warn('获取七牛TOKEN,返回结果如下');
        //console.log(body);
        res.json({token: body.token})
      })
      .catch(function(err){
        console.log("获取七牛TOKEN， 错误信息如下");
        console.log(err.message);
      });
  // if(!req.user){
  //   return res.status(401).json({'err': 'you must login first!'});
  // }
});

module.exports = router;
