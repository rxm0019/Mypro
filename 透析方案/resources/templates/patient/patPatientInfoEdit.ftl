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
        .layui-elem-field legend{
            font-size: 14px;
        }
        .layui-elem-quote{
            background-color: #FFF;
            line-height: 15px;
            padding: 5px;
            border-left: 4px solid rgb(0, 150, 136);
        }
        .input-class{
            width: 130px !important;
        }
        .select-area{
            width: 100px !important;
        }
        .span-class{
            float: left;
            line-height: 38px;
            margin-left: 5px;
        }
        .area-text{
            width: auto !important;
            line-height: 38px
        }
        /* 防止下拉框的下拉列表被隐藏---必须设置--- */
        .layui-table-cell {
            overflow: visible !important;
        }
        /* 使得下拉框与单元格刚好合适 */
        td .layui-form-select{
            margin-left: -15px;
            margin-right: -15px;
        }
        .layui-tag {
            display: inline-block;
            width: 75px;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            color: #000000;
            white-space: nowrap;
            text-align: center;
            font-size: 14px;
            border: 1px solid rgba(171, 160, 148, 0.37);
            border-radius: 2px;
            margin: 0 5px 5px 0;
            cursor: pointer;
        }
        .layui-form-radio {
            margin: 6px 8px 0 0;
            padding-right: 0;
        }
        .layui-form-radio > i {
            margin-right: 3px;
        }
        .layui-row .disui-form-flex>label{
            flex-basis: 140px;
        }
        .dropdown-root{
            left: 142px;
            right: 30px;
        }
        .dropdown-pointer{
            display: none;
        }
        .dropdown-content{
            border: 1px solid #d2d2d2;
            border-radius: 2px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
        }

        .layui-upload-img {
            width: 80px;
            height: 80px;
        }
        .uploadImg {
            height: 80px;
            width: 80px;
            background-color: #ffffff;
            border: 2px solid #e6e6e6;
            color: #e6e6e6;
            vertical-align: middle;
            cursor: pointer;
        }
        .uploadImg i {
            font-size: 30px;
        }
        .layui-upload-item.with-img {
            width: 100px;
            height: 100px;
            margin: 0!important;
        }
        .layui-table-view {
            border: 1px solid #e6e6e6;
        }
    </style>
</head>

