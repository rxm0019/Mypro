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
        .layui-collapse, .layui-collapse .layui-colla-title, .layui-collapse .layui-colla-content {
            background-color: #FFFFFF;
        }
        .disui-form-flex .form-value {
            line-height: 38px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
        }

        .float-pane {
            position: absolute;
            z-index: 99;
            width: 100%;
            height: 100px;
            background-color: #FFFFFF;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
            border: 1px solid #E5E5E5;
            top: 40px;
        }

        /* 分区标题 */
        .partition-title {
            color: #33AB9F;
            font-weight: bold;
            padding: 0 0 2px 15px;
            margin-top: 5px;
            margin-bottom: 8px;
            border-bottom: 1px solid #009688;
        }
        /* 分块标题 */
        .legend-title .layui-field-title {
            margin: 5px 0 0px;
            border-width: 1px 0 0;
        }
        .legend-title .layui-elem-field legend {
            padding: 0 10px;
            font-size: 14px;
        }

        /* 诊断标签 */
        .disease-diagnosis-box .empty-tags, .patient-tag-box .empty-tags {
            color: rgba(83, 100, 113,0.5);
            text-align: center;
            line-height: 32px;
        }
        .disease-diagnosis-box .diagnose-tag {
            position: relative;
            display: inline-block;
            border: 1px solid rgba(83, 100, 113,0.5);
            border-radius: 5px;
            margin-right: 10px;
            height: 32px;
            line-height: 32px;
            margin-bottom: 5px;
        }
        .disease-diagnosis-box .diagnose-tag:last-child {
            margin-right: 0;
        }
        .disease-diagnosis-box .diagnose-tag .color-label {
            position: absolute;
            color: #FFFFFF;
            font-weight: bold;
            top: -5px;
            left: 4px;
        }
        .disease-diagnosis-box .diagnose-tag .color-block {
            position: absolute;
            width: 0;
            height: 0;
            border-width: 0 0 32px 32px;
            border-style: solid;
            border-color: transparent transparent transparent #1E9FFF;
        }
        .disease-diagnosis-box .diagnose-tag .tag-label {
            display: inline-block;
            margin-left: 32px;
            padding-right: 9px;
        }

        /* 患者标签 */
        .patient-tag-box .patient-tag {
            display: inline-block;
            border: 1px solid rgba(83, 100, 113,0.5);
            border-radius: 5px;
            margin-right: 10px;
            height: 32px;
            line-height: 32px;
            padding: 0 10px;
            margin-bottom: 5px;
        }
        .patient-tag-box .patient-tag:last-child {
            margin-right: 0;
        }

        /* 透前病情 */
        .dialysis-before-box .disui-form-flex > label:last-child {
            flex: 0 0 50px;
            text-align: left;
            padding-left: 5px;
        }
        /* 透析处方 - 基本配置 */
        .dialysis-parameter-box .disui-form-flex > label:last-child {
            flex: 0 0 20px;
            text-align: left;
            padding-left: 5px;
        }
        /* 透析处方 - 透析液/置换液 */
        .dialysis-dialysate-box .disui-form-flex > label:last-child, .dialysis-replacement-box .disui-form-flex > label:last-child {
            flex: 0 0 50px;
            text-align: left;
            padding-left: 5px;
        }
        /* 透析处方 - 抗凝剂 */
        .dialysis-anticoagulant-box .disui-form-flex > label:last-child {
            flex: 0 0 50px;
            text-align: left;
            padding-left: 5px;
        }
        .dialysis-anticoagulant-box .dosage-add .layui-form-select {
            flex: 7;
        }
        .dialysis-anticoagulant-box .dosage-add .layui-form-select {
            flex: 7;
        }
        /* 透析处方 - 其他 */
        .dialysis-other-box .layui-row > div:first-child .disui-form-flex > label:last-child {
            flex: 0 0 90px;
        }
        .dialysis-other-box .layui-row > div .disui-form-flex > label:last-child {
            flex: 0 0 50px;
            text-align: left;
            padding-left: 5px;
        }
        .dialysis-other-box .layui-row > div:first-child .disui-form-flex > label:first-child {
            flex: 0 0 120px;
        }
        .dialysis-other-box .dry-weight .disui-form-flex > label img {
            width: 32px;
            height: 32px;
            margin-right: 8px;
        }
        .dialysis-other-box .dry-weight .disui-form-flex > label.unit {
            flex: 0 0 30px;
            text-align: left;
            padding-left: 5px;
        }
        .dialysis-other-box .dry-weight .disui-form-flex .layui-btn {
            width: 50px;
            margin-right: 10px;
            margin-top: 3px;
        }
        .dialysis-other-box .deposit-dehydration .disui-form-flex > label:first-child {
            flex: 0 0 40px;
        }

        @media screen and (min-width: 768px) {
            /* 透析处方 - 基本配置 */
            .dialysis-parameter-box .layui-col-sm2 {
                width: 20%;
            }
        }
        @media screen and (max-width: 768px) {
            .dialysis-other-box .layui-row > div .disui-form-flex > label:last-child {
                flex: 0 0 90px;
            }
            .dialysis-other-box .layui-row > div .disui-form-flex > label:first-child {
                flex: 0 0 120px;
            }
            .dialysis-other-box .deposit-dehydration .disui-form-flex > label:first-child {
                flex: 0 0 120px;
            }
        }

        /* 干体重调整历史图表 */
        #patientDryWeightChart {
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            border: 1px solid #A9B1B8;
            position: absolute;
            top: 585px;
            left: 100px;
            padding: 10px 0;
            width: 70%;
            height: 300px;
            z-index: 99;
        }

        /* 透前病情更多（上一次的透前病情） */
        #lastDialysisIllness {
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            border: 1px solid #A9B1B8;
            position: absolute;
            top: 585px;
            left: 10px;
            padding: 10px 0;
            max-width: 900px;
            min-width: 800px;
            z-index: 99;
        }
        #lastDialysisIllness .layui-row .disui-form-flex>label {
            flex: 0 0 160px;
            line-height: 30px;
        }
        #lastDialysisIllness .layui-row .disui-form-flex>label:last-child {
            text-align: left;
        }
        #lastDialysisIllness .empty {
            color: rgba(83, 100, 113,0.5);
            text-align: center;
            line-height: 60px;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="diaBaseList">
