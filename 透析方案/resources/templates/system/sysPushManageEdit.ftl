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
<body ms-controller="sysPushManageEdit">
<div class="layui-form" lay-filter="sysPushManageEdit_form" id="sysPushManageEdit_form" style="padding: 20px">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="pushId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
            </div>
            <#--穿梭框-->
            <div class="layui-card" style="min-width: 600px" >
                <div id="queryResultSetting" class="demo-transfer" style="padding: 5px"></div>
            </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysPushManageEdit_submit" id="sysPushManageEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysPushManageEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>