/**
 * 处方明细的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author anders
 * @date 2020-09-14
 * @version 1.0
 */
var diaPrescriptionItemList = avalon.define({
    $id: "diaPrescriptionItemList",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,queryMode: '0'   //查询模式  默认分类
    ,diaRecordId: ''  // 透析记录id
    ,showBtn: true    //显示按钮
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        diaPrescriptionItemList.diaRecordId = GetQueryString('diaRecordId');
        diaPrescriptionItemList.showBtn = GetQueryString("readonly") !== 'Y';
        getList();  //查询列表
        monitorRadio();
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList(href) {
    var url = "/diaPrescriptionItem/list.do";
    var height = 'full-90';
    if (isNotEmpty(href)) {
        url = "/diaPrescriptionItem/" + href;
        height = 'full-42';
    }
    var param = {
        diaRecordId: diaPrescriptionItemList.diaRecordId
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#diaPrescriptionItemList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'diaPrescriptionItemList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:height, //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + url, // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'materielName', title: '名称',width:250}
                ,{field: 'batchNo', title: '批号',align:'center',hide:diaPrescriptionItemList.queryMode==='1'}
                ,{field: 'specifications', title: '规格'}
                ,{field: 'type', title: '类型',align:'center',
                    templet: function (d) {
                        return getSysDictName('materielType', d.type);
                    }
                }
                ,{field: 'manufactor', title: '生产厂家'}
                ,{field: 'materielNo', title: '编码',align:'center'}
                ,{field: 'useNumber', title: '数量',align:'center'}
                ,{field: 'basicUnit', title: '单位',align:'center'
                    ,templet: function (d) {
                        return getSysDictName('purSalesBaseUnit', d.basicUnit);
                    }
                }
                ,{field: 'userName', title: '添加者',align:'center'}
                ,{fixed: 'right',title: '操作',width: 140, align:'center',hide:diaPrescriptionItemList.queryMode==='1' || !diaPrescriptionItemList.showBtn
                    ,toolbar: '#diaPrescriptionItemList_bar'}
            ]],
            done: function (res) {
                if (res.bizData.length > 0) {
                    window.parent.showTabBadgeDot(false);
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
                if(isNotEmpty(data.prescriptionItemId)){
                    var manufactor = isNotEmpty(data.manufactor) ? data.manufactor : '';
                    saveOrEdit(data.prescriptionItemId,data.materielName,manufactor);
                }
            }else if(layEvent === 'delete'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.prescriptionItemId)){
                        del(data.prescriptionItemId,data.materielNo, data.useNumber, data.batchNo, data.stockInfoId, data.type);
                    }
                });
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id,materielName,manufactor){
    var url="";
    var title="";
    var width;
    var height;
    if(isEmpty(id)){  //id为空,新增操作
        title="添加处方明细";
        width = 1200;
        height = 700;
        url=$.config.server+"/dialysis/addPrescriptionList?diaRecordId=" + diaPrescriptionItemList.diaRecordId;
    }else{  //编辑
        title="编辑";
        width = 450;
        height = 400;
        url=$.config.server+"/dialysis/diaPrescriptionItemEdit?id=" + id + '&diaRecordId=' + diaPrescriptionItemList.diaRecordId;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:width, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:height,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin,layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    //刷新应收单上传状态
                    if (window.parent.onRefreshRecordOption) { window.parent.onRefreshRecordOption(); }
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('diaPrescriptionItemList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 单选按钮监听事件
 */
function monitorRadio() {
    var form = layui.form;
    form.on('radio(queryMode)', function(data){
        var value = data.value;//被点击的radio的value值
        if (value === '0') {      //查询模式  分类
            diaPrescriptionItemList.queryMode = '0';
            getList('list.do');
        } else if (value === '1') {   //查询模式汇总
            diaPrescriptionItemList.queryMode = '1';
            getList('gatherAll.do');
        }
    });
}

/**
 * 删除事件
 * @param id
 * @param materielNo
 * @param useNumber
 * @param batchNo
 * @param stockInfoId
 * @param type
 */
function del(id, materielNo, useNumber, batchNo, stockInfoId, type){
    var param={
        prescriptionItemId:id,
        materielNo: materielNo,
        useNumber: useNumber,
        batchNo: batchNo,
        stockInfoId: stockInfoId,
        type: type,
        diaRecordId: diaPrescriptionItemList.diaRecordId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaPrescriptionItem/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            //刷新应收单上传状态
            if (window.parent.onRefreshRecordOption) { window.parent.onRefreshRecordOption(); }
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('diaPrescriptionItemList_table'); //重新刷新table
        }
    });
}

