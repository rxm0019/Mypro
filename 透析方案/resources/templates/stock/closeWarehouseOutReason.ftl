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
<body ms-controller="closeWarehouseOutReason">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="closeWarehouseOutReason_form" id="closeWarehouseOutReason_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="warehouseOutMainId" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>关闭原因：</label>
                    <textarea name="closeReason" maxlength="100"  class="layui-textarea"></textarea>
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="closeWarehouseOutReason_submit" id="closeWarehouseOutReason_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/stock/closeWarehouseOutReason.js?t=${currentTimeMillis}"></script>
</body>
</html>