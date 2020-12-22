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
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="sysDictList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="sysDictList_search" lay-filter="sysDictList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="sysDictList_tool">
                <button :visible="@baseFuncInfo.authorityTag('sysDictList#add')"
                        class="layui-btn layui-btn-dismain layui-btn-dis-xs" onclick="onDictAdd()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('sysDictList#delete')"
                        class="layui-btn layui-btn-dissub layui-btn-dis-xs" onclick="onDictBatchDelete()">删除</button>
            </div>
            <!--table定义-->
            <table id="sysDictList_table" lay-filter="sysDictList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="sysDictList_bar">
                {{#  if(baseFuncInfo.authorityTag('sysDictList#detail')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysDictList#edit')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysDictList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysDictList.js?t=${currentTimeMillis}"></script>
</body>
</html>
