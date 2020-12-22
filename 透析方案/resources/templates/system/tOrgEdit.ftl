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
<body ms-controller="tOrgEdit">
<div class="layui-form" lay-filter="tOrgEdit_form" id="tOrgEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide" id="orgParent" >
        <div class="layui-form-item ">
            <label class="layui-form-label">上一级</label>
            <div class="layui-input-inline">
                <input name="orgParentName"  disabled="disabled" readonly autocomplete="off" class="layui-input layui-bg-gray" >
            </div>
        </div>
    </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>编号</label>
            <div class="layui-input-inline">
                <input type="input" name="code" maxlength="20" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>名称</label>
            <div class="layui-input-inline">
                <input type="input" name="orgName" maxlength="100" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
    <#--<div class="layui-form-item layui-hide" id="orgType">-->
        <#--<label class="layui-form-label"><span class="edit-verify-span">*</span>类型</label>-->
        <#--<div class="layui-input-inline">-->
            <#--<select name="category" >-->
                <#--<option value=""></option>-->
                <#--<option  ms-attr="{value:el.value}" ms-text="@el.name"-->
                         <#--ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('t_org_type_')"></option>-->
            <#--</select>-->
        <#--</div>-->
    <#--</div>-->
        <div class="layui-form-item layui-hide" >
            <label class="layui-form-label"><span class="edit-verify-span">*</span>上级组织uuid</label>
            <div class="layui-input-inline">
                <input type="input" name="parent" maxlength="64"   placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>

    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">省名</label>
        <div class="layui-input-inline">
            <input type="hidden" name="provinceName" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">市名</label>
        <div class="layui-input-inline">
            <input type="hidden" name="cityName" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">区/县名</label>
        <div class="layui-input-inline">
            <input type="hidden" name="countyName" placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item layui-hide" id="selectPrison">
        <label class="layui-form-label"><span class="edit-verify-span">*</span>请选择地区</label>
        <div class="layui-input-inline">
            <select name="prisonProvince" id="prisonProvince" lay-filter="prisonProvince" lay-verify="required">

            </select>
        </div>
        <div class="layui-input-inline">
            <select name="prisonCity" id="prisonCity" lay-filter="prisonCity" lay-verify="required">

            </select>
        </div>
        <div class="layui-input-inline">
            <select name="prisonCounty" id="prisonCounty" lay-filter="prisonCounty" lay-verify="required">

            </select>
        </div>
    </div>
    <div class="layui-form-item layui-hide">
        <label class="layui-form-label"><span class="edit-verify-span">*</span>地区代码</label>
        <div class="layui-input-inline">
            <input type="input" name="areaCode" maxlength="200"  placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item layui-hide">
        <label class="layui-form-label"><span class="edit-verify-span">*</span>地区名称</label>
        <div class="layui-input-inline">
            <input type="input" name="areaName" maxlength="200"  placeholder="请输入" autocomplete="off" class="layui-input">
        </div>
    </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="tOrgEdit_submit"  id="tOrgEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/loadJsonData.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/system/tOrgEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>