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
<body ms-controller="eduDataBaseShow">
<div class="layui-fluid">
    <div class="layui-form" lay-filter="eduDataBaseShow_form" id="eduDataBaseShow_form" style="background-color: white;height: calc(100vh - 20px);">
        <div class="layui-row layui-col-space1">
            <div class="layui-row">
                <div style="padding: 20px;background-color: white;">
                    <div id="content" lay-verify="content" name="content"></div>
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1" style="padding: 20px 0px 10px 0px;background-color: white;" :visible="@isSave">
            <div class="layui-row">
                <div style="padding: 20px;text-align: center;">
                    <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach layui-btn layui-btn-dismain" style="width: 50%;" id="andSetTime" onclick="saveTeach()">完成宣教</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/education/eduDataBaseShow.js?t=${currentTimeMillis}"></script>
</body>
</html>