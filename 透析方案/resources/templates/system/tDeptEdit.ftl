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
<body ms-controller="tDeptEdit">
<div class="layui-form" lay-filter="tDeptEdit_form" id="tDeptEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide" id="orgParent" >
        <div class="layui-form-item ">
            <label class="layui-form-label">上一级</label>
            <div class="layui-input-inline">
                <input name="orgParentName"  disabled="disabled" readonly autocomplete="off" class="layui-input layui-bg-gray" >
            </div>
        </div>
    </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>编号</label>
            <div class="layui-input-inline">
                <input type="input" name="deptCode" maxlength="20" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>名称</label>
            <div class="layui-input-inline">
                <input type="input" name="deptName" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
    <div class="layui-form-item layui-hide" >
        <label class="layui-form-label"><span class="edit-verify-span">*</span>上级组织uuid</label>
        <div class="layui-input-inline">
            <input type="input" name="parent" maxlength="64"   placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="tDeptEdit_submit"  id="tDeptEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/tDeptEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>