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
<body ms-controller="diaPrescriptionItemEdit">
<div class="layui-form" lay-filter="diaPrescriptionItemEdit_form" id="diaPrescriptionItemEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="prescriptionItemId"autocomplete="off">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label">处方名称</label>
                        <input type="text" name="materielName" id="materielName" maxlength="50" autocomplete="off" disabled>
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label">生产厂家</label>
                        <input type="text" name="manufactor" id="manufactor" maxlength="50" autocomplete="off" disabled>
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label"><span class="edit-verify-span" ms-css="{display: @isLock==='Y' && (@type==='1' || @type==='2') ? 'inline-block' : 'none'}">*</span>批号</label>
                        <select name="batchNo" id="batchNo">
                            <option value=""></option>
                            <option ms-attr="{value:el.batchNo}" ms-text="@el.batchNo"
                                    ms-for="($index, el) in materielList"></option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label"><span class="edit-verify-span">*</span>数量</label>
                        <input type="text" name="useNumber" lay-verify="required" maxlength="9" autocomplete="off">
                    </div>
                </div>
            </div>

        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="diaPrescriptionItemEdit_submit" id="diaPrescriptionItemEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaPrescriptionItemEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>