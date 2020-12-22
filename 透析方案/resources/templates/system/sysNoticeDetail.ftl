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
<body ms-controller="sysNoticeDetail">
<div class="layui-form" lay-filter="sysNoticeDetail_form" id="sysNoticeDetail_form" style="padding: 20px 30px 0 0;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="noticeId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">

            <div class="layui-input-inline" style="width: 100%">
                <input style="width: 50%;margin: auto;text-align: center;border: none;font-weight: bold;font-size: 20px" type="text" name="noticeTitle" maxlength="20" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-inline" style="width: 100%;">
                <textarea  name="noticeContent" maxlength="500" lay-verify="required"   autocomplete="off" class="layui-textarea" style="width: 80%;height:250px;resize:none;margin: auto;border:0;"></textarea>
            </div>
        </div>

        <div class="layui-form-item" style="float: right;width: 60%;text-align: right">
            <label style="margin-left: 150px" class="layui-form-label">发布人:</label>
            <div class="layui-input-inline" style="width: 100px">
                <input type="text" name="publisher"  id="publisher" style="border: none;width: 100px" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysNoticeDetail_submit" id="sysNoticeDetail_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysNoticeDetail.js?t=${currentTimeMillis}"></script>
</body>
</html>