<body ms-controller="patPatientInfoEdit">
<div class="layui-card-body" style="padding: 10px;">
    <div class="layui-form" lay-filter="patPatientInfoEdit_form" id="patPatientInfoEdit_form" style="padding: 0 30px 0 0;">
        <div class="layui-row layui-col-space1  layui-hide">
            <label >ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="patientId" autocomplete="off" >
            </div>
        </div>
        <blockquote class="layui-elem-quote">基本信息</blockquote>
        <hr class="layui-bg-green">
        <fieldset class="layui-elem-field layui-field-title">
            <legend>个人资料</legend>
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex" >
                            <label><span class="edit-verify-span">*</span>病历号：</label>
                            <input type="text" readonly name="patientRecordNo" id = "patientRecordNo" maxlength="10" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex" >
                            <label>病历编号：</label>
                            <input type="text" name="patientFilesNo" maxlength="20" autocomplete="off" lay-verify="confirmPatientFilesNo">
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex" >
                            <label><span class="edit-verify-span">*</span>客户类型：</label>
                            <select name="customerType" lay-verify="required" lay-reqText="请选择客户类型">
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
                            <input type="text" name="patientName" maxlength="20" lay-verify="required" lay-reqText="请输入姓名" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex" >
                            <label><span class="edit-verify-span">*</span>性别：</label>
                            <input type="radio" lay-verify="radio" lay-verify-msg="性别" name="gender" id="gender" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                                   ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Sex')">
                        </div>

                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex" >
                            <label ><span class="edit-verify-span">*</span>出生日期：</label>
                            <input type="text" name="birthday" readonly lay-verify="required" lay-reqText="请输入出生日期" id="birthday" placeholder="yyyy-MM-dd" autocomplete="off">
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex" >
                            <label><span class="edit-verify-span">*</span>证件号码：</label>
                            <select name="idCardType" id="idCardType" lay-verify="required" lay-reqText="请输入证件号码" lay-filter="idCardType">
                                <option value=""></option>
                                <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                         ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('IdCardType')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex" >
                            <input type="text" name="idCardNo" id="idCardNo" maxlength="20" lay-verify="required|IdCodeValids" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                        <div class="disui-form-flex" >
                            <label>年龄：</label>
                            <input type="text" name="age" id="age" maxlength="50" readonly autocomplete="off" style="float: left">
                            <span class="span-class">岁</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="layui-row layui-col-space1">
                    <#--<div class="layui-col-sm4 layui-col-md4 layui-col-lg12">-->
                        <#--<div class="disui-form-flex" >-->
                            <#--&lt;#&ndash;<label>照片：</label>&ndash;&gt;-->
                            <#--<!-- 隐藏的文本域，用于存文件url&ndash;&gt;-->
                            <#--<input type="hidden" name="patientPhoto"  autocomplete="off">-->
                            <#--&lt;#&ndash;<button style="float: left;" type="button" class="layui-btn" id="patientPhoto_upload">上传照片</button>&ndash;&gt;-->
                            <#--&lt;#&ndash;<img class="layui-upload-img"  ms-if="@patientPhoto==null || @patientPhoto == ''"  src="${ctxsta}/static/images/people.png" id="patientPhoto_upload">&ndash;&gt;-->
                            <#--&lt;#&ndash;<!-- 用于显示上传完的图片&ndash;&gt;&ndash;&gt;-->
                            <#--&lt;#&ndash;<div class="layui-input-block"  id="patientPhoto_upload_div" >&ndash;&gt;-->
                            <#--&lt;#&ndash;</div>&ndash;&gt;-->
                        <#--</div>-->
                    <#--</div>-->
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div style="text-align: center">
                            <div class="layui-upload" >
                                <div class="" id="showImgDiv" style="display: inline;"></div>
                                <input type="hidden" name="patientPhoto" id="patientPhoto" autocomplete="off">
                                <button type="button" id="uploadImg" style="display: none"></button>
                                <button ms-if="@hasPhotoImage===false" class="uploadImg" onclick="uploadClick()" ><i class="layui-icon layui-icon-add-1"></i></button>
                            </div>
                            <div  ms-if="@hasPhotoImage===false">
                                <span>(点击上传照片)</span>
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
                    <select name="insuranceTypes" lay-verify="required" lay-reqText="请选择医保类型" xm-select="insuranceTypes" xm-select-search="" xm-select-search-type="dl" xm-select-height="36px" style="width: inherit;">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('InsuranceType')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex" >
                    <label><span class="edit-verify-span">*</span>社保号：</label>
                    <input type="text" name="socialSecurityNo" maxlength="20" lay-verify="required|confirmSocialSecurityNo" lay-reqText="请输入社保号" autocomplete="off" >
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label><span class="edit-verify-span">*</span>民族：</label>
                    <select name="ethnicity" lay-verify="required" lay-reqText="请选择民族">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Ethnicity')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>身高：</label>
                    <input type="text" name="stature"  lay-verify="stature" maxlength="6" autocomplete="off" style="float:left;width: 80%">
                    <span class="span-class">cm</span>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>入院体重：</label>
                    <input type="text" name="admissionWeight" lay-verify="weight" maxlength="6" autocomplete="off"  style="float:left;width: 80%">
                    <span class="span-class">kg</span>
                </div>

            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>婚姻状况：</label>
                    <select name="maritalStatus" >
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
                    <select name="religion" >
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Religion')"></option>
                    </select>
                </div>

            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>教育程度：</label>
                    <select name="educationLevel" >
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('EducationLevel')"></option>
                    </select>
                </div>

            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>职业：</label>
                    <select name="occupation" >
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Occupation')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>吸烟：</label>
                    <select name="smokeStatus">
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
                    <select name="incomeStatus" >
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('IncomeStatus')"></option>
                    </select>
                </div>

            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>饮酒：</label>
                    <select name="drinkStatus" >
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
                    <textarea name="specialRequirements" maxlength="200" rows="3"></textarea>
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex" >
                    <label>标签：</label>
                    <div lay-filter="test8" id="addFun" style="width: 100%">
                        <div class="tags" id="tags" style="width: 100%;margin: 0 auto;box-sizing: border-box;padding: 2px;border-radius: 5px;">
                            <input type="text" name="" id="inputTags" readonly autocomplete="off" >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;margin-left: 20px">
            <legend>家庭住址及联系方式</legend>
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label><span class="edit-verify-span">*</span>个人手机：</label>
                    <input type="text" name="mobilePhone" maxlength="11" lay-verify="required|phone" lay-reqText="请输入个人手机" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>固定电话：</label>
                    <input type="text" name="fixedPhoneFront" maxlength="4" autocomplete="off" >
                    <label>-</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg4">
                <div class="disui-form-flex">
                    <input type="text" name="fixedPhoneLast" maxlength="8" autocomplete="off">
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg6">
                <div class="disui-form-flex" >
                    <label>通信地址：</label>
                    <select name="contactProvince" id="contactProvince" lay-filter="contactProvince">
                        <option value=""></option>
                        <option  ms-attr="{value:el.areaCode}" ms-text="@el.areaName"
                                 ms-for="($index, el) in @provinces"></option>
                    </select>
                    <lable class="span-class">省</lable>
                    <select name="contactCity" id="contactCity" lay-filter="contactCity">
                        <option value=""></option>
                        <option  ms-attr="{value:el.areaCode}" ms-text="@el.areaName"
                                 ms-for="($index, el) in @contactCitys"></option>
                    </select>
                    <lable class="span-class">市</lable>
                    <select name="contactCounty" id="contactCounty" lay-filter="contactCounty">
                        <option value=""></option>
                        <option  ms-attr="{value:el.areaCode}" ms-text="@el.areaName"
                                 ms-for="($index, el) in @contactCountys"></option>
                    </select>
                    <lable class="span-class">区/县</lable>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg6">
                <div class="disui-form-flex" >
                <input type="text" name="contactAddress" maxlength="200" autocomplete="off">
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg6">
                <div class="disui-form-flex" >
                    <label>家庭住址：</label>
                    <select name="homeProvince" id="homeProvince" lay-filter="homeProvince">
                        <option value=""></option>
                        <option  ms-attr="{value:el.areaCode}" ms-text="@el.areaName"
                                 ms-for="($index, el) in @provinces"></option>
                    </select>
                    <lable class="span-class">省</lable>
                    <select name="homeCity" id="homeCity" lay-filter="homeCity">
                        <option value=""></option>
                        <option  ms-attr="{value:el.areaCode}" ms-text="@el.areaName"
                                 ms-for="($index, el) in @homeCitys"></option>
                    </select>
                    <lable class="span-class">市</lable>
                    <select name="homeCounty" id="homeCounty" lay-filter="homeCounty">
                        <option value=""></option>
                        <option  ms-attr="{value:el.areaCode}" ms-text="@el.areaName"
                                 ms-for="($index, el) in @homeCountys"></option>
                    </select>
                    <lable class="span-class">区/县</lable>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg6">
                <div class="disui-form-flex" >
                    <input type="text" name="homeAddress" maxlength="200" autocomplete="off" >
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label>家庭情况：</label>
                    <div style="width: 100%">
                        <a class="layui-btn layui-btn-dismain" href="javascript:void(0)" onclick="addFamilyMember()">新增</a>
                        <!--table定义-->
                        <table id="patFamilyMemberList_table" lay-filter="patFamilyMemberList_table" style="height: auto"></table>
                        <!--table的工具栏按钮定义，注意：需要增加权限控制-->
                        <script type="text/html" id="patFamilyMemberList_bar">
                            {{#  if(baseFuncInfo.authorityTag('patDiseaseDiagnosisList#del')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                            {{#  } }}
                        </script>
                    </div>

                </div>
            </div>
        </div>

        <blockquote class="layui-elem-quote">治疗信息</blockquote>
        <hr class="layui-bg-green">
        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;margin-left: 20px">
            <legend>过去透析史</legend>
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="padding-left: 60px">
                <div class="disui-form-flex" >
                    <div style="width: 100%;">
                        <a class="layui-btn layui-btn-dismain" href="javascript:void(0)" onclick="addPatPastDialysis()">新增</a>

                        <!--table定义-->
                        <table id="patPastDialysisList_table" lay-filter="patPastDialysisList_table" style="height: auto;"></table>
                        <script type="text/html" id="patPastDialysisList_bar">
                            {{#  if(baseFuncInfo.authorityTag('patDiseaseDiagnosisList#del')){ }}
                            <a class="layui-btn个人资料
     layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                            {{#  } }}
                        </script>
                    </div>
                </div>
            </div>
        </div>

        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;margin-left: 20px">
            <legend>现在透析史</legend>
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>透析类型：</label>
                    <select name="dialysisType" >
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DialysisType')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>首次接收日期：</label>
                    <input type="text" name="firstReceptionDate"  id="firstReceptionDate" placeholder="yyyy-MM-dd" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>首次透析日期：</label>
                    <input type="text" name="firstDialysisDate"  id="firstDialysisDate" placeholder="yyyy-MM-dd" autocomplete="off" >
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>透析次数：</label>
                    <input type="text" readonly name="dialysisTimes" readonly autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>透析年：</label>
                    <input type="text" readonly name="dialysisYear" id="dialysisYear" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label><span class="edit-verify-span">*</span>透析总频次：</label>
                    <select name="dialysisTotalFrequency" lay-verify="required"  lay-reqText="请选择透析总频次">
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
                <input type="checkbox" name="infectionStatusS" ms-attr="{value:el.value,title:el.name}"
                       ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('InfectionMark')">
            </div>
        </div>

        <blockquote class="layui-elem-quote">其他信息</blockquote>
        <hr class="layui-bg-green">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>区名：</label>
                    <input type="text" readonly name="hospitalName" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>初诊医生：</label>
                    <div class="layui-input-block"  >
                        <select id="firstDiagnosisDoctor" name="firstDiagnosisDoctor" lay-search>
                            <option value=""></option>
                            <option  ms-attr="{value:el.id}" ms-text="@el.userName"
                                     ms-for="($index, el) in firstDiagnosisDoctors"></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>主责护士：</label>
                    <select id="principalNurse" name="principalNurse" lay-search>
                        <option value=""></option>
                        <option  ms-attr="{value:el.id}" ms-text="@el.userName"
                                 ms-for="($index, el) in principalNurses"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label>本中心透析次数：</label>
                    <input type="text" name="dialysisTimes"  readonly id="dialysisTimes"  autocomplete="off">

                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-row layui-col-space1 layui-hide">
            <button class="layui-btn" lay-submit lay-filter="patPatientInfoEdit_submit" id="patPatientInfoEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPatientInfoEdit.js?t=${currentTimeMillis}"></script>
<!-- 自定义下拉菜单内容 -->
<script id="mymenu" type="text/html">
    <div class="layui-row layui-col-space1" style="width: 100%;padding: 0 5px;box-sizing: border-box;">
        <div class="layui-col-sm10 layui-col-md10 layui-col-lg10" style="position: relative; min-height: 172px;">
            <div style="line-height: 30px" >常用标签</div>
            <div class="layui-row layui-col-space1">
                <div id="patientTagsId" class="layui-col-sm4 layui-col-md3 layui-col-lg12">
                </div>
            </div>
            <div class="layui-row layui-col-space1" style="position: absolute;bottom: 5px;width:100%;">
                <div style="border-top:1px dashed #cccccc; height: 10px"></div>
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <div class="disui-form-flex" style="display: flex; align-items: center">
                       <input type="text" id="customPatientTagsId" autocomplete="off">
                        <button class="layui-btn layui-btn-sm layui-btn-dismain" onclick="addPatientTags(2)">添加</button>
                    </div>
                </div>
            </div>
        </div>
        <div  class="layui-col-sm2 layui-col-md2 layui-col-lg2" style="border-left: 1px solid rgba(83, 100, 113, 0.5);">
            <div style="line-height: 30px;margin-left: 10px;" >标签颜色</div>
            <div class="disui-form-flex">
                <div class="layui-input-block" id="patientTagsColorId" style="margin-left: 10px;" >
                </div>
            </div>
        </div>
    </div>
</script>
</body>
</html>