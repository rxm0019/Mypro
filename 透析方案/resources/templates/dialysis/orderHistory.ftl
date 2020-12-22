<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
</head>
<style type="text/css">
    .layui-table-cell {
        height: 34px;
        line-height: 18px;
    }
</style>
<body ms-controller="orderHistory">
<div style="padding: 10px;">
    <!--搜素栏的div-->
    <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
         id="orderHistory_search" lay-filter="orderHistory_search">
    </div>

    <div class="layui-card-body">
        <!--table定义-->
        <table id="orderHistory_table" lay-filter="orderHistory_table"></table>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/orderHistory.js?t=${currentTimeMillis}"></script>
</body>
</html>