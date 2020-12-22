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
<style type="text/css">
    .layui-table .layui-form-label {
        width: auto;
        padding: 0px 40px;

    }
    /* 页头 */
    .page-header {
        border-bottom: 2px solid #000000;
        margin-bottom: 10px;
        font-size: 14px;
    }
    .page-header .item-coum-1 {
        display: inline-block;
        width: 10%;
    }
    .page-header .item-coum-2 {
        display: inline-block;
        width: 15%;
    }
    .page-header .item-coum-3 {
        display: inline-block;
        width: 20%;
    }
    .layui-table[lay-size=lg] td {
        padding: 10px 15px;
    }
    .layui-table .item-inline {
        word-break: break-all;
        display: inline-block;
    }
</style>
<body ms-controller="patDiseaseHistoryPrint" style="font-size: 15px;">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-row" style="text-align: center;word-break: break-word;">
            <h2 style="margin: 10px;">患者病史信息</h2>
        </div>
        <div class="page-header">
            <div class="item-coum-2">
                <label>姓名：</label>
                <label><span class="item-inline">{{patDiseaseHistory.patientName}}</span></label>
            </div>
            <div class="item-coum-1">
                <label>性别：</label>
                <label ><span class="item-inline">{{patDiseaseHistory.gender}}</span></label>
            </div>
            <div class="item-coum-1">
                <label>年龄：</label>
                <label><span class="item-inline">{{patDiseaseHistory.age}}</span></label>
            </div>
            <div class="item-coum-3" >
                <label>病历号：</label>
                <label><span class="item-inline">{{patDiseaseHistory.patientRecordNo}}</span></label>
            </div>
            <div class="item-coum-3" >
                <label>记录日期：</label>
                <label ><span class="item-inline">{{patDiseaseHistory.recordDate}}</span></label>
            </div>
            <div class="item-coum-2" style="text-align: right">
                <label>记录人：</label>
                <label><span class="item-inline">{{patDiseaseHistory.userName}}</span></label>
            </div>
        </div>
        <table class="layui-table" lay-size="lg" style="table-layout:fixed">
            <colgroup>
                <col width="120">
                <col>
            </colgroup>
            <tbody>
            <tr>
                <td>患者主诉</td>
                <td><span class="item-inline">{{patDiseaseHistory.patientComplaint}}</span></td>

            </tr>
            <tr>
                <td>现病史</td>
                <td><span class="item-inline">{{patDiseaseHistory.presentHistory}}</span></td>
            </tr>
            <tr>
                <td>心血管疾病史</td>
                <td><span class="item-inline">{{patDiseaseHistory.cardioVascularHistory}}</span></td>
            </tr>
            <tr>
                <td>高血压病史</td>
                <td><span class="item-inline">{{patDiseaseHistory.hypertensionHistory}}</span></td>
            </tr>
            <tr>
                <td>脑血管疾病史</td>
                <td><span class="item-inline">{{patDiseaseHistory.brainVascularHistory}}</span></td>
            </tr>
            <tr>
                <td>糖尿病史</td>
                <td><span class="item-inline">{{patDiseaseHistory.diabetesHistory}}</span></td>
            </tr>
            <tr>
                <td>肝炎病史</td>
                <td><span class="item-inline">{{patDiseaseHistory.hepatitisHistory}}</span></td>
            </tr>
            <tr>
                <td>其他疾病</td>
                <td><span class="item-inline">{{patDiseaseHistory.otherHistory}}</span></td>
            </tr>

            <tr>
                <td>家族史</td>
                <td><span class="item-inline">{{patDiseaseHistory.familyHistory}}</span></td>
            </tr>

            <tr>
                <td>过敏情况</td>
                <td>
                    <label>有无过敏药物：</label>
                    <span class="item-inline">{{patDiseaseHistory.allergicDrugStatus}};</span>

                    <label style="margin-left: 20px;">过敏药物：</label>
                    <span class="item-inline">{{patDiseaseHistory.allergicDrugDetails}}</span>
                </td>
            </tr>

            <tr>
                <td>过敏史</td>
                <td><span class="item-inline">{{patDiseaseHistory.allergicHistory}}</span></td>
            </tr>
            <tr>
                <td>婚史</td>
                <td><span class="item-inline">{{patDiseaseHistory.marriageHistory}}</span></td>
            </tr>

            <tr>
                <td>月经史</td>
                <td><span class="item-inline">{{patDiseaseHistory.menstrualHistory}}</span></td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/patient/patDiseaseHistoryPrint.js?t=${currentTimeMillis}"></script>
</body>
</html>