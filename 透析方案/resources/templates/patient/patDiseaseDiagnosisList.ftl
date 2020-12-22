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
<style>
    .layui-fluid {
        padding: 0px 10px !important;
    }
    .layui-card {
        margin-bottom: 10px;
    }
    .layui-elem-field{
        margin: 10px!important;
    }
    .layui-elem-field legend{
        font-size: 14px;
    }
    .drop-item{
        display: flex;
        display: -webkit-flex;
        font-size: 14px;
        border-bottom: 1px solid #e6e6e6;
    }
    .drop-item .left-wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        width:30%;
    }
    .drop-item .left-wrapper > img {
        width: 70%;
        height: 70%;
        border-radius: 50%;
    }
    .drop-item .right-wrapper{
        width: 70%;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .drop-item .right-wrapper > div{
        width:100%;
        height: 50%;
        /*border:1px solid #ddd;*/
    }
    .drop-item .right-wrapper  .one-item{
        display: flex;
        flex: 1;
        align-items: center;
    }
    .drop-item .right-wrapper  .two-item{
        display: flex;
        align-items: center;
    }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="patDiseaseDiagnosisList">
<div class="layui-fluid">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <#--疾病诊断记录表-->
            <div class="layui-card">
                <!--工具栏的按钮的div，注意：需要增加权限控制-->
                <div style="padding: 10px;" id="patDiseaseDiagnosisList_tool">
                    <button :visible="@baseFuncInfo.authorityTag('patDiseaseDiagnosisList#add')"
                            class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                </div>
                <!--table定义-->
                <table id="patDiseaseDiagnosisList_table" lay-filter="patDiseaseDiagnosisList_table"></table>
                <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                <script type="text/html" id="patDiseaseDiagnosisList_bar">
                    {{#  if(baseFuncInfo.authorityTag('patDiseaseDiagnosisList#edit')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                    {{#  } }}
                    {{#  if(baseFuncInfo.authorityTag('patDiseaseDiagnosisList#del')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                    {{#  } }}
                </script>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patDiseaseDiagnosisList.js?t=${currentTimeMillis}"></script>
</body>
</html>
