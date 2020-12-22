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
<body ms-controller="basConsumableInfoList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="basConsumableInfoList_search" lay-filter="basConsumableInfoList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="basConsumableInfoList_tool">
                <button :visible="@baseFuncInfo.authorityTag('basConsumableInfoList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('basConsumableInfoList#import')"
                        class="layui-btn layui-btn-dissub"  :click="@baseFuncInfo.batchImp('basConsumableInfo', 'platform')">导入</button>
                <button :visible="@baseFuncInfo.authorityTag('basConsumableInfoList#delete')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                <button :visible="@baseFuncInfo.authorityTag('basConsumableInfoList#export')"
                        class="layui-btn layui-btn-dissub"  onclick="exportExcel()">导出</button>
            </div>
            <!--table定义-->
            <table id="basConsumableInfoList_table" lay-filter="basConsumableInfoList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="basConsumableInfoList_bar">
                {{#  if(baseFuncInfo.authorityTag('basConsumableInfoList#detail')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basConsumableInfoList#edit')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basConsumableInfoList#delete')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basConsumableInfoList#supplierList') && d.dataStatus === $.constant.DataStatus.ENABLED){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="supplierList">供应商明细</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/base/basConsumableInfoList.js?t=${currentTimeMillis}"></script>
</body>
</html>