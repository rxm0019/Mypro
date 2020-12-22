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
    <style>
        .layui-table-view[lay-id="diaHistoryList_table"] th {
            height: 50px;
        }
        .layui-table-view[lay-id="diaHistoryList_table"] th .layui-table-cell {
            height: auto;
            line-height: 20px;
        }
    </style>
</head>
<body ms-controller="diaHistoryList">
<div class="layui-card-body">
    <div class="layui-fluid">
        <div class="layui-card">
            <!--搜素栏的div-->
            <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
                 id="diaHistoryList_search" lay-filter="diaHistoryList_search">
            </div>
            <div class="layui-card-body">
                <!--table定义-->
                <table id="diaHistoryList_table" lay-filter="diaHistoryList_table"></table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                <script type="text/html" id="diaHistoryList_bar">
                    {{#  if(baseFuncInfo.authorityTag('diaHistoryList#detail')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs" lay-event="detail">详情</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('diaHistoryList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaHistoryList.js?t=${currentTimeMillis}"></script>
</body>
</html>
