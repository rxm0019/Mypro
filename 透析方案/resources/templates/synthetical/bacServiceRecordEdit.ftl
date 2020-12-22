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
    .layui-row .disui-form-flex>label{
        flex-basis: 110px;
    }
    .layui-table-view{
        height: 300px;
    }
</style>
<body ms-controller="bacServiceRecordEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="bacServiceRecordEdit_form" id="bacServiceRecordEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="serviceRecordId" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>设备类型：</label>
                    <select name="deviceType" lay-filter="deviceType" lay-verify="required" :attr="@disabled">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('deviceType')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>选择设备：</label>
                    <select name="deviceId" lay-verify="required" :attr="@disabled">
                        <option value=""></option>
                        <option  ms-attr="{value:el.codeNo}" ms-text="@el.deviceName"
                                 ms-for="($index, el) in deviceList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2" ms-if="@serviceType=='0'">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>维护计划类型：</label>
                    <select name="servicePlanType" lay-verify="required" :attr="@disabled">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('MaintenanceType')"></option>
                    </select>
                </div>
            </div>
    </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>维护人员：</label>
                    <input type="text" name="accendant" maxlength="32" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>维护日期：</label>
                    <input type="text" name="serviceDate"  id="serviceDate" autocomplete="off" :attr="@readonly">
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <table id="bacServiceConfigList_table" lay-filter="bacServiceConfigList_table"></table>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacServiceRecordEdit_submit" id="bacServiceRecordEdit_submit">提交</button>
        </div>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacServiceRecordEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>