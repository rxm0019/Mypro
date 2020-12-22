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
        .layui-row .disui-form-flex>label{
            flex-basis: 120px;
        }
    </style>

</head>
<body ms-controller="bacAreaSterilizeEdit">
<div class="layui-form" lay-filter="bacAreaSterilizeEdit_form" id="bacAreaSterilizeEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="areaSterilizeId" placeholder="请输入" autocomplete="off">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>消毒类型：</label>
                <select name="sterilizeType" lay-verify="required" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                             ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('regionDisinfectType')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label><span class="edit-verify-span">*</span>病区：</label>
                <select name="areaSterilize" ms-duplex="areaSterilize" lay-filter="areaSterilize" lay-verify="required" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.wardId}" ms-text="@el.wardName"
                             ms-for="($index, el) in @wardList"></option>
                </select>
            </div>
        </div>

        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex " >
                <label><span class="edit-verify-span">*</span>区域：</label>
                <select name="regionSterilize" ms-duplex="regionSterilize" lay-filter="regionSterilize" lay-verify="required" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.regionId}" ms-text="@el.regionName"
                             ms-for="($index, el) in @regionList"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>消毒日期：</label>
                <input type="text" name="sterilizeDate"  id="sterilizeDate" placeholder="yyyy-MM-dd" autocomplete="off" :attr="@disabled">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>消毒开始时间：</label>
                <input type="text" name="startSterilizeTime"  id="startSterilizeTime" autocomplete="off" :attr="@disabled">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>消毒结束时间：</label>
                <input type="text" name="endSterilizeTime"  id="endSterilizeTime" autocomplete="off" :attr="@disabled">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>消毒人：</label>
                <input type="text" name="sterilizeUser" maxlength="10" ms-duplex="sterilizeUser" autocomplete="off" :attr="@readonly">
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>备注：</label>
                <textarea rows="10" name="remarks" maxlength="21845" :attr="@readonly"></textarea>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacAreaSterilizeEdit_submit" id="bacAreaSterilizeEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacAreaSterilizeEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>