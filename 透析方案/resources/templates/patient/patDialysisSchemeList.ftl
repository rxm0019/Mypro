<#include "../base/common.ftl">
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
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
        border-left: 4px solid rgba(118, 189, 187, 1);
    }

    .layui-bg-green {
        height: 3px;
        background-color: rgba(118, 189, 187, 1) !important;
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

    .layui-field-title-separate legend {
        background-color: white;
    }

    .layui-table-view {
        border: 1px solid #e6e6e6;
    }

    /* 干体重调整历史图表 */
    #patientDryWeightChart {
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        border: 1px solid #A9B1B8;
        position: absolute;
        top: 585px;
        right: 0px;
        padding: 10px 0;
        width: 70%;
        height: 300px;
        z-index: 99;
    }

    .layui-field-title {
        margin: 5px 0 0px;
        border-width: 1px 0 0;
    }

    .layui-card-body {
        margin-top: 10px;
    }
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="patDialysisSchemeList">
<div class="layui-fluid">
    <div class="layui-card" style="padding: 10px 30px 0 20px">
        <!--透析基础信息编辑-->
        <div class="layui-card-body">
            <div class="layui-row">
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <blockquote class="layui-elem-quote">
                        <label style="color: rgba(118, 189, 187, 1); font-weight: bold;"> 透析基础信息</label>
                    </blockquote>
                </div>
                <!-- 常规按钮 -->
                <div class="layui-col-sm8 layui-col-md8 layui-col-lg8">
                    <div ms-if="isShow==true">
                        <button :visible="@baseFuncInfo.authorityTag('patPatientInfoList#edit')"
                                class="layui-btn layui-btn-dismain" style="float: right; margin-bottom: 5px;"
                                onclick="update_info()">修改
                        </button>
                    </div>
                    <div style="float: right" id="patDialysisSchemeList_tool"
                         ms-if="isShow==false">
                        <button type="submit" lay-submit="" class="layui-btn layui-btn-dismain"
                                onclick="saveDialysisScheme_Info()">保存
                        </button>
                        <button class="layui-btn layui-btn-dissub" onclick="cancelScheme_Info()">取消
                        </button>
                    </div>
                </div>
                <hr class="layui-bg-green">
            </div>
            <!-- 透析基础信息表单 -->
            <div class="layui-form" action="" name="patDialysisScheme_Info_form"
                 lay-filter="patDialysisScheme_Info_form" id="patDialysisScheme_Info_form">
                <div class="layui-row">
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 layui-hide">
                        <div class="disui-form-flex">
                            <label>ID</label>
                            <input type="text" name="patientId" maxlength="35" lay-verify="required" placeholder="请输入">
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex">
                            <label><span class="edit-verify-span">*</span>透析总频次：</label>
                            <select name="dialysisTotalFrequency" lay-verify="fieldRequired"
                                    data-field-name="透析方式" :attr="{disabled: @baseInfoReadOnly}">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DialysisFrequency')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex">
                            <label><img id="iconDryWeightChart" src="/web/static/images/dryweight.png"><span
                                        class="edit-verify-span">*</span>干体重：</label>
                            <input type="text" name="dryWeight" :attr="{readonly: @baseInfoReadOnly}"
                                   lay-verify="fieldRequired|fieldNotInRange"
                                   data-field-name="干体重" data-min-value="0" data-max-value="200">
                            <label>kg</label>
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex">
                            <label>附加体重：</label>
                            <input type="text" name="additionalWeight" :attr="{readonly: @baseInfoReadOnly}"
                                   lay-verify="fieldNotInRange"
                                   data-field-name="附加体重" data-min-value="0" data-max-value="200">
                            <label>kg</label>
                        </div>
                    </div>
                    <div class="layui-form-item layui-hide">
                        <a class="layui-btn" lay-submit lay-filter="patDialysisScheme_Info_submit"
                           id="patDialysisScheme_Info_submit">提交</a>
                    </div>
                </div>
            </div>
        </div>
        <!--透析处方信息编辑-->
        <div class="layui-card-body">
            <div class="layui-row">
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <blockquote class="layui-elem-quote">
                        <label style="color: rgba(118, 189, 187, 1); font-weight: bold;">透析处方</label>
                    </blockquote>
                </div>
                <div class="layui-col-sm8 layui-col-md8 layui-col-lg8" style="text-align: right">
                    <button lay-submit="" class="layui-btn layui-btn-dismain"
                            lay-filter="templateManage_Info" onclick="templateManage()">模板管理
                    </button>
                </div>
                <hr class="layui-bg-green">
            </div>
            <!--table定义-->
            <table id="patDialysisSchemeList_table" lay-filter="patDialysisSchemeList_table">
            </table>
            <script type="text/html" id="patDialysisSchemeList_bar">
                {{# if(baseFuncInfo.authorityTag('patDialysisSchemeList#enable')){ }}
                {{# if(d.dataStatus === '1') { }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="enable">启用</a>
                {{# } else { }}
                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="enable">停用</a>
                {{# } }}
                {{# } }}
            </script>
            <!--虚线定义-->
            <fieldset class="layui-elem-field layui-field-title layui-field-title-separate">
                <legend>选中上方数据行切换透析处方</legend>
            </fieldset>


            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div class="layui-row">
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <button :visible="@baseFuncInfo.authorityTag('patDialysisSchemeList#add')"
                            class="layui-btn layui-btn-dismain" id="addSchemeEditOrEdit"
                            onclick="addSchemeEditOrEdit()">添加
                    </button>
                    <button :visible="@baseFuncInfo.authorityTag('patDialysisSchemeList#edit')"
                            class="layui-btn layui-btn-dismain"
                            onclick="updateSchemeEditOrEdit()">修改
                    </button>
                    <button :visible="@baseFuncInfo.authorityTag('patDialysisSchemeList#delete')"
                            class="layui-btn layui-btn-dissub"
                            onclick="del()">删除
                    </button>
                </div>
                <div class="layui-col-sm8 layui-col-md8 layui-col-lg8" ms-if="!isShowScheme" style="text-align: right">
                    <button :visible="@baseFuncInfo.authorityTag('patDialysisSchemeList#export')"
                            type="button" class="layui-btn layui-btn-dismain"
                            onclick="templateImport()">从模板导入
                    </button>
                    <button type="submit" lay-submit="" class="layui-btn layui-btn-dismain"
                            lay-filter="updatePatDialysisSchemeEdit_form">保存
                    </button>
                    <button class="layui-btn layui-btn-dissub" onclick="cancelSchemeEdit_form()">
                        取消
                    </button>
                </div>
            </div>


            <div class="layui-form" lay-filter="patDialysisSchemeEdit_form" id="patDialysisSchemeEdit_form">
                <div style="">
                    <div style="margin: 10px 0px; padding: 10px;border: 1px solid #CCCCCC; border-radius: 10px;">
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label><span class="edit-verify-span">*</span>透析方式：</label>
                                    <select name="dialysisMode" id="dialysisMode" :attr="{disabled: @formReadOnly}"
                                            lay-verify="fieldRequired"
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
                                    <select name="dialysisFrequency" :attr="{disabled: @formReadOnly}"
                                            lay-verify="fieldRequired" data-field-name="透析频次">
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
                                           data-field-name="制定时间" :attr="{disabled: @formReadOnly}"
                                           placeholder="yyyy-MM-dd">
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label><span class="edit-verify-span">*</span>制定人：</label>
                                    <select name="schemeUserId" id="schemeUserId" :attr="{disabled: @formReadOnly}"
                                            lay-verify="fieldRequired"
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
                                    <select name="dialyzer" id="dialyzer" :attr="{disabled: @formReadOnly}">
                                        <option value=""></option>
                                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Dialyzer')"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="irrigatorShow">
                                <div class="disui-form-flex">
                                    <label>灌流器：</label>
                                    <select name="irrigator" id="irrigator" :attr="{disabled: @formReadOnly}">
                                        <option value=""></option>
                                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Irrigator')"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="hemofilterShow">
                                <div class="disui-form-flex">
                                    <label>血凝器：</label>
                                    <select name="filter" id="filter" :attr="{disabled: @formReadOnly}">
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
                                    <input type="text" name="dialysisTime" autocomplete="off"
                                           :attr="{readonly: @formReadOnly}"
                                           lay-verify="fieldNotInRange" data-field-name="时" data-min-value="0"
                                           data-max-value="24" data-integer="true">
                                    <span style="display: inline-block;vertical-align: middle;padding-top: 8px">时</span>
                                    <input type="text" name="dialysisTimeMinute" autocomplete="off"
                                           :attr="{readonly: @formReadOnly}"
                                           lay-verify="fieldNotInRange" data-field-name="分" data-min-value="0"
                                           data-max-value="60" data-integer="true">
                                    <label>分</label>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label>血流量：</label>
                                    <input type="text" name="bloodFlow" :attr="{readonly: @formReadOnly}"
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
                                           :attr="{readonly: @formReadOnly}"
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
                                    <select name="anticoagulant" lay-filter="anticoagulant" lay-verify="fieldRequired"
                                            data-field-name="抗凝剂" :attr="{disabled: @formReadOnly}">
                                        <option value=""></option>
                                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Anticoagulant')"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label>首推剂量：</label>
                                    <input type="text" name="dosageFirstValue" :attr="{readonly: @formReadOnly}"
                                           lay-verify="fieldNotInRange" data-field-name="抗凝剂首剂数量" data-min-value="0"
                                           data-max-value="10000">
                                    <select name="dosageFirstUnit" lay-filter="dosageFirstUnit"
                                            :attr="{disabled: @formReadOnly}">
                                        <option value=""></option>
                                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('AnticoagulantUnit')"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                <div class="disui-form-flex">
                                    <label>追加：</label>
                                    <select name="dosageAdd" :attr="{disabled: @formReadOnly}"
                                            lay-filter="anticoagulant">
                                        <option value=""></option>
                                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Anticoagulant')"></option>
                                    </select>
                                    <input type="text" name="dosageAddValue" :attr="{readonly: @formReadOnly}"
                                           lay-verify="fieldNotInRange" data-field-name="抗凝剂追加数量" data-min-value="0"
                                           data-max-value="10000">
                                    <label><span>{{addUnit}}</span>/h</label>
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
                                        <select name="substituteMode" id="substituteMode"
                                                :attr="{disabled: @formReadOnly}">
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
                                               :attr="{readonly: @formReadOnly}"
                                               lay-verify="fieldNotInRange" data-field-name="置换液总量" data-min-value="0"
                                               data-max-value="100">
                                        <label>L</label>
                                    </div>

                                </div>
                                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                    <div class="disui-form-flex">
                                        <label>置换液流速：</label>
                                        <input type="text" name="replacementFluidFlowRate" id="replacementFluidFlowRate"
                                               :attr="{readonly: @formReadOnly}"
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
                                        <input type="text" name="replacementFluidFlow" :attr="{readonly: @formReadOnly}"
                                               lay-verify="fieldNotInRange" data-field-name="透析液流量" data-min-value="0"
                                               data-max-value="10000" data-integer="true">
                                        <label>ml/min</label>
                                    </div>

                                </div>
                                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                    <div class="disui-form-flex">
                                        <label>温度：</label>
                                        <input type="text" name="dialysateTemperature" :attr="{readonly: @formReadOnly}"
                                               lay-verify="fieldNotInRange" data-field-name="透析液温度" data-min-value="35"
                                               data-max-value="42">
                                        <label>℃</label>
                                    </div>
                                </div>
                                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                    <div class="disui-form-flex">
                                        <label>处方钠：</label>
                                        <input type="text" name="dialysatePrescribeSodium"
                                               :attr="{readonly: @formReadOnly}"
                                               lay-verify="fieldNotInRange" data-field-name="处方钠" data-min-value="0"
                                               data-max-value="10000">
                                        <label>mmol/L</label>
                                    </div>
                                </div>
                                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                                    <div class="disui-form-flex">
                                        <label>处方脱水量：</label>
                                        <input type="text" name="parameterDehydration" lay-verify="fieldNotInRange"
                                               :attr="{readonly: @formReadOnly}"
                                               data-field-name="处方脱水量" data-min-value="0" data-max-value="10000">
                                        <label>L</label>
                                    </div>
                                </div>
                                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                                    <div class="disui-form-flex">
                                        <label>回血量：</label>
                                        <input type="text" name="bloodReturning" lay-verify="fieldNotInRange"
                                               :attr="{readonly: @formReadOnly}"
                                               data-field-name="回血量" data-min-value="0" data-max-value="100">
                                        <label>kg</label>
                                    </div>
                                </div>
                                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                    <div class="disui-form-flex">
                                        <label>浓度-K：</label>
                                        <input type="text" name="dialysateConcentrationK"
                                               :attr="{readonly: @formReadOnly}"
                                               lay-verify="fieldNotInRange" data-field-name="透析液浓度-K" data-min-value="0"
                                               data-max-value="10000">
                                        <label>mmol/L</label>
                                    </div>

                                </div>
                                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                    <div class="disui-form-flex">
                                        <label>浓度-Ca： </label>
                                        <input type="text" name="dialysateConcentrationCa"
                                               :attr="{readonly: @formReadOnly}"
                                               lay-verify="fieldNotInRange" data-field-name="透析液浓度-Ca"
                                               data-min-value="0" data-max-value="10000">
                                        <label>mmol/L</label>
                                    </div>

                                </div>
                                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                    <div class="disui-form-flex">
                                        <label>浓度-Na：</label>
                                        <input type="text" name="dialysateConcentrationNa"
                                               :attr="{readonly: @formReadOnly}"
                                               lay-verify="fieldNotInRange" data-field-name="透析液浓度-Na"
                                               data-min-value="0" data-max-value="10000">
                                        <label>mmol/L</label>
                                    </div>

                                </div>
                                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                    <div class="disui-form-flex">
                                        <label>浓度-HCO3：</label>
                                        <input type="text" name="dialysateConcentrationHco3"
                                               :attr="{readonly: @formReadOnly}"
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
                                        <textarea class="layui-textarea" name="remarks" maxlength="5000"
                                                  :attr="{readonly: @formReadOnly}"></textarea>
                                    </div>
                                </div>
                            </div>

                            <#--干体重调整历史图表-->
                            <div id="patientDryWeightChart" class="layui-card layui-hide"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/lib/echarts/4.3.0/echarts.min.js"></script>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/patient/patDialysisSchemeList.js?t=${currentTimeMillis}"></script>
</body>
</html>