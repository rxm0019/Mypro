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
<body ms-controller="jobList">

<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="jobList_search" lay-filter="jobList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style=" padding: 15px 15px 15px 15px;" id="jobList_tool">
                <button :visible="@baseFuncInfo.authorityTag('jobList#add')"
                        class="layui-btn layui-btn-dismain layui-btn-dis-xs"  onclick="saveOrEdit()">添加</button>
                <button :visible="@baseFuncInfo.authorityTag('jobList#batchDel')"
                        class="layui-btn layui-btn-dissub layui-btn-dis-xs"  onclick="batchDel()">删除</button>

            </div>
            <!--table定义-->
            <table id="jobList_table" lay-filter="jobList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="jobList_bar">
                {{#  if(baseFuncInfo.authorityTag('jobList#detail')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs" lay-event="detail">重设密码</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('jobList#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs" lay-event="edit">编辑</a>
                {{#  } }}
                <#--  d.createBy==baseFuncInfo.userInfoData.userid &&-->
                {{#  if( baseFuncInfo.authorityTag('jobList#del')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/job/jobList.js?t=${currentTimeMillis}"></script>
</body>
</html>
