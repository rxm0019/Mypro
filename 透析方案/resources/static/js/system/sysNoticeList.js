/**
 * sysNoticeList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var sysNoticeList = avalon.define({
    $id: "sysNoticeList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
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
        elem: '#sysNoticeList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'sysNoticeList_search'  //指定的lay-filter
        ,conds:[
            {field: 'noticeTitle', title: '通知标题',type:'input'},
            {field: 'noticeContent', title: '通知内容',type:'input'},
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('sysNoticeList_table',{
                where:field
            });
        }
    });
}
/**
 * 查询列表事件
 */
function getList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#sysNoticeList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'sysNoticeList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.system + "/sysNotice/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'noticeTitle', title: '通知标题',align:'center'}
                ,{field: 'noticeContent', title: '通知内容',align:'center'}
                ,{field: 'startDate', title: '生效时间',align:'center'
                    ,templet: function(d){
                        return util.toDateString(d.startDate,"yyyy-MM-dd ");
                    }}
                ,{field: 'endDate', title: '失效时间',align:'center'
                    ,templet: function(d){
                        return util.toDateString(d.endDate,"yyyy-MM-dd ");
                    }}
                ,{field: 'remarks', title: '发布人',align:'center'}
                ,{field: 'createTime', title: '发布时间',align:'center'
                    ,templet: function(d){
                        return util.toDateString(d.createTime,"yyyy-MM-dd ");
                    }}
                ,{fixed: 'right',title: '操作',width: 140, align:'center'
                    ,toolbar: '#sysNoticeList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            var userId=baseFuncInfo.userInfoData.userid;
            if(layEvent === 'edit'){ //编辑
                //do something
                if (data.publisher!=userId){
                    layer.msg('你不是发布者，不能编辑该条通知', {
                        icon: 2
                        ,shade: 0.01
                        ,time:1000
                    });
                }else {
                    if(isNotEmpty(data.noticeId)){
                        saveOrEdit(data.noticeId);
                    }
                }
            }else if(layEvent === 'del'){ //删除
                if (data.publisher!=userId){
                    layer.msg('你不是发布者，不能删除该条通知', {
                        icon: 2
                        ,shade: 0.01
                        ,time:1000
                    });
                }else {
                    layer.confirm('确认删除所选数据吗？', function(index){
                        // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        //向服务端发送删除指令
                        if(isNotEmpty(data.noticeId)){
                            var ids=[];
                            ids.push(data.noticeId);
                            del(ids);
                        }
                    });
                }
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id){
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="添加";
        url=$.config.server+"/system/sysNoticeEdit";
    }else{  //编辑
        title="编辑";
        url=$.config.server+"/system/sysNoticeEdit?id="+id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:580,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    table.reload('sysNoticeList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
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
        url: $.config.services.system+"/sysNotice/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功",500);
            var table = layui.table; //获取layui的table模块
            table.reload('sysNoticeList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysNoticeList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条数据");
        return false;
    }else{
        var userId=baseFuncInfo.userInfoData.userid;
        var flag=0;
        var name="";
        $.each(data,function(i,item){
            if(item.publisher!=userId){
                flag=1;
                name=item.noticeTitle;
                return false;
            }
        });
        if(flag==1){
            warningToast('您不是标题为“'+name+'”通知的发布者，不能删除该通知');
            return false;
        }
        layer.confirm('确认删除所选数据吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.noticeId);
            });
            del(ids);
        });
    }
}

