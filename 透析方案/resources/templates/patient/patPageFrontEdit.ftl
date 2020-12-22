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
<body ms-controller="patPageFrontEdit">
<div class="layui-form" lay-filter="patPageFrontEdit_form" id="patPageFrontEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label"></label>
        <div class="layui-input-inline">
            <input type="hidden" name="pageFrontId"  autocomplete="off"
                   class="layui-input">
        </div>
    </div>
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label"></label>
        <div class="layui-input-inline">
            <input type="hidden" name="adjustType"  autocomplete="off"
                   class="layui-input">
        </div>
    </div>
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label"></label>
        <div class="layui-input-inline">
            <input type="hidden" name="patientId"  autocomplete="off"
                   class="layui-input">
        </div>
    </div>
    <div class="layui-row layui-col-space1" style="padding-top: 15px">
        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>调整日期：</label>
                <input type="text" name="adjustDate" maxlength="32" lay-verify="required"
                       :attr="@disabled"
                       id="adjustDate" autocomplete="off">
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>调整值：</label>
                <input type="text" name="adjustValue" maxlength="20" id="adjustValue"  lay-verify="required"
                       autocomplete="off"
                       :attr="@disabled">
            </div>
        </div>
    </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="patPageFrontEdit_submit" id="patPageFrontEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPageFrontEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>