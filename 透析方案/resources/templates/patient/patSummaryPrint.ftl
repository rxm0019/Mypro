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
        .patSummaryPrint {
            color: black;
            padding: 25px !important;
            background-color: #FFFFFF;
        }
        /* 阶段小结标题 */
        .summary-title {
            font-size: 16px;
            text-align: center;
            margin-bottom: 15px;
        }
        /* 页头 */
        .page-header {
            border-bottom: 2px solid #000000;
            margin-bottom: 10px;
            font-size: 12px;
        }
        .page-header .item-coum-1 {
            display: inline-block;
            width: 15%;
        }
        .page-header .item-coum-2 {
            display: inline-block;
            width: 20%;
        }
        .page-header .item-coum-3 {
            display: inline-block;
            width: 30%;
        }
        .layui-table td.summary-content {
            padding: 5px 10px 10px 10px;
        }
        /* 标签/标签值/列 */
        .item-label {
            display: inline-block;
            text-align: right;
            margin-top: 5px;
        }
        .item-label.with-interval-md {
            margin-left: 15px;
        }
        .item-label.with-interval-sm {
            margin-left: 10px;
        }
        .item-label.with-interval-xs {
            margin-left: 5px;
        }
        .default-width {
            min-width: 80px;
        }
        .item-value {
            display: inline-block;
            border-bottom: 1px solid;
            text-align: center;
            margin-top: 5px;
            padding: 0 5px;
        }
        .item-col-4 {
            display: inline-block;
            width: 33.33333333%;
        }
        .item-col-6 {
            display: inline-block;
            width: 50%;
        }
        .item-col-12 {
            display: inline-block;
            width: 100%;
        }
        /* 阶段小结内容 */
        .layui-table td {
            font-size: 12px !important;
            padding: 9px 5px;
            border: 1px solid #000000 !important;
        }
        .layui-table tbody tr:hover {
            background-color: white !important;
            color: #000000 !important;
        }
        /* 阶段小结内容 - 概要 */
        .summary-content.outline-block .item-value.hours-value {
            min-width: 56px;
        }
        .summary-content.outline-block .item-value.times-value {
            min-width: 40px;
        }
        .summary-content.outline-block .item-value.concentration-value {
            min-width: 50px;
        }
        /* 阶段小结内容 - 评估 */
        .summary-content.assess-block .item-label.assess-group-title {
            text-align: left;
            width: 110px;
        }
        .summary-content.assess-block .item-value.assess-describe {
            width: calc(100% - 310px);
            text-align: left;
        }
        .summary-content.assess-block .item-label.field-label {
            min-width: 80px;
        }
        .summary-content.assess-block .item-value {
            min-width: 80px;
        }
        /* 阶段小结内容 - 评估 - 8. 其他化验评估 */
        .summary-content.assess-block .other-assess-group .item-label.field-label {
            min-width: 130px;
        }
        /* 阶段小结内容 - 评估 - 9. 辅助检查 */
        .summary-content.assess-block .auxiliary-assess-group .item-value {
            width: calc(100% - 100px);
            text-align: left;
        }
        /* 阶段小结内容 - 评估 - 其他总结 */
        .summary-content.other-summary-group {
            vertical-align: top;
        }
        .summary-content.other-summary-group .item-label {
            text-align: left;
            width: 100%;
            word-break: break-all;
            word-wrap: break-word;
        }
    </style>
</head>
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">

