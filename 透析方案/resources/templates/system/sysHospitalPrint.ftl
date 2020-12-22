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
</style>
<body ms-controller="bacDocTmplEdit">
<div class="layui-form" lay-filter="sysHospitalPrint_form" id="sysHospitalPrint_form"
     style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="hospitalId" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-card" style="position: relative">
        <div class="layui-row layui-col-space1" style="padding-top: 15px">
            <p><span style="padding-left: 20px;color: red">占位符格式：姓名{ { d.name} }、性别{ {d.sex} }、年龄{ {d.age} }、透龄{ {d.fallage} }、病历号{ {d.medrec} }</span>
            </p>
        </div>
        <div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="margin-top: 20px">
                <label class="layui-form-label"><span class="edit-verify-span"
                                                      style="width: 150px"></span></label>
                <textarea class="layui-edit" id=notesTemplate name=notesTemplate lay-verify="textAreaContent"
                          style="width: 60%"></textarea>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" type="button" lay-submit lay-filter="sysHospitalPrint_submit"
                id="sysHospitalPrint_submit">提交
        </button>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/system/sysHospitalPrint.js?t=${currentTimeMillis}"></script>
<script type="text/javascript" src="${ctxsta}/static/layuiadmin/layui/lay/modules/ace/ace.js"></script>
</body>
</html>