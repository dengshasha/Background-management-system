/**
 * Created by Alpha.Liu on 2016/12/16.
 */
var express = require('express');
var router = express.Router();
var configLite = require('config-lite');
const rp =  require('request-promise');
router.get('/',function (req,res,next) {
    rp('http://cmadmin.api.v.vidahouse.com/v1/category/search?dto.type=Works')
        .then(function (resourcesData) {
            var NewResourcesData = JSON.parse(resourcesData);
            rp('http://cmadmin.api.v.vidahouse.com/v1/works/search?dto.type=All&dto.off_line=All&dto.start=0&dto.length=15')
            //rp('http://localhost:3331/test.json')
                .then(function(worksData){
                    var NewWorksData = JSON.parse(worksData);
                    var worksArray = NewWorksData.data;
                    var category_list = NewResourcesData.category_list;
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
                    res.render('works_manage',{
                        title:'作品管理',
                        position:'位置：作品管理>作品管理',
                        all:'所有作品',
                        hot:'下线作品',
                        notHot:'在线作品',
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