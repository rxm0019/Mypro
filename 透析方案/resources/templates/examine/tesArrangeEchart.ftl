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
<body ms-controller="tesArrangeEchart">
<div class="layui-fluid" style="padding: 0px 10px !important;">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="tesArrangeEchart_search" lay-filter="tesArrangeEchart_search">
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
                <div class="layui-inline" style="height: 35px"><label class="layui-form-label" style="width: 85px;">检验项名称：</label>
                    <div class="layui-input-inline">
                        <select name="examineItemsNo" xm-select="examineItemsNo" xm-select-height="36px" xm-select-search="" >
                            <option value=""></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item btn-box" style="margin-bottom: 0px;">
                <div class="layui-inline">
                    <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" lay-submit
                            lay-filter="tesArrangeEchart_search_search"> 搜 索
                    </button>
                    <a href="javascript:;" class="pl-10 condition-toogle"> <cite></cite><span
                                class="layui-icon condition-icon"></span> </a>
                </div>
            </div>
        </div>

        <div class="layui-card-body" style="height: calc(100vh - 60px);overflow: auto;">
            <div id="echarts">

            </div>

        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/lib/echarts/4.3.0/echarts.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesArrangeEchart.js?t=${currentTimeMillis}"></script>
</body>
</html>