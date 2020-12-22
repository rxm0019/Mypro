/**
 * jobList.jsp的js文件，排程执行设置相关操作
 */
//定义avalon
var jobList = avalon.define({
    $id: "jobList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    roleId:[]  //搜索条件的roleid集合
});

layui.use(['index'], function() {
    //首先加载layui的组件
    avalon.ready(function () {
        //所有的入口事件写在这里
        initSearch(); //初始化搜索框
        getList();  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#jobList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'jobList_search'  //指定的lay-filter
        ,conds:[
            // {field: 'loginId', title: '登陆账号'},
            // {field: 'userName', title: '用户名字'},
            {field: 'jobClassName', title: '排程功能',type:'select',data:getSysDictByCode("job_class",true)},
            {field: 'sex', title: '频率类别',type:'select',data:getSysDictByCode("job_type",true)},

            {field: 'status', title: '状态',type:'select',data:getSysDictByCode("sys_status",true)}
            // {field: 'updateTime', title: '更新日期',type:'date_range'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            //field.roleId=jobList.roleId.join(",");
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('jobList_table',{
                where:field
            });
        }
    });
}
//获取用户角色列表
function getAllRoles() {
    var dicts=[];
    dicts.push({value:"",name:"全部"});
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysRole/getLists.do",
        dataType: "json",
        async:false,
        done: function(data){
            if(data!=null&&data!=""){
                for(var i=0;i<data.length;i++){
                    dicts.push({value:data[i].id,name:data[i].roleName});
                }
            }
        }
    });
    return dicts;
}
/**
 * 获取列表事件
 */
function getList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#jobList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'jobList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.system + "/sysUser/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:40 }  //序号
                ,{field: 'loginId', title: '登陆账号', sortField:'login_id', align:'center'}
                ,{field: 'userName', title: '用户名字', sortField:'user_name', align:'center'}
                ,{field: 'roleName', title: '用户角色', align:'center'}
                ,{field: 'sex', title: '性别', align:'center',sortField:'sex'
                    ,templet: function(d){
                        return getSysDictName("sys_sex",d.sex);
                    }}
                ,{field: 'email', title: '邮箱'}
                ,{field: 'dataStatus', title: '状态', align:'center', sortField:'dataStatus'
                    ,templet: function(d){
                        return getSysDictName("sys_status",d.dataStatus);
                    }}
                ,{field: 'updateTime', title: '更新时间',sortField:'update_time_'
                    ,templet: function(d){
                        return util.toDateString(d.updateTime,"yyyy-MM-dd HH:mm:ss");
                    }, align:'center'}
                ,{fixed: 'right',title: '操作',width: 180, align:'center'
                    ,toolbar: '#jobList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'detail'){ //查看
                if(isNotEmpty(data.id)){
                    resetPwd(data.id);
                }
                //do somehing
            } else if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.id)){
                    saveOrEdit(data.id);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确认删除所选数据吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.id)){
                        var ids=[];
                        ids.push(data.id);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id,readonly){
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="添加";
        url=$.config.server + "/system/sysUserEdit";
    }else{  //编辑
        title="编辑";
        url=$.config.server + "/system/sysUserEdit?id="+id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:550,  //弹框自定义的高度，方法会自动判断是否超过高度
        readonly:readonly,  //弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功",500);
                    var table = layui.table; //获取layui的table模块
                    table.reload('jobList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 重设密码
 * @param id
 * @param readonly
 */
function resetPwd(id){
    var url="";
    var title="";
    title="重设密码";
    url=$.config.server + "/system/sysUserReset?id="+id;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:460, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:320,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("修改成功",500);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    //top.location.href=$.config.server+ "/login"  ;
                }
            );
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysUser/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功",500);
            var table = layui.table; //获取layui的table模块
            table.reload('jobList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('jobList_table'); //test即为基础参数id对应的值
    //console.log(checkStatus.data);//获取选中行的数据
    //console.log(checkStatus.data.length);//获取选中行数量，可作为是否有选中行的条件
    //console.log(checkStatus.isAll );//表格是否全选
    var data=checkStatus.data;
    if(data.length==0){
        warningToast("请至少选择一条数据");
        return false;
    }else{
        var userId=baseFuncInfo.userInfoData.userid;
        var flag=0;
        var name="";
        $.each(data,function(i,item){
            if(item.createBy!=userId){
                flag=1;
                name=item.loginId;
                return false;
            }
        });
        if(flag==1){
            warningToast('您没有删除'+name+'账号的权限，请联系创建该账号的人员');
            return false;
        }
        layer.confirm('确认删除所选数据吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.id);
            });
            del(ids);
        });
    }
}

function getSysRoleList(obj){
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getRoleLists.do",
        data:{},
        dataType: "json",
        done:function(data){
            var setting={
                id: 'id', //新增自定义参数，同ztree的data.simpleData.idKey
                pId: 'parentId', //新增自定义参数，同ztree的data.simpleData.pIdKey
                name:'roleName',  //新增自定义参数，同ztree的data.key.name
                //radio:true //新增自定义参数，开启radio
                checkbox:true, //新增自定义参数，开启checkbox
                done:function(treeObj){
                    //新增自定义函数,完成初始化加载后的事件，比如可做一些反勾选操作
                    $.each(data,function(i,item){
                        if($.inArray(item.id, jobList.roleId)>-1){
                            var node = treeObj.getNodeByParam("id",item.id,null);
                            if(node!=null){
                                treeObj.checkNode(node, true, false);
                                treeObj.selectNode(node);
                            }
                        }
                    });
                }
                //其它具体参数请参考ztree文档
            };
            //加载ztree弹框树
            _initLayOpenZtree(setting,data,function(nodes){
                //确定事件，返回选择的nodes节点列表
                var ids=[];
                var names=[];
                if(nodes!=undefined&&nodes!=null){
                    $.each(nodes,function(i,item){
                        ids.push(item.id);
                        names.push(item.roleName)
                    });
                }
                jobList.roleId=ids;
                $(obj).val(names.join(","));
            });
        }
    });
}
