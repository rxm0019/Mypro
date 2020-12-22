<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
    <style>
        .layui-form-label {
            width: 90px;
        }
    </style>
</head>
<body ms-controller="basSupplierManagementList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="basSupplierManagementList_search" lay-filter="basSupplierManagementList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="basSupplierManagementList_tool">
                <button :visible="@baseFuncInfo.authorityTag('basSupplierManagementList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('basSupplierManagementList#import')"
                        class="layui-btn layui-btn-dissub"  :click="@baseFuncInfo.batchImp('basSupplierManagement','platform')">导入</button>
                <button :visible="@baseFuncInfo.authorityTag('basSupplierManagementList#export')"
                        class="layui-btn layui-btn-dissub"  onclick="onExportExcel()">导出</button>
                <button :visible="@baseFuncInfo.authorityTag('basSupplierManagementList#delete')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
            </div>
            <!--table定义-->
            <table id="basSupplierManagementList_table" lay-filter="basSupplierManagementList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="basSupplierManagementList_bar">
                {{#  if(baseFuncInfo.authorityTag('basSupplierManagementList#detail')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basSupplierManagementList#edit')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basSupplierManagementList#delete')){ }}
                <a class="layui-btn layui-btn-danger layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="del">删除</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basSupplierManagementList#material')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="materialDetail">物料明细</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/base/basSupplierManagementList.js?t=${currentTimeMillis}"></script>
</body>
</html>