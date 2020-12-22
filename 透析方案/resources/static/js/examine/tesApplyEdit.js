/**
 * tesApplyEdit.jsp的js文件，包括查询，编辑操作
 * 检验检查--检验申请表
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/21
 */
var tesApplyEdit = avalon.define({
    $id: "tesApplyEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    dictType:$.dictType,
    constant:$.constant,
    isFirstSearch:true,//第一次点击 检验计划
    applyId:'',//申请单id
    patientId:'',
    applyStatus:'',//申请单状态
    applySendStatus:'',//送检状态
    newDate:'',//后台返回时间
    tesApply:'',//申请单
    tesApplyItemList:[],//检验项目
    sourceType:'',//申请单来源 1-透析，2-门诊，3-检验
    relationId:'',// 关联id（透析、门诊）
    delApplyItemIds:[],//删除的检验项目明细
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...

        var sourceType=GetQueryString("sourceType");  //接收变量
        var applyId=GetQueryString("applyId");  //接收变量
        var patientId=GetQueryString("patientId");  //接收变量
        var relationId=GetQueryString("relationId");  //透析id或门诊id或空

        debugger
        if(isNotEmpty(patientId)){
            tesApplyEdit.patientId = patientId;
        } else {
            warningToast("请选择患者");
            return false;
        }
        if(isNotEmpty(applyId)){
            tesApplyEdit.applyId = applyId;
        }
        if(isNotEmpty(sourceType)){
            tesApplyEdit.sourceType = sourceType;
        }
        if(isNotEmpty(relationId)){
            tesApplyEdit.relationId = relationId;
        }

        initSearch(); //初始化搜索框
        getProjectList()
        getPlanList();
        //获取实体信息
        getInfo(tesApplyEdit.applyId,tesApplyEdit.patientId,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息

        });
        $('#aboutIcon').on('click', function(){
            var that = this;
            layer.tips('温馨提示：' +
                '<br>操作后请点击【保存】按钮保存操作结果' +
                '<br>点击【提交】按钮后将不能修改申请单' +
                '<br>点击【取消】按钮后直接关闭弹窗', that, {
                tips: 1
            }); //在元素的事件回调体中，follow直接赋予this即可
        });
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch(){
    var form=layui.form;
    var htmlStr = "";
    htmlStr += '<div class="layui-form-item"><div class="layui-inline" style="width:200px;">' +
    '<div class="layui-input-inline"> <input type="text" name="orderName" autocomplete="off" class="layui-input"></div> </div>';
    htmlStr += '<div class="layui-inline" style="line-height: 42px;">' +
        '   <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" lay-submit lay-filter="tesProject_search_search">' +
        '   搜 索' +
        '   </button>' +
        '</div></div>';
    $('#tesProject_search').html(htmlStr);
    //刷新表单
    form.render();
    //监听搜索
    form.on('submit(tesProject_search_search)', function (data) {
        //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
        var field = data.field;
        var table = layui.table; //获取layui的table模块
        table.reload('tesProjectList_table',{
            where:field
        });
    });

    htmlStr = "";
    htmlStr += '<div class="layui-form-item"><div class="layui-inline" style="width:200px;">' +
        '<div class="layui-input-inline"> <input type="text" name="orderName" autocomplete="off" class="layui-input"></div> </div>';
    htmlStr += '<div class="layui-inline" style="line-height: 42px;">' +
        '   <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" lay-submit lay-filter="tesPlan_search_search">' +
        '   搜 索' +
        '   </button>' +
        '</div></div>';
    $('#tesPlan_search').html(htmlStr);
    //刷新表单
    form.render();
    //监听搜索
    form.on('submit(tesPlan_search_search)', function (data) {
        //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
        var field = data.field;
        var table = layui.table; //获取layui的table模块
        field.patientId = tesApplyEdit.patientId;
        table.reload('tesPlanList_table',{
            where:field
        });
    });
}

/**
 * 查询检验项目列表事件
 */
function getProjectList() {
    var param = {
    };
    _layuiTable({
        elem: '#tesProjectList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'tesProjectList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url:  $.config.services.dialysis + "/tesApply/getTesProjectList.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
               {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'orderName', title: '检验项目',align:'center'}
                ,{field: 'salesPrice', title: '费用',align:'center',templet: function(d){
                    return d.salesPrice+" 元/次";
                }}
            ]]
        }
    });
    var table = layui.table;
    //监听行单击事件（双击事件为：rowDouble）
    table.on('rowDouble(tesProjectList_table)', function(obj){
        //提交申请单后不能编辑
        if(tesApplyEdit.applyStatus == $.constant.ApplicationStatus.SUBMITTED){
            return;
        }
        var data = obj.data;
        updateCacheOrForm("tesApplyList_table", "tesApplyList_table", "cache");
        var tableList = layui.table.cache["tesApplyList_table"];
        tesApplyEdit.tesApplyItemList.clear();
        tesApplyEdit.tesApplyItemList = tableList;

        var sampleList = getSysDictMap($.dictType.SampleType);
        var apply = {};
        apply.orderMainId = data.orderMainId;
        apply.orderName = data.orderName;
        apply.salesPrice = data.salesPrice;
        apply.examination = data.examination;

        apply.applyItemId = "";//主键
        apply.applyId = "";
        apply.relationId = "";// 检验项目关联透析、门诊医嘱明细id
        apply.testType = sampleList[0].value;
        tesApplyEdit.tesApplyItemList.push(apply);
        creatItemTable(tesApplyEdit.tesApplyItemList);
    });
}

