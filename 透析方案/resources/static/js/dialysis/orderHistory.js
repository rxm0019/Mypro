/**
 * orderHistory.js的js文件，查看医嘱历史功能
 * @author anders
 * @date 2020-08-24
 * @version 1.0
 */
var orderHistory = avalon.define({
    $id: "orderHistory",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,patientId: ''
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch();
        orderHistory.patientId = GetQueryString('patientId');

        getList();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#orderHistory_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'orderHistory_search'  //指定的lay-filter
        ,limit: 3
        ,conds:[
            {field: 'orderType', title: '类别：',type:'select',data:getSysDictByCode('OrderType', true)}
            ,{field: 'orderContent', title: '医嘱内容：',type:'input'}
            ,{field: 'dialysisDate', title: '日期：',type:'date_range'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            if (isNotEmpty(field.dialysisDate_end) && field.dialysisDate_begin > field.dialysisDate_end) {
                warningToast('开始日期不能大于结束日期');
                return false;
            }
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('orderHistory_table',{
                where:field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table = layui.table;
    var param = {
        patientId: orderHistory.patientId
    };
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#orderHistory_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'orderHistory_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height:'full-95', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/diaExecuteOrder/orderHistoryList.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {field: 'orderType', title: '类别', align: 'center',width:100
                    , templet: function (d) {
                        if (d.orderType === '1') {
                            return '药疗';
                        } else if (d.orderType === '2') {
                            return '诊疗';
                        } else if (d.orderType === '3') {
                            return '检验';
                        } else if (d.orderType === '4') {
                            return '处置';
                        } else {
                            return '其他';
                        }
                    }
                }
                ,{field: 'orderContent', title: '医嘱名称', align: 'center', width: 300
                    , templet: function (d) {
                        return  d.orderContent;
                    }
                }
                ,{field: 'manufactor', title: '生产厂商', align: 'center',width:300}
                ,{field: 'basicUnit', title: '基本剂量单位', align: 'center',width:100}
                ,{field: 'frequency', title: '频率', align: 'center',width:100,templet:function (d) {
                        return getSysDictName('OrderFrequency', d.frequency);
                    }}
                ,{field: 'dosage', title: '剂量', align: 'center',width:80}
                ,{field: 'channel', title: '途径', align: 'center',width:100
                    , templet: function (d) {
                        if (isEmpty(d.channel)) {
                            return '-';
                        }
                        return getSysDictName('Route', d.channel);
                    }
                }
                ,{field: 'usageDays', title: '天数', align: 'center',width:80}
                ,{field: 'totalDosage', title: '总量', align: 'center',width:80}
                ,{field: 'executeOrderDoctorName', title: '开嘱医生<br>提交时间', align: 'center',width:100
                    , templet: function (d) {
                        var html = '<div>' + d.executeOrderDoctorName + '</div><div>' + util.toDateString(d.submitOrderDate, "HH:mm") + '</div>';
                        if (d.orderStatus === $.constant.orderStatus.NOT_COMMIT) {   //未提交
                            return d.executeOrderDoctorName;
                        }
                        return html;
                    }
                }
                ,{field: 'executeOrderNurseName', title: '执行护士<br>执行时间', align: 'center',width:100
                    , templet: function (d) {
                        var html = '<div>' + d.executeOrderNurseName + '</div><div>' + util.toDateString(d.executeOrderDate, "HH:mm") + '</div>';
                        if (d.orderStatus === $.constant.orderStatus.NOT_COMMIT || d.orderStatus === $.constant.orderStatus.SUBMITTED) {
                            return '';
                        } else if (d.orderStatus === $.constant.orderStatus.EXECUTED || d.orderStatus === $.constant.orderStatus.CHECKED || d.orderStatus === $.constant.orderStatus.CANCEL_CHECKED) {
                            return html;
                        } else if (d.orderStatus === $.constant.orderStatus.CANCELLED_EXECUTE) {
                            return d.executeOrderNurseName;
                        }
                    }
                }
                ,{field: 'checkOrderNurseName', title: '核对护士<br>核对时间', align: 'center',width:100
                    , templet: function (d) {
                        var html = '<div>' + d.checkOrderNurseName + '</div><div>' + util.toDateString(d.checkOrderDate, "HH:mm") + '</div>';
                        if (d.orderStatus === $.constant.orderStatus.NOT_COMMIT || d.orderStatus === $.constant.orderStatus.SUBMITTED || d.orderStatus === $.constant.orderStatus.EXECUTED) {
                            return '';
                        } else if (d.orderStatus === $.constant.orderStatus.CHECKED) {
                            return html;
                        } else if(d.orderStatus === $.constant.orderStatus.CANCEL_CHECKED || d.orderStatus === $.constant.orderStatus.CANCELLED_EXECUTE) {
                            return d.checkOrderNurseName;
                        }
                    }
                }
                ,{field: 'orderStatus', title: '操作', width: 100, align: 'center',templet:function (d) {
                    var returnStr = '';
                    if (d.orderStatus === $.constant.orderStatus.NOT_COMMIT) {
                        returnStr = '未提交';
                    } else if (d.orderStatus === $.constant.orderStatus.SUBMITTED) {
                        returnStr = '待执行';
                    } else if (d.orderStatus === $.constant.orderStatus.EXECUTED) {
                        returnStr = '待核对';
                    } else if (d.orderStatus === $.constant.orderStatus.CHECKED) {
                        returnStr = '已核对';
                    } else if (d.orderStatus === $.constant.orderStatus.CANCEL_CHECKED) {
                        returnStr = '已取消核对';
                    }
                    return returnStr;
                }}
            ]]
        }
    });

}


/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //导出组套

}



