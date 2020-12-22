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
<body ms-controller="sysKeyEdit">
<div class="layui-form layui-row" lay-filter="sysKeyEdit_form" id="sysKeyEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
        <div class="disui-form-flex">
            <label>ID：</label>
            <input type="hidden" name="id" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
        <div class="disui-form-flex">
            <label>menuId：</label>
            <input type="hidden" name="menuId" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label><span class="edit-verify-span">*</span>所属菜单：</label>
            <input type="text" name="menuName" disabled  lay-verify="required" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md6 layui-col-lg6">
        <div class="disui-form-flex">
            <label><span class="edit-verify-span">*</span>按钮名称：</label>
            <input type="text" name="keyName" maxlength="50" lay-verify="required" autocomplete="off" class="layui-input" :attr="{readonly: @readonly}">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md6 layui-col-lg6">
        <div class="disui-form-flex">
            <label><span class="edit-verify-span">*</span>按钮代码：</label>
            <input type="text" name="keyCode" maxlength="50" lay-verify="required"  autocomplete="off" class="layui-input" :attr="{readonly: @readonly}">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label>API链接：</label>
            <input type="text" name="apiUrl" maxlength="255" autocomplete="off" class="layui-input" :attr="{readonly: @readonly}">
        </div>
    </div>
    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
        <div class="disui-form-flex">
            <label><span class="edit-verify-span">*</span>排序：</label>
            <input type="text" name="keySort" maxlength="3" lay-verify="required|integer" ms-duplex="@keySort" autocomplete="off" class="layui-input" :attr="{readonly: @readonly}">
        </div>
    </div>
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="sysKeyEdit_submit" id="sysKeyEdit_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysKeyEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
