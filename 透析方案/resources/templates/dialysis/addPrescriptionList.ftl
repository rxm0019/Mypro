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
<style>
    .layui-form-label {
        width: 90px;
    }
    .layui-input-block {
        width: calc(100%);
    }
</style>
<body ms-controller="addPrescriptionList">
<div>
    <!--搜素栏的div-->
    <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
         id="addPrescriptionList_search" lay-filter="addPrescriptionList_search">
    </div>
    <!--table定义-->
    <table id="addPrescriptionList_table"
           lay-filter="addPrescriptionList_table"></table>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/dialysis/addPrescriptionList.js?t=${currentTimeMillis}"></script>
</body>
</html>