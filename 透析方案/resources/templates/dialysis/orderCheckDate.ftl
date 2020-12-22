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
<body ms-controller="orderCheckDate">
<div class="layui-form" lay-filter="orderCheckDate_form" id="orderCheckDate_form" style="padding: 20px;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>请选择时间：</label>
                <input type="text" name="checkOrderDate" lay-verify="required" id="checkOrderDate" autocomplete="off" readonly>
            </div>
        </div>


        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="orderCheckDate_submit" id="orderCheckDate_submit">提交</button>
        </div>

    </div>

</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/orderCheckDate.js?t=${currentTimeMillis}"></script>
</body>
</html>