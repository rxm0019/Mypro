/**
 * 使用登记
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/17
 */
var bacWaterUseList = avalon.define({
    $id: "bacWaterUseList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    tabIndex:'0',//页签
    deviceList:[],//水机列表
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getWaterUseList()  //查询水机每日登记列表
        getSewageList(); //查询污水登记列表
        avalon.scan();
    });
    //监听tab切换
    element = layui.element;
    element.on('tab(docDemoTabBrief)', function(data){
        
        if(data.index == 0){
            bacWaterUseList.tabIndex = "0";
        }else{
            bacWaterUseList.tabIndex = "1";
        }
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#bacWaterUseList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacWaterUseList_search'  //指定的lay-filter
        ,conds:[
            {field: 'registerDate', title: '登记日期：',type:'date_range'}
            ,{field: 'deviceId', title: '水机:',type:'select',data:getDeviceList()}
        ]
        ,done:function(filter,data){
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('bacWaterUseList_table',{
                where:field
            });
        }
    });
    _initSearch({
        elem: '#bacSewageList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacSewageList_search'  //指定的lay-filter
        ,conds:[
            {field: 'sewageRegisterDate', title: '登记日期：',type:'date_range'}
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
            table.reload('bacSewageList_table',{
                where:field
            });
        }
    });
}
//获取水机列表
function getDeviceList() {
    //水机
    var tmp = baseFuncInfo.getSysDictByCode("MachineWater");
    var machineWater = "";
    $.each(tmp,function(index, item){
        if(item.value !=""){
            machineWater = item.value;
        }
    })
    var dicts=[];
    dicts.push({value:"",name:"全部"});
    var param = {
        deviceType:machineWater//设备类型为水机
    };
    _ajax({
        type: "POST",
        url: $.config.services.logistics + "/bacDevice/getLists.do",
        data:param,
        dataType: "json",
        async:false,
        done: function(data){
            if(data!=null&&data!=""){
                for(var i=0;i<data.length;i++){
                    dicts.push({value:data[i].codeNo,name:data[i].deviceName});
                }
            }
        }
    });
    return dicts;
}
/**
 * 查询水机登记列表事件
 */
function getWaterUseList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacWaterUseList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacWaterUseList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacWaterUse/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type:'checkbox',rowspan:2}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60,rowspan:2,colspan:1 }  //序号
                ,{title: '基本信息',colspan:3}
                ,{title: '自来水',colspan:3}
                ,{title: '检测浓度',colspan:7}
                ,{title: '一段',colspan:5}
                ,{title: '二段',colspan:6}
                ,{title: '输送压',colspan:2}

            ],
                [
                {field: 'deviceName', title: '水机名称',align:'center',width:110}
                ,{field: 'deviceId', title: '水机编号',align:'center',width:110}
                ,{field: 'registerDate', title: '登记日期',align:'center',width:110
                    ,templet: function(d){
                        if (isNotEmpty(d.registerDate)) {
                            return util.toDateString(d.registerDate,"yyyy-MM-dd");
                        } else {
                            return ""
                        }
                    }}
                ,{field: 'waterQuality', title: '水质(us/cm)',align:'center',width:140}
                ,{field: 'hydraulicPressure', title: '压力(kg/cm2)',align:'center',width:140}
                ,{field: 'rawPump', title: '原水泵(kg/cm2)',align:'center',width:140}
                ,{field: 'sandFiltration', title: '砂滤(Kg/cm2)',align:'center',width:140}
                ,{field: 'resin', title: '树脂(Kg/cm)',align:'center',width:140}
                ,{field: 'addSalt', title: '加盐量(Kg)',align:'center',width:140}
                ,{field: 'activatedCarbon', title: '活性碳(Kg/cm)',align:'center',width:140}
                ,{field: 'filterAfter', title: '滤芯后 (Kg/cm2)',align:'center',width:140}
                ,{field: 'softWaterHardness', title: '软水硬度',align:'center',width:140}
                ,{field: 'uhr', title: '总氯',align:'center',width:140}
                ,{field: 'waterQualityOne', title: '水质(us/cm)',align:'center',width:140}
                ,{field: 'pureWaterFlow', title: '纯水流量LPM',align:'center',width:140}
                ,{field: 'thickWaterFlow', title: '浓水流量LPM',align:'center',width:140}
                ,{field: 'inHydraulicPressure', title: '进水压（Kg/cm2)',align:'center',width:140}
                ,{field: 'outHydraulicPressure', title: '出水压（Kg/cm2)',align:'center',width:140}
                ,{field: 'waterQualityTwo', title: '水质(us/cm)',align:'center',width:140}
                ,{field: 'pureWaterTwo', title: '纯水流量LPM',align:'center',width:140}
                ,{field: 'thickWaterTwo', title: '浓水流量LPM',align:'center',width:140}
                ,{field: 'inHydraulicTwo', title: '进水压（Kg/cm2)',align:'center',width:140}
                ,{field: 'outHydraulicTwo', title: '出水压（Kg/cm2)',align:'center',width:140}
                ,{field: 'ph', title: 'PH值',align:'center'}
                ,{field: 'intoWater', title: '进水压（Kg/cm2）',align:'center',width:140,rowspan:2,colspan:1}
                ,{field: 'returnWater', title: '回水压（Kg/cm2)',align:'center',width:140,rowspan:2,colspan:1}
                ,{
                    fixed: 'right', title: '操作', width:200, align: 'center',rowspan:2
                    , toolbar: '#bacWaterUseList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit' || layEvent === 'detail'){ //编辑
                //do something
                if(isNotEmpty(data.waterUseId)){
                    saveOrEdit(data.waterUseId,layEvent);
                }
            }else if(layEvent === 'delete'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.waterUseId)){
                        var ids=[];
                        ids.push(data.waterUseId);
                        del(ids);
                    }
                });
            }
        }
    });
}
/**
 * 查询污水登记列表事件
 */
