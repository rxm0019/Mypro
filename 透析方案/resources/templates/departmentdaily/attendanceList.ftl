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
        .layui-transfer-data {
            height: calc(100% - 91px);
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="attendanceList">
<div class="layui-fluid">
    <div class="layui-card" style="min-width: 480px" >
        <div id="attendanceData" class="demo-transfer" style="padding: 5px"></div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="attendance_submit" id="attendance_submit">提交</button>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<!--table的工具栏按钮定义，注意：需要增加权限控制-->
<script type="text/html" id="bacAstrictInfectDetailList_bar"></script>
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/attendanceList.js?t=${currentTimeMillis}"></script>
</body>
</html>