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
<body ms-controller="stoCloseEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="stoCloseEdit_form" id="purRejectEdit_form">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <label><span class="edit-verify-span">*</span>关闭原因：</label>
                <div class="disui-form-flex">
                    <textarea name="remarks" maxlength="65535" rows="15" lay-verify="required"></textarea>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="stoCloseEdit_submit" id="stoCloseEdit_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/stock/stoCloseEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>