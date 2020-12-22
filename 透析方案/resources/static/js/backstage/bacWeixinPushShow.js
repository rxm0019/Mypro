/**
 * 微信推送预览
 * @author anders
 * @date 2020-09-29
 * @version 1.0
 */
var bacWeixinPushShow = avalon.define({
    $id: "bacWeixinPushShow",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientIds: [],    //患者id
    pushType: '',     //推送模块
    relationId: '',    //推送内容id
    createTimeBegin: '',
    createTimeEnd: '',
    pushModule: $.constant.PushModule
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //默认查询一个月的数据
        bacWeixinPushShow.createTimeBegin = layui.util.toDateString(new Date(), 'yyyy-MM-dd');
        bacWeixinPushShow.createTimeEnd = getNextMonth(new Date());

        var patientIdStr = GetQueryString('patientIdStr');  //接收变量
        var pushType = GetQueryString('pushType');    //推送模块
        var relationId = GetQueryString('relationId');   //推送内容id
        bacWeixinPushShow.patientIds = isEmpty(patientIdStr) ? [] : patientIdStr.split(',');
        bacWeixinPushShow.pushType = isEmpty(pushType) ? '' : pushType;
        bacWeixinPushShow.relationId = isEmpty(relationId) ? '' : relationId;

        if (pushType === $.constant.PushModule.PATIENTSCHEDUL) {
            initSearch();
            getPatientScheduleList();
        } else {
            getInfo(pushType, relationId);
        }
        avalon.scan();
    });
});

/**
 * 初始化查询条件
 */
function initSearch() {
    _initSearch({
        elem: '#patientScheduleList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'patientScheduleList_search'  //指定的lay-filter
        ,conds:[
            {field: 'createTime', title: '排班日期：',type:'date_range'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
            $('input[name="createTime_begin"]').val(bacWeixinPushShow.createTimeBegin);
            $('input[name="createTime_end"]').val(bacWeixinPushShow.createTimeEnd);
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            if (isNotEmpty(field.createTime_end) && field.createTime_begin > field.createTime_end) {
                warningToast('开始时间不能大于结束时间');
                return false;
            }
            field.createTimeBegin = field.createTime_begin;
            field.createTimeEnd = field.createTime_end;
            bacWeixinPushShow.createTimeBegin = field.createTimeBegin;
            bacWeixinPushShow.createTimeEnd = field.createTimeEnd;
            getPatientScheduleList();
        }
    });
}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(pushType, relationId){
    var param={
        relationId: relationId,
        pushType: pushType
    };
    var url =  $.config.services.platform + "/bacWeixinPush/getThemeContent.do";
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: url,
        data:param,
        dataType: "json",
        done:function(data){
            $("#content").html(data.themeContent);
        }
    });
}

/**
 * 获取患者排班信息
 */
function getPatientScheduleList() {
    var param = {
        patientIds: bacWeixinPushShow.patientIds,
        createTimeBegin: bacWeixinPushShow.createTimeBegin,
        createTimeEnd: bacWeixinPushShow.createTimeEnd
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patientScheduleList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patientScheduleList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/bacWeixinPush/getPatientScheduleList.do", // ajax的url必须加上getRootPath()方法
            where:{jsonData: JSON.stringify(param)}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'patientName', title: '患者姓名', align: 'center'}
                ,{field: 'scheduleDate', title: '日期',align:'center'
                    ,templet:function (d) {
                        return util.toDateString(d.scheduleDate, 'yyyy-MM-dd');
                    }}
                ,{field: 'scheduleShift', title: '班次',align:'center'
                    ,templet:function (d) {
                        return getSysDictName('Shift', d.scheduleShift);
                    }}
                ,{field: 'regionName', title: '透析区域',align: 'center'}
                ,{field: 'bedNo', title: '床位',align: 'center'}
                ,{field: 'dialysisMode', title: '透析方式',align: 'center'
                    ,templet: function (d) {
                        return getSysDictName('DialysisMode', d.dialysisMode);
                    }}
            ]]
        }
    });
}
