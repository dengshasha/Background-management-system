/**
 * Created by Melody.Deng on 2016/12/21.
 */
$(document).ready(function () {
    var app = new Vue({
        el:"#page-wrapper",
        data:{
            category_id:'',//分类id
            is_hot:'All',
            off_line:'All',
            start:0,
            length:12,
            dataList:[],
            categoryList:[],//存放所有分类的下一级目录（分类）
            categoryListFirst:[],//存放所有分类的下下级目录（分类）
            dataTotal:0,
            isError:{
                news_title_error:'none',
                introduction_error:'none',
                news_url_error:'none',
                upload_img_error:'none'
            },
            categorySelected:'',//添加新闻当前分类,默认选中第一条
            newsTitle:'',//添加新闻标题
            newsIntroduction:'',//添加新闻介绍
            newsUrl:'',//添加新闻路径
            hotChecked:false,//是否热门
            imgUrl:'images/detail.png',//上传图片路径
            promptTitle:'',//提示框标题
            promptBody:''//提示框内容
        },
        mounted:function () {
            var $this = this;
            httpClient.GET('category/search?dto.type=News', {},
                function (data) {
                    //success
                    $this.categoryList = data.category_list;
                    $this.categoryListFirst = data.category_list[0];
                    $this.categorySelected = data.category_list[0].list[0].id;
                    setTimeout(()=> {
                        $("#tree").treeview({
                            collapsed: true,
                            animated: "fast",
                            control:"#sidetreecontrol",
                            prerendered: true,
                            persist: "location"
                        });
                    },100);

                    $this.queryProductList(1);
                },
                function (data) {
                    //error
                }
            )
        },
        methods:{
            //获取时间戳
            getLocalTime:function (time){
                return new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
            },
            //设置热门
            updateHot:function (event,id,isHot) {
                var $this=this;
                if(! $(event.currentTarget).hasClass('active')){
                    //调用httpClient.js模块
                    httpClient.PATCH('news/hot',
                        {
                            is_hot:isHot,
                            id:id
                        },
                        function (data) {
                            //success
                            var currentData = $this.dataList.find((i) => i.id ===id);
                            currentData.is_hot?currentData.is_hot=false:currentData.is_hot=true;
                        },
                        function (data) {
                            //error
                        }
                    )
                }

            },
            //设置下线
            updateOffLine:function (event,id,off_line) {
                var $this=this;
                console.log(id);
                console.log(off_line);
                if(! $(event.currentTarget).hasClass('active')){
                    //调用httpClient.js模块
                    httpClient.PATCH('news/offline',
                        {
                            off_line:off_line,
                            id:id
                        },
                        function (data) {
                            //success
                            var currentData = $this.dataList.find((i) => i.id ===id);
                            currentData.offLine?currentData.offLine=false:currentData.offLine=true;
                        },
                        function (data) {
                            //error
                        }
                    )
                }
            },
            //选择下线
            selectOffLine:function (name){
                var $this = this;
                $this.start=0;
                $this.off_line = name;
                $this.queryProductList(1);
            },
            //选择热门
            selectHot:function (name){
                var $this = this;
                $this.start=0;
                $this.is_hot = name;
                $this.queryProductList(1);
            },
            //选择分类
            selectCategory:function (name){
                var $this = this;
                $this.start=0;
                $this.category_id = name;
                $this.queryProductList(1);
            },
            //公用模块
            queryProductList:function (pageNumber) {
                var $this=this;
                httpClient.GET('news/search?dto.type=' + $this.category_id + '&dto.hot_type='+ $this.is_hot +'&dto.off_line='+ $this.off_line +'&dto.start=' + $this.start + '&dto.length=' + $this.length,
                    {
                        //data
                    },
                    function (data) {
                        $this.dataList = data.data;
                        $this.dataTotal = data.Total;//总数
                        var pageCount = Math.ceil($this.dataTotal/$this.length);
                        $("#pager").pager({ pagenumber: pageNumber, pagecount:pageCount, buttonClickCallback: $this.PageClick });
                    },
                    function (data) {
                        //error
                    }
                )
            },
            //分页
            PageClick : function(pageclickednumber) {
                var $this = this;
                $this.start=(pageclickednumber-1)*$this.length;
                $this.queryProductList(pageclickednumber);
            },
            //上传图片
            uploadPicture:function (event) {
                var $this = this;
                var fileName =$(event.target).val();// fileUrl[fileUrl.length -1];//获取图片名称
                if(fileName){
                    var fileSize = event.target.files[0].size;//$("#img_choose")[0].files[0].size
                    if(!/\.(gif|jpg|jpeg|png)$/.test(fileName)){
                        alert('请选择.gif,.jpg,.jpeg,.png格式的文件!');
                    }else if(fileSize > 1024 * 1024 * 4){
                        alert('图片大小不能超过4M！');
                    }
                    else{
                        $.ajax({
                            url:'/getQiniuToken?fileName=' + fileName + '&slug=upload',
                            type:'get',
                            success:function (data) {
                                let formData = new FormData();
                                formData.append('token', data.token);
                                formData.append('file', event.target.files[0]);
                                $.ajax({
                                    url:'http://upload.qiniu.com',
                                    type:'POST',
                                    data:formData,
                                    processData: false,
                                    contentType: false,
                                    success:function (data) {
                                        let imgUrl='http://upload.s.vidahouse.com/'+ data.hash;
                                        var cropperOptions = {
                                            processInline:true,
                                            modal:true,
                                            loaderHtml:'<div class="loader bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div> ',
                                            loadPicture:imgUrl,
                                            onAfterImgCrop: function(data){
                                                console.log(data);
                                                var r= parseInt(data.imgInitH/data.imgH);
                                                var h=r*data.cropH;
                                                var w=r*data.cropW;
                                                var imgX=r*data.imgX1;
                                                var imgY=r*data.imgY1;
                                                var newImgUrl=data.imgUrl+'?imageMogr2/crop/!'+w+'x'+h+'a'+imgX+'a'+imgY;
                                                $this.imgUrl = newImgUrl;
                                            },
                                        };
                                        var cropperHeader = new Croppic('upload-image',cropperOptions);
                                    }
                                });
                            }
                        })
                    }
                }
            },
            //添加新闻
            addNews:function () {
                var $this = this;

                var type_id = $this.categorySelected;
                var title = $this.newsTitle;
                var image_uri = $this.imgUrl;
                var introduction = $this.newsIntroduction;
                var news_url = $this.newsUrl;
                var is_hot = $this.hotChecked;
                if(!title){
                    $this.isError.news_title_error = 'block';
                    $this.isError.upload_img_error = 'none';
                    $this.isError.introduction_error = 'none';
                    $this.isError.news_url_error = 'none';
                }else if(image_uri == 'images/detail.png'){
                    $this.isError.upload_img_error = 'block';
                    $this.isError.news_title_error = 'none';
                    $this.isError.introduction_error = 'none';
                    $this.isError.news_url_error = 'none';
                } else if(!introduction || introduction.length > 40){
                    $this.isError.introduction_error = 'block';
                    $this.isError.news_title_error = 'none';
                    $this.isError.upload_img_error = 'none';
                    $this.isError.news_url_error = 'none';
                }else if(!news_url){
                    $this.isError.news_url_error = 'block';
                    $this.isError.news_title_error = 'none';
                    $this.isError.upload_img_error = 'none';
                    $this.isError.introduction_error = 'none';
                }else{
                    httpClient.POST('news',
                        {
                            title: title,
                            news_url: news_url,
                            is_hot: is_hot,
                            thumbnail_url: image_uri,
                            introduction: introduction,
                            type_id: type_id
                        },
                        function (data) {
                            //success
                            $("#add-news").modal('hide');
                            $("#prompt").modal('show');
                            $this.promptTitle = '提示';
                            $this.promptBody = '添加成功！';
                            $this.category_id = type_id;
                            $this.queryProductList(1);
                            //初始化数据
                            $this.newsTitle = '';
                            $this.imgUrl = 'images/detail.png';
                            $this.newsIntroduction = '';
                            $this.newsUrl = '';
                            $this.isError.upload_img_error = 'none';
                            $this.isError.news_title_error = 'none';
                            $this.isError.introduction_error = 'none';
                            $this.isError.news_url_error = 'none';
                        },
                        function () {
                            //error
                            $("#add-news").modal('hide');
                            $("#prompt").modal('show');
                            $this.promptTitle = '错误提示';
                            $this.promptBody = '添加失败，请重试！';
                        }
                    )
                }
            },
        }
    });

    //切换热门新闻样式
    $('.choose_hot span').click(function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    });

    //显示缩略图
    $("#tbody").on('mouseover','td a',function(){
        $(this).siblings('div').css({
            'display':'block'
        })
    });
    $("#tbody").on('mouseout','td a',function(){
        $(this).siblings('div').css({
            'display':'none'
        })
    })
});
