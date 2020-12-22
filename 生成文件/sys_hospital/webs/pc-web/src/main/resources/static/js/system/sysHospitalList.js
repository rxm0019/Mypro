/**
 * sysHospitalList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var sysHospitalList = avalon.define({
    $id: "sysHospitalList",
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
        elem: '#sysHospitalList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'sysHospitalList_search'  //指定的lay-filter
        ,conds:[
            {field: 'hospitalId', title: 'UUID',type:'input'}
            ,{field: 'hospitalNo', title: '中心/医院代码',type:'input'}
            ,{field: 'hospitalName', title: '中心/医院名称',type:'input'}
            ,{field: 'superior', title: '上级',type:'input'}
            ,{field: 'tel', title: '电话',type:'input'}
            ,{field: 'address', title: '地址',type:'input'}
            ,{field: 'isPrice', title: '医嘱显示价格:Y:是 =>显示；N:否=>不显示',type:'input'}
            ,{field: 'isAutomatic', title: '是否自动发药:Y:是；N:否',type:'input'}
            ,{field: 'isLog', title: '记录透析痕迹是否需要记录:Y:是；N:否',type:'input'}
            ,{field: 'days', title: '提前警示天数',type:'input'}
            ,{field: 'openingDate', title: '启用日期',type:'date'}
            ,{field: 'accountsName', title: '公众号名称',type:'input'}
            ,{field: 'appid', title: '公众号appId',type:'input'}
            ,{field: 'secret', title: '公众号appSecret',type:'input'}
            ,{field: 'token', title: '公众号token',type:'input'}
            ,{field: 'aeskey', title: '公众号aesKey',type:'input'}
            ,{field: 'remark', title: '备注',type:'input'}
            ,{field: 'createBy', title: '创建人',type:'input'}
            ,{field: 'createTime', title: '创建时间',type:'date'}
            ,{field: 'updateBy', title: '更新人',type:'input'}
            ,{field: 'updateTime', title: '更新时间',type:'date'}
            ,{field: 'dataStatus', title: '数据状态（0-启用，1-停用，2-删除）',type:'input'}
            ,{field: 'dataSync', title: '数据同步状态（0-未同步，1-已同步）',type:'input'}
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
            table.reload('sysHospitalList_table',{
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
        elem: '#sysHospitalList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'sysHospitalList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: getRootPath() + "sysHospital/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'hospitalId', title: 'UUID',sort: true,sortField:'sh_.hospital_id'}
                ,{field: 'hospitalName', title: '中心/医院名称',sort: true,sortField:'sh_.hospital_name'}
                ,{field: 'superior', title: '上级',sort: true,sortField:'sh_.superior'}
                ,{field: 'tel', title: '电话',sort: true,sortField:'sh_.tel'}
                ,{field: 'address', title: '地址',sort: true,sortField:'sh_.address'}
                ,{field: 'isPrice', title: '医嘱显示价格:Y:是 =>显示；N:否=>不显示',sort: true,sortField:'sh_.is_price'}
                ,{field: 'isAutomatic', title: '是否自动发药:Y:是；N:否',sort: true,sortField:'sh_.is_automatic'}
                ,{field: 'isLog', title: '记录透析痕迹是否需要记录:Y:是；N:否',sort: true,sortField:'sh_.is_log'}
                ,{field: 'days', title: '提前警示天数',align:'right',sort: true,sortField:'sh_.days'}
                ,{field: 'openingDate', title: '启用日期',align:'center',sort: true,sortField:'sh_.opening_date'
                    ,templet: function(d){
                    return util.toDateString(d.openingDate,"yyyy-MM-dd");
                }}
                ,{field: 'accountsName', title: '公众号名称',sort: true,sortField:'sh_.accounts_name'}
                ,{field: 'appid', title: '公众号appId',sort: true,sortField:'sh_.appid'}
                ,{field: 'secret', title: '公众号appSecret',sort: true,sortField:'sh_.secret'}
                ,{field: 'token', title: '公众号token',sort: true,sortField:'sh_.token'}
                ,{field: 'aeskey', title: '公众号aesKey',sort: true,sortField:'sh_.aeskey'}
                ,{field: 'remark', title: '备注',sort: true,sortField:'sh_.remark'}
                ,{field: 'createBy', title: '创建人',sort: true,sortField:'sh_.create_by_'}
                ,{field: 'createTime', title: '创建时间',align:'center',sort: true,sortField:'sh_.create_time_'
                    ,templet: function(d){
                    return util.toDateString(d.createTime,"yyyy-MM-dd");
                }}
                ,{field: 'updateBy', title: '更新人',sort: true,sortField:'sh_.update_by_'}
                ,{field: 'updateTime', title: '更新时间',align:'center',sort: true,sortField:'sh_.update_time_'
                    ,templet: function(d){
                    return util.toDateString(d.updateTime,"yyyy-MM-dd");
                }}
                ,{field: 'dataStatus', title: '数据状态（0-启用，1-停用，2-删除）',sort: true,sortField:'sh_.data_status'}
                ,{field: 'dataSync', title: '数据同步状态（0-未同步，1-已同步）',sort: true,sortField:'sh_.data_sync'}
                ,{fixed: 'right',title: '操作',width: 140, align:'center'
                    ,toolbar: '#sysHospitalList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.hospitalId)){
                    saveOrEdit(data.hospitalId);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确认删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.hospitalId)){
                        var ids=[];
                        ids.push(data.hospitalId);
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
function saveOrEdit(id){
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=getRootPath()+"sysHospital/sysHospitalEdit";
    }else{  //编辑
        title="编辑";
        url=getRootPath()+"sysHospital/sysHospitalEdit?id="+id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:500,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    table.reload('sysHospitalList_table'); //重新刷新table
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
        url: getRootPath()+"sysHospital/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功",500);
            var table = layui.table; //获取layui的table模块
            table.reload('sysHospitalList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysHospitalList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确认删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.hospitalId);
            });
            del(ids);
        });
    }
}

