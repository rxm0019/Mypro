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
<body ms-controller="eduDataBaseList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="eduDataBaseList_search" lay-filter="eduDataBaseList_search" style="border-bottom: 1px solid #f6f6f6;">
        </div>

        <div class="layui-card-body" style="padding-left: 10px">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding-bottom: 10px;" id="eduDataBaseList_tool">
                <button :visible="@baseFuncInfo.authorityTag('eduDataBaseList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('eduDataBaseList#delete')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
            </div>
            <!--table定义-->
            <table id="eduDataBaseList_table" lay-filter="eduDataBaseList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="eduDataBaseList_bar">
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="show">预览</a>
                {{#  if(baseFuncInfo.authorityTag('eduDataBaseList#edit') && d.eduBaseFrom == $.constant.themeSource.local){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('eduDataBaseList#delete') && d.eduBaseFrom == $.constant.themeSource.local){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/education/eduDataBaseList.js?t=${currentTimeMillis}"></script>
</body>
</html>