<div class="layui-fluid" style="padding: 0 !important;">
    <div class="layui-collapse">
        <#-- 患者基本信息 + 排班信息 -->
        <div class="layui-colla-item layui-form" lay-filter="diaBaseSchedule_form">
            <p class="layui-colla-title">基本资料</p>
            <div class="layui-colla-content layui-show">
                <#-- 患者基本信息 + 排班信息 -->
                <div class="layui-form layui-row layui-col-space1">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>姓名：</label>
                            <div class="form-value" :attr="{title: @patientInfo.patientName}" :text="@patientInfo.patientName"></div>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>性别：</label>
                            <div class="form-value" :text="@patientInfo.gender"></div>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>年龄：</label>
                            <div class="form-value" :text="@patientInfo.age"></div>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>透析次数：</label>
                            <div class="form-value" :text="@patientInfo.dialysisTimes"></div>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label><span ms-if="!@formReadonly.schedule" class="edit-verify-span">*</span>班次：</label>
                            <select name="scheduleShift" lay-filter="scheduleShift" lay-verify="fieldRequired" data-field-name="班次"
                                    :attr="{disabled: @formReadonly.schedule}">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name" ms-for="($index, el) in @options.scheduleShift"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label><span ms-if="!@formReadonly.schedule" class="edit-verify-span">*</span>床位：</label>
                            <select id="bedNumberId" name="bedNumberId" xm-select="bedNumberId"
                                    xm-select-height="36px"
                                    xm-select-search="" xm-select-radio="bedNumberId"
                                    lay-filter="bedNumberId"
                                    lay-verify="bedNumberIdRequired">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>区域：</label>
                            <div class="form-value" :text="@patientInfo.regionName"></div>
                        </div>
                    </div>
                    <div ms-if="!@formReadonly.schedule" class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <button class="layui-btn layui-btn-dismain layui-btn-dis-xs"
                                    ms-if="@baseFuncInfo.authorityTag('diaBaseList#saveSchedule') && !@formReadonly.schedule"
                                    onclick="onSaveDialysisSchedule()">护士保存
                            </button>
                        </div>
                    </div>
                </div>

                <#-- 过敏情况 -->
                <div class="layui-form layui-row layui-col-space1 disease-diagnosis-box">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 partition-title">过敏情况</div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex">
                            <label>过敏药物：</label>
                            <div class="form-value pl-5">
                                <span ms-if="@patientInfo.allergicDrugStatusName" :text="@patientInfo.allergicDrugStatusName"></span>
                                <div ms-if="@patientInfo.allergicDrugDetails.length > 0" class="diagnose-tag" ms-for="($index, el) in @patientInfo.allergicDrugDetailDatas">
                                    <div class="color-block" :css="{borderColor: 'transparent transparent transparent ' + el.color}"></div>
                                    <div class="color-label" :text="el.shortName"></div>
                                    <div class="tag-label" :text="el.allergyName"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex">
                            <label>过敏史：</label>
                            <textarea type="text" name="allergicHistory" rows="1"
                                      :attr="{readonly: true, value: @patientInfo.allergicHistory}"></textarea>
                        </div>
                    </div>
                </div>

                <#-- 诊断 -->
                <div class="layui-form layui-row layui-col-space1 disease-diagnosis-box">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 partition-title">诊断</div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 form-value pl-20">
                        <div ms-if="@patientInfo.diseaseDiagnosisDatas.length == 0" class="empty-tags">暂无诊断记录</div>
                        <div class="diagnose-tag" ms-for="($index, el) in @patientInfo.diseaseDiagnosisDatas">
                            <div class="color-block" :css="{borderColor: 'transparent transparent transparent ' + el.color}"></div>
                            <div class="color-label" :text="el.shortName"></div>
                            <div class="tag-label" :text="el.icdCode + ' ' + el.diagnoseDetailName"></div>
                        </div>
                    </div>
                </div>

                <#-- 患者标签 -->
                <div class="layui-form layui-row layui-col-space1 patient-tag-box">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 partition-title">患者标签</div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 form-value pl-20">
                        <div ms-if="!@baseFuncInfo.authorityTag('diaBaseList#savePatientTag') && @patientInfo.patientTag.length == 0" class="empty-tags">暂无患者标签</div>
                        <span :css="{color: el.color, borderColor: el.color}" class="patient-tag" ms-for="($index, el) in @patientInfo.patientTag" :text="el.tagName"></span>
                        <button ms-if="@baseFuncInfo.authorityTag('diaBaseList#savePatientTag')" class="layui-btn layui-btn-dismain layui-btn-dis-xs" onclick="onPatientTagMaintain()">维护</button>
                    </div>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="diaBaseSchedule_submit">提交</button>
            </div>
        </div>

        <#-- 透前病情 -->
        <div class="layui-colla-item layui-form dialysis-before-box" lay-filter="diaBaseIllness_form">
            <p class="layui-colla-title">透前病情</p>
            <div class="layui-colla-content layui-show">
                <div class="layui-form layui-row layui-col-space1">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>透前体重：</label>
                            <input type="text" name="beforeWeight" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="透前体重" data-min-value="0" data-max-value="200"
                                   :attr="{readonly: @formReadonly.illness}">
                            <label>kg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>附加体重：</label>
                            <input type="text" name="additionalWeight" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="附加体重" data-min-value="0" data-max-value="200"
                                   :attr="{readonly: @formReadonly.illness}">
                            <label>kg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>收缩压：</label>
                            <input type="text" name="systolicPressure" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="收缩压" data-min-value="0" data-max-value="300" data-integer="true"
                                   :attr="{readonly: @formReadonly.illness}">
                            <label>mmHg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>舒张压：</label>
                            <input type="text" name="diastolicPressure" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="舒张压" data-min-value="0" data-max-value="300" data-integer="true"
                                   :attr="{readonly: @formReadonly.illness}">
                            <label>mmHg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>测量部位：</label>
                            <div>
                                <input type="radio" lay-verify="radio" value="0" name="measuringPart" title="上肢" checked
                                       :attr="{disabled: @formReadonly.illness}">
                                <input type="radio" lay-verify="radio" value="1" name="measuringPart" title="下肢"
                                       :attr="{disabled: @formReadonly.illness}">
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>脉搏：</label>
                            <input type="text" name="pulse" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="脉搏" data-min-value="0" data-max-value="300" data-integer="true"
                                   :attr="{readonly: @formReadonly.illness}">
                            <label>次/分</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>呼吸：</label>
                            <input type="text" name="respire" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="呼吸" data-min-value="0" data-max-value="100" data-integer="true"
                                   :attr="{readonly: @formReadonly.illness}">
                            <label>次/分</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>体温：</label>
                            <input type="text" name="temperature" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="体温" data-min-value="35" data-max-value="42"
                                   :attr="{readonly: @formReadonly.illness}">
                            <label>℃</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>24小时尿量：</label>
                            <input type="text" name="urineVolume" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="24小时尿量" data-min-value="0" data-max-value="5000" data-integer="true"
                                   :attr="{readonly: @formReadonly.illnessPlus}">
                            <label>ml</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex">
                            <label></label>
                            <button id="btnIllnessMore" class="layui-btn layui-btn-dismain layui-btn-dis-xs">更多</button>
                            <button ms-if="@baseFuncInfo.authorityTag('diaBaseList#saveIllness') && !@formReadonly.illness"
                                    class="layui-btn layui-btn-dismain layui-btn-dis-xs"
                                    onclick="onSaveDialysisIllness()">
                                护士保存
                            </button>
                        </div>
                    </div>
                    <div class="layui-col-sm11 layui-col-md11 layui-col-lg11">
                        <div class="disui-form-flex">
                            <label>病情：</label>
                            <textarea type="text" name="illness" id="illness" autocomplete="off" maxlength="5000" rows="3"
                                      :attr="{readonly: @formReadonly.illnessPlus}"></textarea>
                            <div class="ml-5">
                                <button ms-if="!@formReadonly.illnessPlus" class="layui-btn layui-btn-dismain layui-btn-dis-s"
                                        onclick="onSaveIllnessTemplate()">
                                    保存模板
                                </button>
                                <br/>
                                <button ms-if="!@formReadonly.illnessPlus" class="layui-btn layui-btn-dismain layui-btn-dis-s mt-5"
                                        onclick="onImportIllnessTemplate()">
                                    提取模板
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="diaBaseIllness_submit">提交</button>
            </div>
        </div>

        <#-- 透析处方 -->
        <div class="layui-colla-item layui-form" lay-filter="diaBaseScheme_form">
            <p class="layui-colla-title">透析处方</p>
            <div class="layui-colla-content layui-show">
                <#-- 基本信息 -->
                <div class="layui-form layui-row layui-col-space1 dialysis-parameter-box">
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label><span ms-if="!@formReadonly.scheme" class="edit-verify-span">*</span>透析方式：</label>
                            <select name="dialysisMode" lay-filter="dialysisMode"
                                    lay-verify="fieldRequired" data-field-name="透析方式"
                                    :attr="{disabled: @formReadonly.scheme}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.dialysisMode"
                                        ms-attr="{value: el.value}" ms-text="@el.name"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                        <div class="disui-form-flex">
                            <label>透析时长：</label>
                            <input type="text" name="dialysisTime" autocomplete="off" :attr="{readonly: @formReadonly.scheme}" maxlength="2"
                                   lay-verify="fieldNotInRange|number|hourVerify" data-field-name="时" data-min-value="0" data-max-value="24" data-integer="true">
                            <span style="display: inline-block;vertical-align: middle;padding-top: 8px">时</span>
                            <input type="text" name="dialysisTimeMinute" autocomplete="off" :attr="{readonly: @formReadonly.scheme}" maxlength="3"
                                   lay-verify="fieldNotInRange|number|minuteVerify" data-field-name="分" data-min-value="0" data-max-value="60" data-integer="true">
                            <label>分</label>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 form-item-dialyzer">
                        <div class="disui-form-flex">
                            <label>透析器：</label>
                            <select name="dialyzer" :attr="{disabled: @formReadonly.scheme}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.dialyzer"
                                        ms-attr="{value: el.value}" ms-text="@el.name"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 form-item-irrigator">
                        <div class="disui-form-flex">
                            <label>灌流器：</label>
                            <select name="irrigator" :attr="{disabled: @formReadonly.scheme}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.irrigator"
                                        ms-attr="{value: el.value}" ms-text="@el.name"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 form-item-filter">
                        <div class="disui-form-flex">
                            <label>血滤器：</label>
                            <select name="filter" :attr="{disabled: @formReadonly.scheme}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.dialyzer"
                                        ms-attr="{value: el.value}" ms-text="@el.name"></option>
                            </select>
                        </div>
                    </div>
                </div>

                <#-- 透析液 -->
                <div class="layui-form layui-row layui-col-space1 dialysis-dialysate-box">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 legend-title">
                        <fieldset class="layui-elem-field layui-field-title">
                            <legend>透析液</legend>
                        </fieldset>
                    </div>
                    <div class="layui-row">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>流量：</label>
                                <input type="text" name="replacementFluidFlow" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="透析液流量" data-min-value="0" data-max-value="10000" data-integer="true"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>ml/min</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>温度：</label>
                                <input type="text" name="dialysateTemperature" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="透析液温度" data-min-value="35" data-max-value="42"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>℃</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>处方钠：</label>
                                <input type="text" name="dialysatePrescribeSodium" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="处方钠" data-min-value="0" data-max-value="10000"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>mmol/L</label>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>浓度-HCO3：</label>
                                <input type="text" name="dialysateConcentrationHco3" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="透析液浓度-HCO3" data-min-value="0" data-max-value="10000"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>mmol/L</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>浓度-K：</label>
                                <input type="text" name="dialysateConcentrationK" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="透析液浓度-K" data-min-value="0" data-max-value="10000"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>mmol/L</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>浓度-Ca：</label>
                                <input type="text" name="dialysateConcentrationCa" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="透析液浓度-Ca" data-min-value="0" data-max-value="10000"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>mmol/L</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>浓度-Na：</label>
                                <input type="text" name="dialysateConcentrationNa" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="透析液浓度-Na" data-min-value="0" data-max-value="10000"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>mmol/L</label>
                            </div>
                        </div>
                    </div>
                </div>

                <#-- 抗凝剂 -->
                <div class="layui-form layui-row layui-col-space1 dialysis-anticoagulant-box">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 legend-title">
                        <fieldset class="layui-elem-field layui-field-title">
                            <legend>抗凝剂</legend>
                        </fieldset>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label><span ms-if="!@formReadonly.scheme" class="edit-verify-span">*</span>抗凝剂：</label>
                            <select name="anticoagulant"
                                    lay-verify="fieldRequired" data-field-name="抗凝剂"
                                    :attr="{disabled: @formReadonly.scheme}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.anticoagulant"
                                        ms-attr="{value: el.value}" ms-text="@el.name"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex">
                            <label>首剂：</label>
                            <input type="text" name="dosageFirstValue" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="抗凝剂首剂数量" data-min-value="0" data-max-value="10000"
                                   :attr="{readonly: @formReadonly.scheme}">
                            <select name="dosageFirstUnit" lay-filter="dosageFirstUnit" :attr="{disabled: @formReadonly.scheme}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.anticoagulantUnit"
                                        ms-attr="{value: el.value}" ms-text="@el.name"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm5 layui-col-md5 layui-col-lg5 dosage-add">
                        <div class="disui-form-flex">
                            <label>追加：</label>
                            <select name="dosageAdd" :attr="{disabled: @formReadonly.scheme}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.anticoagulant"
                                        ms-attr="{value: el.value}" ms-text="@el.name"></option>
                            </select>
                            <input type="text" name="dosageAddValue" autocomplete="off" style="flex: 3;"
                                   lay-verify="fieldNotInRange" data-field-name="抗凝剂追加数量" data-min-value="0" data-max-value="10000"
                                   :attr="{readonly: @formReadonly.scheme}">
                            <label :text="@patientInfo.dosageFirstUnitName ? @patientInfo.dosageFirstUnitName + '/h' : ''"></label>
                        </div>
                    </div>
                </div>

                <#-- 置换液 -->
                <div class="layui-form layui-row layui-col-space1 dialysis-replacement-box">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 legend-title">
                        <fieldset class="layui-elem-field layui-field-title">
                            <legend>置换液</legend>
                        </fieldset>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>置换方式：</label>
                            <select name="substituteMode" :attr="{disabled: @formReadonly.scheme}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.substituteMode"
                                        ms-attr="{value: el.value}" ms-text="@el.name"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>置换液总量：</label>
                            <input type="text" name="replacementFluidTotal" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="置换液总量" data-min-value="0" data-max-value="100"
                                   :attr="{readonly: @formReadonly.scheme}">
                            <label>L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>置换液流速：</label>
                            <input type="text" name="replacementFluidFlowRate" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="置换液流速" data-min-value="0" data-max-value="10000" data-integer="true"
                                   :attr="{readonly: @formReadonly.scheme}">
                            <label>ml/min</label>
                        </div>
                    </div>
                </div>

                <#-- 其他 -->
                <div class="layui-form layui-row layui-col-space1 dialysis-other-box">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 legend-title">
                        <fieldset class="layui-elem-field layui-field-title">
                            <legend>其他</legend>
                        </fieldset>
                    </div>
                    <div class="layui-row">
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 dry-weight">
                            <div class="disui-form-flex">
                                <label><img id="iconDryWeightChart" src="/web/static/images/dryweight.png">干体重：</label>
                                <input type="text" name="dryWeight" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="干体重" data-min-value="0" data-max-value="200"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label class="unit">kg</label>
                                <button ms-if="!@formReadonly.scheme" class="layui-btn layui-btn-dismain layui-btn-dis-s"
                                        onclick="onUpdateDryWeight()">更新
                                </button>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>目标脱水量：</label>
                                <input type="text" name="targetDehydration" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="目标脱水量" data-min-value="0" data-max-value="10000"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>L</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>处方脱水量：</label>
                                <input type="text" name="parameterDehydration" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="处方脱水量" data-min-value="0" data-max-value="10000"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>L</label>
                            </div>
                        </div>
                        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 deposit-dehydration">
                            <div class="disui-form-flex">
                                <label>存：</label>
                                <input type="text" name="depositDehydration" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="存" data-min-value="0" data-max-value="10000"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>L</label>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row">
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label>前次实际脱水量：</label>
                                <input type="text" name="bigDehydration" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="前次实际脱水量" data-min-value="0" data-max-value="10000"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>L</label>
                            </div>
                        </div>
                        <div class="layui-col-sm8 layui-col-md8 layui-col-lg8">
                            <div class="disui-form-flex">
                                <label>血管通路：</label>
                                <select id="vascularAccessId" name="vascularAccessId" xm-select="vascularAccessId"
                                        xm-select-height="36px"
                                        xm-select-search=""
                                        lay-filter="vascularAccessId"
                                        xm-select-max="2">
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row">
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label>血流量：</label>
                                <input type="text" name="bloodFlow" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="血流量" data-min-value="0" data-max-value="10000" data-integer="true"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>ml/min</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label>回血泵速：</label>
                                <input type="text" name="bloodPumpSpeed" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="回血泵速" data-min-value="0" data-max-value="10000" data-integer="true"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>ml/min</label>
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                            <div class="disui-form-flex">
                                <label>回血量：</label>
                                <input type="text" name="bloodReturning" autocomplete="off"
                                       lay-verify="fieldNotInRange" data-field-name="回血量" data-min-value="0" data-max-value="100"
                                       :attr="{readonly: @formReadonly.scheme}">
                                <label>kg</label>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row">
                        <div class="layui-col-sm11 layui-col-md11 layui-col-lg11">
                            <div class="disui-form-flex">
                                <label>备注：</label>
                                <textarea type="text" name="remarks" maxlength="5000" autocomplete="off" rows="1"
                                          :attr="{readonly: @formReadonly.scheme}"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="diaBaseScheme_submit">提交</button>
            </div>
        </div>
    </div>

    <#--干体重调整历史图表-->
    <div id="patientDryWeightChart" class="layui-card layui-hide"></div>

    <#--透前病情更多（上一次的透析病情）-->
    <div id="lastDialysisIllness" class="layui-card layui-hide">
        <div ms-if="!@patientInfo.lastDialysisIllness" class="empty">暂无上一次的透析病情</div>
        <div ms-if="@patientInfo.lastDialysisIllness" class="layui-row layui-col-space5">
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label>上次体重（前后）：</label>
                    <label>{{patientInfo.lastDialysisIllness.beforeWeight || ""}} kg / {{patientInfo.lastDialysisIllness.afterRealWeight || ""}} kg</label>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label>上次脱水（目标/机显）：</label>
                    <label>{{patientInfo.lastDialysisIllness.targetDehydration || ""}} L / {{patientInfo.lastDialysisIllness.machineDehydration || ""}} L</label>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label>上次存水：</label>
                    <label>{{patientInfo.lastDialysisIllness.depositDehydration || ""}} L</label>
                </div>
            </div>
            <div ms-if="@patientInfo.lastDialysisIllness.isLastHdf" class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label>上次实际置换液总量：</label>
                    <label>{{patientInfo.lastDialysisIllness.relReplacementFluidTotal || ""}} L</label>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label>上次病情：</label>
                    <div>{{patientInfo.lastDialysisIllness.illness || ""}}</div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/lib/echarts/4.3.0/echarts.min.js"></script>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaBaseList.js?t=${currentTimeMillis}"></script>
</body>
</html>
