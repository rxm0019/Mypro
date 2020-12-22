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
<body ms-controller="bacWeixinPushShow">

    <!-- 健康教育、公告 -->
    <div class="layui-form" lay-filter="bacWeixinPushShow_form" id="bacWeixinPushShow_form" ms-if="pushType==@pushModule.HEALTHEDUCATION || pushType==pushModule.NOTICE">
        <div style="padding: 20px">
            <div id="content" lay-verify="content" name="content"></div>
        </div>
    </div>

    <!-- 患者排班 -->
    <div ms-if="pushType==pushModule.PATIENTSCHEDUL">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="patientScheduleList_search" lay-filter="patientScheduleList_search">
        </div>

        <!--table定义-->
        <table id="patientScheduleList_table" lay-filter="patientScheduleList_table"></table>
    </div>

<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacWeixinPushShow.js?t=${currentTimeMillis}"></script>
</body>
</html>