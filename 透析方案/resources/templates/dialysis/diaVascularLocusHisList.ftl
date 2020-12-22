<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
</head>
<style type="text/css">
    .needle-no{
        width: 25px;
        height: 25px;
        background: #FF784E;
        display: inline-block;
        color: #ffffff;
        text-align: center;
        line-height: 25px;
        border-radius: 25px;
    }
    .tag-div{
        position: absolute;
        border: 1px solid rgb(204, 204, 204);
        color: rgb(0, 0, 0);
        border-radius: 7px;
        font-size: 11px;
        padding: 0px 5px;
        background: rgb(255, 255, 255);
        height: 23px;
        line-height: 23px;
        cursor: pointer;
    }
</style>
<body ms-controller="diaVascularLocusHisList">
<div class="layui-fluid" style="height: 500px;">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" style="padding-right: 20px;">
            <div style="color: #000000;font-weight: bold;padding: 10px 0;">历史记录</div>
            <table id="diaVascularLocusHisList_table" lay-filter="diaVascularLocusHisList_table"></table>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" style="padding: 0 10px;">
            <div style="color: #000000;font-weight: bold;padding: 10px 0;">血管通路图</div>
            <div id="roadImgDiv" style="position: relative;width: 100%;">
                <img id="roadImg" style="width: 100%;">
            </div>
        </div>
    </div>
    <!--table的工具栏按钮定义，注意：需要增加权限控制-->
    <script type="text/html" id="diaVascularLocusHisList_bar">
        {{#  if(baseFuncInfo.authorityTag('diaVascularLocusHisList#delete')){ }}
            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
        {{#  } }}
    </script>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaVascularLocusHisList.js?t=${currentTimeMillis}"></script>
</body>
</html>