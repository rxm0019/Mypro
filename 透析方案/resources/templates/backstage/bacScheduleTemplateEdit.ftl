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
<body ms-controller="bacScheduleTemplateEdit">
<div class="layui-card-body">
<div class="layui-form" lay-filter="bacScheduleTemplateEdit_form" id="bacScheduleTemplateEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1 demo-list">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">copyDay</label>
            <div class="layui-input-inline">
                <input type="hidden" name="copyDay" placeholder="请输入" autocomplete="off" >
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>模板名称</label>
                <input type="text" name="templateName" maxlength="50" lay-verify="required"  autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>模板周期</label>
                <div class="layui-input-block" >
                    <input type="radio" name="templateType" lay-filter="templateType" value="0" title="本班次" checked>
                    <input type="radio" name="templateType" lay-filter="templateType" value="1" title="当天">
                    <input type="radio" name="templateType" lay-filter="templateType" value="2" title="本周">
                </div>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                <label class="layui-form-label">班次：</label>
                <select name="scheduleShift"  class="select">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Shift')"></option>
                </select>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacScheduleTemplateEdit_submit" id="bacScheduleTemplateEdit_submit">提交</button>
        </div>
    </div>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacScheduleTemplateEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>