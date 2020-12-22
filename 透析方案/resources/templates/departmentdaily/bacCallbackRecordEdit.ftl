<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">

    <style>
        .layui-row .disui-form-flex>label{
            flex-basis: 120px;
        }
        .xm-input.xm-select-input {
            width: unset !important;
        }
    </style>

</head>
<body ms-controller="bacCallbackRecordEdit">
<div class="layui-form" lay-filter="bacCallbackRecordEdit_form" id="bacCallbackRecordEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="callbackRecordId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>选择患者：</label>
<#--                <input type="text" name="sickId" maxlength="35" lay-verify="required" autocomplete="off" class="layui-input">-->
                <select name="sickId"  xm-select="sickId" xm-select-search="" xm-select-radio=""></select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>回访日期：</label>
                <input type="text" name="callbackDate" lay-verify="required" id="callbackDate" placeholder="yyyy-MM-dd" autocomplete="off" :attr="@disabled">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>回访记录：</label>
                <textarea rows="6" name="callbackRecord" maxlength="200" :attr="@readonly"></textarea>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>评价总结：</label>
                <textarea rows="6" name="evaluate" maxlength="200" :attr="@readonly"></textarea>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>回访者：</label>
                <input type="text" name="callbackUser" ms-duplex="callbackUser" maxlength="10" autocomplete="off" :attr="@readonly">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>查对者：</label>
                <input type="text" name="verifyUser" maxlength="10" autocomplete="off" :attr="@readonly">
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacCallbackRecordEdit_submit" id="bacCallbackRecordEdit_submit">提交</button>
        </div>
    <div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacCallbackRecordEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>