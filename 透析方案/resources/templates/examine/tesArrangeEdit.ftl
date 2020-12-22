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
        .label-title{
            flex: 0 0 120px !important;
        }
    </style>
</head>
<body ms-controller="tesArrangeEdit">
<div class="layui-card-body">
<div class="layui-form" lay-filter="tesArrangeEdit_form" id="tesArrangeEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-row">
            <div class="disui-form-flex">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>检验总类：</label>
                <select name="testMainId" xm-select="testMainId" xm-select-height="36px" xm-select-search="" lay-verify="required">
                    <option value=""></option>
                </select>
            </div>
        </div>

        <div class="layui-col-sm6" ms-for="($index,el) in @arrangeList">
            <div class="disui-form-flex" >
                <label class="layui-form-label label-title">{{el.examineItemsName}}：</label>
                <input type="text" maxlength="8" ms-duplex="@arrangeList[$index].reportValue" :class="@arrangeList[$index].examineItemsNo"
                       autocomplete="off" >
                <label class="layui-form-label">{{el.units}}</label>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="tesArrangeEdit_submit" id="tesArrangeEdit_submit">提交</button>
        </div>
    </div>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesArrangeEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>