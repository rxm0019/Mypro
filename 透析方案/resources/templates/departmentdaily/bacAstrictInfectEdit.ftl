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
        .layui-layedit {
            border-width: 1px;
            border-style: solid;
            border-radius: 2px;
            width: 100%;
        }
    </style>
</head>
<body ms-controller="bacAstrictInfectEdit">
<div class="layui-form" lay-filter="bacAstrictInfectEdit_form" id="bacAstrictInfectEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-form-item  layui-hide">
            <div class="disui-form-flex">
                <label>ID</label>
                <input type="hidden" name="astrictInfectId" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm8 layui-col-md8 layui-col-lg8">
            <div class="disui-form-flex">
                <label>标题：</label>
                <input type="text" name="title" maxlength="50" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
            <div class="disui-form-flex">
                <label>排序编号：</label>
                <input type="text" name="orderNo" maxlength="5" autocomplete="off" lay-verify="number|Ndouble" onkeyup="this.value=this.value.replace(/[^0-9]+/,'');" >
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>内容：</label>
                <textarea id="content" lay-verify="content" name="content"></textarea>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacAstrictInfectEdit_submit" id="bacAstrictInfectEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacAstrictInfectEdit.js?t=${currentTimeMillis}"></script>
<script type="text/javascript" src="${ctxsta}/static/layuiadmin/layui/lay/modules/ace/ace.js"></script>
</body>
</html>