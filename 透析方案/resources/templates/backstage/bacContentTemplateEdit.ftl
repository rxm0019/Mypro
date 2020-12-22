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
</head>
<body ms-controller="bacContentTemplateEdit">
<div class="layui-form" lay-filter="bacContentTemplateEdit_form" id="bacContentTemplateEdit_form"
     style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
            <div class="disui-form-flex ">
                <label class="layui-form-label">ID</label>
                <input type="hidden" name="contentTemplateId" placeholder="请输入" >
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
            <div class="disui-form-flex ">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>模板类型</label>
                <input type="text" name="templateType" id="templateType" maxlength="50" placeholder="请输入">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex ">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>模板名称：</label>
                <input type="text" name="templateTitle" maxlength="100" lay-verify="fieldRequired" data-field-name="模板名称" placeholder="请输入">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex ">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>模板内容：</label>
                <textarea type="text" name="templateContent" id="templateContent" maxlength="5000" lay-verify="fieldRequired" data-field-name="模板内容" placeholder="请输入" rows="10" >
                </textarea>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="bacContentTemplateEdit_submit"
                id="bacContentTemplateEdit_submit">提交
        </button>
    </div>
</div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/backstage/bacContentTemplateEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>