/**
 * 查询检验计划列表事件
 */
function getPlanList() {
    var util = layui.util;
    var param = {
        "patientId":tesApplyEdit.patientId
    };
    _layuiTable({
        elem: '#tesPlanList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'tesPlanList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url:  $.config.services.dialysis + "/tesApply/getTesPlanList.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'orderName', title: '检验项目',align:'center'}
                ,{field: 'nextDate', title: '下次检验时间',align:'center',templet: function(d){
                    return util.toDateString(d.nextDate,"yyyy-MM-dd");
                }}
            ]]
        }
    });
    var table = layui.table;
    //监听行单击事件（双击事件为：rowDouble）
    table.on('rowDouble(tesPlanList_table)', function(obj){
        //提交申请单后不能编辑
        if(tesApplyEdit.applyStatus == $.constant.ApplicationStatus.SUBMITTED){
            return;
        }
        var data = obj.data;
        updateCacheOrForm("tesApplyList_table", "tesApplyList_table", "cache");
        var tableList = layui.table.cache["tesApplyList_table"];
        tesApplyEdit.tesApplyItemList.clear();
        tesApplyEdit.tesApplyItemList = tableList;

        var sampleList = getSysDictMap($.dictType.SampleType);
        var apply = {};
        apply.orderMainId = data.orderMainId;
        apply.orderName = data.orderName;
        apply.salesPrice = data.salesPrice;
        apply.examination = data.examination;

        apply.applyItemId = "";//主键
        apply.applyId = "";
        apply.relationId = ""; // 检验项目关联透析、门诊医嘱明细id
        apply.testType = sampleList[0].value;
        tesApplyEdit.tesApplyItemList.push(apply);
        creatItemTable(tesApplyEdit.tesApplyItemList);
    });
}




