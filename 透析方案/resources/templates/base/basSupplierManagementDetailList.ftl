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
    </style>
</head>
<body ms-controller="basSupplierManagementDetailList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="basSupplierManagementDetailList_search" lay-filter="basSupplierManagementDetailList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="basSupplierManagementDetailList_tool">
                <button :visible="@baseFuncInfo.authorityTag('basSupplierManagementDetailList#add')"
                        class="layui-btn layui-btn-dismain" onclick="onInsert()">添加
                </button>
                <button :visible="@baseFuncInfo.authorityTag('basSupplierManagementDetailList#delete')"
                        class="layui-btn layui-btn-dissub" onclick="batchDel()">删除
                </button>
            </div>
            <!--table定义-->
            <table id="basSupplierManagementDetailList_table"
                   lay-filter="basSupplierManagementDetailList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="basSupplierManagementDetailList_bar">
                {{#  if(baseFuncInfo.authorityTag('basSupplierManagementList#delete')){ }}
                <a class="layui-btn layui-btn-danger layui-btn-xs layui-btn-dissmall layui-btn-dis-black"
                   lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/base/basSupplierManagementDetailList.js?t=${currentTimeMillis}"></script>
</body>
</html>