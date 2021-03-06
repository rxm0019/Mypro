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
        .patient-tag {
            border: 1px solid;
            padding: 5px;
            border-radius: 5px;
            font-size: 12px;
            margin-left: 5px;
        }
        .patient-tag:first-child {
            margin-left: 0;
        }
    </style>
</head>
<body ms-controller="patPatientInfoList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="patPatientInfoList_search" lay-filter="patPatientInfoList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="patPatientInfoList_tool">
                <button :visible="@baseFuncInfo.authorityTag('patPatientInfoList#add')"
                        class="layui-btn layui-btn-dismain" onclick="onPatientAdd()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('patPatientInfoList#export')"
                        class="layui-btn layui-btn-dissub" onclick="onExportExcel()">导出</button>
                <button :visible="@baseFuncInfo.authorityTag('patPatientInfoList#print')"
                        class="layui-btn layui-btn-dissub" onclick="onPatientPrint()">打印二维码</button>
            </div>
            <!--table定义-->
            <table id="patPatientInfoList_table" lay-filter="patPatientInfoList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="patPatientInfoList_bar">
                {{# if(baseFuncInfo.authorityTag('patPatientInfoList#edit')){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="edit">编辑</a>
                {{# } }}
                {{# if(baseFuncInfo.authorityTag('patPatientInfoList#manage')){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="manage">管理</a>
                {{# } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPatientInfoList.js?t=${currentTimeMillis}"></script>
</body>
</html>
