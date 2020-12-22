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
<style type="text/css">
    .layui-elem-quote {
        background-color: #FFF;
        line-height: 20px;
        padding: 5px;
        margin-top: 10px;
        border-left: 4px solid rgba(118, 189, 187, 1);
    }
    .layui-elem-quote > label {
        color: rgba(118, 189, 187, 1);
        font-weight: bold;
    }
    .layui-bg-green {
        height: 3px;
        background-color: rgba(118, 189, 187, 1) !important;
    }
    .tab-style {
        display: inline-block;
        width: 20%;
        text-align: center;
        height: 34px;
        line-height: 34px;
        background-color: #f4f4f4;
        cursor: pointer;
    }
    .tab-style:hover {
        background-color: #d2d2d2;
        color: #ffffff;
    }
    .tab-click {
        background-color: #76C0BB;
        color: #ffffff;
    }
    .layui-row .disui-form-flex > label {
        flex-basis: 100px;

    }
</style>
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="diaShiftJournalList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="diaShiftJournalList_search" lay-filter="diaShiftJournalList_search">
        </div>

        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding: 10px;" id="diaShiftJournalList_tool">
                <button :visible="@baseFuncInfo.authorityTag('diaShiftJournalList#export')"
                        class="layui-btn layui-btn-dissub"  onclick="exportExcel()">导出</button>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <blockquote class="layui-elem-quote">
                        <label>概况</label>
                    </blockquote>
                    <hr class="layui-bg-green">
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>透析人数/人：</label>
                            <label style="line-height: 38px;">{{dialuSum}}</label>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>转入患者/人：</label>
                            <label style="line-height: 38px;">{{inCount}}</label>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>转出患者/人：</label>
                            <label style="line-height: 38px;">{{outCount}}</label>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>留治患者/人：</label>
                            <label style="line-height: 38px;">{{lienCount}}</label>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>死亡患者/人：</label>
                            <label style="line-height: 38px;">{{deathCount}}</label>
                        </div>
                    </div>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div>
                        <blockquote class="layui-elem-quote">
                            <label>血管通路</label>
                        </blockquote>
                        <hr class="layui-bg-green">
                        <table id="catheterList_table" lay-filter="catheterList_table"></table>
                        <table id="punctureList_table" lay-filter="punctureList_table"></table>
                    </div>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div>
                        <blockquote class="layui-elem-quote">
                            <label>故障透析机</label>
                        </blockquote>
                        <hr class="layui-bg-green">
                        <table id="diaMachineFailureList_table" lay-filter="diaMachineFailureList_table"></table>
                        <script type="text/html" id="diaMachineFailureList_bar">
                            {{#  if(baseFuncInfo.authorityTag('diaMachineFailure#delete')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="delete">删除</a>
                            {{#  } }}
                        </script>
                    </div>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div>
                        <blockquote class="layui-elem-quote">
                            <label>透析例次</label>
                        </blockquote>
                        <hr class="layui-bg-green">
                        <table id="dialysisRoutineList_table" lay-filter="dialysisRoutineList_table"></table>
                    </div>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div>
                        <blockquote class="layui-elem-quote">
                            <label>并发症统计</label>
                        </blockquote>
                        <hr class="layui-bg-green">
                        <table id="complicaList_table" lay-filter="complicaList_table"></table>
                    </div>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div>
                        <blockquote class="layui-elem-quote">
                            <label>穿刺/导管</label>
                        </blockquote>
                        <hr class="layui-bg-green">
                        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                            <div class="disui-form-flex">
                                <label>穿刺(例)：</label>
                                <label style="line-height: 38px;">{{sumPuncture}}</label>
                            </div>
                        </div>
                        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                            <div class="disui-form-flex">
                                <label>导管(例)：</label>
                                <label style="line-height: 38px;">{{sumCatheter}}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div>
                        <blockquote class="layui-elem-quote">
                            <label>备注</label>
                        </blockquote>
                        <hr class="layui-bg-green">
                        <table id="diaShiftJournalList_table" lay-filter="diaShiftJournalList_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaShiftJournalList.js?t=${currentTimeMillis}"></script>
</body>
</html>