/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(applyId,patientId,$callback){
    //编辑
    var param={
        "applyId":applyId,
        "patientId":patientId
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/tesApply/getInfo.do",
        data:param,
        dataType: "json",
        success: function (res) {
            tesApplyEdit.newDate = res.ts;
        },
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            //初始化表单元素,日期时间选择器
            var util=layui.util;
            var formData = {};
            tesApplyEdit.tesApplyItemList.clear();
            tesApplyEdit.tesApply = data.tesApply;
            var patPatientInfo = data.patPatientInfo;
            debugger
            tesApplyEdit.tesApplyItemList.pushArray(data.tesApplyItemList);
            if(isNotEmpty(tesApplyEdit.tesApply.applyId)){
                formData.applyId = tesApplyEdit.tesApply.applyId;
                formData.applyDate = util.toDateString(tesApplyEdit.tesApply.applyDate,"yyyy-MM-dd");
                formData.hospitalName = tesApplyEdit.tesApply.hospitalName;
                formData.mechanism = tesApplyEdit.tesApply.mechanism;
                formData.illness = tesApplyEdit.tesApply.illness;
                formData.purpose = tesApplyEdit.tesApply.purpose;
                formData.sourceType = tesApplyEdit.tesApply.sourceType;
                formData.relationId = tesApplyEdit.tesApply.relationId; //申请单关联透析、门诊id
                tesApplyEdit.applyStatus = tesApplyEdit.tesApply.applyStatus;//申请单状态
                tesApplyEdit.applySendStatus = tesApplyEdit.tesApply.applySendStatus;//送检状态

            }else {
                formData.relationId = tesApplyEdit.relationId;
                formData.sourceType = tesApplyEdit.sourceType;
                formData.hospitalName = baseFuncInfo.userInfoData.hospitalName;
                formData.applyDate = util.toDateString(tesApplyEdit.newDate,"yyyy-MM-dd");
            }
            formData.patientId = patientId;
            formData.patientName = patPatientInfo.patientName;
            formData.gender =getSysDictName($.dictType.sex, patPatientInfo.gender);
            formData.patientAge = getAge(tesApplyEdit.newDate,patPatientInfo.birthday);
            formData.patientRecordNo = patPatientInfo.patientRecordNo;

            form.val('tesApplyEdit_form', formData);

            form.val('tesApply_form', formData);

            creatItemTable(tesApplyEdit.tesApplyItemList);
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

function creatItemTable(tesApplyItemList) {
    var sampleList = getSysDictMap($.dictType.SampleType);
    var htmlStr ='<select name="testType" class="select">';
    $.each(sampleList,function(i,item){
        if(i==0){
            htmlStr+='<option value="'+item.value+'">'+item.name+'</option>';
        }else {
            htmlStr+='<option value="'+item.value+'">'+item.name+'</option>';
        }
    });
    htmlStr +='</select>';
    _layuiTable({
        elem: '#tesApplyList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'tesApplyList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-360', //table的高度，页面最大高度减去差值
            data:tesApplyItemList,
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'orderName', title: '检验项目',align:'center'}
                ,{field: 'examination', title: '标本',align:'center',templet: function(d){
                    return getSysDictName($.dictType.Examination,d.examination);
                }}
                ,{field: 'testType', title: '检验类型',align:'center',templet: function(d){
                    return htmlStr;
                }}
                ,{field: 'salesPrice', title: '单价/元',align:'center',templet: function(d){
                    return d.salesPrice+" 元/次";
                }}
                ,{fixed: 'right',title: '操作',width: 140, align:'center',templet: function(d){
                       if(tesApplyEdit.applyStatus != $.constant.ApplicationStatus.SUBMITTED){
                            return '<a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="del">删除</a>';
                       }else {
                           return '';
                       }
                }}
            ]]
        }, //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录？\r\n温馨提示：请点击【保存】按钮保存操作结果', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    if(isNotEmpty(data.applyItemId)){
                        tesApplyEdit.delApplyItemIds.push(data.applyItemId);
                    }
                    obj.del(); // 页面级别删除，不需要提醒
                });
            }
        }
    });
    updateCacheOrForm("tesApplyList_table", "tesApplyList_table", "form");
}


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(tesApplyEdit_submit)', function(data){
        //通过表单验证后
        updateCacheOrForm("tesApplyList_table", "tesApplyList_table", "cache");
        var tableList = layui.table.cache["tesApplyList_table"];
        var field = data.field; //获取提交的字段
        field.tesApplyItemList = [];
        $.each(tableList,function (i,item) {
            if(isNotEmpty(item.orderMainId)){
                field.tesApplyItemList.push(item);
            }
        })
        field.delApplyItemIds = tesApplyEdit.delApplyItemIds;
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#tesApplyEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save(){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        param.applyStatus = $.constant.ApplicationStatus.NO_SUBMIT;
        var url = "";
        if(isEmpty(param.applyId)){
            url = $.config.services.dialysis + "/tesApply/save.do";
        }else{
            url = $.config.services.dialysis + "/tesApply/edit.do";
        }

        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:{jsonData: JSON.stringify(param)},
            dataType: "json",
            done:function(data){
                successToast("保存成功");
                tesApplyEdit.applyId = data;
                //延迟执行，为了显示保存信息
                setTimeout(function () {
                    getInfo(tesApplyEdit.applyId,tesApplyEdit.patientId,function(data){});
                }, 1000);
            }
        });
    });
}

function submit() {
    layer.confirm('申请单提交后不可编辑，确定提交申请单？', function(index){
        verify_form(function(field){
            //成功验证后
            var param=field; //表单的元素
            debugger
            param.applyStatus = $.constant.ApplicationStatus.SUBMITTED;
            //可以继续添加需要上传的参数
            _ajax({
                type: "POST",
                //loading:true,  //是否ajax启用等待旋转框，默认是true
                url:  $.config.services.dialysis + "/tesApply/submitOrBackApply.do",
                data:{jsonData: JSON.stringify(param)},
                dataType: "json",
                done:function(data){
                    successToast("提交成功");
                    tesApplyEdit.applyId = data;
                    getInfo(tesApplyEdit.applyId,tesApplyEdit.patientId,function(data){});
                }
            });
        });
    });
}

