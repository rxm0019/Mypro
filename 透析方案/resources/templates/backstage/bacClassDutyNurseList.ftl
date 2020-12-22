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
<body ms-controller="bacClassDutyNurseList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacClassDutyNurseList_search" lay-filter="bacClassDutyNurseList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="bacClassDutyDoctorList_tool">
                <button :visible="@baseFuncInfo.authorityTag('bacClassDutyNurseList#classManage')"
                        class="layui-btn layui-btn-dismain"  onclick="classManage()">班种管理</button>
                <button :visible="@baseFuncInfo.authorityTag('bacClassDutyNurseList#classTemplate')"
                        class="layui-btn layui-btn-dismain"  onclick="classTemplate()">值班模板管理</button>
                <button :visible="@baseFuncInfo.authorityTag('bacClassDutyNurseList#workingHours')"
                        class="layui-btn layui-btn-dismain"  onclick="workingHours()">工时管理</button>
                <button :visible="@baseFuncInfo.authorityTag('bacClassDutyNurseList#classDuty')"
                        class="layui-btn layui-btn-dismain"  onclick="classDuty()">考勤统计</button>
                <button :visible="@baseFuncInfo.authorityTag('bacClassDutyNurseList#excel')"
                        class="layui-btn layui-btn-dissub"  onclick="exportExcel()">导出</button>
            </div>

            <div style="width: 24.5%;float: left;">
                <!--table定义-->
                <table id="bacClassManageDoctorList_table" lay-filter="bacClassManageDoctorList_table"></table>
            </div>
            <div style="width: 75%;float: right;">
                <!--table定义-->
                <table id="bacClassDutyNurseList_table" lay-filter="bacClassDutyNurseList_table"></table>
            </div>
            <div style="clear: both;"></div>

        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacClassDutyNurseList.js?t=${currentTimeMillis}"></script>
</body>
</html>