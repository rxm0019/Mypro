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
<style type="text/css">
    .layui-row .disui-form-flex > label {
        flex-basis: 140px;
    }
</style>
<body ms-controller="patOutInRecordEdit">
<div class="layui-form" lay-filter="patOutInRecordEdit_form" id="patOutInRecordEdit_form"
     style="padding: 20px 30px 0 0;">
    <div class="layui-form-item  layui-hide">
        <label class="layui-form-label">ID</label>
        <div class="layui-input-inline">
            <input type="hidden" name="outInId" placeholder="请输入"  >
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span"></span>患者姓名:</label>
            <input type="text" name="outInReason" maxlength="50" id="paintName" disabled placeholder="请输入"
                    :attr="{readonly: true}">
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span"></span>病历号:</label>
            <input type="text" name="outInReason" maxlength="50" id="patientRecordNo" disabled placeholder="请输入"
                    :attr="{readonly: true}">
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>转入/转出:</label>
            <input type="radio" name="outInType" lay-filter="outInType" value="0" title="转出" checked>
            <input type="radio" name="outInType" lay-filter="outInType" value="1" title="转入">
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>转归类型:</label>
            <select name="outcomeType" lay-filter="outcomeType">
                <option value=""></option>
                <option ms-if="!isShowReason" ms-attr="{value:el.value}" ms-text="@el.name"
                        ms-for="($index, el) in @dictOutInTypeY"></option>
                <option ms-if="isShowReason" ms-attr="{value:el.value}" ms-text="@el.name"
                        ms-for="($index, el) in @dictOutInTypeN"></option>
            </select>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>转归原因:</label>
            <select name="outInReason" lay-verify="fieldRequired"
                    data-field-name="转归原因">
                <option value=""></option>
                    <option ms-if="isShowReason" ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('OutReason')"></option>
                    <option ms-if="!isShowReason" ms-attr="{value:el.value}" ms-text="@el.name"
                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('InReason')"></option>
            </select>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span"></span>转归日期:</label>
            <input type="text" name="outInDatetime" id="outInDatetime" placeholder="yyyy-MM-dd" lay-verify="fieldRequired"
                   data-field-name="转归日期">
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span"></span>医生备注:</label>
            <textarea type="text" name="doctorRemarks" maxlength="500" rows="3" :attr="{readonly: @doctorReadOnly}"  ></textarea>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span"></span>护士备注:</label>
            <textarea type="text" name="nurseRemarks" rows="3" maxlength="500" :attr="{readonly: @nurseReadOnly}"  ></textarea>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span"></span>运营备注:</label>
            <textarea type="text" name="operateRemarks" rows="3" maxlength="500" :attr="{readonly: @operateReadOnly}"  ></textarea>
        </div>
    </div>
    <div class="layui-row layui-col-space1">
        <div class="disui-form-flex">
            <label class="layui-form-label"><span class="edit-verify-span"></span>备注:</label>
            <textarea type="text" name="remarks" rows="3" maxlength="500" :attr="{readonly: @otherReadOnly}"   ></textarea>
        </div>
    </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="patOutInRecordEdit_submit" id="patOutInRecordEdit_submit">提交
        </button>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patOutInRecordEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>