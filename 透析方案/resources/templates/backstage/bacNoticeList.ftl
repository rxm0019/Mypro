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
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="bacNoticeList">
<div class="layui-fluid" style="padding: 0 10px !important;">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacNoticeList_search" lay-filter="bacNoticeList_search">
        </div>
        <div class="layui-card-body">
            <#--            <!--工具栏的按钮的div，注意：需要增加权限控制&ndash;&gt;-->
            <div style="padding-bottom: 10px;padding-left: 27px" id="bacNoticeList_tool">
                <button :visible="@baseFuncInfo.authorityTag('bacNotice#edit')"
                        class="layui-btn layui-btn-dismain" onclick="edit()">添加
                </button>
                <button :visible="@baseFuncInfo.authorityTag('bacNotice#delete')"
                        class="layui-btn layui-btn-dismain" onclick="batchDel()">删除
                </button>
            </div>
            <table id="bacNoticeList_table" lay-filter="bacNoticeList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="bacNoticeList_bar">
                {{#  if(baseFuncInfo.authorityTag('bacNotice#preview')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="preview">预览</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('bacNotice#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red " lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('bacNotice#delete')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
            </script>
            <script type="text/html" id="img">
                <i class="layui-icon layui-icon-picture" onclick="showImage('{{d.filePath}}')"></i>
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacNoticeList.js?t=${currentTimeMillis}"></script>
</body>
</html>