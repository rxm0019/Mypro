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
    <style>
        .layui-form-label {
            width: 90px;
        }
        .layui-input-block {
            margin-bottom: 5px;
            display: inline-block;
            margin-left: 0;
            width: calc(100%);
        }
    </style>
</head>
<body ms-controller="stoInventoryInsertCheckList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="stoInventoryInsertCheckList_search" lay-filter="stoInventoryInsertCheckList_search">
        </div>
        <div class="layui-card-body">
            <!--table定义-->
            <table id="stoInventoryInsertCheckList_table"
                   lay-filter="stoInventoryInsertCheckList_table"></table>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="stoInventoryInsertCheck_submit"
                        :visible="@baseFuncInfo.authorityTag('stoInventorySetCheckList#add')"
                        id="stoInventoryInsertCheck_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/stock/stoInventoryInsertCheckList.js?t=${currentTimeMillis}"></script>
</body>
</html>