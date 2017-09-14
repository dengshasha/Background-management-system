/**
 * Created by Melody.Deng on 2017/1/10.
 */
    var app = new Vue({
        el:'#page-wrapper' ,
        data:{
            start:0,
            length:5,
            imageList:[],
            projectList:[],
            projectId:1,
            imageTotal:0,//图片列表总数
            selected:'',//选中项目
            imgUrl:'images/detail.png',//上传图片路径
            newProjectName:'',//新建项目名称
            promptTitle:'',//模态框提示框标题
            promptBody:'',//模态框提示框内容
            projectName:'',//添加图片模态框获取到的当前项目名称
            imgDescription:'',//添加图片模态框图片描述
            isError:{
                project_error:'none',
                description_error:'none',
                upload_img_error:'none'
            }
        },
        mounted:function () {
            var $this = this;
            httpClient.GET('system/project',{},
                function (data) {
                    //success
                    $this.projectList = data.data;
                    $this.projectId = $this.projectList[0].id;
                    $this.selected = $this.projectList[0].id;//初始化项目列表，默认选中第一条
                    $this.queryProductList(1);
                },
                function () {
                    //error
                }
            );


        },
        methods:{
            chooseProject:function () {
                var $this = this;
                $this.queryProductList(1);
            },
            //公用模块
            queryProductList:function (pageNumber) {
                var $this=this;
                $this.projectId =  $this.selected;
                httpClient.GET('system/image?dto.project_id='+ $this.projectId +'&dto.start='+ $this.start +'&dto.length=' + $this.length,
                    {
                        //data
                    },
                    function (data) {
                        $this.imageList = data.data;
                        $this.imageTotal = data.Total;//总数
                        var pageCount = Math.ceil($this.imageTotal/$this.length);
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
                var fileName = $(event.target).val();//获取图片名称
                if(fileName){
                    var fileSize = event.target.files[0].size;//获取图片大小
                    if(!/\.(gif|jpg|jpeg|png)$/.test(fileName)){
                        $("#prompt").modal('show');
                        $this.promptTitle = '错误提示';
                        $this.promptBody = '请选择.gif,.jpg,.jpeg,.png格式的文件!';
                    }else if(fileSize > 1024 * 1024 * 4){
                        $("#prompt").modal('show');
                        $this.promptTitle = '错误提示';
                        $this.promptBody = '图片大小不能超过4M！';
                    }
                    else{
                        $.ajax({
                            url:'/getQiniuToken?fileName=' + fileName + '&slug=upload',
                            type:'get',
                            success:function (data) {
                                let formData = new FormData();
                                formData.append('token', data.token);
                                formData.append('file', $('#img_choose')[0].files[0]);
                                $.ajax({
                                    url:'http://upload.qiniu.com',
                                    type:'POST',
                                    data:formData,
                                    processData: false,
                                    contentType: false,
                                    success:function (data) {
                                        let imgNewUrl='http://upload.s.vidahouse.com/'+ data.hash;
                                        $this.imgUrl = imgNewUrl;
                                    }
                                });
                            }
                        })
                    }
                }
            },
            //添加图片
            addPicture:function () {
                var $this = this;
                var project_id = $this.selected;
                var image_uri = $this.imgUrl;
                var description = $this.imgDescription;
                if(!description || description.length > 20) {
                    $this.isError.description_error = 'block';
                }else if(image_uri == 'images/detail.png'){
                    $this.isError.upload_img_error = 'block';
                } else{
                    httpClient.POST('system/image',
                        {
                            project_id:project_id,
                            image_name:Math.random(),
                            image_uri:image_uri,
                            description:description
                        },
                        function (data) {
                            //success
                            //todo 第一步：删除表格数据
                            $this.imageList = null;
                            //todo 第二步：重新拿当前项目的0-N条数据，
                            httpClient.GET('system/image?dto.project_id='+ project_id +'&dto.start='+ app.start + '&dto.length=' + app.length,
                                {
                                    //data
                                },
                                function (data) {
                                    //success
                                    $this.imageList = data.data;
                                },
                                function (data) {
                                    //error
                                }
                            );
                            $("#add-picture").modal('hide');
                            $("#prompt").modal('show');
                            $this.promptTitle = '提示';
                            $this.promptBody = '添加成功!';
                        },
                        function () {
                            //error
                            $("#add-picture").modal('hide');
                            $("#prompt").modal('show');
                            $this.promptTitle = '错误提示';
                            $this.promptBody = '添加失败，请重试！';
                        }
                    )
                }
            },
            //添加项目
            addProject:function () {
                var $this = this;
                var projectName = $this.newProjectName;
                if(!projectName){
                    $this.isError.project_error = 'block';
                }else{
                    httpClient.POST('system/project',
                        {
                            name:projectName
                        },
                        function () {
                            //success
                            httpClient.GET('system/project',{},
                                function (data) {
                                    $this.projectList = data.data;
                                    $("#add-project").modal('hide');
                                    $("#prompt").modal('show');
                                    $this.promptTitle = '提示';
                                    $this.promptBody = '添加成功';
                                }
                            );
                        },
                        function () {
                            //error
                            $("#add-project").modal('hide');
                            $("#prompt").modal('show');
                            $this.promptTitle = '错误提示';
                            $this.promptBody = '添加失败，请重试！';
                        }
                    )
                }
            },
            //获取项目列表
            getProject:function () {
                var $this = this;
                $this.projectName = $("#project-list option:selected").text();
            },
            //替换图片
            // replacePicture:function (event) {
            //     var $this = this;
            //     var fileName = $(event.target).val();//获取图片名称
            //     if(fileName){
            //         var fileSize = $("#img_choose1")[0].files[0].size;//获取图片大小
            //         if(!/\.(gif|jpg|jpeg|png)$/.test(fileName)){
            //             $("#prompt").modal('show');
            //             $this.promptTitle = '错误提示';
            //             $this.promptBody = '请选择.gif,.jpg,.jpeg,.png格式的文件!';
            //         }else if(fileSize > 1024 * 1024 * 4){
            //             $("#prompt").modal('show');
            //             $this.promptTitle = '错误提示';
            //             $this.promptBody = '图片大小不能超过4M！';
            //         }
            //         else{
            //             $.ajax({
            //                 url:'/getQiniuToken?fileName=' + fileName + '&slug=upload',
            //                 type:'get',
            //                 success:function (data) {
            //                     let formData = new FormData();
            //                     formData.append('token', data.token);
            //                     formData.append('file', $('#img_choose1')[0].files[0]);
            //                     $.ajax({
            //                         url:'http://upload.qiniu.com',
            //                         type:'POST',
            //                         data:formData,
            //                         processData: false,
            //                         contentType: false,
            //                         success:function (data) {
            //                             let imgNewUrl='http://upload.s.vidahouse.com/'+ data.hash;
            //                             $this.imgUrl = imgNewUrl;
            //                         }
            //                     });
            //                 }
            //             })
            //         }
            //     }
            // },
            // //替换图片模态框获取图片信息
            // getOldPicture:function (picUrl,picId) {
            //     var $this = this;
            //     $this.imgUrl = picUrl;
            //     $this.imgId = picId;
            // },
            // confirmReplace:function () {
            //     var $this = this;
            //     var imageId = $this.imgId;
            //     console.log($this.imageList);
            //     var currentImg = $this.imageList.find((i) => i.id === imageId);
            //     console.log(currentImg);
            // },
        }
    });























