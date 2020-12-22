/**
 * sysFaceEquipmentList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var sysFaceEquipmentList = avalon.define({
    $id: "sysFaceEquipmentList",
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
    //设定定时器重新刷新页面
    setInterval(getList,30000);
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#sysFaceEquipmentList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'sysFaceEquipmentList_search'  //指定的lay-filter
        ,conds:[
            {field: 'equipmentName', title: '设备名称：',type:'input'}
            ,{field: 'equipmentIp', title: '内网IP：',type:'input'}
            ,{field: 'hospitalNo', title: '医院代码：',type:'input'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('sysFaceEquipmentList_table',{
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
        elem: '#sysFaceEquipmentList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'sysFaceEquipmentList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.system + "/sysFaceEquipment/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'equipmentName', title: '设备名称'}
                ,{field: 'equipmentIp', title: '内网IP',align:'right'}
                ,{field: 'equipmentPort', title: '设备端口号',align:'right'}
                ,{field: 'equipmentUser', title: '设备登录名',align:'right'}
                ,{field: 'equipmentPwd', title: '设备登录密码',align:'right'}
                ,{field: 'hospitalNo', title: '医院代码'}
                ,{field: 'sendStatus', title: '下发是否完成'}
                ,{field: 'remarks', title: '备注'}
                ,{fixed: 'right',title: '操作',width: 140, align:'center'
                    ,toolbar: '#sysFaceEquipmentList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'sendFace'){ //人脸下发
                debugger
                //do something
                if(isNotEmpty(data.equipmentId)){
                    batSendFace(data);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确认删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.equipmentId)){
                        var ids=[];
                        ids.push(data.equipmentId);
                        del(ids);
                    }
                });
            }
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
        url: $.config.services.system + "/sysFaceEquipment/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('sysFaceEquipmentList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysFaceEquipmentList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.equipmentId);
            });
            del(ids);
        });
    }
}

/**
 * 下发人脸
 */
function batSendFace(dataTable){
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysFaceEquipment/sendFace.do",
        dataType: "json",
        contentType: "application/json", // 指定这个协议很重要
        data: JSON.stringify(dataTable), //只有这一个参数，json格式，后台解析为实体，后台可以直接用
        done:function (data) {
            var table = layui.table; //获取layui的table模块
            table.reload('sysFaceEquipmentList_table'); //重新刷新table
        }
    })
}

/**
 * 下发人脸
 */
function sendAllFace(dataTable){
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysFaceEquipment/sendAllFace.do",
        dataType: "json",
        contentType: "application/json", // 指定这个协议很重要
        data: JSON.stringify(dataTable), //只有这一个参数，json格式，后台解析为实体，后台可以直接用
        done:function (data) {
            var table = layui.table; //获取layui的table模块
            table.reload('sysFaceEquipmentList_table'); //重新刷新table
        }
    })


}

