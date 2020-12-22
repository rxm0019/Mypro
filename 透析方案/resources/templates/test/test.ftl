<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>
        /* 固定行高 */
        .layui-table-cell {
            height: 45px;
            line-height: 28px;
        }

        /* 子医嘱添加特殊背景色 */
        .sub-order-tr {
            background-color: rgba(242, 242, 242, 0.5);
        }

        /* 执行医嘱内容 */
        .execute-order-content {
            display: inline-flex;
            align-content: stretch;
        }
        /* 执行医嘱内容 - 展开/折叠Icon */
        .execute-order-content .icon-box {
            flex: 0 0 25px;
            padding-top: 10px;
        }
        .execute-order-content .icon-box .layui-icon {
            border: 1px solid rgba(51, 171, 159, 1);
            color: rgba(51, 171, 159, 1);
            font-size: 12px;
            padding: 1px;
        }
        .execute-order-content.fold .icon-box .layui-icon-addition:before {
            content: "\e67e";
        }
        /* 执行医嘱内容 - 厂家 */
        .execute-order-content .content-manufactor {
            color: #797979;
            line-height: 14px;
            font-size: 12px;
        }
        /* 执行医嘱内容 - 子医嘱内容缩进 */
        .execute-order-content.sub-order .content {
            padding-left: 55px;
        }
    </style>
</head>
<body ms-controller="test">

<table id="executeOrder_table" lay-filter="executeOrder_table"></table>

