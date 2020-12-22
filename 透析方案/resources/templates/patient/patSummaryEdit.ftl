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
        .layui-form-select dl { max-height: 150px; }
    </style>
</head>
<body ms-controller="patSummaryEdit">
<div class="layui-form" lay-filter="patSummaryEdit_form" id="patSummaryEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md6 layui-col-lg4">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>年份：</label>
                <select name="year" lay-verify="required">
                    <option ms-for="($index, el) in @options.year"
                            ms-attr="{value: el.value}" ms-text="@el.name"></option>
                </select>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md6 layui-col-lg4">
            <div class="disui-form-flex" >
                <label></label>
                <div class="layui-input-block">
                    <input type="radio" name="summaryType" lay-verify="radio" lay-filter="summaryTypeClick" lay-verify-msg="单选框至少选一项"
                           ms-for="($index, el) in @options.summaryType"
                           ms-attr="{value: el.value, title: el.name, checked: true && $index == 0}">
                </div>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1" ms-visible="@showMonthOption">
        <div class="layui-col-sm12 layui-col-md6 layui-col-lg4">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>月份：</label>
                <select name="month" lay-verify="required">
                    <option ms-for="($index, el) in @options.month"
                            ms-attr="{value: el.value}" ms-text="@el.name"></option>
                </select>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space1" ms-visible="!@showMonthOption">
        <div class="layui-col-sm12 layui-col-md6 layui-col-lg4">
            <div class="disui-form-flex" >
                <label><span class="edit-verify-span">*</span>季度：</label>
                <select name="quarter" lay-verify="required">
                    <option ms-for="($index, el) in @options.quarter"
                            ms-attr="{value: el.value}" ms-text="@el.name"></option>
                </select>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="patSummaryEdit_submit" id="patSummaryEdit_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patSummaryEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
