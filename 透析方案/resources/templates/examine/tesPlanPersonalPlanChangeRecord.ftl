<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="tesPlanPersonalPlanChangeRecord">
<div class="layui-fluid" style="padding: 0 !important;">
    <div class="layui-card">
        <table id="tesPlanPersonalPlanChangeRecord_table" lay-filter="tesPlanPersonalPlanChangeRecord_table"></table>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesPlanPersonalPlanChangeRecord.js?t=${currentTimeMillis}"></script>
</body>
</html>