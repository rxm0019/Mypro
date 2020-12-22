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
<body ms-controller="stoInventoryMainEdit">
<div class="layui-form" lay-filter="stoInventoryMainEdit_form" id="stoInventoryMainEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-form-item  layui-hide">
            <label>ID</label>
            <input type="hidden" name="inventoryMainId">
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>盘点名称：</label>
                <input type="text" name="name" maxlength="50" lay-verify="required" :attr="@readonly">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>盘点仓库：</label>
                <div class="disui-form-checkbox">
                    <input type="checkbox" lay-skin="primary" class="checkboxItem" name="houseNo1" lay-filter="check"
                           ms-attr="{value:el.warehouseId,title:el.houseName}" lay-verify="required"
                           ms-for="($index, el) in @warehouseList"  >
                <input type="checkbox" lay-filter="checkAll" lay-skin="primary" title="全选" id="checkAll">
                </div>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>备注：</label>
                <textarea name="remarks" maxlength="10000" :attr="@readonly"></textarea>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="stoInventoryMainEdit_submit"
                        id="stoInventoryMainEdit_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/stock/stoInventoryMainEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>