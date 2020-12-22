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
<style>
    .layui-form-label {
        white-space: nowrap;
        width: 110px;
    }
    .layui-input-inline{
        width: 170px !important;
    }
    .layui-input-block{
        margin-bottom: 5px;
        display: inline-block;
        margin-left: 0;
        width: auto;
        min-height: 30px;
    }
</style>
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="bacDeviceSterilizeList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacDeviceSterilizeList_search" lay-filter="bacDeviceSterilizeList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="bacDeviceSterilizeList_tool">
                <button :visible="@baseFuncInfo.authorityTag('bacDeviceSterilizeList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('bacDeviceSterilizeList#delete')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                <button :visible="@baseFuncInfo.authorityTag('bacDeviceSterilizeList#export')"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出</button>
            </div>
            <!--table定义-->
            <table id="bacDeviceSterilizeList_table" lay-filter="bacDeviceSterilizeList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="bacDeviceSterilizeList_bar">
                {{#  if(baseFuncInfo.authorityTag('bacDeviceSterilizeList#detail')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('bacDeviceSterilizeList#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs  layui-btn-dis-red " lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('bacDeviceSterilizeList#delete')){ }}
                <a class="layui-btn  layui-btn-xs layui-btn-dissmall  layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacDeviceSterilizeList.js?t=${currentTimeMillis}"></script>
</body>
</html>