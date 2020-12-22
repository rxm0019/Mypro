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
<body ms-controller="basFinancialClassificationEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="basFinancialClassificationEdit_form" id="basFinancialClassificationEdit_form"
         style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="financialClassificationId" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>归类名称：</label>
                    <input type="text" name="classificationName" lay-verify="required" maxlength="50" autocomplete="off" :attr="@classificationName">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label class="layui-form-label">排序号：</label>
                    <input type="text" name="orderNo" maxlength="7"  autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label class="layui-form-label">状态：</label>
                    <input type="radio" lay-verify="radio" name="dataStatus"
                           ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label">备注：</label>
                    <textarea name="remarks" class="layui-textarea"  maxlength="10000" :attr="@readonly"></textarea>
                </div>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="basFinancialClassificationEdit_submit"
                        id="basFinancialClassificationEdit_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/base/basFinancialClassificationEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>