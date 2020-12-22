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
        @media screen and (min-width: 768px) {
            .layui-col-sm3{
                width: 14.22%
            }
        }
        @media screen and (min-width: 992px) {
            .layui-col-md2{
                width: 14.22%
            }
        }
        @media screen and (min-width: 1200px) {
            .layui-col-lg1 {
                width: 14.22%
            }
        }
    </style>
</head>
<body ms-controller="bacClassTemplateDoctorEdit">
<div class="layui-card-body">
    <div class="layui-form" lay-filter="bacClassTemplateDoctorEdit_form" id="bacClassTemplateDoctorEdit_form" style="padding: 20px;">
        <div class="layui-row layui-col-space1 demo-list">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="classTemplateId" autocomplete="off" >
                </div>
            </div>

            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="classTemplateId" autocomplete="off" >
                </div>
            </div>

            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">姓名：</label>
                    <input type="text" name="userName" maxlength="50"  autocomplete="off" ms-duplex="@userName" readonly >
                </div>
            </div>

            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">默认班种：</label>
                    <select name="defaultTemplate"  class="select" lay-filter="defaultTemplate">
                        <option value=""></option>
                        <option  ms-attr="{value:el.classManageId}" ms-text="@el.className"
                                 ms-for="($index, el) in @classManageList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <fieldset class="layui-elem-field layui-field-title" style="margin: 10px;">
                    <legend style="font-size: 16px;"><span class="edit-verify-span">*</span>班种</legend>
                </fieldset>
            </div>

            <div class="layui-col-sm3 layui-col-md2 layui-col-lg1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label" style="width: auto;float: unset;text-align: center;">星期一</label>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <select name="templateMon"  class="select" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.classManageId}" ms-text="@el.className"
                                 ms-for="($index, el) in @classManageList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md2 layui-col-lg1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label" style="width: auto;float: unset;text-align: center;">星期二</label>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <select name="templateTue"  class="select" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.classManageId}" ms-text="@el.className"
                                 ms-for="($index, el) in @classManageList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md2 layui-col-lg1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label" style="width: auto;float: unset;text-align: center;">星期三</label>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <select name="templateWed"  class="select" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.classManageId}" ms-text="@el.className"
                                 ms-for="($index, el) in @classManageList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md2 layui-col-lg1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label" style="width: auto;float: unset;text-align: center;">星期四</label>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <select name="templateThur"  class="select" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.classManageId}" ms-text="@el.className"
                                 ms-for="($index, el) in @classManageList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md2 layui-col-lg1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label" style="width: auto;float: unset;text-align: center;">星期五</label>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <select name="templateFri"  class="select" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.classManageId}" ms-text="@el.className"
                                 ms-for="($index, el) in @classManageList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md2 layui-col-lg1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label" style="width: auto;float: unset;text-align: center;" >星期六</label>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <select name="templateSat"  class="select" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.classManageId}" ms-text="@el.className"
                                 ms-for="($index, el) in @classManageList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm3 layui-col-md2 layui-col-lg1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <label class="layui-form-label" style="width: auto;float: unset;text-align: center;">星期日</label>
                </div>
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <select name="templateSun"  class="select" lay-verify="required">
                    <option value=""></option>
                    <option  ms-attr="{value:el.classManageId}" ms-text="@el.className"
                             ms-for="($index, el) in @classManageList"></option>
                </select>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="bacClassTemplateDoctorEdit_submit" id="bacClassTemplateDoctorEdit_submit">提交</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacClassTemplateDoctorEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>