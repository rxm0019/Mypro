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
<body ms-controller="bacWeixinPushList">
<div class="layui-fluid" style="padding: 0 10px !important;">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacWeixinPushList_search" lay-filter="bacWeixinPushList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 7px 15px;" id="bacWeixinPushList_tool">
                <button :visible="@baseFuncInfo.authorityTag('bacWeixinPushList#pushHealth')"
                        class="layui-btn layui-btn-dismain"  onclick="modulePush($.constant.PushModule.HEALTHEDUCATION)">健康教育推送</button>
                <button :visible="@baseFuncInfo.authorityTag('bacWeixinPushList#pushPatient')"
                        class="layui-btn layui-btn-dismain"  onclick="modulePush($.constant.PushModule.PATIENTSCHEDUL)">患者排班推送</button>
                <button :visible="@baseFuncInfo.authorityTag('bacWeixinPushList#pushNotice')"
                        class="layui-btn layui-btn-dismain"  onclick="modulePush($.constant.PushModule.NOTICE)">公告推送</button>
            </div>
            <!--table定义-->
            <table id="bacWeixinPushList_table" lay-filter="bacWeixinPushList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="bacWeixinPushList_bar">
                {{#  if(baseFuncInfo.authorityTag('bacWeixinPushList#preview')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="preview">预览</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacWeixinPushList.js?t=${currentTimeMillis}"></script>
</body>
</html>