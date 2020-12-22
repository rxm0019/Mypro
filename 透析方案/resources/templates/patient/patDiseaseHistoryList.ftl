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
    .layui-row .disui-form-flex > label {
        flex-basis: 120px;

    }
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="patDiseaseHistoryList">
<div class="layui-fluid">
    <div class="layui-card" >
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="patDiseaseHistoryList_search" lay-filter="patDiseaseHistoryList_search">
        </div>
        <div class="layui-card-body" style="margin: 10px;">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-md12 layui-inline">
                        <div class="layui-input-inline">
                            <button :visible="@baseFuncInfo.authorityTag('patDiseaseHistoryList#add')"
                                    class="layui-btn layui-btn-dismain" ms-if="isShow" onclick="add()">添加
                            </button>
                        </div>

                        <div class="layui-input-inline" style="float: right;">
                            <button class="layui-btn layui-btn-dismain" onclick="saveOrEdit()" ms-if="!isShow">保存
                            </button>
                            <button class="layui-btn layui-btn-dissub" onclick="cancel()" ms-if="!isShow">取消
                            </button>
                            <button :visible="@baseFuncInfo.authorityTag('patDiseaseHistoryList#edit')"
                                    class="layui-btn layui-btn-dismain" onclick="update_info()" ms-if="isShow" >修改
                            </button>
                            <button :visible="@baseFuncInfo.authorityTag('patDiseaseHistoryList#print')"
                                    class="layui-btn layui-btn-dissub" onclick="onPrint()" ms-if="isShow">打印
                            </button>
                            <button :visible="@baseFuncInfo.authorityTag('patDiseaseHistoryList#delete')"
                                    class="layui-btn layui-btn-dissub" onclick="del()" ms-if="isShow">删除
                            </button>

                        </div>
                </div>
                <div class="layui-col-md4">
                    <!--table定义-->
                    <table id="patDiseaseHistoryList_table"
                           lay-filter="patDiseaseHistoryList_table"></table>
                </div>
                <div class="layui-col-md8">
                    <div class="layui-form" lay-filter="patDiseaseHistory_form"  style="border: 1px rgba(171, 160, 148, 0.37) solid; border-radius: 6px; margin-left: 10px;"  ms-if="isShow">
                        <div style="margin: 10px;">
                            <div class="layui-form-item">
                                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"><span class="edit-verify-span">*</span>记录日期：</label>
                                        <input type="text" name="recordDate" id="recordDate" lay-verify="required"
                                               placeholder="yyyy-MM-dd" autocomplete="off"  :attr="@disabled">
                                    </div>
                                </div>
                                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"><span
                                                    class="edit-verify-span">*</span>记录人：</label>
                                        <select name="recordUserId" id="recordUserId" lay-verify="required" class="select" :attr="@disabled">
                                            <option value=""></option>
                                            <option ms-attr="{value:el.id}" ms-text="@el.userName"
                                                    ms-for="($index, el) in @makerName"></option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">患者主诉：</label>
                                        <textarea type="text" name="patientComplaint"
                                                  maxlength="500" rows="2" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">现病史：</label>
                                        <textarea type="text" name="presentHistory"
                                                  maxlength="500" rows="2" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">心血管疾病史：</label>
                                        <textarea type="text" name="cardioVascularHistory"
                                                  maxlength="500" rows="1" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">高血压病史：</label>
                                        <textarea type="text" name="hypertensionHistory"
                                                  maxlength="500" rows="1" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">脑血管疾病史：</label>
                                        <textarea type="text" name="brainVascularHistory"
                                                  maxlength="500" rows="1" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">糖尿病史：</label>
                                        <textarea type="text" name="diabetesHistory"
                                                  maxlength="500" rows="1" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">肝炎病史：</label>
                                        <textarea type="text" name="hepatitisHistory"
                                                  maxlength="500" rows="1" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">其他疾病：</label>
                                        <textarea type="text" name="otherHistory"
                                                  maxlength="500" rows="1" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">家族史：</label>
                                        <textarea type="text" name="familyHistory"
                                                  maxlength="500" rows="1" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">过敏药物：</label>
                                        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                                            <select name="allergicDrugStatus" :attr="@disabled">
                                                <option value="Y">有</option>
                                                <option value="N">无</option>
                                                <option value="U">不详</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                            <select name="allergicDrug" xm-select="allergicDrug"
                                                    disabled
                                                    lay-filter="allergicDrug"
                                                    lay-verify="requireds"
                                                    xm-select-height="36px" style="width: inherit;">
                                                <option value=""></option>
                                                <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                                         ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('AllergicDrug')"></option>
                                            </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">过敏史：</label>
                                        <textarea type="text" name="allergicHistory"
                                                  maxlength="500" rows="1" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">婚史：</label>
                                        <textarea type="text" name="marriageHistory"
                                                  maxlength="500" rows="1" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">月经史：</label>
                                        <textarea type="text" name="menstrualHistory"
                                                  maxlength="500" rows="1" autocomplete="off" :attr="@readonly"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="layui-form" lay-filter="patDiseaseHistoryEdit_form"
                         id="patDiseaseHistoryEdit_form" style="border: 1px rgba(171, 160, 148, 0.37) solid; border-radius: 6px; margin-left: 10px;" ms-if="!isShow">
                        <div style="margin: 10px;">
                            <div class="layui-form-item  layui-hide">
                                <label class="layui-form-label">ID</label>
                                <div class="layui-input-inline">
                                    <input type="hidden" name="diseaseHistoryId" id="diseaseHistoryId" placeholder="请输入"
                                           autocomplete="off" >
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"><span class="edit-verify-span">*</span>记录日期：</label>
                                        <input type="text" name="recordDate" id="recordDate" lay-verify="required"

                                               placeholder="yyyy-MM-dd" autocomplete="off" >
                                    </div>
                                </div>
                                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"><span
                                                    class="edit-verify-span">*</span>记录人：</label>
                                        <select name="recordUserId" id="recordUserId1" lay-verify="required" class="select">
                                            <option value=""></option>
                                            <option ms-attr="{value:el.id}" ms-text="@el.userName"
                                                    ms-for="($index, el) in @makerName"></option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">患者主诉：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.PATIENTCOMPLAINT)" style="width: auto">从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.PATIENTCOMPLAINT)"  style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex ">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="patientComplaint" id="patientComplaint"
                                                  maxlength="500" rows="2"  autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">现病史：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.PRESENTHISTORY)" style="width: auto">
                                                从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.PRESENTHISTORY)" style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="presentHistory" id="presentHistory"
                                                  maxlength="500" rows="2" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">心血管疾病史：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.CARDIOVASCULARDISEASESHISTORY)"
                                                    style="width: auto">从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.CARDIOVASCULARDISEASESHISTORY)" style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="cardioVascularHistory" id="cardioVascularHistory"
                                                  maxlength="500" rows="1" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">高血压病史：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.HYPERTENSIONHISTORY)" style="width: auto">
                                                从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.HYPERTENSIONHISTORY)"  style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="hypertensionHistory" id="hypertensionHistory"
                                                  maxlength="500" rows="1" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">脑血管疾病史：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.BRAINVASCULARHISTORY)"
                                                    style="width: auto">从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.BRAINVASCULARHISTORY)"  style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="brainVascularHistory" id="brainVascularHistory"
                                                  maxlength="500" rows="1" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">糖尿病史：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.DIABETESHISTORY)" style="width: auto">
                                                从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.DIABETESHISTORY)"   style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="diabetesHistory" id="diabetesHistory"
                                                  maxlength="500" rows="1" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">肝炎病史：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.HEPATITISHISTORY)" style="width: auto">
                                                从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.HEPATITISHISTORY)"  style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="hepatitisHistory" id="hepatitisHistory"
                                                  maxlength="500" rows="1" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">其他疾病：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.OTHERHISTORY)" style="width: auto">
                                                从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.OTHERHISTORY)" style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="otherHistory" id="otherHistory"
                                                  maxlength="500" rows="1" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">家族史：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.FAMILYHISTORY)" style="width: auto">从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.FAMILYHISTORY)" style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="familyHistory" id="familyHistory"
                                                  maxlength="500" rows="1" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">过敏药物：</label>
                                        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                                            <select name="allergicDrugStatus" id="allergicDrugStatus" lay-filter="allergicDrugStatus" >
                                                <option value="Y">有</option>
                                                <option value="N">无</option>
                                                <option value="U">不详</option>
                                            </select>
                                        </div>
                                        <select name="allergicDrugDetails" xm-select="allergicDrugDetails"
                                                xm-select-height="36px"
                                                xm-select-search=""
                                                lay-filter="allergicDrugDetails"
                                                lay-verify="requireds"
                                        >
                                            <option value=""></option>
                                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                    ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('AllergicDrug')">
                                            </option>
                                        </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">过敏史：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.ALLERGICHISTORY)" style="width: auto">
                                                从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.ALLERGICHISTORY)" style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="allergicHistory" id="allergicHistory"
                                                  maxlength="500" rows="1" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">婚史：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.MARRIAGEHISTORY)" style="width: auto">
                                                从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.MARRIAGEHISTORY)"  style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="marriageHistory" id="marriageHistory"
                                                  maxlength="500" rows="1" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label">月经史：</label>
                                        <div>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@importTemp(templateType.MENSTRUALHISTORY)" style="width: auto">
                                                从模板中导入
                                            </button>
                                            <button class="layui-btn layui-btn-dissmall layui-btn-dis-s layui-btn-dis-blue"
                                                    :click="@getTempCont(templateType.MENSTRUALHISTORY)"  style="width: auto">导出到模板
                                            </button>
                                        </div>
                                    </div>
                                    <div class="disui-form-flex">
                                        <label class="layui-form-label"></label>
                                        <textarea type="text" name="menstrualHistory" id="menstrualHistory"
                                                  maxlength="500" rows="1" autocomplete="off"></textarea>
                                    </div>
                                </div>
                            </div>
                            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                            <div class="layui-form-item layui-hide">
                                <button class="layui-btn" lay-submit lay-filter="patDiseaseHistoryEdit_submit"
                                        id="patDiseaseHistoryEdit_submit">提交
                                </button>
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
<script type="text/javascript"
        src="${ctxsta}/static/js/patient/patDiseaseHistoryList.js?t=${currentTimeMillis}"></script>
</body>
</html>