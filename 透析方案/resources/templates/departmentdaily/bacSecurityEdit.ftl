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
        .layui-row .disui-form-flex > label {
            display: inline-block;
            flex: 0 0 140px;
            line-height: 38px;
            text-align: right;
        }

        .measureOne {
            flex: 0 0 450px !important;
        }

        .measureTwo {
            flex: 0 0 590px !important;
        }

        .measureThree {
            flex: 0 0 888px !important;
        }

        .measureFour {
            flex: 0 0 330px !important;
        }

        .symptomDescribe {
            flex: 0 0 200px !important;
        }

        .layui-elem-field legend {
            font-size: 14px;
        }

        .printTable {
            background-color: transparent;
            border: 0;
            width: 120px;
        }

        .xm-select-label {
            width: 160px;
            white-space: nowrap;
            text-overflow: clip;
            overflow: auto;
        }
    </style>
</head>
<body ms-controller="bacSecurityEdit">
<div class="layui-form" lay-filter="bacSecurityEdit_form" id="bacSecurityEdit_form" style="padding: 20px 30px 0 0;">
    <div id="editForm">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label>ID：</label>
                <input type="hidden" name="securityId" :attr="@readonly">
            </div>
            <fieldset class="layui-elem-field layui-field-title">
                <legend>基本情况</legend>
            </fieldset>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>发生日期：</label>
                    <input type="text" name="occurDate" id="occurDate" placeholder="yyyy-MM-dd" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>姓名：</label>
                    <select name="employeeName" xm-select="employeeName" xm-select-search="" xm-select-radio="">
                        <option value=""></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>年龄：</label>
                    <input type="text" name="employeeAge" :attr="@readonly" maxlength="3">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>性别：</label>
                    <input type="radio" name="employeeSex"
                           ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Sex')">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>职业：</label>
                    <select name="employeeJob" lay-filter="employeeJob">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @employeeJob"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" style="display: none" id="otherJob">
                <div class="disui-form-flex">
                    <label>其他职业：</label>
                    <input type="text" name="otherJob" maxlength="50" :attr="@readonly" id="otherJobs">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>工龄：</label>
                    <input type="text" name="workingYears" :attr="@readonly" maxlength="3">
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend>职业暴露情况</legend>
                </fieldset>
                <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                    <div class="disui-form-flex">
                        <label class="layui-form-label">既往职业暴露次数：</label>
                        <input type="text" name="exposureCount" maxlength="2" :attr="@readonly">
                    </div>
                </div>
                <div class="layui-col-sm5 layui-col-md5 layui-col-lg5">
                    <div class="disui-form-flex">
                        <label>暴露类型：</label>
                        <select name="exposureType">
                            <option value=""></option>
                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                    ms-for="($index, el) in @exposureType"></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm5 layui-col-md5 layui-col-5">
                    <div class="disui-form-flex">
                        <label>暴露量：</label>
                        <select name="exposureQuantity">
                            <option value=""></option>
                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                    ms-for="($index, el) in @exposureQuantity"></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>发生状况：</label>
                        <select name="occurState" lay-filter="occurState">
                            <option value=""></option>
                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                    ms-for="($index, el) in @occurState"></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="otherState" style="display: none">
                    <div class="disui-form-flex">
                        <label>其他发生状况：</label>
                        <input type="text" name="otherState" maxlength="50" :attr="@readonly" id="otherStates">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>暴露器材：</label>
                        <select name="equipment" lay-filter="equipment">
                            <option value=""></option>
                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                    ms-for="($index, el) in @equipment"></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="otherEquipment" style="display: none">
                    <div class="disui-form-flex">
                        <label>其他暴露器材：</label>
                        <input type="text" name="otherEquipment" maxlength="50" :attr="@readonly" id="otherEquipments">
                    </div>
                </div>

                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>暴露持续时间：</label>
                        <select name="duration">
                            <option value=""></option>
                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                    ms-for="($index, el) in @duration"></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>带乳胶手套：</label>
                        <input type="radio" name="glove"
                               ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('YesOrNo')">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>岗前培训：</label>
                        <input type="radio" name="preTrain"
                               ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('YesOrNo')">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>暴露部位：</label>
                        <select name="parts" lay-filter="parts">
                            <option value=""></option>
                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                    ms-for="($index, el) in @equipment"></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="otherParts" style="display: none">
                    <div class="disui-form-flex">
                        <label>其他部位：</label>
                        <input type="text" name="otherParts" maxlength="50" :attr="@readonly" id="otherPartss">
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend>暴露源情况</legend>
                </fieldset>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>患者姓名：</label>
                        <select name="sickName" xm-select="sickName" xm-select-search="" xm-select-radio="">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>患者性别：</label>
                        <input type="radio" name="sickSex"
                               ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Sex')">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>患者年龄：</label>
                        <input type="text" name="sickAge" :attr="@readonly">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>诊断：</label>
                        <input type="text" name="diagnosis" maxlength="50" :attr="@readonly">
                    </div>
                </div>
                <#-- Fix bug #664 隐藏此字段。 begin-->
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                    <div class="disui-form-flex">
                        <label>甲肝表面抗原：</label>
                        <input type="text" name="hepatitisA" maxlength="50" :attr="@readonly">
                    </div>
                </div>
                <#-- Fix bug #664 隐藏此字段。 end-->

                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>乙肝表面抗原：</label>
                        <#-- <input type="text" name="hepatitisB" maxlength="50" :attr="@readonly">-->
                        <select name="hepatitisB" lay-filter="hepatitisB">
                            <option value=""></option>
                            <option ms-attr="{value:el.name}" ms-text="@el.name"
                                    ms-for="($index, el) in @detectionResult "></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>HCV：</label>
                        <#-- <input type="text" name="hcv" maxlength="50" :attr="@readonly">-->
                        <select name="hcv" lay-filter="hcv">
                            <option value=""></option>
                            <option ms-attr="{value:el.name}" ms-text="@el.name"
                                    ms-for="($index, el) in @detectionResult "></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>HIV：</label>
                        <#-- <input type="text" name="hiv" maxlength="50" :attr="@readonly">-->
                        <select name="hiv" lay-filter="hiv">
                            <option value=""></option>
                            <option ms-attr="{value:el.name}" ms-text="@el.name"
                                    ms-for="($index, el) in @detectionResult "></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>梅毒：</label>
                        <#-- <input type="text" name="syphilis" maxlength="50" :attr="@readonly">-->
                        <select name="syphilis" lay-filter="syphilis">
                            <option value=""></option>
                            <option ms-attr="{value:el.name}" ms-text="@el.name"
                                    ms-for="($index, el) in @detectionResult "></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend>暴露后紧急处理措施</legend>
                </fieldset>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <label class="measureOne">1、用肥皂液和流动水清洗污染的皮肤用生理盐水冲洗黏膜：</label>
                        <input type="radio" name="measuresOne"
                               ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('YesOrNo')">
                    </div>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <label class="measureTwo">2、在伤口旁端轻挤压，尽可能挤出损伤处的血液，再用肥皂水或流动水进行冲洗：</label>
                        <input type="radio" name="measuresTwo"
                               ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('YesOrNo')">
                    </div>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <label class="measureThree">3、受伤部位的伤口冲洗后，用（75%乙醇或0.5%碘伏）消毒液进行消毒，并包扎伤口；被暴露的黏膜，反复用生理盐水冲洗干净：</label>
                        <input type="radio" name="measureThree"
                               ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('YesOrNo')">
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend>暴露后预防性治疗方案或处理措施</legend>
                </fieldset>
                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                    <div class="disui-form-flex">
                        <label class="symptomDescribe">预防用药类型及计量：</label>
                        <select name="prophylactic" lay-filter="prophylactic">
                            <option value=""></option>
                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                    ms-for="($index, el) in @prophylactic"></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="otherProphylactic" style="display: none">
                    <div class="disui-form-flex">
                        <label>其他预防用药：</label>
                        <input type="text" name="otherProphylactic" maxlength="50" :attr="@readonly"
                               id="otherProphylactics">
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend>症状</legend>
                </fieldset>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <label class="measureFour">暴露后四周内是否出现急性传染病感染症状：</label>
                        <input type="radio" name="measuresThree"
                               ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('YesOrNo')">
                    </div>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <label class="symptomDescribe">症状及持续时间简要描述：</label>
                        <textarea id="symptomDescribe" lay-verify="symptomDescribe" name="symptomDescribe"
                                  :attr="@readonly" maxlength="200"></textarea>
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend>传染性疾病（HBV、HCV、HIV、梅毒等）检查追踪结果</legend>
                </fieldset>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>暴露后立即：</label>
                        <input type="text" name="resultNow" maxlength="50" :attr="@readonly">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>1个月后：</label>

                        <input type="text" name="resultOne" maxlength="50" :attr="@readonly">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>3个月后：</label>

                        <input type="text" name="resultThree" maxlength="50" :attr="@readonly">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>6个月后：</label>

                        <input type="text" name="resultSix" maxlength="50" :attr="@readonly">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>12个月后：</label>
                        <input type="text" name="resultTwelve" maxlength="50" :attr="@readonly">
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend>结论</legend>
                </fieldset>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>暴露后：</label>
                        <select name="finalResult">
                            <option value=""></option>
                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                    ms-for="($index, el) in @finalResult"></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>填表人：</label>
                        <input type="text" name="writeUser" maxlength="10"
                               ms-duplex="@baseFuncInfo.userInfoData.username" :attr="@readonly">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>中心负责人：</label>
                        <#--  <input type="text" name="centerUser" maxlength="10" :attr="@readonly">-->

                        <select name="centerUser" xm-select="centerUser" xm-select-search="" xm-select-radio="">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>报告日期：</label>
                        <input type="text" name="reportDate" id="reportDate" placeholder="yyyy-MM-dd"
                               :attr="@readonly">
                    </div>
                </div>
                <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                <div class="layui-form-item layui-hide">
                    <button class="layui-btn" lay-submit lay-filter="bacSecurityEdit_submit"
                            id="bacSecurityEdit_submit">提交
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div id="print" style="display: none">
        <table border="1" class="layui-table">
            <h1 align="center">医务人员职业暴露报告卡</h1>
            <tr>
                <th colspan="8"><h2 align="center">一、基本情况</h2></th>
            </tr>
            <tr>
                <td>姓名</td>
                <td>
                    <input class="printTable" ms-duplex="@bacSecurityData.employeeName">
                </td>
                <td>性别</td>
                <td><input class="printTable" ms-duplex="@bacSecurityData.employeeSex"></td>
                <td>职业</td>
                <td colspan="3">
                    <input class="printTable" ms-duplex="@bacSecurityData.employeeJob">
                </td>
            </tr>

            <tr>
                <td>年龄</td>
                <td><input class="printTable" ms-duplex="@bacSecurityData.employeeAge"></td>
                <td>工龄</td>
                <td><input class="printTable" ms-duplex="@bacSecurityData.workingYears"></td>
                <td>发生日期</td>
                <td colspan="3"><input class="printTable" ms-duplex="@bacSecurityData.occurDate"></td>
            </tr>
            <tr>
                <th colspan="8"> 职业暴露情况描述：<br/>
                    1、既往职业暴露次数：（
                    <input class="printTable" ms-duplex="@bacSecurityData.exposureCount" style="width:30px !important;">
                    ）<br/>
                    2、发生状况：（
                    <input class="printTable" ms-duplex="@bacSecurityData.occurState" style="width:30px !important;">
                    ） ①肌注&nbsp; ②静注&nbsp; ③穿刺&nbsp; ④拔针&nbsp; ⑤洗消&nbsp; ⑥采集处理标本&nbsp; ⑦收集锐器&nbsp;
                    <br/>
                    ⑧其他（
                    <input :if="@bacSecurityData.otherState == ''?false:true" class="printTable"
                           style="width:70% !important;" ms-duplex="@bacSecurityData.otherState">
                    ）
                    <br/>
                    3、暴露器材：（
                    <input class="printTable" ms-duplex="@bacSecurityData.equipment" style="width:30px !important;">
                    ） ①穿刺针&nbsp; ②注射器针头&nbsp;<br/>
                    ③其他（
                    <input :if="@bacSecurityData.otherEquipment == ''?false:true" class="printTable"
                           style="width:70% !important;" ms-duplex="@bacSecurityData.otherEquipment">）
                    <br/>
                    4、暴露部位：（
                    <input class="printTable" ms-duplex="@bacSecurityData.parts" style="width:30px !important;">
                    ） ①穿刺针&nbsp; ②注射器针头&nbsp; <br/>
                    ③其他（ <input :if="@bacSecurityData.otherParts == ''?false:true" class="printTable"
                                style="width:70% !important;" ms-duplex="@bacSecurityData.otherParts">）<br/>
                    5、暴露类型：（
                    <input class="printTable" ms-duplex="@bacSecurityData.exposureType" style="width:30px !important;">
                    ） ①皮肤黏膜完整&nbsp; ②原有皮肤黏膜损伤&nbsp; ③皮肤黏膜受轻度损伤&nbsp; ④皮肤黏膜受深部损伤<br/>
                    6、暴 露&nbsp; 量：（
                    <input class="printTable" ms-duplex="@bacSecurityData.exposureQuantity"
                           style="width:30px !important;">
                    ）①小（暴露源体液、血液 ≤ 5ml ）&nbsp; ②大（暴露源体液、血液 ≥ 5ml ）<br/>
                    7、暴露持续时间：（
                    <input class="printTable" ms-duplex="@bacSecurityData.duration" style="width:30px !important;">
                    ）① ≤ 10分钟&nbsp; ②10-30 分钟 ③≥ 30分钟<br/>
                    8、带乳胶手套：（
                    <input class="printTable" ms-duplex="@bacSecurityData.glove" style="width:30px !important;">
                    ） ① 是&nbsp;&nbsp; ② 否<br/>
                    9、岗前培训：（
                    <input class="printTable" ms-duplex="@bacSecurityData.preTrain" style="width:30px !important;">
                    ）① 是&nbsp;&nbsp; ② 否<br/>
                </th>
            </tr>
            <tr>
                <th colspan="8"><h2 align="center">二、暴露源情况</h2></th>
            </tr>
            <tr>
                <td>暴露者姓名</td>
                <td>
                    <input class="printTable" ms-duplex="@bacSecurityData.sickName" style="width:100px !important;">
                </td>
                <td>性别</td>
                <td>
                    <input class="printTable" ms-duplex="@bacSecurityData.sickSex" style="width:30px !important;">
                </td>
                <td>年龄</td>
                <td>
                    <input class="printTable" ms-duplex="@bacSecurityData.sickAge" style="width:30px !important;">
                </td>
                <td>诊断</td>
                <td>
                    <input class="printTable" ms-duplex="@bacSecurityData.diagnosis" style="width:30px !important;">
                </td>
            </tr>
            <tr>
                <td rowspan="2">血清检查情况</td>
