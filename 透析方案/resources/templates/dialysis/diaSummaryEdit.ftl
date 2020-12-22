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
        .layui-row .disui-form-flex > label {
            flex: 0 0 115px;
        }
        .layui-row .disui-form-flex > span {
            line-height: 38px;
            padding: 0 5px;
        }
        .layui-row .disui-form-flex > label:last-child {
            flex: 0 0 45px;
            text-align: left;
            padding-left: 5px;
        }
        .layui-form-checkbox {
            margin: 3px;
        }

        /* 圆角分组标题 */
        .fillet-groud-puncture, .fillet-groud-catheter {
            display: block;
            margin-inline-start: 10px;
            margin-inline-end: 10px;
            padding-block-start: 5px;
            padding-inline-start: 10px;
            padding-inline-end: 10px;
            padding-block-end: 10px;
            border-width: 1px;
            border-style: #E6E6E6;
            border-radius: 5px;
            border-color: #E6E6E6;
            margin-bottom: 15px;
        }
        .fillet-groud-puncture.layui-elem-field legend, .fillet-groud-catheter.layui-elem-field legend {
            padding: 0 10px;
            font-size: 14px;
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
    </style>
</head>
<body ms-controller="diaSummaryEdit">
<div class="layui-form" lay-filter="diaSummaryEdit_form" id="diaSummaryEdit_form">
    <div class="layui-collapse">
        <#-- 小结内容 -->
        <div class="layui-colla-item">
            <div class="layui-colla-content layui-show">
                <#-- 透后病情 -->
                <div class="layui-row">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>透后体重：</label>
                            <input type="text" name="afterPlanWeight" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透后体重" data-min-value="0" data-max-value="200">
                            <label>kg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>实际透后体重：</label>
                            <input type="text" name="afterRealWeight" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="实际透后体重" data-min-value="0" data-max-value="200">
                            <span>kg</span>
                            <button ms-if="!@formReadonly" class="layui-btn layui-btn-dismain layui-btn-dis-s" onclick="getAfterRealWeight()">获取体重</button>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>实际脱水量：</label>
                            <input type="text" name="actualDehydration" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="实际脱水量" data-min-value="0" data-max-value="10000">
                            <label>L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>差：</label>
                            <input type="text" name="differDehydration" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="差" data-min-value="0" data-max-value="10000">
                            <label>L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>机显脱水量：</label>
                            <input type="text" name="machineDehydration" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="机显脱水量" data-min-value="0" data-max-value="10000">
                            <label >L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>实际预冲量：</label>
                            <input type="text" name="actualPreload" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="实际预冲量" data-min-value="0" data-max-value="10000" data-integer="true">
                            <label>ml</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>实际透析时长：</label>
                            <input type="text" name="dialysisTimeHour" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="实际透析时长-时" data-min-value="0" data-max-value="24" data-integer="true">
                            <span>时</span>
                            <input type="text" name="dialysisTimeMin" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="实际透析时长-分" data-min-value="0" data-max-value="60" data-integer="true">
                            <label>分</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>脉博：</label>
                            <input type="text" name="pulse" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="脉搏" data-min-value="0" data-max-value="300" data-integer="true">
                            <label>次／分</label>
                        </div>
                    </div>

                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>收缩压：</label>
                            <input type="text" name="systolicPressure" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="收缩压" data-min-value="0" data-max-value="300" data-integer="true">
                            <label >mmHg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>舒张压：</label>
                            <input type="text" name="diastolicPressure" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="舒张压" data-min-value="0" data-max-value="300" data-integer="true">
                            <label>mmHg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex">
                            <label>测量部位：</label>
                            <div>
                                <input type="radio" lay-verify="radio" value="0" name="measuringPart" :attr="{disabled: @formReadonly}"
                                       title="上肢" checked >
                                <input type="radio" lay-verify="radio" value="1" name="measuringPart" :attr="{disabled: @formReadonly}"
                                       title="下肢">
                                <button ms-if="!@formReadonly" class="layui-btn layui-btn-dismain layui-btn-dis-s" onclick="getBloodPressure()">获取血压</button>
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 form-item-rel-replacement-fluid-total">
                        <div class="disui-form-flex">
                            <label>实际置换液总量：</label>
                            <input type="text" name="relReplacementFluidTotal" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="实际置换液总量" data-min-value="0" data-max-value="100">
                            <label >L</label>
                        </div>
                    </div>
                </div>

                <#-- 透后评估 -->
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 legend-title">
                        <fieldset class="layui-elem-field layui-field-title">
                            <legend>透后评估</legend>
                        </fieldset>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>坠床：</label>
                            <select id="fallAssess" name="fallAssess" lay-filter="fallAssess" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @options.fallAssess"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>导管脱出：</label>
                            <select id="catheterDrop" name="catheterDrop" lay-filter="catheterDrop" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @options.catheterDrop"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>透析器凝血：</label>
                            <select id="diaCoagulation" name="diaCoagulation" lay-filter="diaCoagulation" :attr="{disabled: @formReadonly}">
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @options.diaCoagulation"></option>
                            </select>
                        </div>
                    </div>
                    <div ms-visible="!@dialyzerChangeDisabled" class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>透析器更换：</label>
                            <select id="dialyzerChange" name="dialyzerChange" lay-filter="dialyzerChange" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option value="Y">有</option>
                                <option value="N">无</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>透析管路凝血：</label>
                            <select id="bloodClotting" name="bloodClotting" lay-filter="bloodClotting" :attr="{disabled: @formReadonly}">
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @options.bloodClotting"></option>
                            </select>
                        </div>
                    </div>
                    <div ms-visible="!@pipingChangeDisabled" class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>管路更换：</label>
                            <select id="pipingChange" name="pipingChange" lay-filter="pipingChange" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option value="Y">有</option>
                                <option value="N">无</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>透中摄入：</label>
                            <select id="dialysateIntakeType" name="dialysateIntakeType" lay-filter="dialysateIntakeType" :attr="{disabled: @formReadonly}">
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @options.dialysateIntakeType"></option>
                            </select>
                        </div>
                    </div>
                    <div ms-visible="!@dialysateIntakeDisabled" class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>透中摄入：</label>
                            <input type="text" name="dialysateIntake" autocomplete="off" :attr="{readonly: @formReadonly}"
                                   lay-verify="fieldNotInRange" data-field-name="透中摄入" data-min-value="0" data-max-value="10000">
                            <label>kg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>发热：</label>
                            <select id="fever" name="fever" lay-filter="fever" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option value="Y">有</option>
                                <option value="N">无</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>步态观察：</label>
                            <select id="gaitWatch" name="gaitWatch" lay-filter="gaitWatch" :attr="{disabled: @formReadonly}">
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @options.gaitWatch"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 form-item-accompany-user">
                        <div class="disui-form-flex">
                            <label>陪同者：</label>
                            <select id="accompanyUser" name="accompanyUser" lay-filter="accompanyUser" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option ms-attr="{value:el.id}" ms-text="@el.userName"
                                        ms-for="($index, el) in @options.nurseList"></option>
                            </select>
                        </div>
                    </div>
                </div>

                <#-- 透后评估 - 穿刺评估 -->
                <fieldset class="layui-elem-field layui-field-title fillet-groud-puncture">
                    <legend>穿刺评估</legend>
                    <div class="layui-row">
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label>止血方式：</label>
                                <select id="hemostasis" name="hemostasis" lay-filter="hemostasis" :attr="{disabled: @formReadonly}">
                                    <option value=""></option>
                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                            ms-for="($index, el) in @options.hemostasis"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label>止血时间：</label>
                                <select id="hemostasisTime" name="hemostasisTime" lay-filter="hemostasisTime" :attr="{disabled: @formReadonly}">
                                    <option value=""></option>
                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                            ms-for="($index, el) in @options.hemostasisTime"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row">
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 ">
                            <div class="disui-form-flex">
                                <label>杂音：</label>
                                <select id="fistulaNoise" name="fistulaNoise" lay-filter="fistulaNoise" :attr="{disabled: @formReadonly}">
                                    <option value=""></option>
                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                            ms-for="($index, el) in @options.fistulaNoise"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 ">
                            <div class="disui-form-flex">
                                <label>震颤：</label>
                                <select id="fistulaTremor" name="fistulaTremor" lay-filter="fistulaTremor" :attr="{disabled: @formReadonly}">
                                    <option value=""></option>
                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                            ms-for="($index, el) in @options.fistulaTremor"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 ">
                            <div class="disui-form-flex">
                                <label>其他：</label>
                                <input type="text" name="fistulaOther" maxlength="50" autocomplete="off" :attr="{readonly: @formReadonly}">
                            </div>
                        </div>
                    </div>
                </fieldset>

                <#-- 透后评估 - 导管评估 -->
                <fieldset class="layui-elem-field layui-field-title fillet-groud-catheter">
                    <legend>导管评估</legend>
                    <div class="layui-row">
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label>封管方式：</label>
                                <select id="sealingMethod" name="sealingMethod" lay-filter="sealingMethod" :attr="{disabled: @formReadonly}">
                                    <option value=""></option>
                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                            ms-for="($index, el) in @options.sealingMethod"></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label>管腔容量：</label>
                                <span>A</span>
                                <input type="text" name="capacityA" autocomplete="off" :attr="{readonly: @formReadonly}"
                                       lay-verify="fieldNotInRange" data-field-name="管腔容量-A" data-min-value="0" data-max-value="999">
                                <span>ml</span>
                                <span>/</span>
                                <span>V</span>
                                <input type="text" name="capacityV" autocomplete="off" :attr="{readonly: @formReadonly}"
                                       lay-verify="fieldNotInRange" data-field-name="管腔容量-V" data-min-value="0" data-max-value="999">
                                <span>ml</span>
                            </div>
                        </div>
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label></label>
                                <input type="checkbox" name="dressingChange" title="已更换敷料" value="Y" :attr="{disabled: @formReadonly}">
                            </div>
                        </div>
                    </div>
                    <div class="layui-row">
                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 ">
                            <div class="disui-form-flex">
                                <label>封管用药：</label>
                                <select id="drugSealing" name="drugSealing" lay-filter="drugSealing" :attr="{disabled: @formReadonly}">
                                    <option value=""></option>
                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                            ms-for="($index, el) in @options.drugSealing"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <#-- 透后评估 - 小结 -->
                <div class="layui-row">
                    <div class="layui-col-sm10 layui-col-md10 layui-col-lg10 ">
                        <div class="disui-form-flex">
                            <label>小结：</label>
                            <textarea type="text" name="summary" maxlength="5000" autocomplete="off" rows="5" :attr="{readonly: @formReadonly}"></textarea>
                        </div>
                    </div>
                    <div ms-if="!@formReadonly" class="layui-col-sm2 layui-col-md2 layui-col-lg2 ">
                        <div class="disui-form-flex" style="margin: 1px 0px">
                            <button class="layui-btn layui-btn-dismain layui-btn-dis-s" onclick="onSaveSummaryTemplate()">保存模板</button>
                        </div>
                        <div class="disui-form-flex" style="margin: 1px 0px">
                            <button class="layui-btn layui-btn-dismain layui-btn-dis-s" onclick="onImportSummaryTemplate()">提取模板</button>
                        </div>
                        <div class="disui-form-flex" style="margin: 1px 0px">
                            <button class="layui-btn layui-btn-dismain layui-btn-dis-s" onclick="generateSummary()">生成小结
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <#-- 签名 -->
        <div class="layui-colla-item">
            <p class="layui-colla-title">签名</p>
            <div class="layui-colla-content layui-show">
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                        <div class="disui-form-flex">
                            <label>冲管者：</label>
                            <select name="washpipeUser" lay-filter="washpipeUser" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.nurseList"
                                        ms-attr="{value:el.id}" ms-text="@el.userName"></option>
                            </select>

                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>穿刺者：</label>
                            <select name="punctureUser" lay-filter="punctureUser" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.nurseList"
                                        ms-attr="{value:el.id}" ms-text="@el.userName"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                        <div class="disui-form-flex">
                            <label>接血者：</label>
                            <select name="bloodReceiver" lay-filter="bloodReceiver" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.nurseList"
                                        ms-attr="{value:el.id}" ms-text="@el.userName"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                        <div class="disui-form-flex">
                            <label>回血者：</label>
                            <select name="rebleedingUser" lay-filter="rebleedingUser" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.nurseList"
                                        ms-attr="{value:el.id}" ms-text="@el.userName"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                        <div class="disui-form-flex">
                            <label>巡视者：</label>
                            <select name="inspector" lay-filter="inspector" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.nurseList"
                                        ms-attr="{value:el.id}" ms-text="@el.userName"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>责任护士：</label>
                            <select id="principalNurse" name="principalNurse" xm-select="principalNurse" :attr="{disabled: @formReadonly}"
                                    xm-select-height="36px"
                                    xm-select-search=""
                                    lay-filter="principalNurse">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>查对护士：</label>
                            <select name="checkNurse" lay-filter="checkNurse" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.nurseList"
                                        ms-attr="{value:el.id}" ms-text="@el.userName"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 ">
                        <div class="disui-form-flex">
                            <label>医生签名：</label>
                            <select name="doctorSign" lay-filter="doctorSign" :attr="{disabled: @formReadonly}">
                                <option value=""></option>
                                <option ms-for="($index, el) in @options.doctorList"
                                        ms-attr="{value:el.id}" ms-text="@el.userName"></option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn " lay-submit lay-filter="diaSummaryEdit_submit" id="diaSummaryEdit_submit">提交</button>
    </div>
</div>

<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaSummaryEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
