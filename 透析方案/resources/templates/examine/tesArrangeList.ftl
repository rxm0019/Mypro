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
<body ms-controller="tesArrangeList">
<div class="layui-fluid" style="padding: 0px 10px !important;">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="testItemReportList_search" lay-filter="tesArrangeList_search">
            <div class="layui-form-item condition-box">
                <div class="layui-inline" style="height: 35px"><label class="layui-form-label">申请日期：</label>
                    <div class="layui-input-block">
                        <div class="layui-input-inline"><input type="text" name="applyDateBegin"
                                                               placeholder="yyyy-MM-dd" id="applyDateBegin"
                                                               class="layui-input"></div>
                        <div class="layui-form-mid layui-word-aux"> -</div>
                        <div class="layui-input-inline"><input type="text" name="applyDateEnd" placeholder="yyyy-MM-dd"
                                                               id="applyDateEnd" class="layui-input"></div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item btn-box" style="margin-bottom: 0px;">
                <div class="layui-inline">
                    <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" lay-submit
                            lay-filter="tesArrangeList_search_search"> 搜 索
                    </button>
                    <a href="javascript:;" class="pl-10 condition-toogle"> <cite></cite><span
                                class="layui-icon condition-icon"></span> </a>
                </div>
            </div>
        </div>

        <div class="layui-card-body">
            <div class="layui-tab layui-tab-brief" lay-filter="tabItems">
                <ul class="layui-tab-title" id="tabItems">
                </ul>
            </div>

            <div class="layui-row" style="padding-top: 10px;">
                <div class="layui-col-md2">
                    <table id="tesApplyTime_table" lay-filter="tesApplyTime_table"></table>
                </div>
                <div class="layui-col-md10" style="padding-left: 10px;">
                    <!--工具栏的按钮的div，注意：需要增加权限控制-->
                    <div style="padding: 0px 10px 10px 0px;" id="tesApplyList_tool">
                        <button class="layui-btn layui-btn-dismain" :visible="@baseFuncInfo.authorityTag('tesArrangeList#show')"
                                onclick="arrangeEchart()">趋势图</button>
                    </div>
                    <!--table定义-->
                    <table id="tesArrangeList_table" lay-filter="tesArrangeList_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesArrangeList.js?t=${currentTimeMillis}"></script>
</body>
</html>