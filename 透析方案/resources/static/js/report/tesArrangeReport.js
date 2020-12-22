/**
 * tesArrangeReport.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 化验数据查询报表
 * @Author xcj
 * @version: 1.0
 * @Date 2020/10/26
 */
var tesArrangeReport = avalon.define({
    $id: "tesArrangeReport",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    SysHospitalList:[],//区名和区名下的医护人员
    testMainId:'',//检验总项id
    testMainList:[],
    totalPage:false,//统计分页显示、隐藏
});

layui.use(['index','laypage','laydate'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        filterSelect();//监控下拉
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#tesArrangeReport_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'tesArrangeReport_search'  //指定的lay-filter
        ,conds:[
            {field: 'testMainId',type:'select', title: '检验项目：'}
            ,{field: 'applyDate', title: '日期：',type:'date_range'}
            ,{field: 'patientRecordNo', title: '病历号：',type:'input'}
            ,{field: 'patientName', title: '患者姓名：',type:'input'}
            ,{field: 'customerType',type:'select', title: '查询范围：'
                , data: getSysDictByCode($.dictType.customerType, true)}
            ,{field: 'hospitalNo',type:'select', title: '中心：'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form=layui.form;
            var util=layui.util;
            var date_end =  new Date();
            var date = new Date();
            var date_begin = date.setMonth(date.getMonth()-1);
            form.val(filter,{
                "applyDate_begin":util.toDateString(date_begin,"yyyy-MM-dd"),
            });
            form.val(filter,{
                "applyDate_end":util.toDateString(date_end,"yyyy-MM-dd")
            });
            initTab();
            getHospitalAndUser();
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            field.applyDateBegin = field.applyDate_begin;
            field.applyDateEnd = field.applyDate_end;
            getTesArrangeList(field);
        }
    });
}

/**
 * 获取区名和区名下的医护人员下拉列表
 */
function getHospitalAndUser() {
    var param = {
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patReport/listHospitalAndUser.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            if(data.length>0){
                tesArrangeReport.SysHospitalList.pushArray(data);

                var userList = [];
                //清空数据，重新绑定值
                var htmlHospital ='';
                $.each(tesArrangeReport.SysHospitalList,function(i,item){
                    htmlHospital+='<option value="'+item.hospitalNo+'">'+item.hospitalName+'</option>';
                    if(tesArrangeReport.baseFuncInfo.userInfoData.hospitalNo == item.hospitalNo){
                        userList = item.sysUserList;
                    }
                });
                $("select[name='hospitalNo']").html(htmlHospital);
                $("select[name='hospitalNo']").val(tesArrangeReport.baseFuncInfo.userInfoData.hospitalNo);

                var htmlUser ='';
                if(userList.length>0){
                    $.each(userList,function(i,item){
                        htmlUser+='<option value="'+item.id+'">'+item.userName+'</option>';
                    });
                }
                var form=layui.form;
                $("select[name='userId']").html(htmlUser);
                //刷新表单渲染
                form.render();
            }
        }
    });
}

/**
 * 初始化页签（检查总项）
 */
function initTab(){
    var param={
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/testReport/getTesMainList.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            var form=layui.form; //调用layui的form模块
            var html = '';
            tesArrangeReport.testMainList = data;
            $.each(data,function(index, item){
                if(index ==0){
                    tesArrangeReport.testMainId = item.testMainId;
                    html+='<option value="'+item.testMainId+'">'+item.testName+'</option>';
                }else {
                    html+='<option value="'+item.testMainId+'">'+item.testName+'</option>';
                }
            });
            $("select[name='testMainId']").html(html);
            form.render();
            if(isNotEmpty(tesArrangeReport.testMainId)){
                getTesArrangeList();
            }
        }
    });
}


/**
 * 监控下拉
 */
function filterSelect() {
    //监控教育类型，联动主题类型
    var form=layui.form;
    form.on('select(hospitalNo)', function(data){
        if(isNotEmpty(data.value)){
            //清空数据，重新绑定值
            var htmlUser ='';
            var userList = [];
            $.each(tesArrangeReport.SysHospitalList,function(i,item){
                if(data.value == item.hospitalNo){
                    userList = item.sysUserList;
                    return false;
                }
            });
            if(userList.length>0){
                $.each(userList,function(i,item){
                    htmlUser+='<option value="'+item.id+'">'+item.userName+'</option>';
                });
            }
            $("select[name='userId']").html(htmlUser);
            $("select[name='userId']").val("");
            //刷新表单渲染
            form.render();
        }
    });
}



