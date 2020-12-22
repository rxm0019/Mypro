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
<body ms-controller="diaExecuteOrderPrint">
<div style="padding: 0 10px;">
    <div class="layui-card-body">
        <#-- 显示空提示或错误信息 -->
        <div ms-if="@errMsg" class="order-list-error">{{errMsg}}</div>

        <div id="orderWrapper">
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaExecuteOrderPrint.js?t=${currentTimeMillis}"></script>
</body>
</html>
