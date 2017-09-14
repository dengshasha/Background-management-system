/**
 * Created by Alpha.Liu on 2016/12/16.
 */
function NewDate(time){
    return new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
}
var searchApiOptions={
    q:'',
    type:'All',
    category_id:'',
    is_hot:'All',
    off_line:'All',
    start:0,
    length:15
};
//分页
var NewData;
var showData;
var total = $('#totalCount').val();
var perPage = 15;
var pageCount = Math.ceil(total/perPage);
var url = 'http://cmadmin.api.v.vidahouse.com/v1/works/search';


function getSource(data){
    $.ajax({
        type:'GET',
        url:url,
        data:data,
        success:function(data){
            if(total!=data.Total){
                total=data.Total;
                //重新初始化分页控件
                pageCount=Math.ceil(total/perPage);
                $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
            }
            $('table tbody').empty();
            var NewData = data.data;
            $(NewData).each(function(i,v){
                var newIshot = v.is_hot == true ? 'active':'';
                var newNothot = v.is_hot == true ? '':'active';
                $('table tbody').append('<tr data-value="'+ v.works_id +'"><td>'+ v.works_id+'</td><td>'+ v.works_name+'</td><td>'+ v.owner+'</td><td>'+ NewDate(v.created_at)+'</td><td><span data-value="true" class="setHot'+' '+newIshot+'">设置热门</span><span data-value="false" class="setHot'+' '+newNothot+'">取消热门</span></td></tr>');
            })
        },
        error:function(){console.log("error")}
    });
}
$('#functionBtn').on('click','span',function(){
    searchApiOptions.type=$(this).attr('data-value');
    searchApiOptions.start=0;
    getSource(searchApiOptions);
});
$('#searchBtn').on('click',function(){
    searchApiOptions.q= $('#searchCondition').val();
    searchApiOptions.start=0;
    getSource(searchApiOptions);
});
$('.categoryList').on('click','a',function(){
    $('.categoryList a').removeClass('active');
    $(this).addClass('active');
    var data_id = $(this).attr('data-id');
    searchApiOptions.start=0;
    searchApiOptions.category_id=data_id;
    getSource(searchApiOptions);
});
$('tbody').on('click','span',function(){
    var data_value = $(this).attr('data-value');
    var works_id = $(this).parents('tr').attr('data-value');
    if(!$(this).hasClass('active')){
        $.ajax({
            type:'PATCH',
            url:'http://cmadmin.api.v.vidahouse.com/v1/works/hot',
            data:{
                is_hot:data_value,
                works_id:works_id
            },
            success:function(){
                console.log(this);
                $(this).addClass('active');
                $(this).siblings('span').removeClass('active');
                var NewAlert = '<div class="myAlert" style="width:100px;height:52px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;color: #3c763d;background-color: #dff0d8;border-color: #d6e9c6;padding: 15px;border: 1px solid transparent;border-radius: 4px;" class="alert alert-success"> <a href="#" class="close" data-dismiss="alert">&times;</a> <strong>成功！</strong> </div>';
                $(this).parents('table').css('po' +
                    'sition','relative');
                $(this).parents('tr').append(NewAlert);
                setTimeout(function(){
                    $('.myAlert').hide();
                },500)
            }.bind(this),
            error:function(){
                alert('失败');
            }
        });

    }
});

var PageClick = function(pageclickednumber) {
    searchApiOptions.start=(pageclickednumber-1)*searchApiOptions.length;
    getSource(searchApiOptions);
    $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });
}
$("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
$('#searchCondition').keypress(function(e){
    if(e.keyCode==13){
        e.preventDefault();
        searchApiOptions.q= $('#searchCondition').val();
        searchApiOptions.start=0;
        getSource(searchApiOptions);
    }
});