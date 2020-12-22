/**
 * stoDispensingList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 发药管理。
 * Chauncey
 * 2020-10-09
 */
var stoDispensingList = avalon.define({
    $id: "stoDispensingList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    statusSelect:[ //0-未发药，1-已发药 2-已退药
        {"name":"全部","value":""}
        ,{"name":"未发药","value":0}
        ,{"name":"已发药","value":1}
        ,{"name":"已退药","value":2}],
    selectAllList:[], //根据右边勾选查询的数据
    patientList:[],//总览的基本资料集合
    durgModelList:[],//总览的药品清单集合
    consumablesModelList:[],//总览的耗材清单集合
    treatmentShow: true,//发药-治疗区按钮控制
    deliveryShow: true,//发药-出库按钮控制
    withDrawalShow:true,//退药 按钮控制
    materialIssueStatus:"",//物料发放状态
    sendLoaction:"", //发放位置   0 出库，1治疗区
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        tabEvent();//页签切换
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    var statusTemplet =
        '<select name="status" ms-duplex="statusSelect" lay-filter="status">';
        for(var index in stoDispensingList.statusSelect){
            statusTemplet += '<option value='+stoDispensingList.statusSelect[index].value+
                '>' + stoDispensingList.statusSelect[index].name + '</option>'
        }
    statusTemplet +='</select>';
    _initSearch({
        elem: '#stoDispensingList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'stoDispensingList_search'  //指定的lay-filter
        ,conds:[
            {field: 'selectDate', title: '日期:',type:'date_range'}
            ,{field: 'status', title: '状态：',type:'select',templet:statusTemplet}
            ,{field: 'patientId', title: '患者:',type:'input'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var util=layui.util;
            layui.form.val("stoDispensingList_search", {selectDate_begin: util.toDateString(new Date(),"yyyy-MM-dd")});
            layui.form.val("stoDispensingList_search", {selectDate_end: util.toDateString(new Date(),"yyyy-MM-dd")});
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('stoDispensingList_table',{
                where:field
            });
        }
    });
}


function ProcTableData(){
    stoDispensingList.patientList = [];
    stoDispensingList.durgModelList =[];
    stoDispensingList.consumablesModelList = [];
    //循环串接数据处理
    $.each(stoDispensingList.selectAllList, function (index, item) {
        if(null != item.patient){
            stoDispensingList.patientList.push(item.patient);
        }
        if(item.drugList.length>0){
            if(stoDispensingList.durgModelList.length ==0){
                stoDispensingList.durgModelList = item.drugList
            }else{
                stoDispensingList.durgModelList = stoDispensingList.durgModelList.concat(item.drugList);
            }
        }
        if(item.consumablesList.length>0){
            if(stoDispensingList.consumablesModelList.length == 0){
                stoDispensingList.consumablesModelList = item.consumablesList
            }else{
                stoDispensingList.consumablesModelList = stoDispensingList.consumablesModelList.concat(item.consumablesList);
            }
        }
    })
}

/**
 * 重载总览表格
 * @constructor
 */
function ReloadRenderTable(){
    layui.table.reload("stoAllPatientList_table",{data:stoDispensingList.patientList});
    layui.table.reload("stoAllDrugList_table",{data:stoDispensingList.durgModelList});
    layui.table.reload("stoAllConsumablesList_table",{data:stoDispensingList.consumablesModelList});
}


/**
 * 监听tab
 */
function tabEvent() {
    layui.use('element', function () {
        var element = layui.element;
        //监听Tab切换，以改变地址hash值
        element.on('tab(patOrderTab)', function () {
            var tabId = this.getAttribute('lay-id');   //获取选项卡的lay-id
            if (tabId === 'details') {
            } else if (tabId === 'overview') {
                //初始化
                ProcTableData();
                //渲染总览基本资料
                _layuiTable({
                    elem: '#stoAllPatientList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                    filter:'stoAllPatientList_table', ////必填，指定的lay-filter的名字
                    //执行渲染table配置
                    render:{
                        //height:'full-600', //table的高度，页面最大高度减去差值
                        cellMinWidth: 100, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                        totalRow: true,
                        cols: [[ //表头
                            {type: 'numbers', title: '序号',width:60 }  //序号
                            ,{field: 'patientName', title: '患者姓名'}
                            ,{field: 'gender', title: '性别',align: 'center',width:60,
                                templet: function(d){
                                    //返回数据字典的名称
                                    return getSysDictName("Sex",d.gender);
                            }}
                            ,{field: 'age', title: '年龄',align: 'center',width:60}
                            ,{field: 'doctorName', title: '医生姓名',align: 'center'}
                            ,{field: 'socialSecurityNo', title: '医保卡号',width:150}
                            ,{field: 'patientRecordNo', title: '病历号'}
                            ,{field: 'insuranceTypes', title: '收费类型', unresize: true, totalRowText: '小计',
                                templet: function(d){
                                    //返回数据字典的名称
                                    return findInsuranceNm(d.insuranceTypes);
                            }}
                            ,{field: 'westernMedicineFee', title: '西药费',align: 'right', totalRow: true}
                            ,{field: 'chineseMedicineFee', title: '中成药费',align: 'right', totalRow: true}
                            ,{field: 'consumablesCost', title: '耗材费用',align: 'right',totalRow: true}
                        ]],
                        data:stoDispensingList.patientList,
                        page: false,
                        limit: Number.MAX_VALUE, // 数据表格默认全部显示
                    },
                });
                //渲染总览药品清单
                _layuiTable({
                    elem: '#stoAllDrugList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                    filter:'stoAllDrugList_table', ////必填，指定的lay-filter的名字
                    //执行渲染table配置
                    render:{
                        //height:'full-600', //table的高度，页面最大高度减去差值
                        cellMinWidth: 100, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                        cols: [[ //表头
                            {type: 'numbers', title: '序号',width:60 }  //序号
                            ,{field: 'materielNo', title: '药品编号',width:120}
                            ,{field: 'materielName', title: '药品名称',width:250}
                            ,{field: 'specifications', title: '规格'}
                            ,{field: 'placeOfOrigin', title: '产地',width:200}
                            ,{field: 'singleMeasurement', title: '单次计量'}
                            ,{field: 'singleMeasurementUnit', title: '单次计量单位',width:180
                                // ,templet: function(d){
                                //     //返回数据字典的名称
                                //     return getSysDictName("purSalesBaseUnit",d.singleMeasurementUnit);
                                // }
                            }
                            ,{field: 'quantity', title: '数量'}
                            ,{field: 'quantityUnit', title: '数量单位'
                                ,templet: function(d){
                                    //返回数据字典的名称
                                    return getSysDictName("purSalesBaseUnit",d.quantityUnit);
                                }}
                            ,{field: 'valuationPrice', title: '计价单价',align: 'right'}
                            ,{field: 'valuationNumber', title: '计价数量'}
                            ,{field: 'valuationUnit', title: '计价单位'}
                            ,{field: 'usage', title: '用法'
                                ,templet: function(d){
                                    //返回数据字典的名称
                                    return getSysDictName("Route",d.usage);
                                }
                            }
                            ,{field: 'totalPrice', title: '总金额',align: 'right'}
                        ]],
                        data:stoDispensingList.durgModelList,
                        page: false,
                        limit: Number.MAX_VALUE, // 数据表格默认全部显示
                    }
                });
                //渲染总览耗材清单
                _layuiTable({
                    elem: '#stoAllConsumablesList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                    filter:'stoAllConsumablesList_table', ////必填，指定的lay-filter的名字
                    //执行渲染table配置
                    render:{
                       // height:'full-600', //table的高度，页面最大高度减去差值
                        cellMinWidth: 100, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                        cols: [[ //表头
                            {type: 'numbers', title: '序号',width:60 }  //序号
                            ,{field: 'materielNo', title: '耗材编号'}
                            ,{field: 'materielName', title: '耗材名称',width:250}
                            /*,{field: 'specifications', title: '类型'}*/
                            ,{field: 'manufactor', title: '生产厂家',width:200}
                            ,{field: 'quantity', title: '使用数量'}
                            ,{field: 'quantityUnit', title: '使用数量单位'
                                ,templet: function(d){
                                    //返回数据字典的名称
                                    return getSysDictName("purSalesBaseUnit",d.quantityUnit);
                                }}
                            ,{field: 'valuationPrice', title: '计价单价',align: 'right'}
                            ,{field: 'valuationNumber', title: '计价数量'}
                            ,{field: 'valuationUnit', title: '计价单位'
                                ,templet: function(d){
                                    //返回数据字典的名称
                                    return getSysDictName("purSalesBaseUnit",d.valuationUnit);
                                }}
                            ,{field: 'totalPrice', title: '总金额',align: 'right'}
                        ]],
                        data:stoDispensingList.consumablesModelList,
                        page: false,
                        limit: Number.MAX_VALUE, // 数据表格默认全部显示
                    }
                });
            }
        });
    });
}

/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;

    var param = {
        selectDate_begin: util.toDateString(new Date(), "yyyy-MM-dd"),
        selectDate_end: util.toDateString(new Date(), "yyyy-MM-dd")
    };

    _layuiTable({
        elem: '#stoDispensingList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'stoDispensingList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis +  "/stoDispensing/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'dispensingNo', title: '单据编号',hide:true}
                ,{field: 'dispensingStatus', title: '是否发到治疗区',hide:true}
                ,{field: 'patientName', title: '姓名'}
                ,{field: 'patientRecordNo', title: '病历号',width:120}
                ,{field: 'status', title: '状态'
                ,templet: function(d){
                    //返回培训状态的名称
                    return findStatus(d.status);
                }}
            ]],
            done:function () {
                $('#view').attr("style","display:none;");
                $('#overviewDiv').attr("style","display:none;");
            }
        }
    });
    table.on('checkbox(stoDispensingList_table)', function(obj){
        var isall =obj.type;
        var data = obj.data; //获得当前行数据
        var list = layui.table.checkStatus('stoDispensingList_table').data;//获取所有选中的数据
        if(list.length>1){//勾选必须大于一个才进行判断
            for(var i=0;i<list.length;i++){
                if(list[0].status != list[i].status) {//判断所有状态是否相同。

                    var documnet = $(this).siblings(".layui-form-checkbox");
                    /* 需要使用关闭后的回调，所以工具类中的errorToast方法不能使用 */
                    layui.layer.msg("勾选的状态必须相同，请重新确认！", {
                        icon: 2,
                        time: 2000,
                        shade: [0.2, '#838B83'] //0.1透明度的白色背景
                    },function () {
                        documnet.click();
                    });
                    return false;
                }
            }
            selectAllData(list);
            stoDispensingList.materialIssueStatus = list[0].status;
            //选择多笔不可退药，设置判断值为空
            stoDispensingList.sendLoaction = "";

            checkDisButton();
            $('#view').attr("style","display:block;");
            $('#overviewDiv').attr("style","display:block;");
        }else if(list.length == 1){
            selectAllData(list);
            stoDispensingList.materialIssueStatus = list[0].status;
            stoDispensingList.sendLoaction = list[0].dispensingStatus;
            checkDisButton();
            $('#view').attr("style","display:block;");
            $('#overviewDiv').attr("style","display:block;");
        }else{
            stoDispensingList.treatmentShow = true;
            stoDispensingList.deliveryShow = true;
            stoDispensingList.withDrawalShow = true;
            $('#view').attr("style","display:none;");
            $('#overviewDiv').attr("style","display:none;");
        }
    })
}

