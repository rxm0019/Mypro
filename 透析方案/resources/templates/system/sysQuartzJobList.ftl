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
<style type="text/css">
    .layui-form-label {
        width: 120px;
    }
    .layui-form-item .layui-inline {
        width: 330px !important;
    }
    .layui-form-item .layui-inline button{
        margin-left: 18px !important;
    }
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="sysQuartzJobList">
<div class="layui-fluid">

    <div class="layui-card">
        <!--搜素栏的div-->
       <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="sysQuartzJobList_search" lay-filter="sysQuartzJobList_search">
        </div>
        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="sysQuartzJobList_tool">
                <button :visible="@baseFuncInfo.authorityTag('sysQuartzJobList#batchDel')"
                        class="layui-btn"  onclick="batchDel()">删除</button>
                <button :visible="@baseFuncInfo.authorityTag('sysQuartzJobList#add')"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">新增</button>
            </div>
            <!--table定义-->
            <table id="sysQuartzJobList_table" lay-filter="sysQuartzJobList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="sysQuartzJobList_bar">
                {{#  if(baseFuncInfo.authorityTag('sysQuartzJobList#frequencyAdjust')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="edit">频率调整</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysQuartzJobList#immediateExecution')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="immediateExecution">立即执行</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysQuartzJobList#enable')){ }}
                  {{# if(d.dataStatus ==='1'){ }}
                     <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="enable">启用</a>
                  {{# }else { }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="enable">停用</a>
                  {{#  } }}
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('sysQuartzJobList#delete')){ }}
                    <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysQuartzJobList.js?t=${currentTimeMillis}"></script>
</body>
</html>