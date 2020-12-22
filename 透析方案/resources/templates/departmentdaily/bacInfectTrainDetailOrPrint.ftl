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
        .printTable {
            background-color: transparent !important;
            border: 0 !important;
            width: 100%;

        }
        .u400_div {
            margin-top: 10px;
            width: 99.2%;
            background: #FFFFFF;
            border: 1px solid #EFEFEF;
            border-radius: 8px;
        }
        .u400_div_right {
            margin-right: 10px;
            margin-left: 5px;
            overflow: auto;
        }
        .u400_div_content {
            margin: 5%;
        }
        .td_css {
            white-space: nowrap;
        }
        .layui-elem-field {
            margin: 10px !important;
        }
        .layui-elem-field legend {
            font-size: 14px;
        }
        .layui_span{
            padding-top: 9px;
            padding-right: 15px;
            padding-bottom: 9px;
            padding-left: 15px;
        }
    </style>
</head>
<body ms-controller="bacInfectTrainDetailOrPrint">
<div class="layui-card-body" style="padding: 10px;">
    <div class="layui-form" lay-filter="bacInfectTrainDetailOrPrint_form" id="bacInfectTrainDetailOrPrint_form"
         style="padding: 10px 10px 0 0;">
        <div class="layui-row layui-col-space1" id="print">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="disui-form-flex">
                    <input type="hidden" name="infectTrainId" autocomplete="off">
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title">
                <legend>培训信息</legend>
            </fieldset>
            <table class="layui-table" lay-skin="nob">
                <tr>
                    <td class="td_css" width="30%">
                        <label>培训主题：</label>
                        <input class="printTable" type="text" name="planTheme">
                    </td>
                    <td class="td_css" width="20%">
                        <label>培训日期：</label>
                        <input class="printTable" type="text" name="planDate" id="planDate" placeholder="yyyy-MM-dd"
                               autocomplete="off">
                    </td>
                    <td class="td_css" width="15%">
                        <label>科室：</label>
                        <#--<input class="printTable" type="text" name="departmentName" ms-duplex="departmentName">-->
                        <span ms-text="departmentName"></span>
                    </td>
                    <td class="td_css" width="15%">
                        <label>培训方式：</label>
                        <input class="printTable" type="text" name="trainMethodName" ms-duplex="trainMethodName">
                    </td>
                </tr>
                <tr>
                    <td class="td_css" width="30%">
                        <label>培训地点：</label>
                        <input class="printTable" type="text" name="trainSite">
                    </td>
                    <td class="td_css" width="20%">
                        <label>主持人：</label>
                        <input class="printTable" type="text" name="compereName" ms-duplex="compereName">
                    </td>
                    <td class="td_css" colspan="2">
                        <label>制定人：</label>
                        <input class="printTable" type="text" name="designerName" ms-duplex="designerName">
                    </td>
                </tr>
            </table>
            <fieldset class="layui-elem-field layui-field-title">
                <legend>出勤人员</legend>
            </fieldset>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="layui_span">
                    <span id="joinUserName" name="joinUserName" ms-text="joinUserName"></span>
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title">
                <legend>缺勤人员
                    <button style="margin-left: 30px"
                            class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-blue" id="btnEditAtten">修改
                    </button>
                </legend>
            </fieldset>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="layui_span">
                    <span id="absenceUserName" name="absenceUserName" ms-text="absenceUserName"></span>
                </div>
            </div>
            <fieldset class="layui-elem-field layui-field-title">
                <legend>培训内容</legend>
            </fieldset>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="u400_div u400_div_right">
                    <div class="u400_div_content">
                        <div id="content" lay-verify="content" name="content"></div>
                    </div>
                </div>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" type="button" lay-submit lay-filter="bacInfectTrainEdit_submit"
                        id="bacInfectTrainEdit_submit">提交
                </button>
            </div>
        </div>
        <script type="text/javascript"
                src="${ctxsta}/static/js/departmentdaily/bacInfectTrainDetailOrPrint.js?t=${currentTimeMillis}"></script>
    </div>
</div>
</body>
</html>