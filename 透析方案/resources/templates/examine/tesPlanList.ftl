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
<body ms-controller="tesPlanList">
<div class="layui-fluid" style="padding-top: 0 !important;">
    <div class="layui-card">
        <div class="layui-tab" lay-filter="tesPlanTab">
            <ul class="layui-tab-title">
                <li lay-id="personalPlan">个人计划</li>
                <li lay-id="centerPlan">中心计划</li>
            </ul>
            <div class="layui-tab-content">
<#--                个人计划-->
                <div class="layui-tab-item" layui-show>
                    <div style="padding-bottom: 10px;" id="tesPlanList_tool">
                        <button :visible="@baseFuncInfo.authorityTag('tesPlanList#add')"
                                class="layui-btn layui-btn-dismain" onclick="add()">添加
                        </button>
                        <button :visible="@baseFuncInfo.authorityTag('tesPlanList#centralPlanImport')"
                                class="layui-btn layui-btn-dismain" onclick="importFromCenter()">中心计划导入
                        </button>
                        <button :visible="@baseFuncInfo.authorityTag('tesPlanList#inspectionCRecord')"
                                class="layui-btn layui-btn-dissub" onclick="changeRecord()">检验变更记录
                        </button>
                        <button :visible="@baseFuncInfo.authorityTag('tesPlanList#checkTheChange')"
                                class="layui-btn layui-btn-dissub" onclick="changePlan()">检验变更
                        </button>
                    </div>
                    <table id="tesPlanList_table" lay-filter="tesPlanList_table"></table>
                </div>
<#--                中心计划-->
                <div class="layui-tab-item" layui-show>
                    <button :visible="@baseFuncInfo.authorityTag('tesPlanList#add')" style="margin-bottom: 10px"
                            class="layui-btn layui-btn-dismain" onclick="centerAdd()">添加
                    </button>
                    <table id="centerPlanList_table" lay-filter="centerPlanList_table"></table>
                </div>
            </div>
        </div>

        <div class="layui-card-body">
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="tesPlanList_bar">
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
            <script type="text/html" id="centerPlanList_bar">
                {{#  if(baseFuncInfo.authorityTag('tesPlanList#edit')){ }}
                <a class=" layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('tesPlanList#del')){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesPlanList.js?t=${currentTimeMillis}"></script>
</body>
</html>