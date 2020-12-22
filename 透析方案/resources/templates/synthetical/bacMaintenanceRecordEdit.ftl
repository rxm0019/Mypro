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
    .layui-row .disui-form-flex>label {
        flex: 0 0 110px;
    }
</style>
<body ms-controller="bacMaintenanceRecordEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="bacMaintenanceRecordEdit_form" id="bacMaintenanceRecordEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="maintenanceRecordId" placeholder="请输入" autocomplete="off">
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
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>故障：</label>
                    <input type="checkbox" name="malfunction" lay-filter="malfunction" value="故障" title="故障" checked="checked">
                    <input type="checkbox" name="malfunction" lay-filter="malfunction" value="维护" title="维护">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>工程师：</label>
                    <input type="checkbox" name="engineer" lay-filter="engineer" value="厂家工程师" title="厂家工程师" checked="checked">
                    <input type="checkbox" name="engineer" lay-filter="engineer" value="养可工程师" title="养可工程师">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>开始时间：</label>
                    <input type="text" name="startDate" id="startDate" onchange="getManHour()" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>维修日期：</label>
                    <input type="text" name="maintenanceDate" id="maintenanceDate" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>结束时间：</label>
                    <input type="text" name="endDate" id="endDate" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>总工时：</label>
                    <input type="text" name="manHour" id="manHour" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>故障现象：</label>
                    <textarea name="troubles" maxlength="200" :attr="@readonly"></textarea>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>维护/维修记录：</label>
                    <textarea name="maintenanceRecord" maxlength="200" :attr="@readonly"></textarea>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>处理结果：</label>
                    <textarea name="result" maxlength="200" :attr="@readonly"></textarea>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>维修/保养人：</label>
                    <input type="text" name="maintenanceUser" maxlength="32" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>确认人：</label>
                    <input type="text" name="affirmUser" maxlength="32" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>确认意见：</label>
                    <textarea name="affirmIdea" maxlength="200" :attr="@readonly"></textarea>
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacMaintenanceRecordEdit_submit" id="bacMaintenanceRecordEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacMaintenanceRecordEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>