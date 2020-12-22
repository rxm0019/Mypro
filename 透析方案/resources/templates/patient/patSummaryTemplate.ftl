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
        .layui-row .disui-form-flex>span {
            padding: 0 5px;
            line-height: 38px;
        }
        .dis-partition-header {
            margin-bottom: 10px;
        }

        .dropdown-root .dropdown-pointer {
            display: none;
        }
        .dropdown-root .dropdown-content {
            border: 1px solid #d2d2d2;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
        }
        .dropdown-root .dropdown-content .layui-form-checkbox[lay-skin=primary] {
            width: 140px;
        }

        /** 透析液浓度 **/
        .form-item-dialysate-concentration .disui-form-flex>span.label {
            width: 60px;
            text-align: right;
        }

        /** 评估组 **/
        .assess-group {
            position: relative;
            margin: 5px 10px 0 10px;
        }
        .assess-group:before {
            content: "";
            display: block;
            clear: both;
            position: absolute;
            top: 19px;
            width: 100%;
            height: 1px;
            display: block;
            border-top: 1px solid #e6e6e6;
            content: ' ';
        }
        .assess-group .assess-group-title {
            padding-left: 30px;
            margin-bottom: 5px;
        }
        .assess-group .assess-group-title .disui-form-flex .title {
            padding-left: 10px;
            flex: 0 0 130px;
            text-align: left;
            line-height: 38px;
        }
        .assess-group .assess-group-title .describe-label {
            padding-left: 20px;
            text-align: right;
        }
        .assess-group .assess-group-title .describe {
            max-width: 400px;
        }
        .assess-group .assess-group-title .blank {
            width: 20px;
        }
        .assess-group .assess-group-title .disui-form-flex > .content-item {
            background-color: #FFFFFF;
        }
        .assess-group.layui-row .disui-form-flex>label {
            flex: 0 0 100px;
            line-height: 19px;
            vertical-align: middle;
            margin: auto 0;
        }
        .assess-group.layui-row .disui-form-flex .layui-lable-unit {
            flex: 0 0 45px;
            text-align: left;
            padding-left: 5px;
        }
    </style>
