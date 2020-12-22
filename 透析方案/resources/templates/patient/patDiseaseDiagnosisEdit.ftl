<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
</head>
<style>
    .box{
        width: 100%;
        position: relative;
    }
    .box .layui-input, .layui-textarea {
        padding-right: 32px;
    }
    .box .layui-icon-search{
        width: 20px;
        height: 20px;
        position: absolute;
        top: 7px;
        right: 5px;
    }
    .font{
        font-size: 14px;
        color: #333333;
        font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
        font-weight: 700;
        font-style: normal;
    }
    .layui-row .disui-form-flex>label{
        flex-basis: 100px;
    }
    .layui-form-radio{
        margin: 0!important;
    }
    .ztree li a > span:not(.button){
        max-width: calc(40vh - 20px);
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
    }
</style>
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/lib/zTree/v3/css/layuiStyle/layuiStyle.css">
<body ms-controller="patDiseaseDiagnosisEdit">
<div class="layui-fluid" style="background-color: white">
    <div class="layui-card"  >
        <div class="layui-form" lay-filter="patDiseaseDiagnosisEdit_form" id="patDiseaseDiagnosisEdit_form" style="background-color: white">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-block">
                    <input type="hidden" name="diseaseDiagnosisId" placeholder="请输入" autocomplete="off" class="layui-input">
                    <input type="hidden" name="patientId" maxlength="35" lay-verify="required"  placeholder="请输入" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label><span class="edit-verify-span">*</span>诊断时间：</label>
                        <input type="text" name="diagnosisDate" readonly lay-verify="required" id="diagnosisDate" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label><span class="edit-verify-span">*</span>诊断医生：</label>
                        <select name="diagnosisDoctorId" id="diagnosisDoctorId" lay-filter="diagnosisDoctorId" >
                            <option value=""></option>
                            <option  ms-attr="{value:el.id}" ms-text="@el.userName"
                                     ms-for="($index, el) in diagnosisDoctorIds"></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1"  style="margin-top: 10px">
                <#--诊断类别树-->
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="grid-demo grid-demo-bg1">
                        <div class="layui-card" style="margin:0 10px 0 0;height: 400px;border: 1px solid rgba(171, 160, 148, 0.37)">
                            <div style="margin:10px;">
                                <div class="font">诊断类别</div>
                                <div class="layui-card-body">
                                    <div class="layui-col-sm12 layui-box">
                                        <ul id="basDiagnoseTypeTree" class="ztree">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <#--诊断项目-->
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="grid-demo">
                        <div class="layui-card" style="margin:0 10px 0 0;height: 400px;border: 1px solid rgba(171, 160, 148, 0.37)">
                            <div style="margin:10px;">
                                <div class="font" style="">诊断项目</div>
                                <div class="layui-card-body" style="margin-top: 5px;">
                                    <div class="layui-col-sm12 layui-box">
                                        <div class="box">
                                            <input type="text" placeholder="项目名称/ICD-10" ms-duplex="@basDiagnoseSearch"  class="layui-input">
                                            <i class="layui-icon layui-icon-search layuiadmin-button-btn" lay-filter="basDiagnoseDetail_search"></i>
                                        </div>
                                        <div id="basDiagnoseTypeCode"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <#--诊断结果-->
                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                    <div class="grid-demo grid-demo-bg1">
                        <div class="layui-card" style="margin:0 10px 0 0;height: 400px;border: 1px solid rgba(171, 160, 148, 0.37)">
                            <div style="margin:10px;">
                                <div class="font"><span class="edit-verify-span">*</span>诊断结果</div>
                                <div style="margin-left: 10px;">
                                    <div class="layui-card-body">
                                        <div class="layui-col-sm12" ms-for="($itemIndex, ell) in @diagnosisTypeList" style="border-bottom: 1px solid #d2c4c4;padding: 5px 0;">
                                            <div style="width: 90%;float: left" >
                                                <div> {{ell.diagnoseTypeName}}--{{ell.icdCode+ell.diagnoseDetailName}}</div>
                                                <input type="radio"  lay-verify="radio" lay-verify-msg="诊断类型至少选一项"   ms-attr="{name:'diagnosisType_'+ell.diagnoseTypeCode,value:el.value,title:el.name,diseasediagnosisid:ell.diseaseDiagnosisId,checked:true&&$index==0}"
                                                       ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('DiagnosisType')">
                                            </div><i class="layui-icon layui-icon-close" style="float: left" ms-attr="{id:ell.diagnoseTypeCode,diseasediagnosisid:ell.diseaseDiagnosisId}" onclick="deleteItem(this)"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="patDiseaseDiagnosisEdit_submit" id="patDiseaseDiagnosisEdit_submit">提交</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/lib/zTree/v3/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patDiseaseDiagnosisEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
