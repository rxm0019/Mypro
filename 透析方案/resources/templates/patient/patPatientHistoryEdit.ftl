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
<body ms-controller="patPatientHistoryEdit">
<div class="layui-form" lay-filter="patPatientHistoryEdit_form" id="patPatientHistoryEdit_form"
     style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <input type="hidden" name="patientHistoryId" id="patientHistoryId"  autocomplete="off" class="layui-input">
    </div>
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">患者ID</label>
        <input type="hidden" name="patientId" id="patientId"  autocomplete="off" class="layui-input">
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>干体重</label>
            <input type="text" id="dryWeight" name="dryWeight" lay-verify="required|number"
                   autocomplete="off" >
            <label>kg</label>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
            <div class="disui-form-flex">
                <label class="layui-form-label">备注</label>
                <textarea name="remarks" maxlength="500"
                          class="layui-textarea"></textarea>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="patPatientHistoryEdit_submit"
                id="patPatientHistoryEdit_submit">提交
        </button>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/patient/patPatientHistoryEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>