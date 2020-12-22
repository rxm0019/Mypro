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
<body ms-controller="tesApplySampleEdit">
<div class="layui-card-body">
    <div class="layui-form" lay-filter="tesApplySampleEdit_form" id="tesApplySampleEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="applySampleId" placeholder="请输入" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>检验条码：</label>
                    <input type="text" name="sampleCode" maxlength="20" lay-verify="required" autocomplete="off" >
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>检验项目：</label>
                    <input type="text" name="checkoutName" maxlength="100" lay-verify="required" autocomplete="off">
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>检验类型：</label>
                    <select name="testType" class="select" lay-filter="testType" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode(dictType.SampleType)"></option>
                    </select>
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>标本类型：</label>
                    <select name="examination" class="select" lay-filter="examination" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode(dictType.Examination)"></option>
                    </select>
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">标本状况：</label>
                    <textarea name="describable" maxlength="100" autocomplete="off"></textarea>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="tesApplySampleEdit_submit" id="tesApplySampleEdit_submit">提交</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesApplySampleEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>