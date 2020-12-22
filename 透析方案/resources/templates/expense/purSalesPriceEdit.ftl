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
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
</head>
<body ms-controller="purSalesPriceEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="purSalesPriceEdit_form" id="purSalesPriceEdit_form"
         style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label>ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="salesPriceId" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label>名称：</label>
                    <input type="text" name="materielName" maxlength="50"
                           autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="specifications">
                <div class="disui-form-flex">
                    <label>规格：</label>
                    <input type="text" name="specifications" maxlength="50"
                           autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="basicUnit">
                <div class="disui-form-flex">
                    <label>基本单位：</label>
                    <input type="text" name="basicUnit" maxlength="50"
                           autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="manufactor">
                <div class="disui-form-flex">
                    <label>厂家：</label>
                    <input type="text" name="manufactor" maxlength="100" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="salesUnit">
                <div class="disui-form-flex">
                    <label>销售单位：</label>
                    <input type="text" name="salesUnit" maxlength="10" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label>标准价格：</label>
                    <input type="text" name="costPrice" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="supplierName">
                <div class="disui-form-flex">
                    <label>默认供应商：</label>
                    <input type="text" name="supplierName" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="price">
                <div class="disui-form-flex">
                    <label>采购价格：</label>
                    <input type="text" name="price" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>销售价格：</label>
                    <input type="text" name="salesPrice" autocomplete="off" lay-verify="required|number">
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label">备注：</label>
                    <textarea name="remarks" maxlength="10000" class="layui-textarea"></textarea>
                </div>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="purSalesPriceEdit_submit"
                        id="purSalesPriceEdit_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/expense/purSalesPriceEdit.js?t=${currentTimeMillis}"></script>

</body>
</html>