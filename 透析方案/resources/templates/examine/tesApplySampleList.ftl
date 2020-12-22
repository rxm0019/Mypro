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
        .layui-elem-quote {
            float: left;
            padding: 5px;
            font-weight: bold;
            line-height: 28px;
            border-left: 5px solid #009688;
            border-radius: 0 2px 2px 0;
            color: rgba(118, 189, 187, 1);
            background-color: white;
            margin-bottom: 0px;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="tesApplySampleList">
<div class="layui-card-body" style="background-color: white;">
    <div class="layui-form" lay-filter="tesApplySampleList_form" id="tesApplySampleList_form" style="padding: 10px 10px 0px 10px;">
        <div class="layui-row layui-col-space1">
            <div class="layui-row">
                <blockquote class="layui-elem-quote">检验申请单</blockquote>
                <hr class="layui-bg-green" style="margin:0;margin-bottom: 5px;">
            </div>
            <div class="layui-row" style="text-align: center;">
                <h2>检验申请单</h2>
            </div>

            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">申请日期：</label>
                    <input type="text" name="applyDate" readonly style="border: none;">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">送检医院：</label>
                    <input type="text" name="hospitalName" readonly style="border: none;">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">检验机构：</label>
                    <input type="text" name="mechanism" readonly style="border: none;">
                </div>
            </div>

            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">姓名：</label>
                    <input type="text" name="patientName" readonly style="border: none;">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">性别：</label>
                    <input type="text" name="gender" readonly style="border: none;">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">年龄：</label>
                    <input type="text" name="patientAge" readonly style="border: none;">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">病历号：</label>
                    <input type="text" name="patientRecordNo" readonly style="border: none;">
                </div>
            </div>

            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">病情摘要：</label>
                    <input type="text" name="illness" maxlength="200" style="border: none;" readonly>
                </div>
            </div>
            <div class="layui-row">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">检验目的：</label>
                    <input type="text" name="purpose" maxlength="200" style="border: none;" readonly>
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                <legend>检验项目</legend>
            </fieldset>

            <div class="layui-card-body">
                <table id="tesApplyList_table" lay-filter="tesApplyList_table"></table>
            </div>

        </div>
    </div>
    <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
        <legend>采检标本</legend>
    </fieldset>

    <div class="layui-card">
        <div class="layui-card-body">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div style="padding:0px 0px 10px 10px;" id="tesApplySampleList_tool">
                <button :visible="@baseFuncInfo.authorityTag('tesApplySampleList#add') && @applySendStatus!=constant.ApplySendStatus.SENT"
                        class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加标本</button>
                <button :visible="@baseFuncInfo.authorityTag('tesApplySampleList#send') && @applySendStatus!=constant.ApplySendStatus.SENT"
                        class="layui-btn layui-btn-dissub"  onclick="send()">送检</button>
                <button :visible="@baseFuncInfo.authorityTag('tesApplySampleList#back') && @applySendStatus==constant.ApplySendStatus.SENT"
                        class="layui-btn layui-btn-dissub"  onclick="back()">取消送检</button>
                <button :visible="@baseFuncInfo.authorityTag('tesApplySampleList#print')"
                        class="layui-btn layui-btn-dismain" style="float: right;margin-right: 10px;" onclick="printMethod()">打印</button>
            </div>
            <!--table定义-->
            <table id="tesApplySampleList_table" lay-filter="tesApplySampleList_table"></table>
            <script type="text/html" id="tesApplySampleList_bar">
                {{#  if(baseFuncInfo.authorityTag('tesApplySampleList#edit') && d.applySendStatus!=$.constant.ApplySendStatus.SENT){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-blue" lay-event="edit">编辑</a>
                {{#  } }}
                {{#  if(baseFuncInfo.authorityTag('tesApplySampleList#delete') && d.applySendStatus!=$.constant.ApplySendStatus.SENT){ }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="del">删除</a>
                {{#  } }}
            </script>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesApplySampleList.js?t=${currentTimeMillis}"></script>
</body>
</html>