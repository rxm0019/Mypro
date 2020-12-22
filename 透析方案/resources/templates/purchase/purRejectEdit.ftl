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
<body ms-controller="purRejectEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="purRejectEdit_form" id="purRejectEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="rejectId">
                    <input type="hidden" name="requisitionNo" ms-duplex="requisitionNo">
                    <input type="hidden" name="requisitionId" ms-duplex="requisitionId">
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <label><span class="edit-verify-span">*</span>退回原因：</label>
                <div class="disui-form-flex">
                    <textarea name="remarks" maxlength="21845" rows="15" :attr="@readonly"></textarea>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="purRejectEdit_submit" id="purRejectEdit_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/purchase/purRejectEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>