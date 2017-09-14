/**
 * Created by Alpha.Liu on 2016/12/16.
 */
var express = require('express');
var router = express.Router();
var configLite = require('config-lite');
const rp =  require('request-promise');
router.get('/',function (req,res,next) {
    rp(configLite.communityAPIUrl + 'category/search?dto.type=Product')
        .then(function (resourcesData) {
            var NewResourcesData = JSON.parse(resourcesData);
            var category_list = NewResourcesData.category_list;
            res.render('products_manage',{
                title:'产品管理',
                category_list:category_list,
            });
        });
});
module.exports = router;
