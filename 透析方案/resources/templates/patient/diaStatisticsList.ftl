<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>
        /** 头部查询 **/
        .statistics-query {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 999;
            background-color: #FFFFFF;
        }

        /** 患者统计项 **/
        .patient-statistics-item {
            border-radius: 10px;
            padding: 10px;
            background-repeat: no-repeat;
            background-position: right -20px center;
        }
        .patient-statistics-item .item-title {
            color: #FFFFFF;
            font-size: 20px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .patient-statistics-item .item-values {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .patient-statistics-item .item-value {
            color: #FFFFFF;
            font-size: 48px;
        }
        .patient-statistics-item .item-unit {
            color: #FFFFFF;
            font-size: 24px;
        }

        /** 透析流程统计项 **/
        .dialysis-statistics {
            border-radius: 10px;
        }
        @media screen and (min-width: 768px) {
            .dialysis-statistics-item {
                width: 20%
            }
        }
        @media screen and (min-width: 1366px) {
            .dialysis-statistics-item {
                width: 10%
            }
        }
        .dialysis-statistics-item {
            text-align: center;
        }
        .dialysis-statistics-item .item-progress {
            width: 120px;
            height: 130px;
            position: relative;
            margin: auto;
        }
        .dialysis-statistics-item .item-value {
            color: #536471;
            font-size: 24px;
            font-weight: 600;
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            text-align: center;
            margin: 0;
            transform: translateY(-50%);
        }
        .dialysis-statistics-item .item-title {
            color: #536471;
            font-size: 20px;
        }

        /** 交班记录/今日并发症统计 **/
        .shift-record .layui-card-header, .unusual-statistics .layui-card-header {
            padding: 5px 0;
            height: auto;
            line-height: 30px;
            display: flex;
            display: -webkit-flex;
            -webkit-flex-direction: row;
            border: none;
        }
        .shift-record .layui-card-header .quote, .unusual-statistics .layui-card-header .quote {
            display: inline-block;
            border-left: 5px solid #76C0BB;
            padding-left: 10px;
            font-size: 20px;
            color: #536471;
        }
        .shift-record .layui-card-header .type-tab {
            flex: 1;
            text-align: right;
        }
        .shift-record .layui-card-header .type-tab .type-tab-item {
            display: inline-block;
            padding: 0 15px;
            color: #536471;
            font-size: 20px;
            border-bottom: 2px solid #DDE0E3;
            cursor: pointer;
        }
        .shift-record .layui-card-header .type-tab .type-tab-item.selected {
            color: #76c0bb;
            border-bottom: 2px solid #76c0bb;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="diaStatisticsList">
<div class="layui-fluid">
    <#-- 头部查询 -->
    <div class="statistics-query">
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="diaStatisticsList_search" lay-filter="diaStatisticsList_search">
        </div>
    </div>

    <!-- 患者统计项 -->
    <div class="layui-row layui-col-space10" style="margin-top: 45px;">
        <div class="layui-col-xs2" ms-for="($index, el) in @patientStatistics.items">
            <div class="patient-statistics-item" :css="el.css" :attr="{title: el.title + '：' + el.value + '人'}">
                <div class="item-title pl-10" :text="el.title"></div>
                <div class="pt-10 pb-10 pl-10 item-values"><span class="item-value" :text="el.value"></span><span class="item-unit">人</span></div>
            </div>
        </div>
    </div>

    <!-- 透析流程统计项 -->
    <div class="dialysis-statistics layui-card mt-10 pt-10 pr-10 pb-10 pl-10">
        <div class="layui-card-body">
            <div class="layui-row layui-col-space15">
                <div class="dialysis-statistics-item layui-col-xs2" ms-for="($index, el) in @dialysisStatistics.items">
                    <div class="item-progress">
                        <div class="item-value" :text="el.value + ' / ' + el.totalValue"></div>
                        <svg width="130" height="130">
                            <path :attr="{d: @dialysisStatistics.circlPath, stroke: el.color}" opacity="0.2" stroke-width="10" fill="none"
                                  :css="{strokeDasharray: @dialysisStatistics.circlLength + 'px, ' + @dialysisStatistics.circlLength + 'px', strokeDashoffset: '0px'}"></path>
                            <path :if="el.value > 0" :attr="{d: @dialysisStatistics.circlPath, stroke: el.color}" fill="none" stroke-linecap="round" stroke-width="10"
                                  :css="{strokeDasharray: (@dialysisStatistics.circlLength * (1.0 * el.value / el.totalValue)) + 'px, ' + @dialysisStatistics.circlLength + 'px', strokeDashoffset: '0px'}"></path>
                        </svg>
                    </div>
                    <div class="item-title pt-10 pb-10" :text="el.title"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="layui-row layui-col-space10">
        <div class="layui-col-xs4">
            <!-- 交班记录 -->
            <div class="shift-record layui-card">
                <div class="layui-card-header">
                    <div class="quote">
                        <span>交班记录</span>
                    </div>
                    <div class="pr-10 type-tab">
                        <div :class="['type-tab-item', (@shiftRecord.type == 'ToMe' ? 'selected' : '')]" onclick="onShiftRecordListWithToMe()">@我</div>
                        <div :class="['type-tab-item', (@shiftRecord.type == 'FromMe' ? 'selected' : '')]" onclick="onShiftRecordListWithFromMe()">我@</div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table id="shiftRecord_table" lay-filter="shiftRecord_table" class="mt-10"></table><!--table的工具栏按钮定义，注意：需要增加权限控制-->
                    <script type="text/html" id="shiftRecord_bar">
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs" lay-event="detail">详情</a>
                    </script>
                </div>
            </div>
        </div>
        <div class="layui-col-xs8">
            <div class="unusual-statistics layui-card">
                <!-- 并发症统计 -->
                <div class="layui-card-header">
                    <div class="quote">并发症统计（单位：人）</div>
                </div>
                <div class="layui-card-body">
                    <div id="unusual-statistics-charts" style="height: 400px;"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/lib/echarts/4.3.0/echarts.min.js"></script>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/diaStatisticsList.js?t=${currentTimeMillis}"></script>
</body>
</html>