//控制发药按钮
function checkDisButton() {
    //如果是已发药的，则发药按钮不可用
    if(stoDispensingList.materialIssueStatus == "1"){
        if(stoDispensingList.sendLoaction == '1'){ //发药到治疗区
            stoDispensingList.withDrawalShow = true;
        }else{
            stoDispensingList.withDrawalShow = false;
        }
        stoDispensingList.treatmentShow = false;
        stoDispensingList.deliveryShow = false;
    }else{
        stoDispensingList.treatmentShow = true;
        stoDispensingList.deliveryShow = true;
        stoDispensingList.withDrawalShow = false;
    }
}

//在Gridview中查询培训状态的名称
function findStatus(value){
    for(var key in stoDispensingList.statusSelect){
        if(stoDispensingList.statusSelect[key].value == value ){
            return stoDispensingList.statusSelect[key].name
        }
    }
}

//在Gridview中查询培训状态的名称
function findInsuranceNm(value){
    //收费类型
    var insuranceArr = value.split(',');
    var insuranceNm ="";
    insuranceArr.forEach(function (node, index) {
        insuranceNm = getSysDictName('InsuranceType', node) + '、';
    });
    return insuranceNm = insuranceNm.slice(0,insuranceNm.length-1);
}

//发药到治疗区
function dispensingTreatment(){
    var table = layui.table;
    var checkStatus = table.checkStatus("stoDispensingList_table");
    var dataTable = checkStatus.data;
    if(dataTable.length==0) {
        warningToast("请至少选择一条记录");
        return false;
    }else{
        for(var i=0;i<dataTable.length;i++){
            if(dataTable[i].status == "1"){
                warningToast("所选资料已发药，不能重复发药");
                return false;
            }
        }
        // $.ajax({
        //     type: "POST",
        //     url: $.config.services.dialysis + "/stoDispensing/dispensingTreatment.do",
        //     dataType: "json",
        //     contentType: "application/json", // 指定这个协议很重要
        //     data: JSON.stringify(dataTable), //只有这一个参数，json格式，后台解析为实体，后台可以直接用
        //     success: function (data) {
        //         if(data.code > 0){
        //             successToast("发药至治疗区成功");
        //         }
        //         var table = layui.table; //获取layui的table模块
        //         table.reload('stoDispensingList_table'); //重新刷新table
        //     }
        // })

        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/stoDispensing/dispensingTreatment.do",
            dataType: "json",
            contentType: "application/json", // 指定这个协议很重要
            data: JSON.stringify(dataTable), //只有这一个参数，json格式，后台解析为实体，后台可以直接用
            done:function (data) {
                successToast("发药至治疗区成功");
                var table = layui.table; //获取layui的table模块
                table.reload('stoDispensingList_table'); //重新刷新table
            }
        })

    }
}

