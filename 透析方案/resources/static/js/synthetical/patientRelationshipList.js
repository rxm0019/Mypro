/**
 * 综合管理 - 患者关系管理
 * @Author Freya
 * @version: 1.0
 * @Date 2020/9/9
 */
var patientRelationshipList = avalon.define({
    $id: "patientRelationshipList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    serverTime: new Date()
});
layui.use(['index'], function () {
    avalon.ready(function () {
        // 初始化搜索框
        initSearch();

        getPatientList();  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#patientRelationshipList_search', //指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'patientRelationshipList_search',  //指定的lay-filter
        conds: [
            {field: 'patientName', title: '姓名：', type: 'input'},
            {field: 'mobilePhone', title: '个人手机：', type: 'input'},
            {field: 'patientRecordNo', title: '病历号：', type: 'input'},
            {field: 'customerType', title: '客户类型：', type: 'select', data: getSysDictByCode("CustomerType", true)},
        ]
        ,done:function(filter,data){
        //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
        //...
        }
        ,search: function (data) {
            // 重新查询Table
            layui.table.reload('patientRelationshipList_table', {
                where: data.field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getPatientList() {
    var param = {};
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patientRelationshipList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patientRelationshipList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPatientInfo/list.do",
            where: param,
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'},  //开启编辑框
                { fixed: 'left', type: 'numbers', title: '序号', width: 60 },  //序号
                { fixed: 'left', field: 'patientRecordNo', title: '病历号', minWidth: 120, align: 'center' },
                { fixed: 'left', field: 'patientName', title: '姓名', align: 'center', minWidth: 100 },
                { field: 'gender', title: '性别', align: 'center', templet: function (row) { return getSysDictName("Sex", row.gender); } },
                { field: 'birthday', title: '出生日期', minWidth: 180, align: 'center'
                    ,templet: function(d){
                        return d.birthday == null ? '' : util.toDateString(d.birthday,"yyyy-MM-dd");
                    }},
                { field: 'mobilePhone', title: '个人手机', minWidth: 120, align: 'center' },
                { field: 'customerType', title: '客户类型', align: 'center', minWidth: 100, templet: function (row) { return getSysDictName("CustomerType", row.customerType); } },
                { fixed: 'right', title: '操作', minWidth: 120, align: 'center', toolbar: '#patientRelationshipList_bar' }
            ]],
        },
        // 监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            //查看
            if(layEvent === 'detail'){
                if(isNotEmpty(data.patientId)){
                    saveOrEdit(data.patientId, layEvent,true);
                }
                //do somehing
            }else if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.patientId)){
                    saveOrEdit(data.patientId, layEvent,false);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.patientId)){
                        var ids=[];
                        ids.push(data.patientId);
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
function saveOrEdit(id, layEvent, readonly){
    var url="";
    var title="";
    //id为空,新增操作
    if(isEmpty(id)){
        title="新增";
        url=$.config.server+"/synthetical/patientRelationshipEdit";
    }else{  //编辑
        if(layEvent == 'edit'){
            title="编辑";
        }else {
            title="详情";
        }
        url=$.config.server+"/synthetical/patientRelationshipEdit?id="+id+ "&layEvent=" + layEvent;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:700,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly: readonly, // true：查看 | false：编辑
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patientRelationshipList_table'); //重新刷新table
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
        url: $.config.services.dialysis + "/patPatientInfo/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('patientRelationshipList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    //获取layui的table模块
    var table = layui.table;
    //test即为基础参数id对应的值
    var checkStatus = table.checkStatus('patientRelationshipList_table');
    //获取选中行的数据
    var data=checkStatus.data;
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.patientId);
            });
            del(ids);
        });
    }
}


