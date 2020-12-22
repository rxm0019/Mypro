<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="patOutInRecordList">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-form search-form">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" >
                    <div class="disui-form-flex">
                        <label>转归类型：</label>
                        <input type="radio" name="outInType" lay-filter="outInType"  value="" title="全部" checked>
                        <input type="radio" name="outInType" lay-filter="outInType"  value="0" title="转出">
                        <input type="radio" name="outInType" lay-filter="outInType"  value="1" title="转入">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div id="patOutInRecordList_tool" style="padding: 10px;">
                <button :visible="@baseFuncInfo.authorityTag('patOutInRecordList#add')"
                        class="layui-btn-dis-xs layui-btn-dismain" onclick="saveOrEdit()">添加
                </button>
            </div>
            <!--table定义-->
            <table id="patOutInRecordList_table" lay-filter="patOutInRecordList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="patOutInRecordList_bar">
                {{#  if(baseFuncInfo.authorityTag('patOutInRecordList#edit')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('patOutInRecordList#del')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patOutInRecordList.js?t=${currentTimeMillis}"></script>
</body>
</html>