//发药-出库
function dispensingDelivery(){
    var table = layui.table;
    var checkStatus = table.checkStatus("stoDispensingList_table");
    var dataTable = checkStatus.data;
    if(dataTable.length==0) {
        warningToast("请至少选择一条记录");
        return false;
    }else{
        for(var i=0;i<dataTable.length;i++){
            if(dataTable[i].status == "1"){
                warningToast("所选资料已发药，不能重复发药");
                return false;
            }
        }
        // $.ajax({
        //     type: "POST",
        //     url: $.config.services.dialysis + "/stoDispensing/dispensingDelivery.do",
        //     dataType: "json",
        //     contentType: "application/json", // 指定这个协议很重要
        //     data: JSON.stringify(dataTable), //只有这一个参数，json格式，后台解析为实体，后台可以直接用
        //     success: function (data) {
        //         if(data.code > 0){
        //             successToast("发药-出库成功");
        //         }
        //         var table = layui.table; //获取layui的table模块withDrawalShow
        //         table.reload('stoDispensingList_table'); //重新刷新table
        //     }
        // })

        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/stoDispensing/dispensingDelivery.do",
            dataType: "json",
            contentType: "application/json", // 指定这个协议很重要
            data: JSON.stringify(dataTable), //只有这一个参数，json格式，后台解析为实体，后台可以直接用
            done:function (data) {
                successToast("发药-出库成功");
                var table = layui.table; //获取layui的table模块withDrawalShow
                table.reload('stoDispensingList_table'); //重新刷新table
            }
        })

    }
}

