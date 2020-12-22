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
<style type="text/css">
    .layui-elem-field legend{
        font-size: 14px;
    }
    #uploadFile{
        margin-left: 15px;
    }
</style>
<body ms-controller="patVascularTherapyEdit">
<div class="layui-form" lay-filter="patVascularTherapyEdit_form" id="patVascularTherapyEdit_form" style="padding: 20px">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="vascularTherapyId" autocomplete="off">
            <input type="hidden" name="patientId" autocomplete="off">
            <input type="hidden" name="fileId" id="fileId" autocomplete="off">
        </div>
    </div>
    <div class="layui-form-item">
        <div style="width: 68%; float: left;">
            <fieldset class="layui-elem-field layui-field-title">
                <legend>基本信息</legend>
            </fieldset>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                    <div class="disui-form-flex" >
                        <label><span class="edit-verify-span">*</span>记录日期：</label>
                        <input type="text" name="recordDate" lay-verify="required" id="recordDate" placeholder="yyyy-MM-dd" autocomplete="off" readonly :attr="@disabled">
                    </div>
                </div>
                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                    <div class="disui-form-flex" >
                        <label><span class="edit-verify-span">*</span>记录人：</label>
                        <select name="recordUserId" id="recordUserId"  lay-verify="required" :attr="@disabled">
                            <option value=""></option>
                            <option ms-attr="{value:el.id}" ms-text="@el.userName"
                                    ms-for="($index, el) in doctorMakers"></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex" >
                        <label><span class="edit-verify-span">*</span>治疗时间：</label>
                        <input type="text" name="therapyDatetime" lay-verify="required" id="therapyDatetime" placeholder="yyyy-MM-dd HH:mm" autocomplete="off" readonly :attr="@disabled">
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex" >
                        <label><span class="edit-verify-span">*</span>治疗地点：</label>
                        <input type="text" name="therapyLocale" lay-verify="required" maxlength="100" id="therapyLocale" placeholder="请输入地点" autocomplete="off" :attr="@readonly">
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex" >
                        <label>诊断：</label>
                        <input type="text" name="diseaseDiagnosis" maxlength="100" id="diseaseDiagnosis" placeholder="请输入诊断" autocomplete="off" :attr="@readonly">
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex" >
                        <label>手术名称：</label>
                        <input type="text" name="operationName" maxlength="100" id="operationName" placeholder="请输入手术名称" autocomplete="off" :attr="@readonly">
                    </div>
                </div>
            </div>
        </div>
        <div style="width: 30%; float: left;padding-left: 2%;">
            <fieldset class="layui-elem-field layui-field-title">
                <legend>附件</legend>
            </fieldset>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <div class="layui-upload" style="width: 100%;">
                            <input type="hidden" id="fileList" name="fileList" maxlength="1024" autocomplete="off">
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-dismain" id="uploadFile" >上传附件</button>
                            <div class="" id="fileShowDiv" style="padding-left: 15px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="patVascularTherapyEdit_submit" id="patVascularTherapyEdit_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patVascularTherapyEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>