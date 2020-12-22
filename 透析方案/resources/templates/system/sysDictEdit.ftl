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
<body ms-controller="sysDictEdit">
<div class="layui-form layui-row" lay-filter="sysDictEdit_form" id="sysDictEdit_form" style="padding: 20px 30px 0 20px;">
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
        <div class="disui-form-flex">
            <label>ID：</label>
            <input type="hidden" name="id" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label><span class="edit-verify-span">*</span>类别名称：</label>
            <input type="text" name="dictName" maxlength="50" lay-verify="required" autocomplete="off" :attr="{readonly: @readonly}">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label><span class="edit-verify-span">*</span>类别代码：</label>
            <input type="text" name="dictType" maxlength="50" lay-verify="required" autocomplete="off" :attr="{readonly: @readonly}">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label>备注：</label>
            <textarea name="dictDesc" maxlength="100" rows="5" :attr="{readonly: @readonly}"></textarea>
        </div>
    </div>
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="sysDictEdit_submit" id="sysDictEdit_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysDictEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
