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
        .layui-fluid {
            padding: 0px 10px !important;
        }
        .layui-card {
            margin-bottom: 10px;
        }
        .layui-elem-field{
            margin: 10px!important;
        }
        .layui-elem-field legend{
            font-size: 14px;
        }
        .layui-border-box{
            height: auto !important;
        }
        .layui-table-body{
            height: auto !important;
        }
        .layui-table-body .layui-none {
            padding: 5px;
        }
        .layui-tag-box{
            width: 100%;
            margin: 10px 5px;
        }
        .layui-tag {
            display: inline-block;
            height: 30px;
            line-height: 30px;
            margin: 0 5px 5px 0;
            padding: 0 5px;
            color: #33AB9F;
            white-space: nowrap;
            text-align: center;
            font-size: 14px;
            border: 1px solid #33AB9F;
            border-radius: 5px;
            margin-right: 5px;
        }
        .layui-elem-quote{
            background-color: #FFF;
            line-height: 15px;
            padding: 5px;
            border-left: 4px solid rgb(0, 150, 136);
        }
        .drop-item{
            display: flex;
            display: -webkit-flex;
            font-size: 14px;
            border-bottom: 1px solid #e6e6e6;
        }
        .drop-item .left-wrapper{
            display: flex;
            align-items: center;
            justify-content: center;
            width:30%;
        }
        .drop-item .left-wrapper > img {
            width: 70%;
            height: 70%;
            border-radius: 50%;
        }
        .drop-item .right-wrapper{
            width: 70%;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .drop-item .right-wrapper > div{
            width:100%;
            height: 50%;
            /*border:1px solid #ddd;*/
        }
        .drop-item .right-wrapper  .one-item{
            display: flex;
            flex: 1;
            align-items: center;
        }
        .drop-item .right-wrapper  .two-item{
            display: flex;
            align-items: center;
        }
        .layui-row .disui-form-flex>label{
            flex-basis: 120px;
        }
        .layui-form-radio {
            margin: 6px 8px 0 0;
            padding-right: 0;
        }
        .layui-form-radio > i {
            margin-right: 3px;
        }
        .layui-table-view {
            border: 1px solid #e6e6e6;
        }
        /*}*/
        /*#patFamilyMemberList_table + div {*/
        /*    width: calc(100% - 120px);*/
        /*}*/
    </style>
    <style media="print" type="text/css">
        .noprint
        {
            display:none;
        }
    </style>
</head>

<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="patPatientInfo">
<div class="layui-fluid" >
    <div class="layui-row layui-col-space10" >
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" id="rightCardId" >
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-form-item noprint"  style="padding: 10px;">
                        <button :visible="@baseFuncInfo.authorityTag('patPatientInfo#edit')"
                                class="layui-btn layui-btn-dismain" onclick="saveOrEdit(2)">编辑</button>
                        <button :visible="@baseFuncInfo.authorityTag('patPatientInfo#print')"
                                class="layui-btn layui-btn-dissub" onclick="onPrint()" >打印</button>
                    </div>
                    <div class="layui-form" lay-filter="patPatientInfo_form" id="patPatientInfo_form"  style="padding: 0 30px 10px 10px;">
                        <blockquote class="layui-elem-quote">基本信息</blockquote>
                        <hr class="layui-bg-green">
                        <fieldset class="layui-elem-field layui-field-title">
                            <legend>个人资料</legend>
                        </fieldset>
                        <div class="layui-form-item">
                            <div style="width: 75%;float: left">
                                <div class="layui-row layui-col-space1">
                                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                        <div class="disui-form-flex" >
                                            <label><span class="edit-verify-span">*</span>病历号：</label>
                                            <input type="text" readonly name="patientRecordNo" maxlength="10" lay-verify="required" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                        <div class="disui-form-flex" >
                                            <label><span class="edit-verify-span"></span>病历编号：</label>
                                            <input type="text" readonly name="patientFilesNo" maxlength="20" lay-verify="required" autocomplete="off" >
                                        </div>
                                    </div>
                                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                        <div class="disui-form-flex" >
                                            <label><span class="edit-verify-span">*</span>客户类型：</label>
                                            <select name="customerType" lay-verify="required" disabled>
                                                <option value=""></option>
                                                <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                         ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('CustomerType')"></option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                                <div class="layui-row layui-col-space1">
                                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                        <div class="disui-form-flex" >
                                            <label><span class="edit-verify-span">*</span>姓名：</label>
                                            <input type="text" readonly name="patientName" maxlength="255" lay-verify="required" autocomplete="off" >
                                        </div>
                                    </div>
                                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                        <div class="disui-form-flex" >
                                            <label style="flex-basis: 120px;text-align: right;"><span class="edit-verify-span">*</span>性别：</label>
                                            <input type="radio" disabled lay-verify="radio" lay-verify-msg="性别"  name="gender" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                                                   ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Sex')">
                                        </div>
                                    </div>
                                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                        <div class="disui-form-flex" >
                                            <label><span class="edit-verify-span">*</span>出生日期：</label>
                                            <input type="text" name="birthday" disabled lay-verify="required" id="birthday" placeholder="yyyy-MM-dd" autocomplete="off" >
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-row layui-col-space1">
                                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg8">
                                        <div class="disui-form-flex" >
                                            <label><span class="edit-verify-span">*</span>证件号码：</label>
                                            <input type="text" readonly name="idCardNo" maxlength="50" lay-verify="required" autocomplete="off" >
                                        </div>
                                    </div>
                                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                        <div class="disui-form-flex" >
                                            <label><span class="edit-verify-span">*</span>年龄：</label>
                                            <input type="text" readonly name="age" maxlength="50" lay-verify="required" autocomplete="off" >
                                            <label><span>岁</span></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="width: 25%;float: left">
                                <div class="layui-row layui-col-space1">
                                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                        <div class="disui-form-flex" >
                                            <#--<label style=" flex-basis: 50px;">照片：</label>-->
                                            <div style="width: 100%;text-align: center;">
                                                <img ms-attr="{'src': @patPatientInfo.patientPhoto}" onclick="previewImg()" onerror="this.src='${ctxsta}/static/images/u6399.png'" style="width: 100px;height: 100px;">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                                <div class="disui-form-flex" >
                                    <label><span class="edit-verify-span">*</span>医保类型：</label>
                                    <select disabled name="insuranceTypes" id="insuranceTypesId" lay-verify="required" xm-select="insuranceTypes" xm-select-search="" xm-select-search-type="dl" xm-select-height="36px" style="width: inherit;">
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('InsuranceType')"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                                <div class="disui-form-flex" >
                                    <label><span class="edit-verify-span">*</span>社保号：</label>
                                    <input type="text" readonly name="socialSecurityNo" maxlength="50" lay-verify="required" autocomplete="off" >
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label>民族：</label>
                                    <select name="ethnicity" lay-verify="required" disabled>
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Ethnicity')"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label>身高：</label>
                                    <input type="text" name="stature" readonly lay-verify="required"  autocomplete="off">
                                    <label>cm</label>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label>入院体重：</label>
                                    <input type="text" name="admissionWeight" readonly lay-verify="required" autocomplete="off">
                                    <label>kg</label>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label>婚姻状况：</label>
                                    <select name="maritalStatus" disabled lay-verify="required">
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('MaritalStatus')"></option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label>宗教：</label>
                                    <select name="religion" disabled lay-verify="required">
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Religion')"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label>教育程度：</label>
                                    <select name="educationLevel" lay-verify="required" disabled>
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('EducationLevel')"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label >职业：</label>
                                    <select name="occupation" lay-verify="required" disabled>
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Occupation')"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label>吸烟：</label>
                                    <select name="smokeStatus" lay-verify="required" disabled>
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('SmokeStatus')"></option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label>收入/年：</label>
                                    <select name="incomeStatus" disabled>
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('IncomeStatus')"></option>
                                    </select>
                                </div>

                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label>饮酒：</label>
                                    <select name="drinkStatus" disabled>
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DrinkStatus')"></option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <div class="disui-form-flex" >
                                    <label>特殊要求：</label>
                                    <textarea name="specialRequirements" readonly maxlength="100" rows="3"  ></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <div class="disui-form-flex" >
                                    <label style="flex-basis: 120px;text-align: right;">标签：</label>
                                    <div class="layui-tag-box">
                                        <div ms-for="($index, el) in @patPatientInfo.patPatientTagLists" class="layui-tag" ms-css="{border: '1px solid ' + @el.tagColor,color: @el.tagColor}">{{el.tagContent}}</div>

                                        <#--<span class="layui-tag"  ms-css="{borderColor: ' + el.tagColor + '}" ms-for="($index, el) in @patPatientInfo.patPatientTagLists">{{el.tagContent}}</span>-->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <fieldset class="layui-elem-field layui-field-title">
                            <legend>家庭住址及联系方式</legend>
                        </fieldset>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex" >
                                    <label><span class="edit-verify-span">*</span>个人手机：</label>
                                    <input type="text" name="mobilePhone" readonly maxlength="20" lay-verify="required|phone" autocomplete="off">
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label>固定电话：</label>
                                    <input type="text" name="fixedPhoneFront" readonly maxlength="20" lay-verify="required" autocomplete="off" >
                                    <label>-</label>
                                </div>
                            </div>
                            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                <div class="disui-form-flex">
                                    <input type="text" name="fixedPhoneLast" readonly maxlength="20" lay-verify="required" autocomplete="off" >
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <div class="disui-form-flex">
                                    <label>通信地址：</label>
                                    <input type="text" name="contactAddressComplete" readonly maxlength="200" lay-verify="required" autocomplete="off" >
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <div class="disui-form-flex">
                                    <label><span class="edit-verify-span"></span>家庭住址：</label>
                                    <input type="text" name="homeAddressComplete" readonly maxlength="200" lay-verify="required" autocomplete="off" >
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <div class="disui-form-flex">
                                    <label>家庭情况：</label>
                                    <!--table定义-->
                                    <div style="width: calc(100% - 120px);">
                                        <table id="patFamilyMemberList_table" lay-filter="patFamilyMemberList_table" style="height: auto;"></table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <blockquote class="layui-elem-quote">治疗信息</blockquote>
                        <hr class="layui-bg-green">
                        <fieldset class="layui-elem-field layui-field-title">
                            <legend>过去透析史</legend>
                        </fieldset>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <!--table定义-->
                                <table id="patPastDialysisList_table" lay-filter="patPastDialysisList_table" style="height: auto;"></table>
                            </div>
                        </div>

                        <fieldset class="layui-elem-field layui-field-title">
                            <legend>现在透析史</legend>
                        </fieldset>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label>透析类型：</label>
                                    <select name="dialysisType" disabled >
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DialysisType')"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label>首次接收日期：</label>
                                    <input type="text" name="firstReceptionDate" readonly lay-verify="required" id="firstReceptionDate" placeholder="yyyy-MM-dd" autocomplete="off" >
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label>首次透析日期：</label>
                                    <input type="text" name="firstDialysisDate" readonly lay-verify="required" id="firstDialysisDate" placeholder="yyyy-MM-dd" autocomplete="off" >
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label>透析次数：</label>
                                    <input type="text" name="dialysisTimes" readonly lay-verify="required" autocomplete="off" >
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label>透析年：</label>
                                    <input type="text" name="dialysisYear" readonly lay-verify="required" id="dialysisYear" autocomplete="off" >
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label><span class="edit-verify-span">*</span>透析总频次：</label>
                                    <select name="dialysisTotalFrequency" lay-verify="required" disabled>
                                        <option value=""></option>
                                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DialysisFrequency')"></option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <blockquote class="layui-elem-quote">感染状况</blockquote>
                        <hr class="layui-bg-green">
                        <div class="layui-row layui-col-space1">
                            <div class="layui-input-block" style="margin-left: 50px;">
                                <input type="checkbox" name="infectionStatusS" lay-filter="infectionStatus"  ms-attr="{value:el.value,title:el.name}"
                                       ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('InfectionMark')">
                            </div>
                        </div>

                        <blockquote class="layui-elem-quote">其他信息</blockquote>
                        <hr class="layui-bg-green">
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label><span class="edit-verify-span"></span>区名：</label>
                                    <input type="text" name="hospitalName" readonly lay-verify="required" autocomplete="off" >
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label ><span class="edit-verify-span"></span>初诊医生：</label>
                                    <input type="text" name="firstDiagnosisDoctor" readonly lay-verify="required" id="firstDiagnosisDoctor" autocomplete="off" >
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label ><span class="edit-verify-span"></span>主责护士：</label>
                                    <input type="text" name="principalNurse" readonly lay-verify="required" id="principalNurse" autocomplete="off" >
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label><span class="edit-verify-span"></span>本中心透析次数：</label>
                                    <input type="text" name="dialysisTimes" readonly lay-verify="required" id="dialysisTimes"  autocomplete="off" >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPatientInfo.js?t=${currentTimeMillis}"></script>
<!-- 自定义下拉菜单内容 -->
<script id="patPatientInfo" type="text/html">
    <div  id="leftpatPatientInfo">

    </div>
</script>
</body>
</html>
