<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">

    <#--<style>
        .layui-table-cell {
            height:auto;
        }
    </style>-->
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="bacUnusualReportList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacUnusualReportList_search" lay-filter="bacUnusualReportList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="bacUnusualReportList_tool">
                <button :visible="@baseFuncInfo.authorityTag('bacUnusualReportList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('bacUnusualReportList#export')"
                        class="layui-btn layui-btn-dissub" onclick="onExportExcel()">导出</button>
                <button :visible="@baseFuncInfo.authorityTag('bacUnusualReportList#delete')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
            </div>
            <!--table定义-->
            <table id="bacUnusualReportList_table" lay-filter="bacUnusualReportList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="bacUnusualReportList_bar">
                {{#  if(baseFuncInfo.authorityTag('bacUnusualReportList#detail')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}

                {{#  if(baseFuncInfo.authorityTag('bacUnusualReportList#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red " lay-event="edit">编辑</a>
                {{#  } }}

                {{#  if(baseFuncInfo.authorityTag('bacUnusualReportList#delete')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacUnusualReportList.js?t=${currentTimeMillis}"></script>
<!--覆盖表格样式，由于表格样式优先级较高，所以放在底部-->
<style>
    [data-field="unusualItem"] > .layui-table-cell{
        margin: 0;
        padding: 0;
        height: unset;
    }
</style>
</body>
</html>