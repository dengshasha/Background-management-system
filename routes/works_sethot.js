/**
 * Created by Alpha.Liu on 2016/12/16.
 */
var express = require('express');
var router = express.Router();
var configLite = require('config-lite');
const rp =  require('request-promise');
router.get('/',function (req,res,next) {
    rp('http://cmadmin.api.v.vidahouse.com/v1/category/search?dto.type=Works')
    //rp( configLite.communityAPIUrl + '/category.json')
        .then(function (resourcesData) {
            var NewResourcesData = JSON.parse(resourcesData);
            rp('http://cmadmin.api.v.vidahouse.com/v1/works/search?dto.type=All&dto.off_line=All&dto.start=0&dto.length=15')
            //rp( configLite.communityAPIUrl + '/test.json')
                .then(function(worksData){
                    var NewWorksData = JSON.parse(worksData);
                    var worksArray = NewWorksData.data;
                    var category_list= NewResourcesData.category_list;
                    var list = [];
                    for(var i = 0; i < category_list.length; i++){
                        list.push(category_list[i].list);
                    }
                    worksArray.forEach(function(e,i,arr){
                        arr[i] = Object.assign({},e,{
                            tdId : e.product_id || e.works_id,
                            tdName : e.product_name || e.works_name
                        })
                    });
                    res.render('works_sethot',{
                        title:'热门设置',
                        position:'位置：作品管理>热门设置',
                        all:'所有作品',
                        hot:'热门作品',
                        notHot:'非热门作品',
                        id:'作品ID',
                        name:'作品名',
                        category_list:category_list,
                        list:list,
                        table:worksArray,
                        total:NewWorksData.Total
                    });
                });
        });
});
module.exports = router;
