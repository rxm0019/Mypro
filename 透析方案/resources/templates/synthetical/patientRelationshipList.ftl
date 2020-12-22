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
<body ms-controller="patientRelationshipList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="patientRelationshipList_search" lay-filter="patientRelationshipList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="patPatientInfoList_tool">
                <button :visible="@baseFuncInfo.authorityTag('patientRelationshipList#add')"
                        class="layui-btn layui-btn-dismain" onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('patientRelationshipList#delete')"
                        class="layui-btn layui-btn-dissub" onclick="batchDel()">删除</button>
            </div>

            <!--table定义-->
            <table id="patientRelationshipList_table" lay-filter="patientRelationshipList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="patientRelationshipList_bar">
                {{#  if(baseFuncInfo.authorityTag('patientRelationshipList#detail')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue " lay-event="detail">详情</a>
                {{#  } }}

                {{#  if(baseFuncInfo.authorityTag('patientRelationshipList#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red " lay-event="edit">编辑</a>
                {{#  } }}

                {{#  if(baseFuncInfo.authorityTag('patientRelationshipList#delete')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/patientRelationshipList.js?t=${currentTimeMillis}"></script>
</body>
</html>
