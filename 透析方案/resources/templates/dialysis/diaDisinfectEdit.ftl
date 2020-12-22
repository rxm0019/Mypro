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
            flex: 0 0 115px;
        }
        .layui-row .disui-form-flex > .layui-btn {
            margin-top: 3px;
            margin-left: 3px;
        }
        .layui-row .disui-form-flex > span {
            line-height: 38px;
            padding: 0 5px;
        }
        .form-item-disinfect-surface dl {
            margin: 3px;
        }
        .form-item-disinfect-surface dl dd {
            line-height: 30px;
        }
    </style>
</head>
<body ms-controller="diaDisinfectEdit">
<div class="layui-form pt-10 pl-10 pr-20 pb-10" lay-filter="diaDisinfectEdit_form" id="diaDisinfectEdit_form">
    <div class="layui-row">
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
            <div class="disui-form-flex">
                <label>床号：</label>
                <span :text="bedNo"></span>
            </div>
        </div>
    </div>
    <div class="layui-row">
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 ">
            <div class="disui-form-flex">
                <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>开始时间：</label>
                <input type="text" name="startTime" placeholder="yyyy-MM-dd HH:mm" autocomplete="off"
                       lay-verify="fieldRequired" data-field-name="开始时间" :attr="{disabled: @formReadonly}">
                <button ms-if="!@formReadonly" class="layui-btn layui-btn-dismain layui-btn-dis-s" onclick="getCurrentTimeForStartTime()">获取时间</button>
            </div>
        </div>
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 ">
            <div class="disui-form-flex">
                <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>结束时间：</label>
                <input type="text" name="endTime" placeholder="yyyy-MM-dd HH:mm" autocomplete="off"
                       lay-verify="fieldRequired" data-field-name="结束时间" :attr="{disabled: @formReadonly}">
                <button ms-if="!@formReadonly" class="layui-btn layui-btn-dismain layui-btn-dis-s" onclick="getCurrentTimeForEndTime()">获取时间</button>
            </div>
        </div>
    </div>
    <div class="layui-row">
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 ">
            <div class="disui-form-flex">
                <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>消毒程序：</label>
                <select name="disinfectOrder" lay-filter="disinfectOrder" lay-verify="fieldRequired" data-field-name="消毒程序" :attr="{disabled: @formReadonly}">
                    <option value=""></option>
                    <option ms-for="($index, el) in @options.disinfectOrderList"
                            ms-attr="{value: el.value}" ms-text="@el.name"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 form-item-residual-test">
            <div class="disui-form-flex">
                <label>残余测试：</label>
                <input type="text" name="residualTest" maxlength="50" autocomplete="off" :attr="{readonly: @formReadonly}">
            </div>
        </div>
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 ">
            <div class="disui-form-flex">
                <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>消毒时长：</label>
                <input type="text" name="disinfectHour" autocomplete="off" maxlength="5" :attr="{readonly: @formReadonly}"
                       lay-verify="fieldNotInRange" data-field-name="消毒时长-时" data-min-value="0" data-max-value="24" data-integer="true">
                <span>时</span>
                <input type="text" name="disinfectMin" autocomplete="off" maxlength="5" :attr="{readonly: @formReadonly}"
                       lay-verify="fieldNotInRange" data-field-name="消毒时长-分" data-min-value="0" data-max-value="60" data-integer="true">
                <span>分</span>
            </div>
        </div>
    </div>
    <div class="layui-row">
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 ">
            <div class="disui-form-flex">
                <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>床单更换：</label>
                <select name="sheetChange" lay-verify="fieldRequired" data-field-name="床单更换" :attr="{disabled: @formReadonly}">
                    <option value=""></option>
                    <option ms-for="($index, el) in @options.sheetChangeList"
                            ms-attr="{value:el.value}" ms-text="@el.name"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4 ">
            <div class="disui-form-flex">
                <label><span ms-if="!@formReadonly" class="edit-verify-span">*</span>操作者：</label>
                <select name="disinfectUser" lay-verify="fieldRequired" data-field-name="操作者" :attr="{disabled: @formReadonly}">
                    <option value=""></option>
                    <option ms-for="($index, el) in @options.nurseList"
                            ms-attr="{value: el.id}" ms-text="@el.userName"></option>
                </select>
            </div>
        </div>
    </div>
    <div class="layui-row">
        <div class="layui-col-sm8 layui-col-md8 layui-col-lg8 form-item-disinfect-surface">
            <div class="disui-form-flex">
                <label>表面消毒方法：</label>
                <select name="disinfectSurface" :attr="{disabled: @formReadonly}">
                    <option value=""></option>
                    <option ms-for="($index, el) in @options.disinfectSurfaceList"
                            ms-attr="{value: el.value}" ms-text="@el.name"></option>
                </select>
            </div>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="diaDisinfectEdit_submit" id="diaDisinfectEdit_submit">提交</button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaDisinfectEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
