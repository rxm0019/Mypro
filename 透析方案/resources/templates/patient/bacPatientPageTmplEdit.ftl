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
<style>
    .layui-row .disui-form-flex > .title-style {
        flex-basis: 140px;
    }

    .layui-layedit {
        margin-left: 102px;
        width: 91%;
    }

    p {
        line-height: 30px;
    }
</style>
<body ms-controller="bacPatientPageTmplEdit">
<div class="layui-form" lay-filter="bacPatientPageTmplEdit_form" id="bacPatientPageTmplEdit_form"
     style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="patientPageTmplId" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-card" style="position: relative">
        <div class="layui-row layui-col-space1" style="padding-top: 15px">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>模板名：</label>
                    <input type="text" name="pageName" lay-verify="required" maxlength="10" placeholder="请输入模板名称"
                           id="pageName" autocomplete="off" class="layui-input">
                </div>
            </div>
            <script type="text/html" style="display: block ;color: red;line-height: 25px;padding-left: 100px">
                占位符格式：姓名{{d.name}}、性别{{d.sex}}、年龄{{d.age}}、透龄{{d.fallage}}、病历号{{d.medrec}}、医院名称{{d.hospitalName}}
            </script>
            <script type="text/html" style="display: block ;color: red;line-height: 25px;padding-left: 100px">
                首次治疗日期{{d.firstDialysisDate}}、开始治疗日期{{d.firstReceptionDate}}、医保卡号{{d.socialSecurityNo}}
            </script>
            <script type="text/html" style="display: block ;color: red;line-height: 25px;padding-left: 100px">
                主诊断{{d.mainDiagnosis}}、合并症/并发症{{d.otherDiagnosis}}身份证{{d.idCardNo}}、现住省{{d.homeProvince}}
            </script>
            <script type="text/html" style="display: block ;color: red;line-height: 25px;padding-left: 100px">
                现住市县(区){{d.homeCity}}、现住乡镇(街道){{d.homeCountry}}、电话{{d.fixedPhone}}、手机{{d.mobilePhone}}
            </script>
            <script type="text/html" style="display: block ;color: red;padding-left: 100px">
                户口省{{d.contactProvince}}、户口市县(区){{d.contactCity}}、户口乡镇(街道){{d.contactCountry}}
            </script>

        </div>
        <div class="layui-col-sm11 layui-col-md11 layui-col-lg11 layui-col-md-offset1" id="controllerAddModel">
            <div style="padding-top: 15px;" id="absoluteDiv">
                <div class="layui-row layui-col-space1" style="padding-top: 15px;">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <button class="layui-btn layui-btn-dismain" style="width: 100%" onclick="addModel('init')"
                                :visible="@baseFuncInfo.authorityTag('bacPatientPageItem#addModel')"
                        >添加模块
                        </button>
                    </div>
                </div>
                <div class="layui-row layui-col-space1" style="padding-top: 15px">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <button class="layui-btn layui-btn-dismain" style="width: 100%"
                                :visible="@baseFuncInfo.authorityTag('bacPatientPageItem#preview')"
                                onclick="preview()">主报表预览
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" type="button" lay-submit lay-filter="bacPatientPageTmplEdit_submit"
                id="bacPatientPageTmplEdit_submit">提交
        </button>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/patient/bacPatientPageTmplEdit.js?t=${currentTimeMillis}"></script>
<script type="text/javascript" src="${ctxsta}/static/layuiadmin/layui/lay/modules/ace/ace.js"></script>
</body>
</html>