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
<body ms-controller="eduTeachEdit">
<div class="layui-card-body">
<div class="layui-form" lay-filter="eduTeachEdit_form" id="eduTeachEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="teachId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>

        <div class="layui-row">
            <div class="disui-form-flex" >
                <label >教育主题：</label>
                <input type="text" name="eduBaseName" maxlength="32" autocomplete="off" readonly>
            </div>
        </div>
        <div class="layui-row">
            <div class="disui-form-flex" >
                <label class="layui-form-label"><span class="edit-verify-span">*</span>测评结果</label>
                <input type="radio" lay-verify="radio" lay-verify-msg="请选择测评结果" name="teachAssess" value="1" title="无测评" checked="">
                <input type="radio" lay-verify="radio" lay-verify-msg="请选择测评结果" name="teachAssess" value="2" title="不合格">
                <input type="radio" lay-verify="radio" lay-verify-msg="请选择测评结果" name="teachAssess" value="3" title="合格">
            </div>
        </div>
        <div class="layui-row">
            <div class="disui-form-flex" >
                <label >评价：</label>
                <textarea name="assessRemarks" maxlength="250"  class="layui-textarea" :attr="@readonly"></textarea>
            </div>
        </div>

        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="eduTeachEdit_submit" id="eduTeachEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/education/eduTeachEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>