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
<body ms-controller="stoInventorySetCheckList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="stoInventorySetCheckList_search" lay-filter="stoInventorySetCheckList_search">
        </div>
        <div class="layui-card-body">
            <div style="padding: 10px;" id="stoInventorySetCheckList_tool">
                <button :visible="@baseFuncInfo.authorityTag('stoInventoryCheckList#add')"
                        class="layui-btn layui-btn-dismain" onclick="checkAdd()" :if="@hide">新增盘点物料
                </button>
                <button :visible="@baseFuncInfo.authorityTag('stoInventoryCheckList#delete')"
                        class="layui-btn layui-btn-dissub" onclick="batchDel()" :if="@hide">删除
                </button>
            </div>
            <!--table定义-->
            <table id="stoInventorySetCheckList_table"
                   lay-filter="stoInventorySetCheckList_table"></table>
            <script type="text/html" id="stoInventorySetCheckList_bar">
                {{#  if(baseFuncInfo.authorityTag('stoInventoryCheckList#delete')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/stock/stoInventorySetCheckList.js?t=${currentTimeMillis}"></script>
</body>
</html>