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
<body ms-controller="sysDictDataList">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-header" :visible="@showDictDesc != null && @showDictDesc != ''" ms-text="@showDictDesc"></div>
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="sysDictDataList_search" lay-filter="sysDictDataList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="sysDictDataList_tool">
                <button :visible="@baseFuncInfo.authorityTag('sysDictDataList#add')"
                        class="layui-btn layui-btn-dismain layui-btn-dis-xs" onclick="onDictDataAdd()">添加
                </button>
                <button :visible="@baseFuncInfo.authorityTag('sysDictDataList#delete')"
                        class="layui-btn layui-btn-dissub layui-btn-dis-xs" onclick="onDictDataBatchDelete()">删除
                </button>

            </div>
            <!--table定义-->
            <table id="sysDictDataList_table" lay-filter="sysDictDataList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="sysDictDataList_bar">
                {{#  if(baseFuncInfo.authorityTag('sysDictDataList#detail')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysDictDataList#edit')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysDictDataList#delete') ){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysDictDataList.js?t=${currentTimeMillis}"></script>
</body>
</html>
