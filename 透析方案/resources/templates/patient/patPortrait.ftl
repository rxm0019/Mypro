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
        .evaluation-item {
            padding: 10px;
            border: 1px solid #EFEFEF;
            border-radius: 10px;
        }
        .evaluation-item .chart-body {
            width: 100%;
            height: 300px;
            margin-top: 10px;
        }
    </style>
</head>
<body ms-controller="patPortrait">
<div class="layui-fluid" style="padding-top: 0 !important;">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="patPortrait_search" lay-filter="patPortrait_search">
        </div>

        <div class="layui-card-body" style="padding: 10px;" id="evaluationCharts">
            <div class="layui-row layui-col-space10"></div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/lib/echarts/4.3.0/echarts.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPortrait.js?t=${currentTimeMillis}"></script>
</body>
</html>
