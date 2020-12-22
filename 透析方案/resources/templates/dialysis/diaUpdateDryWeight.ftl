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
<body ms-controller="diaUpdateDryWeight">
<div class="layui-form" lay-filter="patPatientHistoryEdit_form" id="patPatientHistoryEdit_form"
     style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>干体重</label>
                <input type="text" id="dryWeight" name="dryWeight" lay-verify="required|number"
                       autocomplete="off">
                <label>kg</label>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1 layui-hide">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>干体重调整值</label>
            <input type="text" id="dryWeightAdjust" name="dryWeightAdjust" placeholder="请输入"
                   autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex">
                <label class="layui-form-label">备注</label>
                <textarea name="remarks" maxlength="500"
                          class="layui-textarea"></textarea>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="diaUpdateDryWeight_submit"
                id="diaUpdateDryWeight_submit">提交
        </button>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/dialysis/diaUpdateDryWeight.js?t=${currentTimeMillis}"></script>
</body>
</html>