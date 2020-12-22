<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>
        /*.layui-input-block{*/
        /*    margin-top: 4px !important;*/
        /*}*/
        /*.layui-form-item .layui-inline:nth-child(2) >label{*/
        /*    margin-top: 4px !important;*/
        /*}*/
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="sysPushManageList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="sysPushManageList_search" lay-filter="sysPushManageList_search">
        </div>


        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="sysPushManageList_tool">
                <button :visible="@baseFuncInfo.authorityTag('sysPushManageList#batchDel')"
                        class="layui-btn"  onclick="batchDel()">删除</button>
                <button :visible="@baseFuncInfo.authorityTag('sysPushManageList#queryResultSetting')"
                        class="layui-btn layui-btn-dismain"  onclick="batchSetting()">设置</button>
            </div>
            <!--table定义-->
            <table id="sysPushManageList_table" lay-filter="sysPushManageList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="sysPushManageList_bar">
                {{#  if(baseFuncInfo.authorityTag('sysPushManageList#set')){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="set">设置</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysPushManageList#pushHistory')){ }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="pushHistory">推送记录</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysPushManageList.js?t=${currentTimeMillis}"></script>
</body>
</html>