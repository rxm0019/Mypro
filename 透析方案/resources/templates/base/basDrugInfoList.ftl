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
<body ms-controller="basDrugInfoList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="basDrugInfoList_search" lay-filter="basDrugInfoList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="basDrugInfoList_tool">
                <button :visible="@baseFuncInfo.authorityTag('basDrugInfoList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('basDrugInfoList#import')"
                        class="layui-btn layui-btn-dissub"  :click="@baseFuncInfo.batchImp('basDrugInfo', 'platform')">导入</button>
                <button :visible="@baseFuncInfo.authorityTag('basDrugInfoList#delete')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                <button :visible="@baseFuncInfo.authorityTag('basDrugInfoList#export')"
                        class="layui-btn layui-btn-dissub"  onclick="exportExcel()">导出</button>
            </div>
            <!--table定义-->
            <table id="basDrugInfoList_table" lay-filter="basDrugInfoList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="basDrugInfoList_bar">
                {{#  if(baseFuncInfo.authorityTag('basDrugInfoList#detail')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basDrugInfoList#edit')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basDrugInfoList#delete')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basDrugInfoList#supplierList') && d.dataStatus === $.constant.DataStatus.ENABLED){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="supplierList">供应商明细</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/base/basDrugInfoList.js?t=${currentTimeMillis}"></script>
</body>
</html>