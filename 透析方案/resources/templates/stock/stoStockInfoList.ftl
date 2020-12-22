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
    <style>
        .layui-form-label{
            width :90px !important;
        }
        .layui-tab-title {
            margin: 0 20px;
            border-bottom: 2px solid #e5e5e5;
        }

        .layui-this {
            color: #33AB9F !important;
        }

        .layui-this:after {
            border-bottom: 2px solid #33AB9F !important;
        }

        .layui-fluid {
            padding-top: 0 !important;
        }

        .layui-input-block{
            width: calc(100% - 100px);
        }

        .dis_radio > .layui-input-block {
            width: calc(100%);
        }

    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="stoStockInfoList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="stoStockInfoList_search" lay-filter="stoStockInfoList_search">
        </div>

        <div class="layui-card-body">
            <div class="layui-tab layui-tab-brief" lay-filter="stockInfoTab">
                <ul class="layui-tab-title">
                    <li lay-id="stoStockInfoListDetail" class="layui-this">详情</li>
                    <li lay-id="stoStockInfoListOverview">总览</li>
                </ul>
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show">
                        <!--工具栏的按钮的div，注意：需要增加权限控制-->
                        <div style="padding: 10px;" id="stoStockInfoList_tool">
                            <button :visible="@baseFuncInfo.authorityTag('stoStockInfoList#export')"
                                    class="layui-btn layui-btn-dismain" onclick="onExportExcel()">导出
                            </button>
                        </div>
                        <!--table定义-->
                        <table id="stoStockInfoListDetail_table" lay-filter="stoStockInfoListDetail_table"></table>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                    </div>
                    <div class="layui-tab-item">
                        <div style="padding: 10px;" id="stoStockInfoList_tool">
                            <button :visible="@baseFuncInfo.authorityTag('stoStockInfoList#export')"
                                    class="layui-btn layui-btn-dismain" onclick="onExportExcel()">导出
                            </button>
                        </div>
                        <table id="stoStockInfoListOverview_table" lay-filter="stoStockInfoListOverview_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/stock/stoStockInfoList.js?t=${currentTimeMillis}"></script>
</body>
</html>