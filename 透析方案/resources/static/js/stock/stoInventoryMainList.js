/**
 * 库存盘点单
 * @author: Rain
 * @version: 1.0
 * @date: 2020/09/05
 */
var stoInventoryMainList = avalon.define({
    $id: "stoInventoryMainList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    warehouseList: [],
    status: '0', //盘点状态,0.新增 1.开始,2.结束  开始盘点后不允许再修改
    hide: true
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        getWarehouseList();
        avalon.scan();
    });
});

/**
 * 获取仓库下拉值
 */
function getWarehouseList() {
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basWarehouse/getLists.do",
        dataType: "json",
        async: false,
        done: function (data) {
            stoInventoryMainList.warehouseList = data;
            layui.form.render();
        }
    });
}

/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#stoInventoryMainList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'stoInventoryMainList_search'  //指定的lay-filter
        ,conds:[
            {field: 'inventoryNo', title: '盘点单号：',type:'input'}
            ,{field: 'name', title: '盘点名称：',type:'input'}
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
            table.reload('stoInventoryMainList_table',{
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
        elem: '#stoInventoryMainList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'stoInventoryMainList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/stoInventoryMain/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'inventoryNo', title: '盘点单号', align: 'center'}
                , {field: 'name', title: '盘点名称', align: 'center'}
                , {
                    field: 'houseNo', title: '盘点仓库', align: 'center',
                    templet: function (d) {
                        return getHouse(d.houseNo);
                    }
                }, {
                    field: 'status', title: '盘点状态', align: 'center',width:140,
                    templet: function (d) {
                        return getStatus(d.status);
                    }
                }
                , {
                    fixed: 'right', title: '操作', width: 240, align: 'center'
                    ,toolbar: '#stoInventoryMainList_bar'}
            ]],
            done: function (res, curr, count) {
                if (res.bizData.length > 0) {
                    stoInventoryMainList.status = res.bizData[0].status;
                    stoInventoryMainList.hide = false;
                }

            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.inventoryMainId)){
                    saveOrEdit(data.inventoryMainId);
                }
            } else if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.inventoryMainId)){
                        var ids=[];
                        ids.push(data.inventoryMainId);
                        del(ids);
                    }
                });
            } else if (layEvent === 'setCheck') { //设置
                setCheck(data.inventoryNo, data.houseNo);

            } else if (layEvent === 'check') {
                layer.confirm('开始盘点后，数据将不能再做修改，确定要开始盘点吗？', function (index) {
                    check(data.inventoryNo,data.houseNo);
                });

            }
        }
    });
}


/**
 * 开始盘点
 */
function check(inventoryNo,houseNo) {

    var param = {
        "inventoryNo": inventoryNo,
        "houseNo":houseNo
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/stoInventoryMain/setCheck.do",
        data: param,  //必须字符串后台才能接收list,
        dataType: "json",
        done: function (data) {
            successToast("操作成功");
            var table = layui.table; //获取layui的table模块
            table.reload('stoInventoryMainList_table'); //重新刷新table
        }
    });
}

/**
 * 设置盘点物料
 * @param inventoryNo
 * @param houseNo
 */
function setCheck(inventoryNo, houseNo) {
    var title = "盘点物料";
    var hide = stoInventoryMainList.status === '0' ? false : true;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: $.config.server + "/stock/stoInventorySetCheckList?inventoryNo=" + inventoryNo + "&houseNo=" + houseNo + "&hide=" + hide,  //弹框自定义的url，会默认采取type=2
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: true // true：查看 | false：编辑
    });
}

/**
 * 获取仓库
 */
function getHouse(houseNo) {
    var list = stoInventoryMainList.warehouseList;
    var house = "";
    if (houseNo !== "" && houseNo !== null) {
        var houseNoList = houseNo.split(",");
        for (var i in list) {
            for (var j in houseNoList) {
                if (list[i].warehouseId === houseNoList[j]) {
                    house += list[i].houseName + ",";
                    break;
                }
            }
        }
    }
    if (house !== "") {
        house = house.substr(0, house.length - 1);
    }
    return house;
}

/**
 * 获取盘点状态
 */
function getStatus(status) {
    if (status === "0") {
        return "新增盘点单";
    } else if (status === "1") {
        return "盘点开始";
    } else {
        return "盘点结束";
    }
}

/**
 * 获取单个实体
 */
function saveOrEdit(id){
    var url="";
    var title="";
    var readonly = stoInventoryMainList.status === '0' ? false : true;
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url = $.config.server + "/stock/stoInventoryMainEdit";
        readonly = false;
    }else{  //编辑
        title="编辑";
        url = $.config.server + "/stock/stoInventoryMainEdit?id=" + id + "&readonly=" + readonly;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width: 600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 300,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly: readonly,
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
                    table.reload('stoInventoryMainList_table'); //重新刷新table
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
        url: $.config.services.pharmacy + "/stoInventoryMain/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            stoInventoryMainList.hide = true;
            var table = layui.table; //获取layui的table模块
            table.reload('stoInventoryMainList_table'); //重新刷新table
        }
    });
}