<script type="text/html" id="executeOrder_orderContentTemplet">
    <#-- 子医嘱-->
    {{#  if (d.parentOrderId) { }}
        <div class="execute-order-content sub-order" data-parent-order-id="{{d.parentOrderId}}">
            <div class="content">
                <div>{{d.orderContent}}<span>#</span>{{d.specifications}}</div>
                <div class="content-manufactor" style="color: #797979;">厂家：{{d.manufactor}}</div>
            </div>
        </div>
    {{#  } }}

    <#-- 父医嘱-->
    {{#  if (!d.parentOrderId) { }}
        <div class="execute-order-content" data-order-id="{{d.orderId}}">
            <div class="icon-box" lay-event="toggle-fold-suborder">
                <i class="layui-icon layui-icon-addition"></i>
            </div>
            <div class="content">
                <div>{{d.orderContent}}<span>#</span>{{d.specifications}}</div>
                <div class="content-manufactor">厂家：{{d.manufactor}}</div>
            </div>
        </div>
    {{#  } }}
</script>

<!-- 执行渲染, 把原始select美化~~ -->
<script type="text/javascript">
    layui.use(['index', 'table'], function () {
        _layuiTable({
            elem: '#executeOrder_table', //必填，指定原始表格元素选择器（推荐id选择器）
            filter: 'executeOrder_table', ////必填，指定的lay-filter的名字
            //执行渲染table配置
            render: {
                height:'full-180', //table的高度，页面最大高度减去差值
                cols: [[ //表头
                    {fixed: 'left', type: 'checkbox'},  //开启编辑框
                    {field: 'stockCount', title: '库存', align: 'center', width: 70},
                    {field: 'orderContent', title: '医嘱名称#规格', align: 'left', width: 400, toolbar: '#executeOrder_orderContentTemplet'},
                    {field: 'dosage', title: '单次剂量 x 频率 x 天数', align: 'center',width:180},
                    {field: 'channel', title: '途径', align: 'center'},
                    {field: 'totalDosage', title: '总量<br>总量(取整)', align: 'center',width:100},
                    {field: 'startDate', title: '起始日期<br>循环周期', align: 'center',width:200},
                    {field: 'dataStatus', title: '使用状态', align: 'center',width:90},
                    {field: 'establishUserName', title: '开嘱医生<br>下达日期', align: 'center',width:100},
                    {field: 'disabledUserName', title: '停用人<br>停用时间', align: 'center',width:100},
                    {fixed: 'right', title: '操作', width: 140, align: 'center', toolbar: '#orderList_bar'},
                ]],
                data: [
                    {"allowSplitDispense":"N","basicUnit":"","category":"0","channel":"1","conversionRel2Basic":10,"conversionRel2Sales":1,"createBy":"5f9a6441a8f1faafd4f27677","createTime":1603954606000,"customEdit":"N","cycleEveryTimes":null,"cycleType":"0","cycleWeekDays":"","cycleWeekType":"","dataStatus":"0","dataSync":"0","dialysisTimes":4,"disabledDatetime":1604893695000,"disabledUserId":"5f9a5d00fe9e8f0859e1dc2c","disabledUserName":"anders","dosage":1.00,"endDate":1603900800000,"establishDate":1603900800000,"establishDateBegin":null,"establishDateEnd":null,"establishUserId":"5f9a5d00fe9e8f0859e1dc2c","establishUserName":"anders","frequency":"0","hospitalNo":"1001","manufactor":"","openingDate":1597334400000,"orderContent":"20%甘露醇（上海百特）（250ml:50g*1）","orderDictId":"5f504051a5ed8fa13eb6cc60","orderId":"5f9a67aea8f135ba1793bb3d","orderNo":1,"orderSubType":"31","orderType":"1","page":null,"parentOrderId":"","patientId":"aa7cee41cc8814eaaf5900163e026c3a","patientName":"","patientRecordNo":"","remarks":"","salesUnit":"盒","scheduleShift":"","specifications":"","startDate":1603900800000,"stockCount":0,"stockLockCount":0,"stockUnit":"","testType":"","totalDosage":1,"type":"1","updateBy":"5f9a5d00fe9e8f0859e1dc2c","updateTime":1604893695000,"usageDays":1},
                    {"allowSplitDispense":"N","basicUnit":"支","category":"0","channel":"0","conversionRel2Basic":10,"conversionRel2Sales":1,"createBy":"5f9a5d00fe9e8f0859e1dc2c","createTime":1604631253000,"customEdit":"N","cycleEveryTimes":0,"cycleType":"0","cycleWeekDays":"","cycleWeekType":"","dataStatus":"0","dataSync":"0","dialysisTimes":4,"disabledDatetime":-62135798400000,"disabledUserId":"","disabledUserName":"","dosage":11.11,"endDate":1604592000000,"establishDate":1604592000000,"establishDateBegin":null,"establishDateEnd":null,"establishUserId":"5fa4f72ffe9e90e8ea309134","establishUserName":"shdai","frequency":"1","hospitalNo":"1001","manufactor":"天津金耀集团湖北天药药业股份有限公司","openingDate":1597334400000,"orderContent":"【开药外带】999感冒灵颗粒(10g*9）#10ml:1g*1#天津金耀集团湖北天药药业股份有限公司","orderDictId":"5f470a9f9ab54b0f109590fb","orderId":"5fa4bad4fe9eb12911874ea2","orderNo":1,"orderSubType":"31","orderType":"1","page":null,"parentOrderId":"5f9a67aea8f135ba1793bb3d","patientId":"aa7cee41cc8814eaaf5900163e026c3a","patientName":"","patientRecordNo":"","remarks":"","salesUnit":"HE","scheduleShift":"","specifications":"10ml:1g*1","startDate":1604592000000,"stockCount":1320,"stockLockCount":1326,"stockUnit":"支","testType":"","totalDosage":45,"type":"1","updateBy":"5f9a5d00fe9e8f0859e1dc2c","updateTime":1604650709000,"usageDays":2},
                    {"allowSplitDispense":"N","basicUnit":"支","category":"0","channel":"0","conversionRel2Basic":10,"conversionRel2Sales":1,"createBy":"5f9a5d00fe9e8f0859e1dc2c","createTime":1604631253000,"customEdit":"N","cycleEveryTimes":0,"cycleType":"0","cycleWeekDays":"","cycleWeekType":"","dataStatus":"0","dataSync":"0","dialysisTimes":4,"disabledDatetime":-62135798400000,"disabledUserId":"","disabledUserName":"","dosage":1.00,"endDate":1604592000000,"establishDate":1604592000000,"establishDateBegin":null,"establishDateEnd":null,"establishUserId":"5f9a5d00fe9e8f0859e1dc2c","establishUserName":"anders","frequency":"0","hospitalNo":"1001","manufactor":"河北天成药业股份有限公司","openingDate":1597334400000,"orderContent":"氯化钾#10ml:1g*1#河北天成药业股份有限公司","orderDictId":"5f48aefefe9e7a6a574105ef","orderId":"5fa4bad4fe9eb12911874ea3","orderNo":1,"orderSubType":"17","orderType":"1","page":null,"parentOrderId":"5f9a67aea8f135ba1793bb3d","patientId":"aa7cee41cc8814eaaf5900163e026c3a","patientName":"","patientRecordNo":"","remarks":"","salesUnit":"HE","scheduleShift":"","specifications":"10ml:1g*1","startDate":1604592000000,"stockCount":3153,"stockLockCount":106,"stockUnit":"支","testType":"","totalDosage":2,"type":"1","updateBy":"5f9a5d00fe9e8f0859e1dc2c","updateTime":1604631253000,"usageDays":2},
                    {"allowSplitDispense":"N","basicUnit":"ml","category":"0","channel":"0","conversionRel2Basic":10,"conversionRel2Sales":1,"createBy":"5f30abbdabe4b6acbe3b211","createTime":1599556861000,"customEdit":"N","cycleEveryTimes":null,"cycleType":"1","cycleWeekDays":"3,4,5","cycleWeekType":"0","dataStatus":"0","dataSync":"0","dialysisTimes":4,"disabledDatetime":-62135798400000,"disabledUserId":"","disabledUserName":"","dosage":100.11,"endDate":1599753600000,"establishDate":1599494400000,"establishDateBegin":null,"establishDateEnd":null,"establishUserId":"5f9a5d00fe9e8f0859e1dc2c","establishUserName":"anders","frequency":"1","hospitalNo":"1001","manufactor":"天津金耀集团湖北天药药业股份有限公司","openingDate":1597334400000,"orderContent":"【开药外带】999感冒灵颗粒(10g*9）#10ml:1g*1#天津金耀集团湖北天药药业股份有限公司","orderDictId":"5f470a9f9ab54b0f109590fb","orderId":"5f574cfcfe9e7f8e68037c10","orderNo":1,"orderSubType":"31","orderType":"1","page":null,"parentOrderId":"","patientId":"aa7cee41cc8814eaaf5900163e026c3a","patientName":"","patientRecordNo":"","remarks":"","salesUnit":"HE","scheduleShift":"","specifications":"10ml:1g*1","startDate":1599580800000,"stockCount":1320,"stockLockCount":1326,"stockUnit":"支","testType":"","totalDosage":200,"type":"1","updateBy":"5f9a5d00fe9e8f0859e1dc2c","updateTime":1604024442000,"usageDays":1},
                    {"allowSplitDispense":"N","basicUnit":"ml","category":"0","channel":"0","conversionRel2Basic":10,"conversionRel2Sales":1,"createBy":"5f30abbdabe4b6acbe3b211","createTime":1601017682000,"customEdit":"N","cycleEveryTimes":0,"cycleType":"0","cycleWeekDays":"","cycleWeekType":"","dataStatus":"0","dataSync":"0","dialysisTimes":4,"disabledDatetime":-62135798400000,"disabledUserId":"","disabledUserName":"","dosage":100.00,"endDate":1609430400000,"establishDate":1600963200000,"establishDateBegin":null,"establishDateEnd":null,"establishUserId":"5f9a5d00fe9e8f0859e1dc2c","establishUserName":"anders","frequency":"1","hospitalNo":"1001","manufactor":"天津金耀集团湖北天药药业股份有限公司","openingDate":1597334400000,"orderContent":"【开药外带】999感冒灵颗粒(10g*9）#10ml:1g*1#天津金耀集团湖北天药药业股份有限公司","orderDictId":"5f470a9f9ab54b0f109590fb","orderId":"5f6d9752fe9e772e2fb9799d","orderNo":1,"orderSubType":"31","orderType":"1","page":null,"parentOrderId":"","patientId":"aa7cee41cc8814eaaf5900163e026c3a","patientName":"","patientRecordNo":"","remarks":"","salesUnit":"HE","scheduleShift":"","specifications":"10ml:1g*1","startDate":1600963200000,"stockCount":1320,"stockLockCount":1326,"stockUnit":"支","testType":"","totalDosage":400,"type":"1","updateBy":"5f9a5d00fe9e8f0859e1dc2c","updateTime":1604024431000,"usageDays":2},
                    {"allowSplitDispense":"N","basicUnit":"支","category":"0","channel":"0","conversionRel2Basic":10,"conversionRel2Sales":1,"createBy":"5f4c52677e5cf45cbf62bd97","createTime":1603272527000,"customEdit":"N","cycleEveryTimes":null,"cycleType":"1","cycleWeekDays":"1,2,3,4,5,6,7","cycleWeekType":"0","dataStatus":"0","dataSync":"0","dialysisTimes":4,"disabledDatetime":-62135798400000,"disabledUserId":"","disabledUserName":"","dosage":1.00,"endDate":1634745600000,"establishDate":1603209600000,"establishDateBegin":null,"establishDateEnd":null,"establishUserId":"5f9a5d00fe9e8f0859e1dc2c","establishUserName":"anders","frequency":"0","hospitalNo":"1001","manufactor":"回音必集团(江西)东亚制药有限公司","openingDate":1597334400000,"orderContent":"氯化钾#10ml:1g*1#河北天成药业股份有限公司","orderDictId":"5f48aefefe9e7a6a574105ef","orderId":"5f8fff4e9ab52a39379fb1cc","orderNo":1,"orderSubType":"17","orderType":"1","page":null,"parentOrderId":"","patientId":"aa7cee41cc8814eaaf5900163e026c3a","patientName":"","patientRecordNo":"","remarks":"","salesUnit":"HE","scheduleShift":"","specifications":"250ml:12.5g*1","startDate":1603209600000,"stockCount":3153,"stockLockCount":106,"stockUnit":"支","testType":"","totalDosage":1,"type":"1","updateBy":"5f9a5d00fe9e8f0859e1dc2c","updateTime":1604023914000,"usageDays":1},
                    {"allowSplitDispense":"N","basicUnit":"支","category":"0","channel":"0","conversionRel2Basic":10,"conversionRel2Sales":1,"createBy":"5f4c52677e5cf45cbf62bd97","createTime":1603275405000,"customEdit":"N","cycleEveryTimes":null,"cycleType":"0","cycleWeekDays":"","cycleWeekType":"","dataStatus":"0","dataSync":"0","dialysisTimes":4,"disabledDatetime":-62135798400000,"disabledUserId":"","disabledUserName":"","dosage":11.11,"endDate":1697817600000,"establishDate":1603209600000,"establishDateBegin":null,"establishDateEnd":null,"establishUserId":"5f9a5d00fe9e8f0859e1dc2c","establishUserName":"anders","frequency":"1","hospitalNo":"1001","manufactor":"天津金耀集团湖北天药药业股份有限公司","openingDate":1597334400000,"orderContent":"【开药外带】999感冒灵颗粒(10g*9）#10ml:1g*1#天津金耀集团湖北天药药业股份有限公司","orderDictId":"5f470a9f9ab54b0f109590fb","orderId":"5f900a8d9ab52a39379fb1f4","orderNo":1,"orderSubType":"31","orderType":"1","page":null,"parentOrderId":"","patientId":"aa7cee41cc8814eaaf5900163e026c3a","patientName":"","patientRecordNo":"","remarks":"","salesUnit":"HE","scheduleShift":"","specifications":"10ml:1g*1","startDate":1603209600000,"stockCount":1320,"stockLockCount":1326,"stockUnit":"支","testType":"","totalDosage":45,"type":"1","updateBy":"5f9a5d00fe9e8f0859e1dc2c","updateTime":1604023900000,"usageDays":2}
                ],
                done: function (res, curr, count) {
                    // 所有子医嘱添加特殊背景色
                    var tableTarget = $("[lay-id='executeOrder_table']");
                    var subOrderTrs = tableTarget.find(".execute-order-content.sub-order[data-parent-order-id]").closest("tr[data-index]");
                    $.each(subOrderTrs, function (index, item) {
                        var dataIndex = $(item).attr("data-index");
                        tableTarget.find(".layui-table-body table tr[data-index='" + dataIndex + "']").addClass("sub-order-tr");
                    });
                }
            },
            // 监听工具条事件
            tool: function (obj, filter) {
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                var tr = obj.tr; //获得当前行 tr 的DOM对象
                if (layEvent === 'toggle-fold-suborder') {
                    var orderId = data.orderId;
                    var tableTarget = $("[lay-id='executeOrder_table']");
                    // 父医嘱行
                    var orderTr = tableTarget.find(".execute-order-content[data-order-id='" + orderId + "']").closest("tr[data-index]");
                    // 子医嘱行
                    var subOrderTrs = tableTarget.find(".execute-order-content.sub-order[data-parent-order-id='" + orderId + "']").closest("tr[data-index]");

                    // 展开/折叠子医嘱
                    var isOrderTrFold = orderTr.find(".execute-order-content").hasClass("fold");
                    console.log("orderTr", orderTr, isOrderTrFold, orderId);
                    if (isOrderTrFold) {
                        // 若父医嘱是折叠状态，则展开子医嘱，并设置父医嘱为展开状态
                        $.each(subOrderTrs, function (index, item) {
                            var dataIndex = $(item).attr("data-index");
                            tableTarget.find(".layui-table-body table tr[data-index='" + dataIndex + "']").show();
                        });
                        orderTr.find(".execute-order-content").removeClass("fold");
                    } else {
                        // 否则，则隐藏子医嘱，并设置父医嘱为折叠状态
                        $.each(subOrderTrs, function (index, item) {
                            var dataIndex = $(item).attr("data-index");
                            tableTarget.find(".layui-table-body table tr[data-index='" + dataIndex + "']").hide();
                        });
                        orderTr.find(".execute-order-content").addClass("fold");
                    }
                }
            }
        });
    });
</script>
</body>
</html>
