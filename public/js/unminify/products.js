
/**
 * Created by Melody.Deng on 2016/12/20.
 */
$(function() {
    var app = new Vue({
        el:"#wrapper",
        data:{
            categoryId:'',
            q:'',
            isHot:'All',
            offLine:'All',
            start:0,
            length:15,
            dataList:[],
            dataTotal:0
        },
        mounted:function () {
            var $this = this;
            $this.queryProductList(1);
        },
        methods:{
            //获取时间戳
            getLocalTime:function (time){
                return new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
            },
            //选择热门
            selectHot:function (name){
                var $this = this;
                $this.start=0;
                $this.isHot = name;
                $this.queryProductList(1);
            },
            //选择下线
            selectOffLine:function (name){
                var $this = this;
                $this.start=0;
                $this.offLine = name;
                $this.queryProductList(1);
            },
            //选择分类
            selectCategory:function (name){
                var $this = this;
                $this.start=0;
                $this.categoryId = name;
                $this.queryProductList(1);
            },
            searchResult:function () {
                var $this = this;
                $this.start=0;
                $this.q = $("#searchValue").val();
                $this.queryProductList(1);
            },
            //更新热门
            updateHot:function (event,id,isHot) {
                var $this=this;
                if(! $(event.currentTarget).hasClass('active')){
                    //调用httpClient.js模块
                    httpClient.PATCH('product/hot',
                        {
                            is_hot:isHot,
                            product_id:id
                        },
                        function (data) {
                            //success
                            var currentData = $this.dataList.find((i) => i.product_id ===id);
                            currentData.is_hot?currentData.is_hot=false:currentData.is_hot=true;
                        },
                        function (data) {
                            //error
                        }
                    )
                }

            },
            //更新下线
            updateOffLine:function (event,id,off_line) {
                var $this=this;
                if(! $(event.currentTarget).hasClass('active')){
                    //调用httpClient.js模块
                    httpClient.PATCH('product/offline',
                        {
                            off_line:off_line,
                            product_id:id
                        },
                        function (data) {
                            //success
                            var currentData = $this.dataList.find((i) => i.product_id ===id);
                            currentData.off_line?currentData.off_line=false:currentData.off_line=true;
                        },
                        function (data) {
                            //error
                        }
                    )
                }

            },
            //公用模块
            queryProductList:function (pageNumber) {
                var $this=this;
                httpClient.GET('product/search?dto.q='+ $this.q +'&dto.type=' + $this.isHot + '&dto.category_id='+ $this.categoryId +'&dto.off_line='+ $this.offLine +'&dto.start=' + $this.start + '&dto.length=' + $this.length,
                    {
                        //data
                    },
                    function (data) {
                        $this.dataList = data.Result.data;
                        $this.dataTotal = data.Result.Total;//总数
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
            }
        }
    });

    $("#tree").treeview({
        collapsed: true,
        animated: "fast",
        control:"#sidetreecontrol",
        prerendered: true,
        persist: "location"
    });
    $('.form-group').on('click','span',function(){
        $('.form-group span').removeClass('active');
        $(this).addClass('active');
    });

    //搜索按钮回车提交
    $("#searchValue").keypress (function (event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        if(keyCode === 13) {
            e.preventDefault();
            $("#search_btn").click();
            //app.searchResult();
        }
    });
});



