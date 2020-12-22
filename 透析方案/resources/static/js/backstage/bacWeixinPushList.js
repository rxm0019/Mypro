/**
 * bacWeixinPushList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var bacWeixinPushList = avalon.define({
    $id: "bacWeixinPushList",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,createTimeBegin: ''
    ,createTimeEnd: ''
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        bacWeixinPushList.createTimeBegin = layui.util.toDateString(new Date(), 'yyyy-MM-dd');
        bacWeixinPushList.createTimeEnd = getNextMonth(new Date());
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
        elem: '#bacWeixinPushList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacWeixinPushList_search'  //指定的lay-filter
        ,conds:[
            {field: 'patientName', title: '患者姓名：',type:'input'}
            ,{field: 'pushType', title: '推送模块：',type:'select',data: getSysDictByCode('PushModule', true)}
            ,{field: 'createTime', title: '日期：',type:'date_range'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
            $('input[name="createTime_begin"]').val(bacWeixinPushList.createTimeBegin);
            $('input[name="createTime_end"]').val(bacWeixinPushList.createTimeEnd);
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
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('bacWeixinPushList_table',{
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
        createTimeBegin: bacWeixinPushList.createTimeBegin + ' 00:00:00',
        createTimeEnd: bacWeixinPushList.createTimeEnd + ' 23:59:59'
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#bacWeixinPushList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacWeixinPushList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            // height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/bacWeixinPush/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'patientName', title: '患者姓名',align:'center'}
                ,{field: 'createTime', title: '推送时间',align:'center'
                    ,templet:function (d) {
                        return util.toDateString(d.createTime, 'yyyy-MM-dd');
                    }}
                ,{field: 'pushType', title: '推送模块',align:'center'
                    ,templet:function (d) {
                        return getSysDictName('PushModule', d.pushType);
                    }}
                ,{field: 'relationName', title: '推送内容',align: 'center'}
                ,{fixed: 'right',title: '操作',width: 140, align:'center'
                    ,toolbar: '#bacWeixinPushList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'preview'){ //编辑
                //do something
                if(isNotEmpty(data.pushId)){
                    previewTheme(data.pushType, data.patientId, data.relationId);
                }
            }
        }
    });
}

/**
 * 预览
 */
function previewTheme(pushType, patientId, relationId) {
    var url = $.config.server + '/backstage/bacWeixinPushShow?pushType=' + pushType + '&patientIdStr=' + patientId + '&relationId=' + relationId;
    var title = '';
    if (pushType === $.constant.PushModule.HEALTHEDUCATION) {   //健康教育预览
        title = '健康教育查看';
    } else if (pushType === $.constant.PushModule.PATIENTSCHEDUL) {  //患者排班预览
        title = '患者排班查看';
    } else if (pushType === $.constant.PushModule.NOTICE) {  //公告预览
        title = '公告查看';
    }

    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1000, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        btn:[],
        done:function(index,iframeWin, layer){

        }
    });
}

/**
 * 推送
 */
function modulePush(pushType){
    var url=$.config.server + "/backstage/bacWeixinPushEdit?pushType=" + pushType;
    var title="";
    if(pushType === $.constant.PushModule.HEALTHEDUCATION){  //健康教育推送
        title="健康教育推送";
    } else if (pushType === $.constant.PushModule.PATIENTSCHEDUL) {
        title = '患者排班推送';
    } else if (pushType === $.constant.PushModule.NOTICE) {
        title = '公告推送';
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        btn: ['推送', '取消'],
        done:function(index,iframeWin,layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("推送成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('bacWeixinPushList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}
