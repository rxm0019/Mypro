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
        .layui-row .disui-form-flex > label {
            flex-basis: 100px;
        }
    </style>
</head>
<body ms-controller="sysDictDataEdit">
<div class="layui-form" lay-filter="sysDictDataEdit_form" id="sysDictDataEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2 layui-hide">
            <div class="disui-form-flex">
                <label class="layui-form-label">ID</label>
                <input type="hidden" name="id" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md6 layui-col-lg4">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>字典类型：</label>
                <select name="dictId" lay-verify="required" lay-search :attr="{disabled: @readonly}">
                    <option value=""></option>
                    <option ms-for="($index, el) in @dictOptions" ms-attr="{value: el.id}" ms-text="@el.dictName + '（' + @el.dictType + '）'"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>标签名：</label>
                <input type="input" name="dictDataName" maxlength="50" lay-verify="required" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label class="layui-form-label">标签名简称：</label>
                <input type="input" name="dictDataShortName" maxlength="50" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>数据值：</label>
                <input type="input" name="dictDataValue" maxlength="50" lay-verify="required" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label class="layui-form-label">业务代码：</label>
                <input type="input" name="dictBizCode" maxlength="50" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label class="layui-form-label">默认值：</label>
                <input type="input" name="dictDataDefaultValue" maxlength="50" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label class="layui-form-label">增量：</label>
                <input type="input" name="dictDataIncrement" maxlength="50" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label class="layui-form-label">是否复制：</label>
                <select name="dictDataCopy"  lay-search :attr="{disabled: @readonly}">
                    <option value=""></option>
                    <option value="Y">是</option>
                    <option value="N">否</option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>排序：</label>
                <input type="input" name="dictDataSort" maxlength="10" lay-verify="required|number" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md6 layui-col-lg4">
            <div class="disui-form-flex">
                <label class="layui-form-label">备注：</label>
                <textarea name="dictDataDesc" maxlength="100" autocomplete="off" :attr="{readonly: @readonly}"></textarea>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-col-sm6 layui-col-md3 layui-col-lg2 layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysDictDataEdit_submit" id="sysDictDataEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysDictDataEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
