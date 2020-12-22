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
<body ms-controller="tesApplyItemList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="tesApplyItemList_search" lay-filter="tesApplyItemList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding-bottom: 10px;" id="tesApplyItemList_tool">
                <button :visible="@baseFuncInfo.authorityTag('tesApplyItemList#batchDel')"
                        class="layui-btn"  onclick="batchDel()">删除</button>
                <button :visible="@baseFuncInfo.authorityTag('tesApplyItemList#add')"
                        class="layui-btn"  onclick="saveOrEdit()">添加</button>
            </div>
            <!--table定义-->
            <table id="tesApplyItemList_table" lay-filter="tesApplyItemList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="tesApplyItemList_bar">
                {{#  if(baseFuncInfo.authorityTag('tesApplyItemList#edit')){ }}
                <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('tesApplyItemList#del')){ }}
                <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesApplyItemList.js?t=${currentTimeMillis}"></script>
</body>
</html>