/**
 * Created by Alpha.Liu on 2016/12/16.
 */
var express = require('express');
var router = express.Router();
var configLite = require('config-lite');
const rp =  require('request-promise');
router.get('/',function (req,res,next) {
    rp( configLite.communityAPIUrl + 'category/search?dto.type=Product')///category.json
        .then(function (categoryData) {
            var categoryJson = JSON.parse(categoryData);
            var category_list = categoryJson.category_list;
            res.render('products_sethot',{
                title:'热门设置',
                position:'位置：产品管理>热门设置',
                category_list:category_list
            });
        });
});
module.exports = router;
