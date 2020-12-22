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
    .layui-elem-quote {
        background-color: #FFF;
        line-height: 20px;
        padding: 5px;
        margin-top: 10px;
        border-left: 4px solid rgba(118, 189, 187, 1);
        margin-left: 15px;
    }

    .layui-bg-green {
        height: 3px;
        margin-left: 5px;
        margin-left: 15px;
        background-color: rgba(118, 189, 187, 1) !important;
    }

    .layui-table-view {
        border: 1px solid #e6e6e6;
    }

    /*
虚线样式
*/
    .layui-field-title-separate {
        text-align: center;
        border-style: none;
        background-image: linear-gradient(to right, #ccc 0%, #ccc 60%, transparent 40%);
        background-size: 25px 1px;
        background-repeat: repeat-x;
        margin: 10px 0 !important;
    }

    .layui-row .disui-form-flex > label {
        flex-basis: 120px;

    }

    .layui-row .disui-form-flex > label:last-child {
        flex-basis: 50px;
        text-align: left;
    }

    .layui-elem-field legend {
        font-size: 14px;
    }

    .layui-field-title {
        margin: 5px 0 0px;
        border-width: 1px 0 0;
    }
</style>
<body ms-controller="patDialysisSchemeEdit">
<div class="layui-card-body" style="padding: 10px 30px 0 20px">
    <div>
        <!--table定义-->
        <table id="patDialysisSchemeEdit_table" lay-filter="patDialysisSchemeEdit_table"
               style="height: inherit;">
        </table>
        <script type="text/html" id="patDialysisSchemeEdit_bar">
            {{# if(baseFuncInfo.authorityTag('patDialysisSchemeEdit#enable')){ }}
            {{# if(d.dataStatus === '1') { }}
            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="enable">启用</a>
            {{# } else { }}
            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="enable">停用</a>
            {{# } }}
            {{# } }}
        </script>
        <fieldset class="layui-elem-field layui-field-title layui-field-title-separate">
            <legend>选中上方数据行切换透析处方</legend>
        </fieldset>
    </div>
    <!--工具栏的按钮的div，注意：需要增加权限控制-->
    <div ms-if="isShowScheme">
        <button :visible="@baseFuncInfo.authorityTag('patDialysisSchemeEdit#add')"
                class="layui-btn layui-btn-dismain" id="addSchemeEditOrEdit"
                onclick="addSchemeEditOrEdit()">添加
        </button>
        <button :visible="@baseFuncInfo.authorityTag('patDialysisSchemeEdit#edit')"
                class="layui-btn layui-btn-dismain" id="addSchemeEditOrEdit"
                onclick="updateSchemeEditOrEdit()">修改
        </button>
        <button :visible="@baseFuncInfo.authorityTag('patDialysisSchemeList#delete')"
                class="layui-btn layui-btn-dissub"
                onclick="del()">删除
        </button>
    </div>
    <form class="layui-form" lay-filter="patDialysisSchemeEdit_form" id="patDialysisSchemeEdit_form">
        <div class="layui-row layui-col-space1" style="margin-bottom: 10px;">
            <div style="float: right" ms-if="!isShowScheme">
                <button type="submit" lay-submit="" class="layui-btn layui-btn-dismain"
                        lay-filter="updatePatDialysisSchemeEdit_form">保存
                </button>
                <button  class="layui-btn layui-btn-dissub" onclick="cancelSchemeEdit_form()">取消
                </button>
            </div>
        </div>
        <div style="border: 1px solid #CCCCCC; border-radius: 10px;">
            <div style="margin: 20px">
                <div class="layui-form-item  layui-hide">
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex">
                            <label>ID</label>
                            <input type="hidden" name="dialysisSchemeId" id="dialysisSchemeId" placeholder="请输入"
                            >
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex">
                            <label>患者ID</label>
                            <input type="hidden" name="patientId" placeholder="请输入">
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label><span class="edit-verify-span">*</span>透析方式：</label>
                            <select name="dialysisMode" id="dialysisMode" lay-verify="fieldRequired"
                                    data-field-name="透析方式"
                                    lay-filter="dialysisMode">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DialysisMode')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label><span class="edit-verify-span">*</span>透析频次：</label>
                            <select name="dialysisFrequency" lay-verify="fieldRequired"
                                    data-field-name="透析频次">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DialysisFrequency')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label><span class="edit-verify-span">*</span>制定时间：</label>
                            <input type="text" name="schemeDate" id="schemeDate" lay-verify="fieldRequired"
                                   data-field-name="制定时间"
                                   placeholder="yyyy-MM-dd"
                            >
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label><span class="edit-verify-span">*</span>制定人：</label>
                            <select name="schemeUserId" id="schemeUserId" lay-verify="fieldRequired"
                                    data-field-name="制定人">
                                <option value=""></option>
                                <option ms-attr="{value:el.id}" ms-text="@el.userName"
                                        ms-for="($index, el) in makerName"></option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="dialyzerShow">
                        <div class="disui-form-flex">
                            <label>透析器：</label>
                            <select name="dialyzer" id="dialyzer">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Dialyzer')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="irrigatorShow">
                        <div class="disui-form-flex">
                            <label>灌流器：</label>
                            <select name="irrigator" id="irrigator">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Irrigator')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="hemofilterShow">
                        <div class="disui-form-flex">
                            <label>血凝器：</label>
                            <select name="filter" id="filter">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Dialyzer')"></option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>透析时长：</label>
                            <input type="text" name="dialysisTime" autocomplete="off" :attr="{readonly: @formReadonly.scheme}"
                                   lay-verify="fieldNotInRange" data-field-name="时" data-min-value="0" data-max-value="24" data-integer="true">
                            <span style="display: inline-block;vertical-align: middle;padding-top: 8px">时</span>
                            <input type="text" name="dialysisTimeMinute" autocomplete="off" :attr="{readonly: @formReadonly.scheme}"
                                   lay-verify="fieldNotInRange" data-field-name="分" data-min-value="0" data-max-value="60" data-integer="true">
                            <label>分</label>
                        </div>

                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>血流量：</label>
                            <input type="text" name="bloodFlow"
                                   lay-verify="fieldNotInRange" data-field-name="血流量"
                                   data-min-value="0" data-max-value="10000"
                                   data-integer="true">
                            <label>ml/min</label>
                        </div>

                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>回血泵速：</label>
                            <input type="text" name="bloodPumpSpeed" autocomplete="off"
                                   lay-verify="fieldNotInRange" data-field-name="回血泵速" data-min-value="0"
                                   data-max-value="10000" data-integer="true">
                            <label>ml/min</label>
                        </div>
                    </div>
                </div>
                <#--抗凝剂-->
                <div class="layui-row layui-col-space1">
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend>抗凝剂</legend>
                    </fieldset>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label><span class="edit-verify-span">*</span>抗凝剂：</label>
                            <select name="anticoagulant" lay-verify="required" lay-filter="anticoagulant">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Anticoagulant')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>首推剂量：</label>
                            <input type="text" name="dosageFirstValue"
                                   lay-verify="fieldNotInRange" data-field-name="抗凝剂首剂数量" data-min-value="0"
                                   data-max-value="10000">
                            <select name="dosageFirstUnit" lay-filter="dosageFirstUnit">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('AnticoagulantUnit')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" id="addToShow">
                        <div class="disui-form-flex">
                            <label>追加：</label>
                            <select name="dosageAdd"
                                    lay-filter="anticoagulant">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Anticoagulant')"></option>
                            </select>
                            <input type="text" name="dosageAddValue"
                                   lay-verify="fieldNotInRange" data-field-name="抗凝剂追加数量" data-min-value="0"
                                   data-max-value="10000">
                            <label><span>{{addUnit}}</span>/h</label>
                        </div>
                    </div>
                </div>
                <#--置换液-->
                <div class="layui-row layui-col-space1" id="replacementFluidAll">
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend>置换液</legend>
                    </fieldset>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>置换方式：</label>
                            <select name="substituteMode" id="substituteMode">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('SubstituteMode')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>置换液总量：</label>
                            <input type="text" name="replacementFluidTotal" id="replacementFluidTotal"
                                   lay-verify="fieldNotInRange" data-field-name="置换液总量" data-min-value="0"
                                   data-max-value="100">
                            <label>L</label>
                        </div>

                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>置换液流速：</label>
                            <input type="text" name="replacementFluidFlowRate" id="replacementFluidFlowRate"
                                   lay-verify="fieldNotInRange" data-field-name="置换液流速" data-min-value="0"
                                   data-max-value="10000" data-integer="true">
                            <label>ml/min</label>
                        </div>

                    </div>
                </div>
                <#--透析液 -->
                <div class="layui-row layui-col-space1">
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend>透析液</legend>
                    </fieldset>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>流量：</label>
                            <input type="text" name="replacementFluidFlow"
                                   lay-verify="fieldNotInRange" data-field-name="透析液流量" data-min-value="0"
                                   data-max-value="10000" data-integer="true">
                            <label>ml/min</label>
                        </div>

                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>温度：</label>
                            <input type="text" name="dialysateTemperature"
                                   lay-verify="fieldNotInRange" data-field-name="透析液温度" data-min-value="35"
                                   data-max-value="42">
                            <label>℃</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>处方钠：</label>
                            <input type="text" name="dialysatePrescribeSodium"
                                   lay-verify="fieldNotInRange" data-field-name="处方钠" data-min-value="0"
                                   data-max-value="10000">
                            <label>mmol/L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                        <div class="disui-form-flex">
                            <label>处方脱水量：</label>
                            <input type="text" name="parameterDehydration" lay-verify="fieldNotInRange"
                                   data-field-name="处方脱水量" data-min-value="0" data-max-value="10000">
                            <label>L</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                        <div class="disui-form-flex">
                            <label>回血量：</label>
                            <input type="text" name="bloodReturning" llay-verify="fieldNotInRange"
                                   data-field-name="回血量" data-min-value="0" data-max-value="100">
                            <label>kg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>浓度-K：</label>
                            <input type="text" name="dialysateConcentrationK"
                                   lay-verify="fieldNotInRange" data-field-name="透析液浓度-K" data-min-value="0"
                                   data-max-value="10000">
                            <label>mmol/L</label>
                        </div>

                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>浓度-Ca： </label>
                            <input type="text" name="dialysateConcentrationCa"
                                   lay-verify="fieldNotInRange" data-field-name="透析液浓度-Ca"
                                   data-min-value="0" data-max-value="10000">
                            <label>mmol/L</label>
                        </div>

                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>浓度-Na：</label>
                            <input type="text" name="dialysateConcentrationNa"
                                   lay-verify="fieldNotInRange" data-field-name="透析液浓度-Na"
                                   data-min-value="0" data-max-value="10000">
                            <label>mmol/L</label>
                        </div>

                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>浓度-HCO3：</label>
                            <input type="text" name="dialysateConcentrationHco3"
                                   lay-verify="fieldNotInRange" data-field-name="透析液浓度-HCO3"
                                   data-min-value="0" data-max-value="10000">
                            <label>mmol/L</label>
                        </div>
                    </div>
                </div>
                <#--备注 -->
                <div class="layui-row layui-col-space1">
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend>备注：</legend>
                    </fieldset>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex">
                            <div class="layui-input-block">
                                <textarea type="text" name="remarks" maxlength="5000" class="layui-textarea"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="text-align: center;margin-top: 10px;">
            <div class="layui-inline">
                <button class="layui-btn layui-btn-dissub" onclick="cancelBtn()">取消
                </button>
            </div>
        </div>
    </form>
</div>


<script type="text/javascript"
        src="${ctxsta}/static/js/patient/patDialysisSchemeEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>