</head>
<body ms-controller="patSummaryTemplate">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-body">
            <!-- 阶段小结表单 -->
            <form class="layui-form" lay-filter="patSummaryEdit_form" id="patSummaryEdit_form">
                <div class="layui-row">
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex" >
                            <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>阶段小结：</label>
                            <input type="text"  name="summaryName" autocomplete="off" lay-verify="fieldRequired" data-field-name="阶段小结名称">
                        </div>
                    </div>
                </div>

                <!-- 阶段小结表单 - 概要 -->
                <div class="dis-partition-header">
                    <div class="quote">概要</div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex" >
                            <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>干体重：</label>
                            <input type="text" name="dryWeight" maxlength="6" autocomplete="off" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldRequired|fieldNotInRange" data-field-name="干体重" data-min-value="0" data-max-value="200">
                            <label class="layui-lable-unit">kg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
                        <div class="disui-form-flex" >
                            <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>透析方式：</label>
                            <input type="hidden" name="dialysisModeWithTimes" lay-verify="fieldRequired" data-field-name="透析方式">
                            <input type="text" name="dialysisModeWithTimesVal" readonly autocomplete="off" lay-filter="dialysisModeWithTimesId"
                                   class="dialysisModeWithTimes" id="dialysisModeWithTimesId" ms-attr="{disabled: @formReadonly}">
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex" >
                            <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>抗凝方式：</label>
                            <select name="antiMode" lay-filter="antiMode" ms-attr="{disabled: @formReadonly}"
                                    lay-verify="fieldRequired" data-field-name="抗凝方式">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.anticoagulant"
                                        ms-attr="{value: el.value}" ms-text="@el.name"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm5 layui-col-md5 layui-col-lg5">
                        <div class="disui-form-flex" >
                            <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>剂量：</label>
                            <input type="text" name="dosage" maxlength="8" autocomplete="off" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldRequired|fieldNotInRange" data-field-name="剂量" data-min-value="0" data-max-value="10000">
                            <select name="dosageUnit" lay-filter="dosageUnit" ms-attr="{disabled: @formReadonly}"
                                    lay-verify="fieldRequired" data-field-name="剂量单位">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.anticoagulantUnit"
                                        ms-attr="{value: el.value}" ms-text="@el.name"></option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1 form-item-dialysate-concentration">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex" >
                            <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>透析液浓度：</label>
                            <span class="label">HCO3</span>
                            <input type="text" name="dialysateConcentrationHco3" maxlength="8" autocomplete="off" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldRequired|fieldNotInRange" data-field-name="透析液浓度-HCO3" data-min-value="0" data-max-value="10000">
                            <span>mmol/L</span>

                            <span class="label">K</span>
                            <input type="text" name="dialysateConcentrationK" maxlength="8" autocomplete="off" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldRequired|fieldNotInRange" data-field-name="透析液浓度-K" data-min-value="0" data-max-value="10000">
                            <span>mmol/L</span>

                            <span class="label">Ca</span>
                            <input type="text" name="dialysateConcentrationCa" maxlength="8" autocomplete="off" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldRequired|fieldNotInRange" data-field-name="透析液浓度-Ca" data-min-value="0" data-max-value="10000">
                            <span>mmol/L</span>

                            <span class="label">Na</span>
                            <input type="text" name="dialysateConcentrationNa" maxlength="8" autocomplete="off" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldRequired|fieldNotInRange" data-field-name="透析液浓度-Na" data-min-value="0" data-max-value="10000">
                            <span>mmol/L</span>
                        </div>
                    </div>
                </div>

                <!-- 阶段小结表单 - 评估 -->
                <div class="dis-partition-header">
                    <div class="quote">评估</div>
                </div>
                <!-- 阶段小结表单 - 评估 - 1.肾性贫血评估 -->
                <div class="layui-row assess-group">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 assess-group-title">
                        <div class="disui-form-flex" >
                            <label class="title content-item">1. 肾性贫血评估：</label>
                            <div class="content-item">
                                <input type="radio" name="renalAnemiaAssess" lay-verify="fieldRequired" data-field-name="肾性贫血评估是否达标"
                                       ms-for="($index, el) in @options.assess"
                                       ms-attr="{value: el.value, title: el.name, checked: true && $index == 0, disabled: @formReadonly}">
                            </div>
                            <span class="describe-label content-item">描述：</span>
                            <input type="text" class="describe content-item"  name="renalAnemiaDescribe" maxlength="1000" autocomplete="off" ms-attr="{readonly: @formReadonly}">
                            <span class="content-item"></span>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>血红蛋白：</label>
                            <input type="text" name="hemoglobin" autocomplete="off" maxlength="8" lay-verify="numbers" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="血红蛋白" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">g/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>红细胞压积：</label>
                            <input type="text" name="hematocrit" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="红细胞压积" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">%</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>血小板：</label>
                            <input type="text" name="platelet" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="血小板" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">10^9/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>网织红细胞：</label>
                            <input type="text" name="reticulocyte" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="网织红细胞" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">10^9/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>总铁结合力：</label>
                            <input type="text" name="totalIronBindingForce" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="总铁结合力" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">μmoI/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>转铁蛋白饱和度：</label>
                            <input type="text" name="transferrinSaturation" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="转铁蛋白饱和度" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">%</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>血清铁：</label>
                            <input type="text" name="serumIron" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="血清铁" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">μmoI/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>血清铁蛋白：</label>
                            <input type="text" name="serumFerritin" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="血清铁蛋白" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">μg/L</label>
                        </div>
                    </div>
                </div>
                <!-- 阶段小结表单 - 评估 - 2.CKD-MBD评估 -->
                <div class="layui-row assess-group">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 assess-group-title">
                        <div class="disui-form-flex" >
                            <label class="title content-item">2. CKD-MBD评估：</label>
                            <div class="content-item">
                                <input type="radio" name="ckdMbdAssess" lay-verify="fieldRequired" data-field-name="CKD-MBD评估是否达标"
                                       ms-for="($index, el) in @options.assess"
                                       ms-attr="{value: el.value, title: el.name, checked: true && $index == 0, disabled: @formReadonly}">
                            </div>
                            <span class="describe-label content-item">描述：</span>
                            <input type="text" class="describe content-item" name="ckdMbdDescribe" maxlength="1000" autocomplete="off" ms-attr="{readonly: @formReadonly}">
                            <span class="content-item"></span>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>透前钙：</label>
                            <input type="text" name="preDialysisCalcium" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透前钙" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>透前磷：</label>
                            <input type="text" name="preDialysisPhosphorus" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透前磷" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>iPTH：</label>
                            <input type="text" name="ipth" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="iPTH" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">ng/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>钙磷乘积：</label>
                            <input type="text" name="calciumPhosphorusProduct" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="钙磷乘积" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mg^2/dL^2</label>
                        </div>
                    </div>
                </div>
                <!-- 阶段小结表单 - 评估 - 3.营养评估 -->
                <div class="layui-row assess-group">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 assess-group-title">
                        <div class="disui-form-flex" >
                            <label class="title content-item">3. 营养评估：</label>
                            <div class="content-item">
                                <input type="radio" name="nutritionalAssess" lay-verify="fieldRequired" data-field-name="营养评估是否达标"
                                       ms-for="($index, el) in @options.assess"
                                       ms-attr="{value: el.value, title: el.name, checked: true && $index == 0, disabled: @formReadonly}">
                            </div>
                            <span class="describe-label content-item">描述：</span>
                            <input type="text" class="describe content-item" name="nutritionalDescribe" maxlength="1000" autocomplete="off" ms-attr="{readonly: @formReadonly}">
                            <span class="content-item"></span>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>白蛋白：</label>
                            <input type="text" name="albumin" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="白蛋白" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">g/L</label>
                        </div>
                    </div>
                </div>
                <!-- 阶段小结表单 - 评估 - 4.血脂评估 -->
                <div class="layui-row assess-group">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 assess-group-title">
                        <div class="disui-form-flex" >
                            <label class="title content-item">4. 血脂评估：</label>
                            <div class="content-item">
                                <input type="radio" name="bloodFatAssess" lay-verify="fieldRequired" data-field-name="血脂评估是否达标"
                                       ms-for="($index, el) in @options.assess"
                                       ms-attr="{value: el.value, title: el.name, checked: true && $index == 0, disabled: @formReadonly}">
                            </div>
                            <span class="describe-label content-item">描述：</span>
                            <input type="text" class="describe content-item" name="bloodFatDescribe" maxlength="1000" autocomplete="off" ms-attr="{readonly: @formReadonly}">
                            <span class="content-item"></span>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>胆固醇：</label>
                            <input type="text" name="cholesterol" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="胆固醇" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>甘油三酯：</label>
                            <input type="text" name="triglyceride" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="甘油三酯" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>低密度脂蛋白：</label>
                            <input type="text" name="lowDensityLipoprotein" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="低密度脂蛋白" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>高密度脂蛋白：</label>
                            <input type="text" name="highDensityLipoprotein" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="高密度脂蛋白" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                </div>
                <!-- 阶段小结表单 - 评估 - 5.血糖评估 -->
                <div class="layui-row assess-group">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 assess-group-title">
                        <div class="disui-form-flex" >
                            <label class="title content-item">5. 血糖评估：</label>
                            <div class="content-item">
                                <input type="radio" name="bloodSugarAssess" lay-verify="fieldRequired" data-field-name="血糖评估是否达标"
                                       ms-for="($index, el) in @options.assess"
                                       ms-attr="{value: el.value, title: el.name, checked: true && $index == 0, disabled: @formReadonly}">
                            </div>
                            <span class="describe-label content-item">描述：</span>
                            <input type="text" class="describe content-item" name="bloodSugarDescribe" maxlength="1000" autocomplete="off" ms-attr="{readonly: @formReadonly}">
                            <span class="content-item"></span>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>空腹血糖：</label>
                            <input type="text" name="fastingBloodGlucose" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="空腹血糖" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                </div>
                <!-- 阶段小结表单 - 评估 - 6.钾钠评估 -->
                <div class="layui-row assess-group">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 assess-group-title">
                        <div class="disui-form-flex" >
                            <label class="title content-item">6. 钾钠评估：</label>
                            <div class="content-item">
                                <input type="radio" name="potassiumSodiumAssess" lay-verify="fieldRequired" data-field-name="钾钠评估是否达标"
                                       ms-for="($index, el) in @options.assess"
                                       ms-attr="{value: el.value, title: el.name, checked: true && $index == 0, disabled: @formReadonly}">
                            </div>
                            <span class="describe-label content-item">描述：</span>
                            <input type="text" class="describe content-item" name="potassiumSodiumDescribe" maxlength="1000" autocomplete="off" ms-attr="{readonly: @formReadonly}">
                            <span class="content-item"></span>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>透前钾：</label>
                            <input type="text" name="preDialysisPotassium" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透前钾" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>透后钾：</label>
                            <input type="text" name="postDialysisPotassium" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透后钾" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>透前钠：</label>
                            <input type="text" name="preDialysisSodium" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透前钠" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>透后钠：</label>
                            <input type="text" name="postDialysisSodium" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透后钠" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                </div>
                <!-- 阶段小结表单 - 评估 - 7.透析充分性评估 -->
                <div class="layui-row assess-group">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 assess-group-title">
                        <div class="disui-form-flex" >
                            <label class="title content-item">7. 透析充分性评估：</label>
                            <div class="content-item">
                                <input type="radio" name="dialysisAdequacyAssess" lay-verify="fieldRequired" data-field-name="透析充分性评估是否达标"
                                       ms-for="($index, el) in @options.assess"
                                       ms-attr="{value: el.value, title: el.name, checked: true && $index == 0, disabled: @formReadonly}">
                            </div>
                            <span class="describe-label content-item">描述：</span>
                            <input type="text" class="describe content-item" name="dialysisAdequacyDescribe" maxlength="1000" autocomplete="off" ms-attr="{readonly: @formReadonly}">
                            <span class="content-item"></span>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>KTV：</label>
                            <input type="text" name="ktv" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="KTV" data-min-value="0" data-max-value="10000">
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>URR：</label>
                            <input type="text" name="urr" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="URR" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">%</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>透前尿素氮：</label>
                            <input type="text" name="preDialysisUreaNitrogen" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透前尿素氮" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>透后尿素氮：</label>
                            <input type="text" name="postDialysisUreaNitrogen" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透后尿素氮" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>透前肌酐：</label>
                            <input type="text" name="preDialysisCreatinine" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透前肌酐" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">μmoI/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>透后肌酐：</label>
                            <input type="text" name="postDialysisCreatinine" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透后肌酐" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">μmoI/L</label>
                        </div>
                    </div>
                </div>
                <!-- 阶段小结表单 - 评估 - 8.其他化验评估 -->
                <div class="layui-row assess-group">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 assess-group-title">
                        <div class="disui-form-flex" >
                            <label class="title content-item">8. 其他化验评估：</label>
                            <span class="content-item"></span>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>谷丙转氨酶：</label>
                            <input type="text" name="alt" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="谷丙转氨酶" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">U/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                        <div class="disui-form-flex" ><label>谷草转氨酶：</label>
                            <input type="text" name="ast" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="谷草转氨酶" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">U/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3 col-flex">
                        <div class="disui-form-flex" ><label class="long-lable">透前二氧化碳结合力：</label>
                            <input type="text" name="preDialysisCarbonDioxide"  autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透前二氧化碳结合力" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md4 layui-col-lg3 col-flex">
                        <div class="disui-form-flex" ><label class="long-lable">透后二氧化碳结合力：</label>
                            <input type="text" name="postDialysisCarbonDioxide" autocomplete="off" maxlength="8" ms-attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透后二氧化碳结合力" data-min-value="0" data-max-value="10000">
                            <label class="layui-lable-unit">mmol/L</label>
                        </div>
                    </div>
                </div>
                <!-- 阶段小结表单 - 评估 - 9.辅助检查 -->
                <div class="layui-row assess-group">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 assess-group-title">
                        <div class="disui-form-flex" >
                            <label class="title content-item">9. 辅助检查：</label>
                            <span class="content-item"></span>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex" ><label>胸片：</label>
                            <input type="text" name="chestFilm" maxlength="1000" autocomplete="off" ms-attr="{readonly: @formReadonly}">
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex" ><label>心电图：</label>
                            <input type="text" name="ecg" maxlength="1000"  autocomplete="off" ms-attr="{readonly: @formReadonly}">
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex" ><label>超声心动：</label>
                            <input type="text" name="ultrasonicCardiography" maxlength="1000" autocomplete="off" ms-attr="{readonly: @formReadonly}">
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex" ><label>其他：</label>
                            <input type="text" name="auxiliaryOther" maxlength="1000" autocomplete="off" ms-attr="{readonly: @formReadonly}">
                        </div>
                    </div>
                </div>

                <!-- 阶段小结表单 - 其他总结 -->
                <div class="dis-partition-header"><div class="quote">其他总结</div></div>
                <div class="layui-row">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex" >
                            <textarea name="otherSummary" maxlength="21845" ms-attr="{readonly: @formReadonly}"></textarea>
                        </div>
                    </div>
                </div>

                <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                <div class="layui-form-item layui-hide">
                    <a class="layui-btn" lay-submit lay-filter="patSummaryEdit_submit" id="patSummaryEdit_submit">提交</a>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- 自定义添加阶段小结弹框 -->
<script id="dialysisModeWithTimesOptionsTemp" type="text/html">
    <div class="layui-row" style="width: 100%; padding: 10px; box-sizing: border-box;">
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="position: relative; min-height: 172px;">
            <div class="layui-row">
                <div id="dialysisModeWithTimesOption" class="layui-col-sm4 layui-col-md3 layui-col-lg12"></div>
            </div>
            <div class="layui-row" style="margin: 5px 0 5px 0;width:100%;text-align: center">
                <a class="layui-btn layui-btn-dismain" href="javascript: onSaveDialysisModeWithTimes()">确认</a>
                <a class="layui-btn layui-btn-dissub" href="javascript: onCancelDialysisModeWithTimes()">取消</a>
            </div>
        </div>
    </div>
</script>

<script type="text/javascript" src="${ctxsta}/static/js/patient/patSummaryTemplate.js?t=${currentTimeMillis}"></script>
</body>
</html>
