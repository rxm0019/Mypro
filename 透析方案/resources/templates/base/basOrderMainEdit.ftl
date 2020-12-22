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
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
</head>
<body ms-controller="basOrderMainEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="basOrderMainEdit_form" id="basOrderMainEdit_form"
         style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="orderMainId" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>医嘱名称：</label>
                    <input type="text" name="orderName" maxlength="200" lay-verify="required"
                           autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label class="layui-form-label">拼音代码：</label>
                    <input type="text" name="orderCode" maxlength="200" autocomplete="off"
                    >
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>医嘱类别：</label>
                    <select name="orderType" lay-verify="required" lay-filter="select">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @orderType"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="medicalTherapy" style="display: none">
                <div class="disui-form-flex">
                    <label class="layui-form-label">药疗分类：</label>
                    <select name="medicalTherapy" id="MedicalTherapy">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('MedicalTherapy')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="route" style="display: none">
                <div class="disui-form-flex">
                    <label class="layui-form-label">用药途径：</label>
                    <select name="route" id="Route">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Route')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="examination" style="display: none">
                <div class="disui-form-flex">
                    <label class="layui-form-label">检体：</label>
                    <select name="examination" id="Examination">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Examination')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label class="layui-form-label">单次剂量：</label>
                    <input type="text" name="singleDose" maxlength="50" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="specifications">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span layui-hide">*</span>规格：</label>
                    <input type="text" name="specifications" maxlength="50" autocomplete="off" id="Specifications">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="unit">
                <div class="disui-form-flex">
                    <label class="layui-form-label">单位：</label>
                    <input type="text" name="unit" maxlength="50" autocomplete="off" id="Unit">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label class="layui-form-label">频率：</label>
                    <select name="frequency">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('OrderFrequency')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label">数据状态：</label>
                    <div class="layui-input-block">
                        <input type="radio" name="dataStatus"
                               ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')">
                    </div>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label">备注：</label>
                    <div class="layui-input-block">
                        <textarea name="remarks" maxlength="10000" class="layui-textarea"></textarea>
                    </div>
                </div>

                <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                <div class="layui-form-item layui-hide">
                    <button class="layui-btn" lay-submit lay-filter="basOrderMainEdit_submit"
                            id="basOrderMainEdit_submit">
                        提交
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/base/basOrderMainEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>