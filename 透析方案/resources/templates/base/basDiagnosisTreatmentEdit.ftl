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
    <style>
        .layui-row .disui-form-flex>label {
            display: inline-block;
            flex: 0 0 120px !important;
            line-height: 38px;
            text-align: right;
        }
    </style>
</head>
<body ms-controller="basDiagnosisTreatmentEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="basDiagnosisTreatmentEdit_form" id="basDiagnosisTreatmentEdit_form"
         style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label >ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="diagnosisTreatmentId" autocomplete="off"
                           :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label ><span class="edit-verify-span">*</span>诊疗项目编码：</label>
                    <input type="text" name="itemNo" maxlength="32" lay-verify="required"
                           autocomplete="off" :attr="@itemNo" ms-duplex="diagnosisNo">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label ><span class="edit-verify-span">*</span>诊疗项目名称：</label>

                    <input type="text" name="itemName" maxlength="50" lay-verify="required"
                           autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label ><span class="edit-verify-span">*</span>诊疗项目规格：</label>
                    <input type="text" name="specifications" maxlength="50" lay-verify="required"
                           autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label>一级分类：</label>
                    <select name="levelOne" ms-duplex="levelOneStr" lay-filter="levelOneStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.classificationCode}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @levelOneList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label >标准价格：</label>
                    <input type="text" name="costPrice"  autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label>二级分类：</label>
                    <select name="levelTwo" ms-duplex="levelTwoStr" lay-filter="levelTwoStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.classificationCode}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @levelTwoList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label ><span class="edit-verify-span">*</span>基本单位：</label>
                    <select name="basicUnit" lay-verify="required">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('baseUnit')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label>三级分类：</label>
                    <select name="levelThree" ms-duplex="levelThreeStr" lay-filter="levelThreeStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.classificationCode}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @levelThreeList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label ><span class="edit-verify-span">*</span>医保编码：</label>

                    <input type="text" name="medicalInsuranceNo" maxlength="50" lay-verify="required"
                           autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label>四级分类：</label>
                    <select name="levelFour" ms-duplex="levelFourStr" lay-filter="levelFourStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.classificationCode}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @levelFourList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>发票归类：</label>
                    <select name="invoiceClassification" lay-verify="required">
                        <option value=""></option>
                        <option ms-attr="{value:el.invoiceClassificationId}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @invoiceClassificationList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>财务归类：</label>
                    <select name="financialClassification" lay-verify="required">
                        <option value=""></option>
                        <option ms-attr="{value:el.financialClassificationId}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @financialClassificationList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label >排序号：</label>
                    <input type="text" name="orderNo" lay-verify="digital" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label >应用范围：</label>
                    <input type="text" name="scopeOfApplication" maxlength="200" autocomplete="off"
                           :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label>状态：</label>
                    <div class="layui-input-block">
                        <input type="radio" name="dataStatus"
                               ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注：</label>
                <div class="layui-input-block">
                    <textarea name="remarks" maxlength="10000" class="layui-textarea" :attr="@readonly"></textarea>
                </div>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="basDiagnosisTreatmentEdit_submit"
                        id="basDiagnosisTreatmentEdit_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/base/basDiagnosisTreatmentEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>