function getSewageList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacSewageList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacSewageList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/bacSewage/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type:'checkbox',rowspan:2}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60,rowspan:2 }  //序号
                ,{field: 'registerDate', title: '登记日期',align:'center',rowspan:2
                    ,templet: function(d){
                        return util.toDateString(d.registerDate,"yyyy-MM-dd");
                    }}
                ,{field: 'registerTime', title: '登记时间',align:'center',rowspan:2}
                ,{field: 'chlorineDioxide',title: '二氧化氯（包）',align:'center',rowspan:2}
                ,{field: 'ph',title: '检验浓度',align:'center',colspan:3}
                ,{field: 'registerUser', title: '操作人',align:'center',rowspan:2}
                ,{field: 'checkUser', title: '核对人',align:'center',rowspan:2}
                ,{fixed: 'right',title: '操作',width: 200, align:'center',rowspan:2
                    ,toolbar: '#bacSewageList_bar'}
            ],[
                //{field: 'chlorineDioxide', title: '二氧化氯（包）',align:'center'}
                {field: 'ph', title: 'PH 值（量）',align:'center'}
                ,{field: 'hcio', title: '余氯（mg/L)',align:'center'}
                ,{field: 'ozone', title: '臭氧（mg/L)',align:'center'}
                ]
            ]

            // cols: [
            //     [{type: 'numbers', title: '序号',width:60,rowspan:1 ,colspan:2}  ], //序号 ],
            // [{type: 'numbers', title: '序号',width:60,rowspan:1 }  //序号]
            //
            //     ]
            //     ]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.sewageId)){
                    saveOrEdit(data.sewageId,layEvent);
                }
            }else if(layEvent === 'check') {
                check(data.sewageId,data.checkUser);
            }else if(layEvent === 'delete'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.sewageId)){
                        var ids=[];
                        ids.push(data.sewageId);
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
function saveOrEdit(id,layEvent){
    var url="";
    var title="";
    var width = 400;
    var height = 600;
    var readonly = false;
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        if(bacWaterUseList.tabIndex == "0"){
            width = 850;
            url=$.config.server+"/synthetical/bacWaterUseEdit";
        }else{
            url=$.config.server+"/synthetical/bacSewageEdit";
        }
    }else{  //编辑
        if(layEvent === "edit"){
            title = "编辑";
        }else {
            title = "详情";
            readonly = true;
        }
        if(bacWaterUseList.tabIndex == "0"){
            width = 850;
            height = 800;
            url=$.config.server+"/synthetical/bacWaterUseEdit?id="+id+"&layEvent="+layEvent;
        }else{
            url=$.config.server+"/synthetical/bacSewageEdit?id="+id;
        }
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:width, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:height,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        readonly:readonly,//只读
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
                    if(bacWaterUseList.tabIndex == "0"){
                        table.reload('bacWaterUseList_table'); //重新刷新水机每日登记table
                    }else{
                        table.reload('bacSewageList_table'); //重新刷新污水登记table
                    }
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 核对污水登记
 */
function check(id,checkUser){
    var title="核对";
    var url=$.config.server+"/synthetical/bacSewageCheck?id="+id+"&checkUser="+checkUser;

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:300,  //弹框自定义的高度，方法会自动判断是否超过高度
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
                    table.reload('bacSewageList_table'); //重新刷新污水登记table
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
    if(bacWaterUseList.tabIndex == "0"){
        _ajax({
            type: "POST",
            url: $.config.services.logistics + "/bacWaterUse/delete.do",
            data:param,  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function(data){
                successToast("删除成功");
                var table = layui.table; //获取layui的table模块
                table.reload('bacWaterUseList_table'); //重新刷新table
            }
        });
    }else{
        _ajax({
            type: "POST",
            url: $.config.services.logistics + "/bacSewage/delete.do",
            data:param,  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function(data){
                successToast("删除成功");
                var table = layui.table; //获取layui的table模块
                table.reload('bacSewageList_table'); //重新刷新table
            }
        });
    }
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = '';
    if(bacWaterUseList.tabIndex == "0"){
        checkStatus = table.checkStatus('bacWaterUseList_table'); //test即为基础参数id对应的值
    }else {
        checkStatus = table.checkStatus('bacSewageList_table'); //test即为基础参数id对应的值
    }

    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.waterUseId);
            });
            del(ids);
        });
    }
}

/**
 * 导出excel
 */
function exportSewageExcel() {
    _downloadFile({
        url: $.config.services.logistics + "/bacSewage/export.do",
        data: getSearchParam(),
        fileName: '污水每日登记列表.xlsx'
    });
}

/**
 * 导出excel
 */
function exportWaterUseExcel() {
    _downloadFile({
        url: $.config.services.logistics + "/bacWaterUse/export.do",
        data: getSearchParam(),
        fileName: '水机每日登记列表.xlsx'
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    
    if(bacWaterUseList.tabIndex == "0"){
        //var searchParam = getRequestParam("bacWaterUseList_search");
        var searchParam = layui.form.val("bacWaterUseList_search")
        return $.extend({
            registerDate_begin: '',
            registerDate_end: '',
            deviceId: ''
        }, searchParam)
    }else{
        var searchParam = layui.form.val("bacSewageList_search")
        //var searchParam = getRequestParam("bacSewageList_search");
        return $.extend({
            sewageRegisterDate_begin: '',
            sewageRegisterDate_end: '',
        }, searchParam)
    }
}