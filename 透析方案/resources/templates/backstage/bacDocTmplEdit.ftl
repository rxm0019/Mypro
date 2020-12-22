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
<body ms-controller="sysHospitalPrint">
<div class="layui-form" lay-filter="sysHospitalPrint_form" id="sysHospitalPrint_form"
     style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="docId" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-card" style="position: relative">
        <div class="layui-row layui-col-space1" style="padding-top: 15px">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>标题：</label>
                    <input type="text" name="docName" lay-verify="required"
                           id="docName" autocomplete="off" class="layui-input" maxlength="12">
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
        <div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="margin-top: 20px">
                <label class="layui-form-label"><span class="edit-verify-span"
                                                      style="width: 150px"></span></label>
                <textarea class="layui-edit" id=docContent name=docContent lay-verify="textAreaContent" maxlength="3000"
                          style="width: 60%"></textarea>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" type="button" lay-submit lay-filter="bacDocTmplEdit_submit"
                id="bacDocTmplEdit_submit">提交
        </button>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/backstage/bacDocTmplEdit.js?t=${currentTimeMillis}"></script>
<script type="text/javascript" src="${ctxsta}/static/layuiadmin/layui/lay/modules/ace/ace.js"></script>
</body>
</html>