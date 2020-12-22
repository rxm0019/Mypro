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

<body ms-controller="diaDoctorShiftDetail">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="diaDoctorShiftEdit_form" id="diaDoctorShiftEdit_form">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label>交班类型：</label>
                    <div>
                        <input type="radio" name="shiftType" lay-filter="shiftType" value="1" title="班次" disabled>
                        <input type="radio" name="shiftType" lay-filter="shiftType" value="2" title="肾友" disabled>
                    </div>
                </div>
            </div>
            <div id="shiftDoctorNameColumn" class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label>交班班次：</label>
                    <input type="text" name="scheduleShiftName" readonly>
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="dis-partition-header">
                    <div class="quote">病患名单</div>
                </div>
                <div class="mt-10 pl-10 pr-10" style="border: 1px solid #EFEFEF; border-radius: 10px;">
                    <table id="patientList_table" lay-filter="patientList_table"></table>
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1 mt-20">
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label>交班日期：</label>
                    <input type="text" name="shiftDate" readonly>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                <div class="disui-form-flex">
                    <label>交班人：</label>
                    <input type="text" name="shiftDoctorName" readonly>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label>接班人：</label>
                    <input type="text" name="replaceDoctorName" readonly>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label>内容：</label>
                    <textarea type="text" name="remarks" lay-verify="required" readonly rows="5"></textarea>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaDoctorShiftDetail.js?t=${currentTimeMillis}"></script>

</body>
</html>
