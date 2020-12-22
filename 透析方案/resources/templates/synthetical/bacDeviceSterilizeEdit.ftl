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
<body ms-controller="bacDeviceSterilizeEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="bacDeviceSterilizeEdit_form" id="bacDeviceSterilizeEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="deviceSterilizeId" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>设备类型：</label>
                    <select name="deviceType" lay-verify="required"  lay-filter="deviceType" :attr="@disabled">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in deviceTypeList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>选择设备：</label>
                    <select name="deviceId" lay-verify="required" :attr="@disabled">
                        <option value=""></option>
                        <option  ms-attr="{value:el.codeNo}" ms-text="@el.deviceName"
                                 ms-for="($index, el) in deviceList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>消毒日期：</label>
                    <input type="text" name="sterilizeDate"  id="sterilizeDate" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>开始时间：</label>
                    <input type="text" name="startDate"  id="startDate" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>结束时间：</label>
                    <input type="text" name="endDate"  id="endDate" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>消毒人：</label>
                    <input type="text" name="operatorUser" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>备注：</label>
                    <textarea name="remarks" maxlength="200" class="layui-textarea" :attr="@readonly"></textarea>
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacDeviceSterilizeEdit_submit" id="bacDeviceSterilizeEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacDeviceSterilizeEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>