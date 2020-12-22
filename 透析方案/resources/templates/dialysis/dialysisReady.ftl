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
        .layui-table-sort {
            margin: 0;
            vertical-align: middle;
            margin-bottom: 3px;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="dialysisReady">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="dialysisReady_search" lay-filter="dialysisReady_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="dialysisReady_tool">
                <button class="layui-btn layui-btn-dismain"  onclick="exportExcel()">导出</button>
            </div>

            <!--table定义-->
            <div class="layui-tab" lay-filter="readyTab">
                <ul class="layui-tab-title">
                    <li class="layui-this">上机准备</li>
                    <li>耗材准备</li>
                    <li>药品准备</li>
                </ul>
                <div class="layui-tab-content">
                    <!--上机准备-->
                    <div class="layui-tab-item layui-show">
                        <table id="dialysisPatient_table" lay-filter="dialysisPatient_table"></table>
                    </div>
                    <!--耗材准备-->
                    <div class="layui-tab-item">
                        <table id="dialysisMaterial_table" lay-filter="dialysisMaterial_table"></table>
                    </div>
                    <!--药品准备-->
                    <div class="layui-tab-item">
                        <table id="dialysisDrugs_table" lay-filter="dialysisDrugs_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/dialysisReady.js?t=${currentTimeMillis}"></script>
</body>
</html>