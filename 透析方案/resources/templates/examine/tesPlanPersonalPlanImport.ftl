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
<body ms-controller="tesPlanPersonalPlanImport">
<div class="layui-form" lay-filter="tesPlanPersonalPlanImport_form" id="tesPlanPersonalPlanImport_form" style="padding: 20px 30px 0 0;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="testPlanId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
    <table id="tesPlanPersonalPlanImport_table" lay-filter="tesPlanPersonalPlanImport_table"></table>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="tesPlanPersonalPlanImport_submit" id="tesPlanPersonalPlanImport_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesPlanPersonalPlanImport.js?t=${currentTimeMillis}"></script>
</body>
</html>