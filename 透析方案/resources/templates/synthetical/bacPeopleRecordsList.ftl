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
<body ms-controller="bacPeopleRecordsList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacPeopleRecordsList_search" lay-filter="bacPeopleRecordsList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="bacPeopleRecordsList_tool">

                <button :visible="@baseFuncInfo.authorityTag('bacPeopleRecordsList'+@peopletype+'#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>

                <button :visible="@baseFuncInfo.authorityTag('bacPeopleRecordsList'+@peopletype+'#del')"
                        class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>

                <button :visible="@baseFuncInfo.authorityTag('bacPeopleRecordsList'+@peopletype+'#export')"
                        class="layui-btn layui-btn-dissub" onclick="exportExcel()">导出</button>

<#--                <button :visible="@baseFuncInfo.authorityTag('bacPeopleRecordsList#add')"-->
<#--                        class="layui-btn layui-btn-dismain layui-btn-dis-x"  onclick="saveOrEdit()">添加</button>-->
<#--                <button :visible="@baseFuncInfo.authorityTag('bacPeopleRecordsList#batchDel')"-->
<#--                        class="layui-btn layui-btn-dissub layui-btn-dis-x"  onclick="batchDel()">删除</button>-->
            </div>
            <!--table定义-->
            <table id="bacPeopleRecordsList_table" lay-filter="bacPeopleRecordsList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="bacPeopleRecordsList_bar">

                {{#  if(baseFuncInfo.authorityTag('bacPeopleRecordsList'+bacPeopleRecordsList.peopletype+'#detail')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}

                {{#  if(baseFuncInfo.authorityTag('bacPeopleRecordsList'+bacPeopleRecordsList.peopletype+'#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red " lay-event="edit">编辑</a>
                {{#  } }}

                {{#  if(baseFuncInfo.authorityTag('bacPeopleRecordsList'+bacPeopleRecordsList.peopletype+'#del')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacPeopleRecordsList.js?t=${currentTimeMillis}"></script>
</body>
</html>