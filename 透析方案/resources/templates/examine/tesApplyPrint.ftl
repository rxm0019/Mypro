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
        .item-inline{
            display: inline-block;
        }
        .item-row {
            margin: 5px 0;
        }
        .divarea{
            flex: 1 10 0px;flex-grow: 1; flex-shrink: 10;
            flex-basis: 0px;
            width: 0px;
            padding: 5px 10px;
            border-bottom: 0.5px solid rgba(83, 100, 113, 0.5);
            margin: 3px;
            white-space: normal;
            word-break: break-all;
        }
    </style>
</head>
<body ms-controller="tesApplyPrint">
<div class="layui-card-body" style="overflow-x: hidden;">
    <div class="layui-form">
        <div class="layui-row layui-col-space1">
            <div class="layui-row" style="text-align: center;">
                <h2 style="margin: 10px;">检验申请单</h2>
            </div>
            <div class="item-row">
                <div class="item-inline" style="width: 28%;">
                    <label class="layui-form-label">申请日期：</label>
                    <div class="item-inline">{{applyDate}}</div>
                </div>
                <div class="item-inline" style="width: 40%; text-align: center;">
                    <label>送检医院：</label>
                    <div class="item-inline">{{hospitalName}}</div>
                </div>
                <div class="item-inline" style="width: 28%;text-align: right;">
                    <label>检验机构：</label>
                    <div class="item-inline">{{mechanism}}</div>
                </div>
            </div>

            <div class="item-row">
                <div class="item-inline" style="width: 25%;">
                    <label class="layui-form-label">姓名：</label>
                    <div class="item-inline">{{patientName}}</div>
                </div>
                <div class="item-inline" style="width: 20%; text-align: center;">
                    <label>性别：</label>
                    <div class="item-inline">{{gender}}</div>
                </div>
                <div class="item-inline" style="width: 20%; text-align: center;">
                    <label>年龄：</label>
                    <div class="item-inline">{{patientAge}}</div>
                </div>
                <div class="item-inline" style="width: 25%;text-align: right;">
                    <label>病历号：</label>
                    <div class="item-inline" >{{patientRecordNo}}</div>
                </div>
            </div>

            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">病情摘要：</label>
<#--                    <input type="text" name="illness" ms-duplex="illness" readonly  style="border: none;border-radius: 0;border-bottom: solid 0.5px rgba(83, 100, 113,0.5);">-->
                    <div class="divarea" name="illness" ms-text="@illness">
                    </div>
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">检验目的：</label>
<#--                    <input type="text" name="purpose" ms-duplex="purpose" readonly style="border: none;border-radius: 0;border-bottom: solid 0.5px rgba(83, 100, 113,0.5);">-->
                    <div class="divarea" name="purpose" ms-text="@purpose">
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                <legend style="font-size: 18px;">检验项目</legend>
            </fieldset>

            <div class="item-row" ms-for="($index, el) in @applyList" :visible="@applyList.length>0">
                <div class="item-inline" style="width: 10%;text-align: center;">
                    {{$index + 1}}
                </div>
                <div class="item-inline" style="width: 40%;">
                    {{el.orderName}}
                </div>
                <div class="item-inline" style="width: 15%;text-align: center;">
                    {{el.examination}}
                </div>
                <div class="item-inline" style="width: 15%;text-align: center;">
                    {{el.testType}}
                </div>
                <div class="item-inline" style="width: 15%;text-align: center;">
                    {{el.salesPrice}}
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesApplyPrint.js?t=${currentTimeMillis}"></script>
</body>
</html>