/**
 * 化验记录  统计
 * @param field
 */
function getTesArrangeList(field) {
    var util=layui.util;
    var param = {
        "page.pageNum":1,
        "page.pageSize":20
    };
    if(isEmpty(field)){
        var date_end =  new Date();
        var date = new Date();
        var date_begin = date.setMonth(date.getMonth()-1);
        param.applyDateBegin = util.toDateString(date_begin,"yyyy-MM-dd");
        param.applyDateEnd = util.toDateString(date_end,"yyyy-MM-dd");
        param.hospitalNo = baseFuncInfo.userInfoData.hospitalNo;
        param.testMainId = tesArrangeReport.testMainId;
        param.patientRecordNo = "";
        param.patientName = "";
        param.customerType = "";
    }else {
        param = $.extend(param,field);
    }
    _ajax({
        type: "POST",
        url:$.config.services.dialysis + "/patReport/getTesArrangeList.do",
        dataType: "json",
        data:param,
        done:function(data){
            var pageCount = data.pageCount;
            creatTable(data);
            creatPage(param,pageCount);
        }
    });
}

function creatTable(data) {
    var util=layui.util;
    var headerList = data.headerList;
    var dataList = data.dataList;
    if(dataList.length>0){
        tesArrangeReport.totalPage = true;
    }else {
        tesArrangeReport.totalPage = false;
    }
    // 列表表头
    var columnList = [
        {type: 'numbers', title: '序号',width:60 }  //序号
        ,{field: 'patientRecordNo', title: '病历号',align:'center',width:140}
        ,{field: 'patientName', title: '患者姓名',align:'center',width:120}
        ,{field: 'applyDate', title: '检查时间',align:'center',templet: function(d){
                if(isNotEmpty(d.applyDate)){
                    return util.toDateString(d.applyDate,"yyyy-MM-dd HH:mm");
                }else{
                    return "--";
                }
        }},
    ];
    if(headerList.length>0){
        for(var j=0;j<headerList.length;j++) {
            var map = headerList[j];
            for (var key in map) {
                columnList.push({field: key, title: map[key], align:'center'});
                if(key == "KTV" || key == "URR" || key == "CaMultiplyP"){
                    var applyMap = data.applyMap;
                    //获取配置公式
                    var formula = {};
                    try {
                        formula = eval(data.formula);
                    } catch (e) {
                        console.error("公式格式错误：formula=" + data.formula, e);
                    }
                    if (dataList.length > 0) {
                        for(var i=0;i<dataList.length;i++){
                            // 若配置项需公式计算，则根据中心设定的公式获取计算值
                            if (formula != null) {
                                getFormulaData(dataList[i],applyMap,formula,key);
                            } else {
                                console.error("公式不存在或格式错误。");
                            }
                        }
                    }

                }
            }
        }

    }
    _layuiTable({
        elem: '#tesArrangeReport_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'tesArrangeReport_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-200', //table的高度，页面最大高度减去差值
            data:dataList,
            page:false,
            cols: [columnList]
        }
    });
}

function creatPage(field,pageCount) {
    var laypage = layui.laypage
    laypage.render({
        elem: 'total-page'
        ,count: pageCount
        ,layout: [ 'prev', 'page', 'next','skip','count', 'limit']
        ,limit: 20
        ,limits:[10,20,30,40,50,60,70,80,90]
        ,prev:'<i class="layui-icon layui-icon-left"></i>'
        ,next:'<i class="layui-icon layui-icon-right"></i>'
        ,theme:'#72C0BB'
        ,jump: function(obj, first){
            //obj包含了当前分页的所有参数，比如：
            //首次不执行
            if(!first){
                var param = {
                    "page.pageNum":obj.curr,
                    "page.pageSize":obj.limit
                };
                if(isNotEmpty(field)){
                    param = $.extend(param,{
                        "applyDateBegin":field.applyDateBegin,
                        "applyDateEnd":field.applyDateEnd,
                        "hospitalNo":field.hospitalNo,
                        "testMainId":field.testMainId,
                        "patientRecordNo":field.patientRecordNo,
                        "patientName":field.patientName,
                        "customerType":field.customerType
                    });
                }
                _ajax({
                    type: "POST",
                    url:$.config.services.dialysis + "/patReport/getTesArrangeList.do",
                    data:param,  //必须字符串后台才能接收list,
                    dataType: "json",
                    done: function(data){
                        creatTable(data);
                    }
                });
            }
        }
    });
}

