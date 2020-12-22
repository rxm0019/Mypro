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
<body ms-controller="testReportList">
<div class="layui-fluid" style="padding: 0px 10px !important;">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="testReportList_search" lay-filter="testReportList_search">
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
                            lay-filter="testReportList_search_search"> 搜 索
                    </button>
                    <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach layui-btn-dismain"
                            :visible="@baseFuncInfo.authorityTag('testReportList#resule')"  onclick="getSampleCodeResule()">获取结果</button>
                    <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach layui-btn-dissub"
                            :visible="@baseFuncInfo.authorityTag('tesArrangeEdit#edit')" onclick="edit()">编辑</button>
                    <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach layui-btn-dissub"
                            :visible="@baseFuncInfo.authorityTag('testReportList#delete')" onclick="delArrange()">删除</button>
                    <a href="javascript:;" class="pl-10 condition-toogle"> <cite></cite><span
                                class="layui-icon condition-icon"></span> </a>
                </div>
            </div>
        </div>

        <div class="layui-card-body">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-md3">
                    <table id="tesApplySampleList_table" lay-filter="tesApplySampleList_table"></table>
                </div>
                <div class="layui-col-md9" style="padding-left: 10px;">
                    <div class="layui-form">
                        <div class="disui-form-flex" >
                            <label class="layui-form-label">检验总评：</label>
                            <input type="text" name="assess" id="assess" readonly autocomplete="off">
                        </div>
                    </div>
                    <table id="testReportList_table" lay-filter="testReportList_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/examine/testReportList.js?t=${currentTimeMillis}"></script>
</body>
</html>