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
    <#--引入json格式查看插件-->
    <link rel="stylesheet" href="${ctxsta}/static/css/json/jquery.jsonview.css">
    <script src="${ctxsta}/static/lib/json/jquery.jsonview.js"></script>
</head>
<body ms-controller="sysPushEdit">
<div class="layui-form" lay-filter="sysPushEdit_form" id="sysPushEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="pushId" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <pre id="pushJsonData" disabled/>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="sysPushEdit_submit" id="sysPushEdit_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysPushEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>