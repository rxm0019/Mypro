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
<style>
    .layui-row .disui-form-flex > label {
        flex-basis: 120px;
    }
</style>
<body ms-controller="tesPlanPersonalPlanChange">
<div class="layui-form" lay-filter="tesPlanPersonalPlanChange_form" id="tesPlanPersonalPlanChange_form" style="padding: 20px 30px 0 0;width: 400px;margin: auto">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="testPlanId" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>

    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>下次检验时间：</label>
                <input type="text" name="nextDate" maxlength="500" autocomplete="off" id="nextDate"
                       lay-verify="required">
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>缘由：</label>
                <textarea rows="2" name="remarks" id="remarks" maxlength="2000" lay-verify="required"></textarea>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="tesPlanPersonalPlanChange_submit" id="tesPlanPersonalPlanChange_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesPlanPersonalPlanChange.js?t=${currentTimeMillis}"></script>
</body>
</html>