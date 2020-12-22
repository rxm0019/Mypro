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
<body ms-controller="patDocRecordList">
<div class="layui-card" style="margin-left: 10px;margin-right: 10px">
    <!--工具栏的按钮的div，注意：需要增加权限控制-->
    <div style="padding-bottom: 10px;padding-top: 10px;padding-left: 10px" id="patDocRecordList_tool">
        <button :visible="@baseFuncInfo.authorityTag('patDocRecord#add')"
                class="layui-btn layui-btn-dismain" onclick="add()">添加
        </button>
        <button :visible="@baseFuncInfo.authorityTag('patDocRecord#delete')"
                class="layui-btn layui-btn-dissub" onclick="batchDelete()">删除
        </button>
    </div>
    <!--table定义-->
    <table id="patDocRecordList_table" lay-filter="patDocRecordList_table"></table>
    <!--table的工具栏按钮定义，注意：需要增加权限控制-->
    <script type="text/html" id="patDocRecordList_bar">
        {{#  if(baseFuncInfo.authorityTag('patDocRecord#edit')){ }}
        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red " lay-event="edit">编辑</a>
        {{#  } }}
        {{#  if(baseFuncInfo.authorityTag('patDocRecord#preview')){ }}
        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="preview">预览</a>
        {{#  } }}
        {{#  if(baseFuncInfo.authorityTag('patDocRecord#delete')){ }}
        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
        {{#  } }}
    </script>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patDocRecordList.js?t=${currentTimeMillis}"></script>
</body>
</html>