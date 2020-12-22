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
        .layui-row.key-list .disui-form-flex>label {
            flex: 0 0 100px;
        }
        .custom-btn {
            line-height: 38px;
        }
    </style>
</head>
<body ms-controller="sysMenuAuto">
<div class="layui-form" lay-filter="sysMenuAuto_form" id="sysMenuAuto_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
            <div class="disui-form-flex">
                <label>parentId：</label>
                <input type="hidden" name="parentId" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label>上级菜单：</label>
                <input type="text" name="parentName" readonly autocomplete="off" class="layui-input">
            </div>
        </div>
    </div>
    <div class="layui-row">
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>表名字<i class="layui-icon layui-icon-tips" style="margin-top: 10px" lay-tips="以工具生成表时的名字为准"></i>：</label>
                <input type="text" name="tableName" ms-duplex="@tableName" maxlength="50" lay-verify="required" placeholder="数据库表名,比如 t_user" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>菜单名称：</label>
                <input type="text" name="menuName" ms-duplex="@menuName" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>菜单地址<i class="layui-icon layui-icon-tips" style="margin-top: 10px" lay-tips="该地址是以生成工具生成的路径为准"></i>：</label>
                <input type="text" name="menuUrl" ms-duplex="@menuUrl" maxlength="255" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>按钮权限列表：</label>
                <a ms-click="@addPk" class="custom-btn" style="color: dodgerblue;" href="javascript:;">
                    <i class="layui-icon layui-icon-add-circle"></i>添加(可多个)
                </a>
            </div>
        </div>
    </div>
    <div class="layui-row key-list" ms-for="($index, el) in @keyList">
        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>按钮名称：</label>
                <input type="text" name="keyName" maxlength="50" lay-verify="required" ms-duplex="@el.keyName" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>按钮代码：</label>
                <input type="text" name="keyCode" maxlength="50" lay-verify="required" ms-duplex="@el.keyCode" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
            <div class="disui-form-flex">
                <label>API链接：</label>
                <input type="text" name="apiUrl" maxlength="255" ms-duplex="@el.apiUrl" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-col-sm1 layui-col-md1 layui-col-lg1" style="text-align: right;">
            <a href="javascript:;" class="custom-btn" style="color: red; text-align: right;" ms-click="@delPk($index)">
                <i class="layui-icon layui-icon-close"></i>删除
            </a>
        </div>
    </div>
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="sysMenuAuto_submit" id="sysMenuAuto_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysMenuAuto.js?t=${currentTimeMillis}"></script>
</body>
</html>
