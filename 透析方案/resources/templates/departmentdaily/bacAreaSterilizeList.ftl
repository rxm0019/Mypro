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
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="bacAreaSterilizeList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacAreaSterilizeList_search" lay-filter="bacAreaSterilizeList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="bacAreaSterilizeList_tool">
                <button :visible="@baseFuncInfo.authorityTag('bacAreaSterilizeList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('bacAreaSterilizeList#export')"
                        class="layui-btn layui-btn-dissub" onclick="onExportExcel()">导出</button>
                <button :visible="@baseFuncInfo.authorityTag('bacAreaSterilizeList#del')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>

            </div>
            <!--table定义-->
            <table id="bacAreaSterilizeList_table" lay-filter="bacAreaSterilizeList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="bacAreaSterilizeList_bar">

                {{#  if(baseFuncInfo.authorityTag('bacAreaSterilizeList#detail')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}

                {{#  if(baseFuncInfo.authorityTag('bacAreaSterilizeList#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red " lay-event="edit">编辑</a>
                {{#  } }}

                {{#  if(baseFuncInfo.authorityTag('bacAreaSterilizeList#del')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                {{#  } }}

            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacAreaSterilizeList.js?t=${currentTimeMillis}"></script>
<!--覆盖表格样式，由于表格样式优先级较高，所以放在底部-->
<style>
    [data-field="bacDevices"] > .layui-table-cell{
        margin: 0;
        padding: 0;
        height: unset;
    }
</style>
</body>
</html>