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
<body ms-controller="eduNurseEdit">
<div class="layui-form" lay-filter="eduNurseEdit_form" id="eduNurseEdit_form" style="text-align: center;padding: 20px 30px 0 30px;">

        <div id="patientList" class="demo-transfer"></div>

        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="eduNurseEdit_submit" id="eduNurseEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/education/eduNurseEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>