/**
 * 导出excel
 */
function exportExcel() {
    var id = $("select[name='testMainId']").val();
    var data = getSearchParam();
    if(isEmpty(data.applyDateBegin) || isEmpty(data.applyDateEnd)){
        warningToast("请选择日期");
        return false;
    }
    var name = "";
    $.each(tesArrangeReport.testMainList,function(index, item){
        if(item.testMainId == id){
            name = item.testName;
        }
    });
     name = name + "_" + data.applyDateBegin + "-" + data.applyDateEnd + ".xlsx";
    _downloadFile({
        url: $.config.services.dialysis + "/patReport/exportTesArrangeList.do",
        data:data,
        fileName: name
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("tesArrangeReport_search");
    if(isEmpty(searchParam.applyDate_begin) && isEmpty(searchParam.applyDate_end)){
        var util=layui.util;
        var date_end =  new Date();
        var date = new Date();
        var date_begin = date.setMonth(date.getMonth()-1);
        searchParam.applyDateBegin = util.toDateString(date_begin,"yyyy-MM-dd");
        searchParam.applyDateEnd = util.toDateString(date_end,"yyyy-MM-dd");
        searchParam.hospitalNo = baseFuncInfo.userInfoData.hospitalNo;
        searchParam.testMainId = tesArrangeReport.testMainId;
        searchParam.patientRecordNo = "";
        searchParam.patientName = "";
        searchParam.customerType = "";
    }else {
        searchParam.applyDateBegin = searchParam.applyDate_begin;
        searchParam.applyDateEnd = searchParam.applyDate_end;
    }
    return $.extend({
    }, searchParam)
}

/**
 * 检验项计算公式 返回结果
 * @param map
 * @param formula
 */
function getFormulaData(obj,applyMap,formula,key){
    var applyId = obj.applyId;
    var formulaMap = applyMap[applyId];
    if(formulaMap == null || formulaMap == undefined){
        return "";
    }
    if (key == "KTV") {
        var formulaData = {
            ureaB: Number(formulaMap.UREAB), // 透前尿素
            ureaA: Number(formulaMap.UREAA), // 透后尿素
            dialysisHours: Number(formulaMap.DialysisHours), // 透析时长
            actualDehydration: Number(formulaMap.ActualDehydration), // 实际脱水量
            weightA: Number(formulaMap.WeightA) // 透后体重
        };
        // 获取显示项的值
        var relatedItemValue = -1;
        if (formula != null && typeof formula.getKtvValue === 'function') {
            relatedItemValue = formula.getKtvValue(formulaData);
        } else {
            console.error("公式（" + getKtvValue + "）不存在或格式错误。");
        }
        obj[key] = relatedItemValue;
    }
    if (key == "URR") {
        var formulaData = {
            ureaB: Number(formulaMap.UREAB), // 透前尿素
            ureaA: Number(formulaMap.UREAA) // 透后尿素
        };
        // 获取显示项的值
        var relatedItemValue = -1;
        if (formula != null && typeof formula.getUrrValue === 'function') {
            relatedItemValue = formula.getUrrValue(formulaData);
        } else {
            console.error("公式（" + getUrrValue + "）不存在或格式错误。");
        }
        obj[key] = relatedItemValue;
    }
    if (key == "CaMultiplyP") {
        var formulaData = {
            alb: Number(formulaMap.ALB), // 白蛋白
            caB: Number(formulaMap.CaB), // 透前钙
            pB: Number(formulaMap.PB)    // 透前磷
        };
        // 获取显示项的值
        var relatedItemValue = -1;
        if (formula != null && typeof formula.getCaPValue === 'function') {
            relatedItemValue = formula.getCaPValue(formulaData);
        } else {
            console.error("公式（" + getCaPValue + "）不存在或格式错误。");
        }
        obj[key] = relatedItemValue;
    }
}