//退药
function withDrawal(){
    var table = layui.table;
    var checkStatus = table.checkStatus("stoDispensingList_table");
    var dataTable = checkStatus.data;
    if(dataTable.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }
    if (dataTable.length > 1) {
        warningToast('只能选择一笔发药记录进行退药');
        return false;
    }
    if(dataTable.length == 1){
        if(dataTable[0].status != "1"&& dataTable[0].dispensingStatus !="1"){
            warningToast('只能退已发药治疗区的资料');
            return false;
        }else if(dataTable[0].status == "1"&& dataTable[0].dispensingStatus =="1"){
            // $.ajax({
            //     type: "POST",
            //     url: $.config.services.dialysis + "/stoDispensing/withDrawal.do",
            //     dataType: "json",
            //     contentType: "application/json", // 指定这个协议很重要
            //     data: JSON.stringify(dataTable), //只有这一个参数，json格式，后台解析为实体，后台可以直接用
            //     success: function (data) {
            //         if(data.code > 0){
            //             successToast("退药成功");
            //         }
            //         var table = layui.table; //获取layui的table模块
            //         table.reload('stoDispensingList_table'); //重新刷新table
            //     }
            // })

            _ajax({
                type: "POST",
                url: $.config.services.dialysis + "/stoDispensing/withDrawal.do",
                dataType: "json",
                contentType: "application/json", // 指定这个协议很重要
                data: JSON.stringify(dataTable), //只有这一个参数，json格式，后台解析为实体，后台可以直接用
                done:function (data) {
                    successToast("退药成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoDispensingList_table'); //重新刷新table
                }
            })


        }
    }
}

/**
 * 获取单个实体
 */
function saveOrEdit(id){
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server+"/stock/stoDispensing/stoDispensingEdit";
    }else{  //编辑
        title="编辑";
        url=$.config.server+"/stock/stoDispensing/stoDispensingEdit?id="+id;
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
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoDispensingList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

function selectAllData(list) {
    var loading = layer.msg("数据请求中", {icon: 16, shade: 0, time: 1000000});


    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/stoDispensing/getPantienModelList.do",
        contentType: "application/json", // 指定这个协议很重要
        data: JSON.stringify(list), //只有这一个参数，json格式，后台解析为实体，后台可以直接用
        dataType: "json",
        done: function (data) {
            $.each(data, function (index, item) {
                //性别
                item.patient.sex = getSysDictName('Sex', item.patient.gender);
                var insuranceArr = item.patient.insuranceTypes.split(',');
                //收费类型
                item.patient.insuranceNm = "";
                insuranceArr.forEach(function (node, index) {
                    item.patient.insuranceNm += getSysDictName('InsuranceType', node) + '、';
                });
                item.patient.insuranceNm = item.patient.insuranceNm.slice(0, item.patient.insuranceNm.length - 1);
                //发药状态
                item.patient.statusNm = findStatus(item.patient.status);
            });
            stoDispensingList.selectAllList = data;//先将数据暂存

            ProcTableData(); //渲染总览数据
            ReloadRenderTable(); //重载总览表格
            var layer = layui.layer;
            var form = layui.form;
            var laytpl = layui.laytpl;
            var getTpl = detailsHTML.innerHTML
                , view = document.getElementById('view');
            laytpl(getTpl).render({bizData: data}, function (html) {
                view.innerHTML = html;
            });
            form.render(); //更新全部
            var element = layui.element;
            element.init();

            $.each(data, function (index, item) {
                var elemId = "#stoDispensingDrugList_table_" + index;
                var filterId = "stoDispensingDrugList_table_" + index;
                //获取layui的table模块
                var table = layui.table;
                //获取layui的util模块
                var util = layui.util;

                console.log("item", item);

                //已发药
                var batchNoConf = {field: 'batchNo', title: '批次号', width: 150}
                if ("1" != item.patient.status) {
                    batchNoConf = {field: 'batchNo', title: '批次号', width: 150, templet: '#batchNo'}
                }

                _layuiTable({
                    elem: elemId, //必填，指定原始表格元素选择器（推荐id选择器）
                    filter: filterId, ////必填，指定的lay-filter的名字
                    //执行渲染table配置
                    render: {
                        // height:'full-600', //table的高度，页面最大高度减去差值
                        cellMinWidth: 100, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                        cols: [[ //表头
                            // {fixed: 'left',type:'checkbox'}  //开启编辑框
                            {type: 'numbers', title: '序号', width: 60}  //序号
                            , {field: 'dispensingDrugId', title: '发药记录id', hide: true}
                            , {field: 'materielNo', title: '药品编号', width: 120}
                            , {field: 'materielName', title: '药品名称', width: 150}
                            , batchNoConf
                            , {field: 'specifications', title: '规格'}
                            , {field: 'placeOfOrigin', title: '产地', width: 200}
                            , {field: 'singleMeasurement', title: '单次计量'}
                            , {
                                field: 'singleMeasurementUnit', title: '单次计量单位', width: 180
                                // ,templet: function(d){
                                //     //返回数据字典的名称
                                //     return getSysDictName("purSalesBaseUnit",d.singleMeasurementUnit);
                                // }
                            }
                            , {field: 'quantity', title: '数量'}
                            , {
                                field: 'quantityUnit', title: '数量单位'
                                , templet: function (d) {
                                    //返回数据字典的名称
                                    return getSysDictName("purSalesBaseUnit", d.quantityUnit);
                                }
                            }
                            , {field: 'days', title: '天数'}
                            , {field: 'valuationPrice', title: '计价单价', align: 'right'}
                            , {field: 'valuationNumber', title: '计价数量'}
                            , {
                                field: 'valuationUnit', title: '计价单位'
                                , templet: function (d) {
                                    //返回数据字典的名称
                                    return getSysDictName("purSalesBaseUnit", d.valuationUnit);
                                }
                            }
                            , {
                                field: 'usage', title: '用法'
                                , templet: function (d) {
                                    //返回数据字典的名称
                                    return getSysDictName("Route", d.usage);
                                }
                            }
                            , {field: 'totalPrice', title: '总金额', align: 'right'}
                        ]],
                        data: item.drugList,
                        page: false,
                        limit: Number.MAX_VALUE, // 数据表格默认全部显示
                        done: function (res, curr, count) {
                            //添加下拉列表监听事件
                            $.each(res.bizData, function (i, obj) {
                                $('#select_' + obj.dispensingDrugId).val(obj.batchNo);//赋值当前批次号
                                layui.form.on('select(batchNo_' + obj.dispensingDrugId + ')', function (data) {
                                    layer.confirm('确定修改批次号吗？', function () {
                                        editBatchNo(data, obj.dispensingDrugId);
                                    });
                                });
                            });
                        }
                    }
                });
            });
            //渲染耗材清单
            $.each(data, function (index, item) {
                var elemId = "#stoDispensingConsumablesList_table_" + index;
                var filterId = "stoDispensingConsumablesList_table_" + index;
                //获取layui的table模块
                var table = layui.table;
                //获取layui的util模块
                var util = layui.util;
                //已发药
                var batchNoConf = {field: 'batchNo', title: '批次号', width: 150}
                if ("1" != item.patient.status) {
                    batchNoConf = {field: 'batchNo', title: '批次号', width: 150, templet: '#batchNo'}
                }
                _layuiTable({
                    elem: elemId, //必填，指定原始表格元素选择器（推荐id选择器）
                    filter: filterId, ////必填，指定的lay-filter的名字
                    //执行渲染table配置
                    render: {
                        //height:'full-600', //table的高度，页面最大高度减去差值
                        cellMinWidth: 100, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                        cols: [[ //表头
                            // {fixed: 'left',type:'checkbox'}  //开启编辑框
                            {type: 'numbers', title: '序号', width: 60}  //序号
                            , {field: 'dispensingDrugId', title: '发药记录id', hide: true}
                            , {field: 'materielNo', title: '耗材编号', width: 120}
                            , {field: 'materielName', title: '耗材名称', width: 150}
                            , batchNoConf
                            , {field: 'manufactor', title: '生产厂家', width: 200}
                            , {field: 'quantity', title: '使用数量'}
                            , {
                                field: 'quantityUnit', title: '使用数量单位', width: 180
                                , templet: function (d) {
                                    //返回数据字典的名称
                                    return getSysDictName("purSalesBaseUnit", d.quantityUnit);
                                }
                            }
                            , {field: 'valuationPrice', title: '计价单价', align: 'right'}
                            , {field: 'valuationNumber', title: '计价数量'}
                            , {
                                field: 'valuationUnit', title: '计价单位'
                                , templet: function (d) {
                                    //返回数据字典的名称
                                    return getSysDictName("purSalesBaseUnit", d.valuationUnit);
                                }
                            }
                            , {field: 'totalPrice', title: '总金额', align: 'right'}
                        ]],
                        data: item.consumablesList,
                        page: false,
                        limit: Number.MAX_VALUE, // 数据表格默认全部显示
                        done: function (res, curr, count) {
                            //添加下拉列表监听事件
                            $.each(res.bizData, function (i, obj) {
                                $('#select_' + obj.dispensingDrugId).val(obj.batchNo);//赋值当前批次号
                                layui.form.on('select(batchNo_' + obj.dispensingDrugId + ')', function (data) {
                                    layer.confirm('确定修改批次号吗？', function () {
                                        editBatchNo(data, obj.dispensingDrugId);
                                    });
                                });
                            });
                        }
                    }
                });
            });
            layui.form.render();
        }

    });
}

