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
<body ms-controller="recentInspectionItemList">
<div style="padding: 10px;">

    <div class="layui-card-body">
        <div id="tesPlanList_tool">
            <button :visible="@baseFuncInfo.authorityTag('tesPlanList#add')"
                    class="layui-btn layui-btn-dismain" onclick="add()">添加
            </button>
            <button :visible="@baseFuncInfo.authorityTag('tesPlanList#inspectionCRecord')"
                    class="layui-btn layui-btn-dismain" onclick="changeRecord()">检验变更记录
            </button>
            <button :visible="@baseFuncInfo.authorityTag('tesPlanList#checkTheChange')"
                    class="layui-btn layui-btn-dismain" onclick="changePlan()">检验变更
            </button>
        </div>
        <!--table定义-->
        <table id="recentInspectionItemList_table" lay-filter="recentInspectionItemList_table"></table>
    </div>
    <!--table的工具栏按钮定义，注意：需要增加权限控制-->
    <script type="text/html" id="recentInspectionItemList_bar">
        {{#  if(baseFuncInfo.authorityTag('tesPlanList#edit')){ }}
        <a class=" layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
        {{#  } }}
        {{#  if(baseFuncInfo.authorityTag('tesPlanList#change')){ }}
        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="change">检验变更</a>
        {{#  } }}
        {{#  if(baseFuncInfo.authorityTag('tesPlanList#del')){ }}
        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
        {{#  } }}
    </script>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/recentInspectionItemList.js?t=${currentTimeMillis}"></script>
</body>
</html>