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
    <style>
        #sysUserPwd_form {
            max-width: 400px;
            margin: 0 auto;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="sysUserPwd">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-header">修改密码</div>
        <div class="layui-card-body">
            <div class="layui-form layui-row layui-col-space1 pd-10" lay-filter="sysUserPwd_form" id="sysUserPwd_form">
                <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <label><span class="edit-verify-span">*</span>当前密码：</label>
                        <input type="password" name="userPwd" lay-verify="required" autocomplete="off">
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
                        <input type="password" name="rePassword" lay-verify="repass" autocomplete="off">
                    </div>
                </div>
                <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12 mt-10">
                    <div class="disui-form-flex">
                        <label></label>
                        <button class="layui-btn layui-btn-dismain layui-btn-dis-s" lay-submit lay-filter="sysUserPwd_submit" id="sysUserPwd_submit">确认修改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysUserPwd.js?t=${currentTimeMillis}"></script>
</body>
</html>