function backSubmit() {
    if(tesApplyEdit.applySendStatus == $.constant.ApplySendStatus.SENT){
        warningToast("已提交送检，申请单不可撤回");
        return false;
    }
    layer.confirm('确定撤回提交申请单？', function(index){
        verify_form(function(field){
            //成功验证后
            var param=field; //表单的元素
            param.applyStatus = $.constant.ApplicationStatus.NO_SUBMIT;
            //可以继续添加需要上传的参数
            _ajax({
                type: "POST",
                //loading:true,  //是否ajax启用等待旋转框，默认是true
                url:  $.config.services.dialysis + "/tesApply/submitOrBackApply.do",
                data:{jsonData: JSON.stringify(param)},
                dataType: "json",
                done:function(data){
                    successToast("撤回成功");
                    tesApplyEdit.applyId = data;
                    getInfo(tesApplyEdit.applyId,tesApplyEdit.patientId,function(data){});
                }
            });
        });

    });
}

function cancel() {
    var index=parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

/***
 * op="cache",则更新表格数据，将表格编辑控件数据更新到缓存table.cache[tableCacheId];
 * op="form"，则从缓存table.cache[tableCacheId]获取数据更新表格对应的下拉框，日期等控件。
 * op: 取值cache或者form。默认form
 */
function updateCacheOrForm(tableId, tableCacheId, op){
    var table = layui.table;
    op = op || "form";
    var divForm = $("#" + tableId).next();
    var tableCache = table.cache[tableCacheId];
    var trJqs = divForm.find(".layui-table-body tr");
    trJqs.each(function(){
        var trJq = $(this);
        var dataIndex = trJq.attr("data-index");
        trJq.find("td").each(function(){
            var tdJq = $(this);
            var fieldName = tdJq.attr("data-field");
            //var fieldName = selectJq.eq(0).attr("name");
            //更新select数据
            var selectJq = tdJq.find("select");
            if(selectJq.length == 1){
                if(op == "cache"){
                    tableCache[dataIndex][fieldName] = selectJq.eq(0).val();
                }else if(op == "form"){
                    selectJq.eq(0).val(tableCache[dataIndex][fieldName])
                }
            }
        });
    });
    layui.form.render();
    return tableCache;
}

/**
 * 打印
 */
function printMethod(){
    if(isEmpty(tesApplyEdit.applyId)){
        warningToast("请先保存检验申请单！");
        return false;
    }
    _layerOpen({
        url: $.config.server + "/examine/tesApplyPrint?applyId="+tesApplyEdit.applyId+"&patientId="+tesApplyEdit.patientId,
        width: 710, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 842,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "打印申请单", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin) {
            var ids = iframeWin.onPrint();
        }
    });
}


/**
 * 打印
 */
function printMethod2(){
    var uuid = guid();
    var a = $("select[name='mechanism']").text();
    var b = $("input[name='applyDate']").val();
    debugger
    updateCacheOrForm("tesApplyList_table", "tesApplyList_table", "cache");
    var tableList = layui.table.cache["tesApplyList_table"];

    var data = {
        applyDate:$("input[name='applyDate']").val(),
        hospitalName:$("input[name='hospitalName']").val(),
        mechanism:$("select[name='mechanism']").text(),
        patientName:$("input[name='patientName']").val(),
        gender:$("input[name='gender']").val(),
        patientAge:$("input[name='patientAge']").val(),
        patientRecordNo:$("input[name='patientRecordNo']").val(),
        illness:$("input[name='illness']").val(),
        purpose:$("input[name='purpose']").val(),
        applyList:tableList
    }
    sessionStorage.setItem(uuid, JSON.stringify(data));
    _layerOpen({
        url: $.config.server + "/examine/tesApplyPrint?uuid=" + uuid,
        width: 710, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 842,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "打印申请单", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin) {
            var ids = iframeWin.onPrint();
        }
    });
}

/**
 * 计算年龄
 * @param dateTime
 * @returns {number}
 */
function getAge(dialysisDate, birthday) {
    var aDate = new Date(dialysisDate);
    var thisYear = aDate.getFullYear();
    var bDate = new Date(birthday);
    var brith = bDate.getFullYear();
    var age = (thisYear - brith);
    return age;
}