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
        .order-list-error {
            text-align: center;
            padding: 50px 10px;
            color: #999;
        }
    </style>
</head>
<body ms-controller="orderQueryPrint">
<div style="padding: 10px 10px;">
    <div class="layui-card-body">
        <#-- 显示空提示或错误信息 -->
        <div ms-if="@errMsg" class="order-list-error">{{errMsg}}</div>

        <div id="orderWrapper" style="width: 100%;">
            <div style="text-align: center;font-size: 22px;padding: 10px 0;">{{billTitle}}</div>
            <div>
                <div style="display: inline-block; width: 30%;" ms-if="!allPatient">
                    <label>病历号：<span>{{patientRecordNo}}</span></label>
                </div>
                <div style="display: inline-block; width: 40%;" ms-if="!allPatient">
                    <label>姓名：<span>{{patientName}}</span></label>
                </div>
                <div style="display: inline-block; width: 30%;">
                    <label>打印日期：<span>{{currentTime}}</span></label>
                </div>
            </div>
            <table border="1" style="width: 100%; text-align: center">
                <thead>
                    <tr>
                        <td ms-if="allPatient">病历号</td>
                        <td ms-if="allPatient">姓名</td>
                        <td ms-if="categoryShow">透析日期</td>
                        <td ms-if="categoryShow">提交时间</td>
                        <td>类别</td>
                        <td>医嘱内容</td>
                        <td ms-if="categoryShow">医生签名</td>
                        <td ms-if="categoryShow">执行护士</td>
                        <td ms-if="categoryShow">执行时间</td>
                        <td ms-if="!categoryShow">数量</td>
                        <td ms-if="!categoryShow">单位</td>
                        <td ms-if="!categoryShow">状态</td>
                        <td ms-if="!categoryShow">开嘱日期</td>
                        <td ms-if="!categoryShow">开嘱医生</td>
                    </tr>
                </thead>
                <tbody>
                    <tr ms-for="($index,el) in @orderList">
                        <td ms-if="allPatient">{{el.patientRecordNo}}</td>
                        <td ms-if="allPatient">{{el.patientName}}</td>
                        <td ms-if="categoryShow">{{el.dialysisDate}}</td>
                        <td ms-if="categoryShow">{{el.submitOrderDate}}</td>
                        <td>{{el.orderType}}</td>
                        <td style="text-align: left;width: 250px;">{{el.orderContent}}</td>
                        <td ms-if="categoryShow">{{el.executeOrderDoctorName}}</td>
                        <td ms-if="categoryShow">{{el.executeOrderNurseName}}</td>
                        <td ms-if="categoryShow">{{el.executeOrderDate}}</td>
                        <td ms-if="!categoryShow">{{el.totalDosage}}</td>
                        <td ms-if="!categoryShow">{{el.basicUnit}}</td>
                        <td ms-if="!categoryShow">{{el.dataStatus}}</td>
                        <td ms-if="!categoryShow">{{el.establishDate}}</td>
                        <td ms-if="!categoryShow">{{el.establishUserName}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!--请在下方写此页面业务相关的脚本-->
    <script type="text/javascript" src="${ctxsta}/static/js/report/orderQueryPrint.js?t=${currentTimeMillis}"></script>
</body>
</html>
