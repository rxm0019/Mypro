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
<body ms-controller="sysRoleList">

<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="sysRoleList_search" lay-filter="sysRoleList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style=" padding: 15px 15px 0 15px;" id="sysRoleList_tool">
                <button :visible="@baseFuncInfo.authorityTag('sysRoleList#add')"
                        class="layui-btn layui-btn-dismain layui-btn-dis-xs" onclick="onRoleAdd()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('sysRoleList#delete')"
                        class="layui-btn layui-btn-dissub layui-btn-dis-xs" onclick="onRoleBatchDelete()">删除</button>
            </div>

            <!--table定义-->
            <table id="sysRoleList_table" lay-filter="sysRoleList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="sysRoleList_bar">
                {{#  if(baseFuncInfo.authorityTag('sysRoleList#edit')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysRoleList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="delete">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysRoleList.js?t=${currentTimeMillis}"></script>
</body>
</html>
