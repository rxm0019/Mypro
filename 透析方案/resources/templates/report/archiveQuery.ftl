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
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="archiveQuery">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="archiveQuery_search" lay-filter="archiveQuery_search" style="border-bottom: 1px solid #f6f6f6;">
        </div>
        <button :visible="@baseFuncInfo.authorityTag('patReport#exportArchiveQuery')"
                class="layui-btn layui-btn-dissub" onclick="onExportExcel()" style="margin: 10px;margin-top: 0">导出</button>
        <div class="layui-card-body">
            <!--table定义-->
            <table id="archiveQuery_table" lay-filter="archiveQuery_table"></table>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/report/archiveQuery.js?t=${currentTimeMillis}"></script>
</body>
</html>