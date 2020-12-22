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
<style>
    .layui-row .disui-form-flex > label {
        width: 114px;
        display: inline-table;
    }
</style>
<body ms-controller="tesPlanCenterPlanEdit">
<div class="layui-form" lay-filter="tesPlanCenterPlanEdit_form" id="tesPlanCenterPlanEdit_form"
     style="padding: 20px 30px 0 0;width: 400px;margin: auto">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="testPlanId" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>检验项目：</label>
                <select name="orderMainId" lay-verify="required" lay-filter="deathType" id="orderMainId"
                        :attr="@disabled">
                    <option value="" selected>请选择</option>
                </select>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>检验频次：</label>
                <select name="testTimes" lay-verify="required" lay-filter="deathType" id="testTimes">
                    <option value="" selected>请选择</option>
                </select>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span"></span>状态：</label>
                <input type="checkbox" name="dataStatus" lay-skin="switch" lay-text="启用|关闭" id="dataStatus">
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label class="layui-form-label">备注：</label>
                <textarea rows="2" name="remarks" id="remarks" maxlength="2000"></textarea>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="tesPlanCenterPlanEdit_submit"
                id="tesPlanCenterPlanEdit_submit">提交
        </button>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/examine/tesPlanCenterPlanEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>