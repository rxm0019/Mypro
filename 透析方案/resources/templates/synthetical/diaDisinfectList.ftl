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
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="diaDisinfectList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="diaDisinfectList_search" lay-filter="diaDisinfectList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="diaDisinfectList_tool">
                <button :visible="@baseFuncInfo.authorityTag('diaDisinfectList#export')"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出</button>
            </div>
            <!--table定义-->
            <table id="diaDisinfectList_table" lay-filter="diaDisinfectList_table"></table>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/diaDisinfectList.js?t=${currentTimeMillis}"></script>
</body>
</html>