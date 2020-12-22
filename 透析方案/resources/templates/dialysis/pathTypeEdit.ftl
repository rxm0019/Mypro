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

</head>
<body ms-controller="pathTypeEdit">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" style="height: 39px; line-height: 39px;">
                    <div class="disui-form-flex">
                        <label>交班类型：</label>
                        <div class="tab-style tab-click"
                             style="border-top-left-radius: 5px;border-bottom-left-radius: 5px;"
                             onclick="clickWholeDay(this)">全天
                        </div>
                        <div class="tab-style" onclick="clickAm(this)">上午</div>
                        <div class="tab-style" onclick="clickPm(this)">下午</div>
                        <div class="tab-style" style="border-top-right-radius: 5px;border-bottom-right-radius: 5px;"
                             onclick="clickNight(this)">晚上
                        </div>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>日期：</label>
                        <input type="text" 　name="shiftDate" id="shiftDate" autocomplete="off">
                    </div>
                </div>
                <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                    <div class="disui-form-flex">
                        <label>通路类型：</label>
                        <input type="radio" name="pathType" lay-filter="pathType" value="CatheterAssess" title="导管">
                        <input type="radio" name="pathType" lay-filter="pathType" value="PunctureAssess" title="穿刺"
                               checked="">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="layui-inline">
                        <button class="layui-btn layui-btn-dismain" style="margin-left: 5px;" onclick="searchOrder()">搜索
                        </button>
                        <button class="layui-btn layui-btn-dissub" onclick="onExportExcel()">导出</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-card-body">
            <div ms-if="pathTypeShow">
                <table id="catheterList_table" lay-filter="catheterList_table"></table>
            </div>
            <div ms-if="!pathTypeShow">
                <table id="punctureList_table" lay-filter="punctureList_table"></table>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/pathTypeEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>