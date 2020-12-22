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
        /*.layui-form-item .layui-inline:nth-child(3) >label{*/
        /*    margin-top: 4px !important;*/
        /*}*/
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="sysPushList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="sysPushList_search" lay-filter="sysPushList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="sysPushList_tool">
                <button :visible="@baseFuncInfo.authorityTag('sysPushList#batchDel')"
                        class="layui-btn"  onclick="batchDel()">删除</button>
                <button :visible="@baseFuncInfo.authorityTag('sysPushList#batchDelivery')"
                        class="layui-btn layui-btn-dismain"  onclick="batchPush()">批量推送</button>
            </div>
            <!--table定义-->
            <table id="sysPushList_table" lay-filter="sysPushList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="sysPushList_bar">
                {{#  if(baseFuncInfo.authorityTag('sysPushList#detail')){ }}
                    {{# if(d.pushStatus === $.constant.pushStatus.SUCCESS){ }}
                        <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详细</a>
                    {{#  } }}
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysPushList#push')){ }}
                    {{# if(d.pushStatus === $.constant.pushStatus.UNPUSH || d.pushStatus ===$.constant.pushStatus.FAIL){ }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="push">推送</a>
                     {{#  } }}
                {{#  } }}
                {{# if(baseFuncInfo.authorityTag('sysPushList#reason')) { }}
                    {{# if(d.pushStatus === $.constant.pushStatus.FAIL){ }}
                         <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="detail">查看原因</a>
                    {{#  } }}
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysPushList.js?t=${currentTimeMillis}"></script>
</body>
</html>