<body ms-controller="patSummaryPrint">
<div class="layui-fluid patSummaryPrint">
    <div class="layui-card-body">
        <#-- 标题 -->
        <div class="summary-title" ms-text="@patSummary.summaryTitle"></div>

        <#-- 页头（患者信息） -->
        <div class="page-header">
            <div class="item-coum-2">
                <label>病案号：</label>
                <label><span ms-text="@patPatientInfo.patientRecordNo"></span></label>
            </div>
            <div class="item-coum-2">
                <label>姓名：</label>
                <label><span ms-text="@patPatientInfo.patientName"></span></label>
            </div>
            <div class="item-coum-1">
                <label>性别：</label>
                <label><span ms-text="@patPatientInfo.gender"></span></label>
            </div>
            <div class="item-coum-1">
                <label>年龄：</label>
                <label><span ms-text="@patPatientInfo.birthday"></span></label>
            </div>
            <div class="item-coum-3" style="text-align: right">
                <label>打印日期：</label>
                <label><span ms-text="@patPatientInfo.nowTime"></span></label>
            </div>
        </div>

        <#-- 阶段小结内容 -->
        <div class="layui-form">
            <table class="layui-table">
                <colgroup>
                    <col width="20">
                    <col>
                </colgroup>
                <tbody>

                <#-- 阶段小结内容 - 概要 -->
                <tr>
                    <td>概要</td>
                    <td class="summary-content outline-block">
                        <div class="layui-row">
                            <label class="item-label default-width">干体重(kg)：</label><span class="item-value default-width" ms-text="@patSummary.dryWeight"></span>
                            <label class="item-label with-interval-md">共透析</label><span class="item-value default-width" ms-text="@patSummary.dialysisModeTotalNum"></span><label class="item-label">次</label>
                            <label ms-if="@patSummary.dialysisModeTotalNum > 0" class="item-label with-interval-md">其中：</label>
                            <div ms-for="($index, el) in @patSummary.dialysisModes" style="display: inline-block;">
                                <label class="item-label with-interval-sm" ms-text="el.dialysisModeName"></label>
                                <span class="item-value times-value" ms-text="el.dialysisTimes"></span><label class="item-label">次</label>
                            </div>
                        </div>
                        <div class="layui-row">
                            <label class="item-label default-width">抗凝方式：</label><span class="item-value default-width" ms-text="@patSummary.antiMode"></span>
                            <label class="item-label with-interval-md">剂量：</label><span class="item-value default-width" ms-text="@patSummary.dosage"></span>
                        </div>
                        <div class="layui-row">
                            <label class="item-label default-width">每次透析：</label><span class="item-value hours-value" ms-text="@patSummary.dosage"></span><label class="item-label">小时</label>
                            <label class="item-label with-interval-md">透析液（mmol/L）：</label>
                            <label class="item-label with-interval-sm">HCO3</label><span class="item-value concentration-value" ms-text="@patSummary.dialysateConcentrationHco3"></span>
                            <label class="item-label with-interval-sm">K</label><span class="item-value concentration-value" ms-text="@patSummary.dialysateConcentrationK"></span>
                            <label class="item-label with-interval-sm">Ca</label><span class="item-value concentration-value" ms-text="@patSummary.dialysateConcentrationCa"></span>
                            <label class="item-label with-interval-sm">Na</label><span class="item-value concentration-value" ms-text="@patSummary.dialysateConcentrationNa"></span>
                        </div>
                    </td>
                </tr>

                <#-- 阶段小结内容 - 评估 -->
                <tr>
                    <td>评估</td>
                    <td class="summary-content assess-block">
                        <#-- 阶段小结内容 - 评估 - 1.肾性贫血评估 -->
                        <div class="layui-row">
                            <label class="item-label assess-group-title">1. 肾性贫血评估：</label>
                            <div ms-for="($index, el) in @options.assess" style="display: inline-block;">
                                <label class="item-label with-interval-xs" ms-text="el.name"></label>
                                <label class="item-label" ms-text="el.value === @patSummary.renalAnemiaAssess ? '（√）' : '（ ）'"></label>
                            </div>
                            <label class="item-label with-interval-md">描述：</label><span class="item-value assess-describe" ms-text="@patSummary.renalAnemiaDescribe"></span>
                        </div>

                        <div class="layui-row">
                            <div class="item-col-4">
                                <label class="item-label field-label">血红蛋白：</label>
                                <label class="item-value" ms-text="@patSummary.hemoglobin"></label>
                                <label class="item-label">g/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">红细胞压积：</label>
                                <label class="item-value" ms-text="@patSummary.hematocrit"></label>
                                <label class="item-label">%</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">血小板：</label>
                                <label class="item-value" ms-text="@patSummary.platelet"></label>
                                <label class="item-label">10^9/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">网织红细胞：</label>
                                <label class="item-value" ms-text="@patSummary.reticulocyte"></label>
                                <label class="item-label">10^9/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">总铁结合力：</label>
                                <label class="item-value" ms-text="@patSummary.totalIronBindingForce"></label>
                                <label class="item-label">μmoI/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">转铁蛋白饱和度：</label>
                                <label class="item-value" ms-text="@patSummary.transferrinSaturation"></label>
                                <label class="item-label">%</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">血清铁：</label>
                                <label class="item-value" ms-text="@patSummary.serumIron"></label>
                                <label class="item-label">μmoI/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">血清铁蛋白：</label>
                                <label class="item-value" ms-text="@patSummary.serumFerritin"></label>
                                <label class="item-label">μg/L</label>
                            </div>
                        </div>

                        <#-- 阶段小结内容 - 评估 - 2.CKD-MBD评估 -->
                        <div class="layui-row">
                            <label class="item-label assess-group-title">2. CKD-MBD评估：</label>
                            <div ms-for="($index, el) in @options.assess" style="display: inline-block;">
                                <label class="item-label with-interval-xs" ms-text="el.name"></label>
                                <label class="item-label" ms-text="el.value === @patSummary.ckdMbdAssess ? '（√）' : '（ ）'"></label>
                            </div>
                            <label class="item-label with-interval-md">描述：</label><span class="item-value assess-describe" ms-text="@patSummary.ckdMbdDescribe"></span>
                        </div>
                        <div class="layui-row">
                            <div class="item-col-4">
                                <label class="item-label field-label">透前钙：</label>
                                <label class="item-value" ms-text="@patSummary.preDialysisCalcium"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">透前磷：</label>
                                <label class="item-value" ms-text="@patSummary.preDialysisPhosphorus"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">iPTH：</label>
                                <label class="item-value" ms-text="@patSummary.ipth"></label>
                                <label class="item-label">ng/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">钙磷乘积：</label>
                                <label class="item-value" ms-text="@patSummary.ipth"></label>
                                <label class="item-label">mg^2/dL^2</label>
                            </div>
                        </div>

                        <#-- 阶段小结内容 - 评估 - 3.营养评估 -->
                        <div class="layui-row">
                            <label class="item-label assess-group-title">3. 营养评估：</label>
                            <div ms-for="($index, el) in @options.assess" style="display: inline-block;">
                                <label class="item-label with-interval-xs" ms-text="el.name"></label>
                                <label class="item-label" ms-text="el.value === @patSummary.nutritionalAssess ? '（√）' : '（ ）'"></label>
                            </div>
                            <label class="item-label with-interval-md">描述：</label><span class="item-value assess-describe" ms-text="@patSummary.nutritionalDescribe"></span>
                        </div>
                        <div class="layui-row">
                            <div class="item-col-4">
                                <label class="item-label field-label">白蛋白：</label>
                                <label class="item-value" ms-text="@patSummary.albumin"></label>
                                <label class="item-label">g/L</label>
                            </div>
                        </div>

                        <#-- 阶段小结内容 - 评估 - 4.血脂评估 -->
                        <div class="layui-row">
                            <label class="item-label assess-group-title">4. 血脂评估：</label>
                            <div ms-for="($index, el) in @options.assess" style="display: inline-block;">
                                <label class="item-label with-interval-xs" ms-text="el.name"></label>
                                <label class="item-label" ms-text="el.value === @patSummary.bloodFatAssess ? '（√）' : '（ ）'"></label>
                            </div>
                            <label class="item-label with-interval-md">描述：</label><span class="item-value assess-describe" ms-text="@patSummary.bloodFatDescribe"></span>
                        </div>
                        <div class="layui-row">
                            <div class="item-col-4">
                                <label class="item-label field-label">胆固醇：</label>
                                <label class="item-value" ms-text="@patSummary.cholesterol"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">甘油三酯：</label>
                                <label class="item-value" ms-text="@patSummary.triglyceride"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">低密度脂蛋白：</label>
                                <label class="item-value" ms-text="@patSummary.lowDensityLipoprotein"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">高密度脂蛋白：</label>
                                <label class="item-value" ms-text="@patSummary.highDensityLipoprotein"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                        </div>

                        <#-- 阶段小结内容 - 评估 - 5.血糖评估 -->
                        <div class="layui-row">
                            <label class="item-label assess-group-title">5. 血糖评估：</label>
                            <div ms-for="($index, el) in @options.assess" style="display: inline-block;">
                                <label class="item-label with-interval-xs" ms-text="el.name"></label>
                                <label class="item-label" ms-text="el.value === @patSummary.bloodSugarAssess ? '（√）' : '（ ）'"></label>
                            </div>
                            <label class="item-label with-interval-md">描述：</label><span class="item-value assess-describe" ms-text="@patSummary.bloodSugarDescribe"></span>
                        </div>
                        <div class="layui-row">
                            <div class="item-col-4">
                                <label class="item-label field-label">空腹血糖：</label>
                                <label class="item-value" ms-text="@patSummary.fastingBloodGlucose"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                        </div>

                        <#-- 阶段小结内容 - 评估 - 6.钾钠评估 -->
                        <div class="layui-row">
                            <label class="item-label assess-group-title">6. 钾钠评估：</label>
                            <div ms-for="($index, el) in @options.assess" style="display: inline-block;">
                                <label class="item-label with-interval-xs" ms-text="el.name"></label>
                                <label class="item-label" ms-text="el.value === @patSummary.potassiumSodiumAssess ? '（√）' : '（ ）'"></label>
                            </div>
                            <label class="item-label with-interval-md">描述：</label><span class="item-value assess-describe" ms-text="@patSummary.potassiumSodiumDescribe"></span>
                        </div>
                        <div class="layui-row">
                            <div class="item-col-4">
                                <label class="item-label field-label">透前钾：</label>
                                <label class="item-value" ms-text="@patSummary.preDialysisPotassium"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">透后钾：</label>
                                <label class="item-value" ms-text="@patSummary.postDialysisPotassium"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">透前钠：</label>
                                <label class="item-value" ms-text="@patSummary.preDialysisSodium"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">透后钠：</label>
                                <label class="item-value" ms-text="@patSummary.postDialysisSodium"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                        </div>

                        <#-- 阶段小结内容 - 评估 - 7.透析充分性评估 -->
                        <div class="layui-row">
                            <label class="item-label assess-group-title">7. 透析充分性评估：</label>
                            <div ms-for="($index, el) in @options.assess" style="display: inline-block;">
                                <label class="item-label with-interval-xs" ms-text="el.name"></label>
                                <label class="item-label" ms-text="el.value === @patSummary.dialysisAdequacyAssess ? '（√）' : '（ ）'"></label>
                            </div>
                            <label class="item-label with-interval-md">描述：</label><span class="item-value assess-describe" ms-text="@patSummary.dialysisAdequacyDescribe"></span>
                        </div>
                        <div class="layui-row">
                            <div class="item-col-4">
                                <label class="item-label field-label">KTV：</label>
                                <label class="item-value" ms-text="@patSummary.ktv"></label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">URR：</label>
                                <label class="item-value" ms-text="@patSummary.urr"></label>
                                <label class="item-label">%</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">透前尿素氮：</label>
                                <label class="item-value" ms-text="@patSummary.preDialysisUreaNitrogen"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">透后尿素氮：</label>
                                <label class="item-value" ms-text="@patSummary.postDialysisUreaNitrogen"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">透前肌酐：</label>
                                <label class="item-value" ms-text="@patSummary.preDialysisCreatinine"></label>
                                <label class="item-label">μmoI/L</label>
                            </div>
                            <div class="item-col-4">
                                <label class="item-label field-label">透后肌酐：</label>
                                <label class="item-value" ms-text="@patSummary.postDialysisCreatinine"></label>
                                <label class="item-label">μmoI/L</label>
                            </div>
                        </div>

                        <#-- 阶段小结内容 - 评估 - 8.其他化验评估 -->
                        <div class="layui-row">
                            <label class="item-label assess-group-title">8. 其他化验评估：</label>
                        </div>
                        <div class="layui-row other-assess-group">
                            <div class="item-col-6">
                                <label class="item-label field-label">谷丙转氨酶：</label>
                                <label class="item-value" ms-text="@patSummary.alt"></label>
                                <label class="item-label">U/L</label>
                            </div>
                            <div class="item-col-6">
                                <label class="item-label field-label">谷草转氨酶：</label>
                                <label class="item-value" ms-text="@patSummary.ast"></label>
                                <label class="item-label">U/L</label>
                            </div>
                            <div class="item-col-6">
                                <label class="item-label field-label">透前二氧化碳结合力：</label>
                                <label class="item-value" ms-text="@patSummary.preDialysisCarbonDioxide"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                            <div class="item-col-6">
                                <label class="item-label field-label">透后二氧化碳结合力：</label>
                                <label class="item-value" ms-text="@patSummary.postDialysisCarbonDioxide"></label>
                                <label class="item-label">mmol/L</label>
                            </div>
                        </div>

                        <#-- 阶段小结内容 - 评估 - 9.辅助检查 -->
                        <div class="layui-row">
                            <label class="item-label assess-group-title">9. 辅助检查：</label>
                        </div>
                        <div class="layui-row auxiliary-assess-group">
                            <div class="item-col-12">
                                <label class="item-label field-label">胸片：</label>
                                <label class="item-value" ms-text="@patSummary.chestFilm"></label>
                            </div>
                            <div class="item-col-12">
                                <label class="item-label field-label">心电图：</label>
                                <label class="item-value" ms-text="@patSummary.ecg"></label>
                            </div>
                            <div class="item-col-12">
                                <label class="item-label field-label">超声心动：</label>
                                <label class="item-value" ms-text="@patSummary.ultrasonicCardiography"></label>
                            </div>
                            <div class="item-col-12">
                                <label class="item-label field-label">其他：</label>
                                <label class="item-value" ms-text="@patSummary.auxiliaryOther"></label>
                            </div>
                        </div>
                    </td>
                </tr>

                <#-- 阶段小结内容 - 其他总结 -->
                <tr>
                    <td>其他总结</td>
                    <td class="summary-content other-summary-group">
                        <label class="item-label" ms-text="@patSummary.otherSummary"></label>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <#-- 签名 -->
        <div class="layui-row" style="text-align: right">
            <label class="item-label">医生：</label><label class="item-value default-width" ms-text="@patSummary.doctorName"></label>
            <label class="item-label with-interval-md">时间：</label><label class="item-value default-width" ms-text="@patSummary.createTime"></label>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patSummaryPrint.js?t=${currentTimeMillis}"></script>
</body>
</html>
