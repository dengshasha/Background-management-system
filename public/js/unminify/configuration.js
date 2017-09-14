/**
 * Created by Melody.Deng on 2016/12/16.
 */
$(function(){
    var app = new Vue({
        el:'#page-wrapper',
        data:{
            resources:[],//资源数据
            resourcesSelected:'',//选中的资源类型id
            category:[],//分类
            category_list: [],//分类下的数据
            categorySelected:'',//选中的分类id
            promptTitle:'',//模态框提示框标题
            promptBody:'',//模态框提示框内容
            remodalResources:'',//模态框获取当前所在资源
            remodalCategory:'',//模态框获取当前所在分类
            isError:{
                //所有提示错误
                cn_name_error:'none',
                en_name_error:'none',
                display_index_error:'none',
                off_line_error:'none',
                is_hot_error:'none'
            },
            postForm:{
                //添加分类提交表单的所有数据
                cnName:'',
                enName:'',
                displayIndex:'',
                offLine:'',
                isHot:''
            }
        },
        mounted:function () {
            var $this = this;
            httpClient.GET('system/resource',{},
                function (resourcesData) {
                    //success
                    $this.resources = resourcesData.data;
                    $this.resourcesSelected = $this.resources[0].id;

                    $this.reloadTable(resourcesData.data[0].type_name);
                },
                function () {
                    //error
                }
            );

        },
        methods:{
            //选择分类
            selectCategory:function () {
                var $this = this;
                var index = $this.category.findIndex(function(o){
                    return o.type_id == $this.categorySelected;
                }.bind(this));
                $this.category_list = $this.category[index].list;
            },
            //选择资源类型
            selectResources:function () {
                var $this = this;
                $this.reloadTable($this.resourcesSelected);
            },
            //更新分类顺序
            updateSort:function (categoryListId,event) {
                var displayIndex = $(event.target).val();
                httpClient.PATCH('/category/displayindex',
                    {
                        display_index:displayIndex,
                        id:categoryListId
                    },
                    function () {
                        //success
                    },
                    function () {
                        //error
                    }
                );
            },
            //更新设置热门
            updateHot:function (index,categoryListId,isHot,initIsHot) {
                var $this = this;
                if(!isHot == true){
                    httpClient.PATCH('/category/hot',
                        {
                            is_hot:initIsHot,
                            id:categoryListId
                        },
                        function () {
                            //success
                            $this.category_list[index].is_hot=initIsHot;
                        },
                        function () {
                            //error
                            $("#prompt").modal('show');
                            $this.promptTitle = '错误提示';
                            $this.promptBody = '设置失败，请重试!';
                        }
                    );
                }
            },
            //更新设置下线
            updateOffLine:function (index,categoryListId,offLine,initOffLine) {
                var $this = this;
                if(!offLine == true){
                    httpClient.PATCH('/category/offline',
                        {
                            off_line:initOffLine,
                            id:categoryListId
                        },
                        function () {
                            //success
                            $this.category_list[index].off_line = initOffLine;
                        },
                        function () {
                            //error
                            $("#prompt").modal('show');
                            $this.promptTitle = '错误提示';
                            $this.promptBody = '设置失败，请重试!';
                        }
                    );
                }
            },
            //模态框--获取当前所在资源和分类
            getResources:function () {
                var $this = this;
                var type_id = $this.resourcesSelected;
                var parent_id = $this.categorySelected;
                var currentResource = $this.resources.find((i) => i.id === type_id);//匹配当前所在资源
                $this.remodalResources = currentResource.type_name;//获得当前所在资源名称
                var currentCategory = $this.category.find((i) => i.type_id === parent_id);//匹配当前所在分类
                $this.remodalCategory = currentCategory.type;//获取当前所在分类名称
            },
            //添加分类
            addCategory:function () {
                var $this = this;
                var type_id = $this.resourcesSelected;
                var parent_id = $this.categorySelected;
                var cn_name = $this.postForm.cnName;
                var en_name = $this.postForm.enName;
                var off_line = $this.postForm.offLine;
                var is_hot = $this.postForm.isHot;
                var displayindex = $this.postForm.displayIndex;
                if(!cn_name){
                    $this.isError.cn_name_error = 'block';
                } else if(!en_name){
                    $this.isError.en_name_error = 'block';
                }else if(!displayindex){
                    $this.isError.display_index_error = 'block';
                } else if(!off_line){
                    $this.isError.off_line_error = 'block';
                } else if(!is_hot){
                    $this.isError.is_hot_error = 'block';
                } else{
                    httpClient.POST('category',
                        {
                                type_id:type_id,
                                parent_id:parent_id,
                                cn_name:cn_name,
                                en_name:en_name,
                                off_line:off_line,
                                is_hot:is_hot,
                                displayindex:displayindex
                        },
                        function () {
                            //success
                            $("#add-category").modal('hide');
                            $("#prompt").modal('show');
                            $this.promptTitle = '提示';
                            $this.promptBody = '添加成功！';
                            var currentResource = $this.resources.find((i) => i.id === type_id);
                            $this.reloadTable(currentResource.type_name);
                        },
                        function () {
                            //error
                        }
                    );
                }

            },
            //公用模块
            reloadTable:function (typeId) {
                var $this = this;
                httpClient.GET('category/search?dto.type=' + typeId,{},
                    function (data) {
                        //success
                        $this.category = data.category_list;
                        if( data.category_list[0]){
                            $this.category_list = data.category_list[0].list.sort(function (x,y) {
                                return Number(y.id)-Number(x.id);
                            });
                            $this.categorySelected = $this.category[0].type_id;
                        }

                    },
                    function () {
                        //error
                    }
                )
            }
        }
    })
});



