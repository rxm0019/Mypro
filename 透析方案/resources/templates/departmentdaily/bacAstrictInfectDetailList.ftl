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
<body ms-controller="bacAstrictInfectDetailList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacAstrictInfectDetailList_search" lay-filter="bacAstrictInfectDetailList_search">
        </div>
        <div class="layui-card-body">
            <!--table定义-->
            <table id="bacAstrictInfectDetailList_table" lay-filter="bacAstrictInfectDetailList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="bacAstrictInfectDetailList_bar">
            </script>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="bacAstrictInfectDetailList_submit" id="bacAstrictInfectDetailList_submit">提交</button>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<!--table的工具栏按钮定义，注意：需要增加权限控制-->
<script type="text/html" id="bacAstrictInfectDetailList_bar"></script>
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacAstrictInfectDetailList.js?t=${currentTimeMillis}"></script>
</body>
</html>