//
//     $.ajax({
//         type:"POST",
//         url: $.config.services.dialysis + "/stoDispensing/getPantienModelList.do",
//         dataType:"json",
//         contentType:"application/json", // 指定这个协议很重要
//         data:JSON.stringify(list), //只有这一个参数，json格式，后台解析为实体，后台可以直接用
//         success:function(data){
//             layui.layer.close(loading);
//             $.each(data.bizData, function (index, item) {
//                 //性别
//                 item.patient.sex = getSysDictName('Sex', item.patient.gender);
//                 var insuranceArr = item.patient.insuranceTypes.split(',');
//                 //收费类型
//                 item.patient.insuranceNm ="";
//                 insuranceArr.forEach(function (node, index) {
//                     item.patient.insuranceNm += getSysDictName('InsuranceType', node) + '、';
//                 });
//                 item.patient.insuranceNm = item.patient.insuranceNm.slice(0,item.patient.insuranceNm.length-1);
//                 //发药状态
//                 item.patient.statusNm = findStatus(item.patient.status);
//             });
//             stoDispensingList.selectAllList = data.bizData;//先将数据暂存
//             ProcTableData(); //渲染总览数据
//             ReloadRenderTable(); //重载总览表格
//             var layer = layui.layer;
//             var form = layui.form;
//             var laytpl = layui.laytpl;
//             var getTpl = detailsHTML.innerHTML
//                 ,view = document.getElementById('view');
//             laytpl(getTpl).render(data, function(html){
//                 view.innerHTML = html;
//             });
//             form.render(); //更新全部
//             var element = layui.element;
//             element.init();
//             //渲染药品清单
//             $.each(data.bizData, function (index, item) {
//                 var elemId = "#stoDispensingDrugList_table_" + index;
//                 var filterId = "stoDispensingDrugList_table_" + index;
//                 //获取layui的table模块
//                 var table=layui.table;
//                 //获取layui的util模块
//                 var util=layui.util;
//
//                 console.log("item",item);
//
//                 //已发药
//                 var batchNoConf = {field: 'batchNo', title: '批次号',width:150}
//                 if("1" != item.patient.status){
//                     batchNoConf = {field: 'batchNo', title: '批次号',width:150,templet:'#batchNo'}
//                 }
//
//                 _layuiTable({
//                     elem: elemId, //必填，指定原始表格元素选择器（推荐id选择器）
//                     filter:filterId, ////必填，指定的lay-filter的名字
//                     //执行渲染table配置
//                     render:{
//                        // height:'full-600', //table的高度，页面最大高度减去差值
//                         cellMinWidth: 100, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
//                         cols: [[ //表头
//                             // {fixed: 'left',type:'checkbox'}  //开启编辑框
//                             {type: 'numbers', title: '序号',width:60 }  //序号
//                             ,{field: 'dispensingDrugId', title: '发药记录id',hide:true}
//                             ,{field: 'materielNo', title: '药品编号',width:120}
//                             ,{field: 'materielName', title: '药品名称',width:150}
//                             ,batchNoConf
//                             ,{field: 'specifications', title: '规格'}
//                             ,{field: 'placeOfOrigin', title: '产地',width:200}
//                             ,{field: 'singleMeasurement', title: '单次计量'}
//                             ,{field: 'singleMeasurementUnit', title: '单次计量单位',width:180
//                                 // ,templet: function(d){
//                                 //     //返回数据字典的名称
//                                 //     return getSysDictName("purSalesBaseUnit",d.singleMeasurementUnit);
//                                 // }
//                                 }
//                             ,{field: 'quantity', title: '数量'}
//                             ,{field: 'quantityUnit', title: '数量单位'
//                                 ,templet: function(d){
//                                     //返回数据字典的名称
//                                     return getSysDictName("purSalesBaseUnit",d.quantityUnit);
//                                 }}
//                             ,{field: 'days', title: '天数'}
//                             ,{field: 'valuationPrice', title: '计价单价',align: 'right'}
//                             ,{field: 'valuationNumber', title: '计价数量'}
//                             ,{field: 'valuationUnit', title: '计价单位'
//                                 ,templet: function(d){
//                                     //返回数据字典的名称
//                                     return getSysDictName("purSalesBaseUnit",d.valuationUnit);
//                                 }}
//                             ,{field: 'usage', title: '用法'
//                                 ,templet: function(d){
//                                     //返回数据字典的名称
//                                     return getSysDictName("Route",d.usage);
//                                 }
//                             }
//                             ,{field: 'totalPrice', title: '总金额',align: 'right'}
//                         ]],
//                         data:item.drugList,
//                         page: false,
//                         limit: Number.MAX_VALUE, // 数据表格默认全部显示
//                         done: function (res, curr, count) {
//                             //添加下拉列表监听事件
//                             $.each(res.bizData, function(i, obj) {
//                                 $('#select_' + obj.dispensingDrugId).val(obj.batchNo);//赋值当前批次号
//                                 layui.form.on('select(batchNo_' + obj.dispensingDrugId + ')', function(data) {
//                                     layer.confirm('确定修改批次号吗？', function(){
//                                         editBatchNo(data,obj.dispensingDrugId);
//                                     });
//                                 });
//                             });
//                         }
//                     }
//                 });
//             });
//             //渲染耗材清单
//             $.each(data.bizData, function (index, item) {
//                 var elemId = "#stoDispensingConsumablesList_table_" + index;
//                 var filterId = "stoDispensingConsumablesList_table_" + index;
//                 //获取layui的table模块
//                 var table=layui.table;
//                 //获取layui的util模块
//                 var util=layui.util;
//                 //已发药
//                 var batchNoConf = {field: 'batchNo', title: '批次号',width:150}
//                 if("1" != item.patient.status){
//                     batchNoConf = {field: 'batchNo', title: '批次号',width:150,templet:'#batchNo'}
//                 }
//                 _layuiTable({
//                     elem: elemId, //必填，指定原始表格元素选择器（推荐id选择器）
//                     filter:filterId, ////必填，指定的lay-filter的名字
//                     //执行渲染table配置
//                     render:{
//                         //height:'full-600', //table的高度，页面最大高度减去差值
//                         cellMinWidth: 100, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
//                         cols: [[ //表头
//                             // {fixed: 'left',type:'checkbox'}  //开启编辑框
//                             {type: 'numbers', title: '序号',width:60 }  //序号
//                             ,{field: 'dispensingDrugId', title: '发药记录id',hide:true}
//                             ,{field: 'materielNo', title: '耗材编号',width:120}
//                             ,{field: 'materielName', title: '耗材名称',width:150}
//                             , batchNoConf
//                             ,{field: 'manufactor', title: '生产厂家',width:200}
//                             ,{field: 'quantity', title: '使用数量'}
//                             ,{field: 'quantityUnit', title: '使用数量单位',width:180
//                                 ,templet: function(d){
//                                     //返回数据字典的名称
//                                     return getSysDictName("purSalesBaseUnit",d.quantityUnit);
//                                 }}
//                             ,{field: 'valuationPrice', title: '计价单价',align: 'right'}
//                             ,{field: 'valuationNumber', title: '计价数量'}
//                             ,{field: 'valuationUnit', title: '计价单位'
//                                 ,templet: function(d){
//                                     //返回数据字典的名称
//                                     return getSysDictName("purSalesBaseUnit",d.valuationUnit);
//                                 }}
//                             ,{field: 'totalPrice', title: '总金额',align: 'right'}
//                         ]],
//                         data:item.consumablesList,
//                         page: false,
//                         limit: Number.MAX_VALUE, // 数据表格默认全部显示
//                         done: function (res, curr, count) {
//                             //添加下拉列表监听事件
//                             $.each(res.bizData, function(i, obj) {
//                                 $('#select_' + obj.dispensingDrugId).val(obj.batchNo);//赋值当前批次号
//                                 layui.form.on('select(batchNo_' + obj.dispensingDrugId + ')', function(data) {
//                                     layer.confirm('确定修改批次号吗？', function(){
//                                         editBatchNo(data,obj.dispensingDrugId);
//                                     });
//                                 });
//                             });
//                         }
//                     }
//                 });
//             });
//             layui.form.render();
//         }
//     });
// }

