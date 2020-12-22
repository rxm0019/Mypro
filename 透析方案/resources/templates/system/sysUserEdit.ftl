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
        .layui-row .disui-form-flex>label {
            flex: 0 0 110px;
        }
    </style>
</head>
<body ms-controller="sysUserEdit">
<div class="layui-card-body">
    <div class="layui-form layui-row layui-col-space1" lay-filter="sysUserEdit_form" id="sysUserEdit_form" style="padding: 10px;">
        <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
            <div class="disui-form-flex">
                <label>ID：</label>
                <input type="hidden" name="id" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>角色：</label>
                <div class="layui-input-block">
                    <input type="checkbox" lay-verify="checkbox" lay-skin="primary" name="roleId"
                           ms-for="($index, el) in @roleOptions"
                           ms-attr="{value: el.value, title: el.name, checked: false, disabled: @readonly}">
                </div>
            </div>
        </div>
        <div class="layui-col-xs6 layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>登陆账号：</label>
                <input type="text" name="loginId" maxlength="50" lay-verify="required" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-xs6 layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>用户姓名：</label>
                <input type="text" name="userName" maxlength="64" lay-verify="required" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-xs6 layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label>性别：</label>
                <div>
                    <input type="radio" lay-verify="radio" name="sex"
                           ms-for="($index, el) in @sexOptions"
                           ms-attr="{value: el.value, title: el.name, checked: true && $index == 0, disabled: @readonly}">
                </div>
            </div>
        </div>
        <div class="layui-col-xs6 layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label>职称：</label>
                <select name="title" :attr="{disabled: @readonly}">
                    <option value=""></option>
                    <option ms-for="($index, el) in @titleOptions"
                            ms-attr="{value: el.value}"
                            ms-text="@el.name"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-xs6 layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label>用户类型：</label>
                <select name="userType" :attr="{disabled: @readonly}">
                    <option value=""></option>
                    <option ms-for="($index, el) in @userTypeOptions"
                            ms-attr="{value: el.value}"
                            ms-text="@el.name"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-xs6 layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label>手机号码：</label>
                <input type="text" name="mobile" maxlength="20" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>邮箱：</label>
                <input type="text" name="email" maxlength="128" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>地址：</label>
                <input type="text" name="address" maxlength="200" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-xs6 layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label>医保用户代码：</label>
                <input type="text" name="medicalUser" maxlength="128" autocomplete="off" :attr="{readonly: @readonly}">
            </div>
        </div>
        <div class="layui-col-xs6 layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label>状态：</label>
                <div>
                    <input type="radio" lay-verify="radio" name="dataStatus"
                           ms-for="($index, el) in @dataStatusOptions"
                           ms-attr="{value: el.value, title: el.name, checked: true && $index == 0, disabled: @readonly}">
                </div>
            </div>
        </div>

        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysUserEdit_submit" id="sysUserEdit_submit">提交</button>
        </div>
    </div>
</div>

<script type="text/javascript" src="${ctxsta}/static/js/system/sysUserEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
