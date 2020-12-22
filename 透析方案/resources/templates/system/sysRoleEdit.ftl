<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/lib/zTree/v3/css/layuiStyle/layuiStyle.css">
    <style>
        .layui-row .disui-form-flex.role-tree-box {
            height: calc(100vh - 90px);
            overflow-y: auto;
            border: solid 0.5px rgba(83, 100, 113,0.5);
            border-radius: 6px;
        }
    </style>
</head>
<body ms-controller="sysRoleEdit">
<!-- 角色基本信息表单 -->
<div class="layui-form layui-row layui-col-xs6 layui-col-space1" lay-filter="sysRoleEdit_form" id="sysRoleEdit_form" style="padding: 10px;">
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
        <div class="disui-form-flex">
            <label>ID：</label>
            <input type="hidden" name="id" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label><span class="edit-verify-span">*</span>角色名称：</label>
            <input type="text" name="roleName" maxlength="50" lay-verify="required" autocomplete="off">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label><span class="edit-verify-span">*</span>角色代码：</label>
            <input type="text" name="roleCode" maxlength="50" lay-verify="required" autocomplete="off">
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label>角色描述：</label>
            <textarea name="remark" maxlength="255" class="layui-textarea"></textarea>
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <label>角色状态：</label>
            <div class="layui-input-block">
                <input type="radio" lay-verify="radio" name="dataStatus"
                       ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')"
                       ms-attr="{value: el.value, title: el.name, checked: true && $index == 0}">
            </div>
        </div>
    </div>

    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="sysRoleEdit_submit" id="sysRoleEdit_submit">提交</button>
    </div>
</div>

<!-- 角色菜单权限设置表单 -->
<div class="layui-form layui-row layui-col-xs6" lay-filter="sysOpenTree_form" id="sysOpenTree_form" style="padding: 10px;">
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
        <div class="disui-form-flex">
            <input type="text" name="searchnName" placeholder="角色权限名称" autocomplete="off">
            <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" lay-submit lay-filter="sysOpenTree_search" style="width: 50px;">
                <i class="layui-icon layui-icon-search"></i>
            </button>
        </div>
    </div>
    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 mt-5" style="padding: 3px;">
        <label>分配角色权限：</label>
        <div class="disui-form-flex role-tree-box" style="">
            <ul id="sysOpenTree" class="ztree"></ul>
        </div>
    </div>
</div>
<!-- 引入js-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysRoleEdit.js?t=${currentTimeMillis}"></script>
<script type="text/javascript" src="${ctxsta}/static/lib/zTree/v3/js/jquery.ztree.all.min.js"></script>
</body>
</html>
