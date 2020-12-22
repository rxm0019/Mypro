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
<div class="layui-form" lay-filter="sysDictEdit_form" id="sysDictEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="id" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>字典名称</label>
            <div class="layui-input-inline">
                <input type="text" name="dictName" maxlength="100" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>字典类型</label>
            <div class="layui-input-inline">
                <input type="text" name="dictType" maxlength="100" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>系统字典(1:是，0否)</label>
            <div class="layui-input-inline">
                <input type="text" name="dictSystem" maxlength="2" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>描述</label>
            <div class="layui-input-inline">
                <input type="text" name="dictDesc" maxlength="100" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>创建人</label>
            <div class="layui-input-inline">
                <input type="text" name="createBy" maxlength="64" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>创建时间</label>
            <div class="layui-input-inline">
                <input type="text" name="createTime" lay-verify="required" id="createTime" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>更新人</label>
            <div class="layui-input-inline">
                <input type="text" name="updateBy" maxlength="64" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>更新时间</label>
            <div class="layui-input-inline">
                <input type="text" name="updateTime" lay-verify="required" id="updateTime" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>数据状态（0-启用，1-停用，2-删除）</label>
            <div class="layui-input-inline">
                <input type="text" name="dataStatus" maxlength="1" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>数据同步状态（0-未同步，1-已同步）</label>
            <div class="layui-input-inline">
                <input type="text" name="dataSync" maxlength="1" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>医院代码（Ref: sys_hospital.hospital_no）</label>
            <div class="layui-input-inline">
                <input type="text" name="hospitalNo" maxlength="7" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysDictEdit_submit" id="sysDictEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysDictEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>