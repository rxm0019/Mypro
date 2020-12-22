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
<body ms-controller="areaInfoEdit">
<div class="layui-form" lay-filter="areaInfoEdit_form" id="areaInfoEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="id" placeholder="" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item layui-hide">
        <label class="layui-form-label">上级id</label>
        <div class="layui-input-inline">
            <input type="input" id="parentId" name="parentId" readonly lay-verify="" placeholder="" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label" style="width: 85px;margin-left: -5px;">上级编码</label>
        <div class="layui-input-inline">
            <input type="input" id="parentCode" name="parentCode" readonly lay-verify="" placeholder="" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label"><span class="edit-verify-span">*</span>区域编码</label>
        <div class="layui-input-inline">
            <input type="input" name="areaCode"  lay-verify="required|number"  autocomplete="off" class="layui-input" maxlength="20">
            <input type="hidden" name="oldAreaCode" id="oldAreaCode">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label"><span class="edit-verify-span">*</span>区域名称</label>
        <div class="layui-input-inline">
            <input type="input" name="areaName" lay-verify="required"  autocomplete="off" class="layui-input" maxlength="20">
        </div>
    </div>
    <#--  <%-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用--%>-->
<div class="layui-form-item layui-hide">
    <button class="layui-btn" lay-submit lay-filter="areaInfoEdit_submit" id="areaInfoEdit_submit">提交</button>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysAreaInfoEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>

