/**
 * 透析机消毒
 * @author: Freya
 * @version: 1.0
 * @date: 2020/10/10
 */
var diaDisinfectList = avalon.define({
    $id: "diaDisinfectList",
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
        elem: '#diaDisinfectList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'diaDisinfectList_search'  //指定的lay-filter
        ,conds:[
            {field: 'scheduleShift', title: '班次：',type:'select'
                ,data:getSysDictByCode("Shift",true)}
            ,{field: 'regionId', title: '区域：',type:'select',data:getRegionList()}
            ,{field: 'bedNo', title: '床号：',type:'input'}
            ,{field: 'codeNo', title: '透析机号：',type:'input'}
            ,{field: 'date', title: '消毒日期：',type:'date_range'}
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
            table.reload('diaDisinfectList_table',{
                where:field
            });
        }
    });
}

//获取区域列表
function getRegionList(){
    var dicts=[];
    dicts.push({value:"",name:"全部"});
    var param = {
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basRegionSetting/getLists.do",
        data:param,
        dataType: "json",
        async:false,
        done: function(data){
            if(data != null && data.length>0){
                for(var i=0;i<data.length;i++){
                    dicts.push({value:data[i].regionSettingId,name:data[i].wardRegionName});
                }
            }
        }
    });
    return dicts;
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
        elem: '#diaDisinfectList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'diaDisinfectList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/diaDisinfect/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'startTime', title: '消毒日期',align:'center',minWidth:105
                    ,templet: function(d){
                        return util.toDateString(d.startTime,"yyyy-MM-dd");
                    }}
                ,{field: 'scheduleShift', title: '班次',align:'center'
                    ,templet: function(d){
                        return getSysDictName("Shift",d.scheduleShift);
                    }}
                ,{field: 'regionName', title: '区域',align:'center',minWidth:110}
                ,{field: 'bedNo', title: '床号',align:'center'}
                ,{field: 'codeNo', title: '透析机编号',align:'center',minWidth:115}
                ,{field: 'infectionMark', title: '感染标志',align:'left',minWidth:110
                    ,templet: function(d){
                        return getSysDictNameList("InfectionMark",d.infectionMark);
                    }}
                ,{field: 'startTime', title: '开始时间',align:'center',minWidth:92
                    ,templet: function(d){
                    return util.toDateString(d.startTime,"HH:mm");
                }}
                ,{field: 'endTime', title: '结束时间',align:'center',minWidth:92
                    ,templet: function(d){
                    return util.toDateString(d.endTime,"HH:mm");
                }}
                ,{field: 'disinfectHour', title: '消毒时长',align:'center',minWidth:135
                    ,templet: function(d){
                        return changeTime(d.disinfectHour,d.disinfectMin);
                    }}
                ,{field: 'disinfectOrder', title: '消毒程序',align:'center',minWidth:135
                    ,templet: function(d){
                        return getSysDictName("DisinfectOrder",d.scheduleShift);
                    }}
                ,{field: 'sheetChange', title: '床单更换',align:'center',minWidth:95
                    ,templet: function(d){
                        return getSysDictName("SheetChange",d.sheetChange);
                    }}
                ,{field: 'disinfectSurface', title: '表面消毒方式',align:'left',minWidth:105
                    ,templet: function(d){
                        return getSysDictName("DisinfectSurface",d.disinfectSurface);
                    }}
                ,{field: 'userName', title: '操作者',align:'center',minWidth:95}
            ]]
        }
    });
}
/**
 * 获取数据字典的名称List，专用于列表显示
 * @param code
 * @param value
 */
function getSysDictNameList(code,value) {
    var name="";
    if(value !=null && value !=""){
        var characteristicsarr = value.split(',');
        for(var i in characteristicsarr){
            var tmp = getSysDictName(code,characteristicsarr[i]);
            name = name+tmp+","
        }
        name = name.substring(0,name.length-1);
    }else{
        name = "无";
    }
    return name;
}

//消毒时长处理
function changeTime(disinfectHour,disinfectMin) {
    if(isNotEmpty(disinfectHour) && isEmpty(disinfectMin)){
        return disinfectHour+"小时";
    }else if(isEmpty(disinfectHour) && isNotEmpty(disinfectMin)){
        return disinfectMin+"分钟";
    }else if(isNotEmpty(disinfectHour) && isNotEmpty(disinfectMin)){
        return disinfectHour+"小时"+disinfectMin+"分钟";
    }else{
        return "";
    }
}
/**
 * 导出excel
 */
function exportExcel() {
    var fileName = '透析机消毒记录列表.xlsx';
    _downloadFile({
        url: $.config.services.dialysis + "/diaDisinfect/export.do",
        data: getSearchParam(),
        fileName: fileName
    });
}
/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('diaDisinfectList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    var ids=[];
    //判断是否勾选全选，全选按查询条件查询，否则按所选id查询
    $("input:checkbox[name='layTableCheckbox']").each(function () {
        if(this.checked == true){
            ids=[];
        }else{
            $.each(data,function(i,item){
                ids.push(item.disinfectId);
            });
        }
    });
    var searchParam = layui.form.val("diaDisinfectList_search");
    searchParam.ids = ids;
    return $.extend({
        scheduleShift: '',
        regionId: '',
        bedNo: '',
        codeNo: '',
        date_begin: '',
        date_end: '',
        ids:[],
    }, searchParam)
}