/**
 * 修改批次号
 */
function editBatchNo(data,dispensingDrugId){
    var field = {
        batchNo: data.value,
        dispensingDrugId: dispensingDrugId
    };
    var url = $.config.services.dialysis + "/stoDispensing/saveOrEdit.do";
    //可以继续添加需要上传的参数
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: url,
        data:field,
        dataType: "json",
        done:function(data){
            if(null!=data && data.code>0){
                successToast("保存成功");
                layui.form.render();
            }
        }
    });
}

/* 刷新表格，拉去新的数据 */
function tableReload(){
    layui.table.reload("stoDispensingList_table");
}


// /** Test 模拟自动发药 **/
// function TestAuto(){
//     var field = {
//         source:  $.constant.MaterielSource.DIALYSISTREATMENT,
//         dispensing_no: '5fb5dffda8f118a5be9c79a4'
//     };
//     var url = $.config.services.dialysis + "/stoDispensing/AutoDispensing.do";
//     //可以继续添加需要上传的参数
//     _ajax({
//         type: "POST",
//         //loading:true,  //是否ajax启用等待旋转框，默认是true
//         url: url,
//         data:field,
//         dataType: "json",
//         done:function(data){
//             console.log(data);
//         }
//     });
// }
//
// /** Test 模拟自动退药 **/
// function TestAutoBack(){
//     var field = {
//         source:  $.constant.MaterielSource.DIALYSISTREATMENT,
//         dispensing_no: '5fb5dffda8f118a5be9c79a4'
//     };
//     var url = $.config.services.dialysis + "/stoDispensing/AutoBackDispensing.do";
//     //可以继续添加需要上传的参数
//     _ajax({
//         type: "POST",
//         //loading:true,  //是否ajax启用等待旋转框，默认是true
//         url: url,
//         data:field,
//         dataType: "json",
//         done:function(data){
//             console.log(data);
//         }
//     });
// }




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
        url: $.config.services.dialysis + "/stoDispensing/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('stoDispensingList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('stoDispensingList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.dispensingDrugId);
            });
            del(ids);
        });
    }
}

