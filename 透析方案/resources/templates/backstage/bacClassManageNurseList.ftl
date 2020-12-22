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
<body ms-controller="bacClassManageNurseList">
<div class="layui-fluid">
    <div class="layui-card">

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="bacClassManageNurseList_tool">
                <button class="layui-btn layui-btn-dismain" onclick="saveOrEdit()">添加</button>
            </div>
            <!--table定义-->
            <table id="bacClassManageNurseList_table" lay-filter="bacClassManageNurseList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="bacClassManageNurseList_bar">
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacClassManageNurseList.js?t=${currentTimeMillis}"></script>
</body>
</html>