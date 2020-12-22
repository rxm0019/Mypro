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
<body ms-controller="tesApplyList">
<div class="layui-fluid" style="padding: 0px 10px!important;">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="tesApplyList_search" lay-filter="tesApplyList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="tesApplyList_tool">
                <button :visible="@baseFuncInfo.authorityTag('tesApplyList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
            </div>
            <!--table定义-->
            <table id="tesApplyList_table" lay-filter="tesApplyList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="tesApplyList_bar">
                {{#  if(baseFuncInfo.authorityTag('tesApplyList#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="edit">申请单</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('tesApplyList#report') && d.applySendStatus == $.constant.ApplySendStatus.SENT){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="report">检验报告</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('tesApplyList#delete') && d.applyStatus != $.constant.ApplicationStatus.SUBMITTED){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesApplyList.js?t=${currentTimeMillis}"></script>
</body>
</html>