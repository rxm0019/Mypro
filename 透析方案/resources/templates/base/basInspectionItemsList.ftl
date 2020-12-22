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
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
    <style>
        .layui-form-label {
            width: 100px;
        }

        .layui-input, .layui-textarea {
            padding-left: 10px !important;
            border: solid 0.5px rgba(83, 100, 113, 0.5);
            border-radius: 6px;
            background-color: #FFFFFF;
            width: 170px;
        }

        .layui-input-inline, .layui-inline {
            width: 170px !important;
        }

        .layui-form-item .layui-inline {
            width: 300px !important;
        }
    </style>
</head>
<body ms-controller="basInspectionItemsList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="basInspectionItemsList_search" lay-filter="basInspectionItemsList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="basInspectionItemsList_tool">
                <button :visible="@baseFuncInfo.authorityTag('basInspectionItemsList#add')"
                        class="layui-btn layui-btn-dismain" onclick="saveOrEdit()">添加
                </button>
                <button :visible="@baseFuncInfo.authorityTag('basInspectionItemsList#import')"
                        class="layui-btn layui-btn-dissub" :click="@baseFuncInfo.batchImp('basInspectionItems','platform')">
                    导入
                </button>
                <button :visible="@baseFuncInfo.authorityTag('basInspectionItemsList#export')"
                        class="layui-btn layui-btn-dissub" onclick="onExportExcel()">导出
                </button>
                <button :visible="@baseFuncInfo.authorityTag('basInspectionItemsList#delete')"
                        class="layui-btn layui-btn-dissub" onclick="batchDel()">删除
                </button>
            </div>
            <!--table定义-->
            <table id="basInspectionItemsList_table" lay-filter="basInspectionItemsList_table"></table>
            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="basInspectionItemsList_bar">
                {{#  if(baseFuncInfo.authorityTag('basInspectionItemsList#detail')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" lay-event="detail">详情</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basInspectionItemsList#edit')){ }}
                <a class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('basInspectionItemsList#delete')){ }}
                <a class="layui-btn layui-btn-danger layui-btn-xs layui-btn-dissmall layui-btn-dis-black"
                   lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/base/basInspectionItemsList.js?t=${currentTimeMillis}"></script>
</body>
</html>