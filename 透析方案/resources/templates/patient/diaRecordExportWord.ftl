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
        .words-table {
            border-right: 1px solid black;
            border-bottom: 1px solid black;
        }
        .words-table td,th {
            padding: 5px;
            border-left: 1px solid black;
            border-top: 1px solid black;
        }
        .patient-item {
            width: 100%;
        }
        .patient-item label{
            margin-right: 24pt;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="diaRecordExportWord">
<div class="layui-fluid layui-card">
    <div class="layui-card-body" id="exportWord">
        <#-- 标题 -->
        <div style="text-align: center; font-size: 25px; line-height: 50px;" ms-text="@title"></div>
        <br>

        <#-- 病程记录内容 -->
        <div ms-for="($index, el) in @courseRecordList">
            <#-- 病程记录内容 - 患者信息 -->
            <table>
                <tr>
                    <td>病历号：<span ms-text="el.patientRecordNo"></span></td>
                    <td width="10"></td>
                    <td>姓名：<span ms-text="el.patientName"></span></td>
                    <td width="10"></td>
                    <td>性别：<span ms-text="el.genderName"></span></td>
                    <td width="10"></td>
                    <td>年龄：<span ms-text="el.age + '岁'"></span></td>
                    <td width="10"></td>
                    <td>透析次数：<span ms-text="el.dialysisTimes"></span></td>
                </tr>
            </table>

            <#-- 病程记录内容 - 透析概要 -->
            <table>
                <tr>
                    <td>透析日期：<span ms-text="el.dialysisDate"></span></td>
                    <td width="10"></td>
                    <td>记录人：<span ms-text="el.courseRecordUserName"></span></td>
                </tr>
            </table>

            <table class="words-table" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                    <td width="80" style="text-align: center;">过敏情况</td>
                    <td style="text-align: left;">
                        <div>过敏药物：<span ms-text="el.allergicDrugDesc"></span></div>
                        <div>过敏史：<span ms-text="el.allergicHistory"></span></div>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">诊断</td>
                    <td style="text-align: left;">
                        <div ms-for="($diagnosisTypeIndex, diagnosisTypeItem) in @el.dialysisDiagnosisDescData">
                            {{diagnosisTypeItem.diagnosisTypeName}}：{{diagnosisTypeItem.diagnosisDesc}}
                        </div>
                    </td>
                </tr>
                <tr ms-if="@el.diaUnusualRecordsDescData != null && @el.diaUnusualRecordsDescData.length > 0">
                    <td style="text-align: center;">异常情况</td>
                    <td style="text-align: center; font-size: 14px; margin: auto;">
                        <table class="words-table">
                            <thead>
                            <tr style="height: 20px">
                                <th width="80" style="text-align: center">记录时间</th>
                                <th width="30%" style="text-align: center">病症及体征</th>
                                <th width="30%" style="text-align: center">处理</th>
                                <th style="text-align: center">结果</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr ms-for="($indexDu, unusualRecord) in @el.diaUnusualRecordsDescData">
                                <td style="text-align: center;">{{unusualRecord.monitorTime}}</td>
                                <td style="text-align: left; vertical-align: top;">
                                    <div ms-for="($indexUd, unusualDetailName) in @unusualRecord.unusualDetailNames">
                                        <span>● {{unusualDetailName}}</span>
                                    </div>
                                </td>
                                <td style="text-align: left; vertical-align: top;">{{unusualRecord.handleDetails}}</td>
                                <td style="text-align: left; vertical-align: top;">{{unusualRecord.handleResults}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">病程内容</td>
                    <td style="text-align: left;"><span ms-text="el.courseRecord"></span></td>
                </tr>
            </table>
            <br><br>
        </div>
    </div>
</div>

<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/diaRecordExportWord.js?t=${currentTimeMillis}"></script>
</body>
</html>
