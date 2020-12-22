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
<body ms-controller="bacScheduleTemplateList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacScheduleTemplateList_search" lay-filter="bacScheduleTemplateList_search">
            <div class="layui-form-item condition-box">
                <div class="layui-inline" style="height: 35px;"><label class="layui-form-label">模板周期：</label>
                    <div class="layui-input-block" style="margin-bottom: 0px;margin-top: 5px;">
                        <input type="radio" name="templateType" lay-filter="templateType" value="0" title="本班次" checked>
                        <input type="radio" name="templateType" lay-filter="templateType" value="1" title="当天">
                        <input type="radio" name="templateType" lay-filter="templateType" value="2" title="本周">
                    </div>
                </div>
                <div class="layui-inline" style="height: 35px"><label class="layui-form-label" style="width: 85px;">导入班次：</label>
                    <div class="layui-input-inline">
                        <select name="scheduleShift"  class="select">
                            <option value=""></option>
                            <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                     ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Shift')"></option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-card-body">
            <!--table定义-->
            <table id="bacScheduleTemplateList_table" lay-filter="bacScheduleTemplateList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="bacScheduleTemplateList_bar">
                {{#  if(baseFuncInfo.authorityTag('bacScheduleDetail#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('bacScheduleDetailList#add')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="add">导入</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('bacScheduleTemplateList#del')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacScheduleTemplateList.js?t=${currentTimeMillis}"></script>
</body>
</html>