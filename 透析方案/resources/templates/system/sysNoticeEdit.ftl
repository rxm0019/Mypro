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
<body ms-controller="sysNoticeEdit">
<div class="layui-form" lay-filter="sysNoticeEdit_form" id="sysNoticeEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="noticeId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>通知标题</label>
            <div class="layui-input-inline">
                <input type="text" name="noticeTitle" maxlength="20" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>通知内容</label>
            <div class="layui-input-inline" style="width: 60%">
                <input  name="noticeContent" maxlength="300" lay-verify="required"   autocomplete="off"
                    class="layui-input"/>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label"><span class="edit-verify-span">*</span>生失效时间</label>
                <div class="layui-input-block">
                    <div class="layui-input-inline">
                        <input type="text" name="startDate" lay-verify="required" id="startDate" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
                    </div>
                    <div class="layui-form-mid layui-word-aux"> - </div>
                    <div class="layui-input-inline">
                        <input type="text" name="endDate" lay-verify="required" id="endDate" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item layui-hide">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>发布人</label>
            <div class="layui-input-inline">
                <input type="text" name="publisher" id="publisher" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysNoticeEdit_submit" id="sysNoticeEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysNoticeEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>