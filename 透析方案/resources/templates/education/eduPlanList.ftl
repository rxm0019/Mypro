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
<body ms-controller="eduPlanList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="eduPlanList_search" lay-filter="eduPlanList_search">
        </div>

        <div class="layui-card-body" style="padding: 10px;">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding-bottom: 10px;" id="eduPlanList_tool">
                <button :visible="@baseFuncInfo.authorityTag('eduPlanList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="batchAdd()">制定计划</button>
<#--                <button :visible="@baseFuncInfo.authorityTag('eduPlanList#wechat')"-->
<#--                        class="layui-btn layui-btn-dissub"  onclick="sendWeChat()">微信推送</button>-->
            </div>
            <!--table定义-->
            <table id="eduPlanList_table" lay-filter="eduPlanList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="eduPlanList_bar">
                {{#  if(baseFuncInfo.authorityTag('eduPlanList#edit') && d.sustainType == $.constant.sustainType.newPatient){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">转维持患者</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('eduPlanList#edit') && d.sustainType == $.constant.sustainType.keepPatient){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">转新患者</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('eduPlanList#edit') && d.sustainType != $.constant.sustainType.keepPatient
                && d.sustainType != $.constant.sustainType.newPatient){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">转新患者</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('eduPlanList#add')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="add">制定计划</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/education/eduPlanList.js?t=${currentTimeMillis}"></script>
</body>
</html>