<#--                <td colspan="2">甲肝表面抗原</td>-->
                <td colspan="2">乙肝表面抗原</td>
                <td>HCV</td>
                <td colspan="2">HIV</td>
                <td colspan="2">梅毒</td>
            </tr>
            <tr>
<#--                <td colspan="2">-->
<#--                    <input class="printTable" ms-duplex="@bacSecurityData.hepatitisA">-->
<#--                </td>-->
                <td colspan="2">
                    <input class="printTable" ms-duplex="@bacSecurityData.hepatitisB">
                </td>
                <td>
                    <input class="printTable" ms-duplex="@bacSecurityData.hcv" style="width:30px !important;">
                </td>
                <td colspan="2">
                    <input class="printTable"  ms-duplex="@bacSecurityData.hiv" style="width:30px !important;">
                </td>
                <td colspan="2">
                    <input class="printTable"  ms-duplex="@bacSecurityData.syphilis" style="width:30px !important;">
                </td>
            </tr>
            <tr>
                <th colspan="8"><h2 align="center">三、暴露后紧急处理措施</h2></th>
            </tr>
            <tr>
                <th colspan="8">
                    1、用肥皂液和流动水清洗污染的皮肤用生理盐水冲洗黏膜：（
                    <input class="printTable" ms-duplex="@bacSecurityData.measuresOne" style="width:30px !important;">
                    ）① 是&nbsp;&nbsp; ② 否 <br/>
                    2、在伤口旁端轻挤压，尽可能挤出损伤处的血液，再用肥皂水喝流动水进行冲洗：（
                    <input class="printTable" ms-duplex="@bacSecurityData.measuresTwo" style="width:30px !important;">
                    ）① 是&nbsp;&nbsp; ② 否<br/>
                    3、受伤部位的伤口冲洗后，用（75%乙醇或0.5%碘伏）消毒液进行消毒，并包扎伤口；被暴露的黏膜，反复用生理盐水冲洗干净：（
                    <input class="printTable" ms-duplex="@bacSecurityData.measuresThree" style="width:30px !important;">
                    ）① 是&nbsp;&nbsp; ② 否<br/>

                </th>
            </tr>
            <tr>
                <th colspan="8"><h2 align="center">四、暴露后预防性治疗方案或处理措施</h2></th>
            </tr>
            <tr>
                <th colspan="8">
                    1、预防用药类型及剂量：（
                    <input class="printTable" ms-duplex="@bacSecurityData.prophylactic" style="width:30px !important;">
                    ）<br/>
                    ①立即肌注乙肝疫苗&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; ②立即肌注乙肝免疫球蛋白&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp;&nbsp;
                    ③口服双态芝&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ④口服茚地那韦&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    ⑤立即静注人免疫球蛋白<br/>
                    ⑥其他（ <input :if="@bacSecurityData.otherProphylactic == ''?false:true" class="printTable"
                                style="width: 70% !important;" ms-duplex="@bacSecurityData.otherProphylactic">
                    ）<br/>
                </th>
            </tr>
            <tr>
                <th colspan="8"><h2 align="center">五、症状</h2></th>
            </tr>
            <tr>
                <th colspan="8">
                    1、暴露后4周内是否出现急性传染病感染症状：（
                    <input class="printTable" ms-duplex="@bacSecurityData.symptom" style="width:30px !important;">
                    ）① 是&nbsp;&nbsp; ② 否<br/>
                    2、症状及持续时间简要描述：
                    <textarea class="printTable" ms-duplex="@bacSecurityData.symptomDescribe"
                              style="width:100% !important; "></textarea>
                </th>
            </tr>
            <tr>
                <th colspan="8"><h2 align="center">六、感染性疾病（HBV、HCV、HIV、梅毒等）检查追踪结果</h2></th>
            </tr>
            <tr>
                <th>暴露后立即：</th>
                <th colspan="7">
                    <input class="printTable" ms-duplex="@bacSecurityData.resultNow" style="width:100% !important;">
                </th>
            </tr>
            <tr>
                <th>1个月后：</th>
                <th colspan="3">
                    <input class="printTable" ms-duplex="@bacSecurityData.resultOne" style="width:100% !important;">
                </th>
                <th>3个月后：</th>
                <th colspan="3">
                    <input class="printTable" ms-duplex="@bacSecurityData.resultThree" style="width:100% !important;">
                </th>
            </tr>
            <tr>
                <th>6个月后：</th>
                <th colspan="3">
                    <input class="printTable" ms-duplex="@bacSecurityData.resultSix" style="width:100% !important;">
                </th>
                <th>12个月后：</th>
                <th colspan="3">
                    <input class="printTable" ms-duplex="@bacSecurityData.resultTwelve" style="width:100% !important;">
                </th>
            </tr>
            <tr>
                <th colspan="8"><h2 align="center">七、结论</h2></th>
            </tr>
            <th colspan="8">
                暴露后：（
                <input class="printTable" ms-duplex="@bacSecurityData.finalResult" style="width:30px !important;">
                ）① 感染病毒&nbsp;&nbsp; ② 未感染病毒<br/>
            </th>
        </table>
        <p>
            <span>报告日期：
             <input class="printTable" ms-duplex="@bacSecurityData.reportDate" style=" width:130px !important;">
            </span>
            <span>中心负责人：
                  <input ms-duplex="@bacSecurityData.centerUser" class="printTable" style=" width:60px !important;">
            </span>
            <span>填表人：
              <input ms-duplex="@bacSecurityData.writeUser" class="printTable" style=" width:60px !important;">
            </span>
        </p>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/departmentdaily/bacSecurityEdit.js?t=${currentTimeMillis}"></script>
</body>

</html>