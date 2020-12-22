<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <script type="text/javascript" src="${ctxsta}/static/lib/jquery.base64/jquery.base64.js"></script>
</head>
<body ms-controller="sysUserReset">
<div class="layui-card-body">
    <div class="layui-form layui-row layui-col-space1" lay-filter="sysUserReset_form" id="sysUserReset_form" style="padding: 10px;">
        <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
            <div class="disui-form-flex">
                <label>ID：</label>
                <input type="hidden" name="id" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>登陆账号：</label>
                <input type="text" name="loginId" autocomplete="off" :attr="{readonly: true}">
            </div>
        </div>
        <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>新密码：</label>
                <input type="password" name="password" lay-verify="pass" id="LAY_password" autocomplete="off">
            </div>
            <div class="disui-form-flex">
                <label></label>
                <div class="layui-form-mid layui-word-aux">6到16个字符</div>
            </div>
        </div>
        <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>确认密码：</label>
                <input type="password" name="repass" lay-verify="repass" autocomplete="off">
            </div>
        </div>

        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysUserReset_submit" id="sysUserReset_submit">提交</button>
        </div>
    </div>
</div>

<script type="text/javascript" src="${ctxsta}/static/js/system/sysUserReset.js?t=${currentTimeMillis}"></script>
</body>
</html>
