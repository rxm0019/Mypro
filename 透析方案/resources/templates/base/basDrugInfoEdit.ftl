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
        .layui-row .disui-form-flex > label {
            flex-basis: 120px;
        }

        .layui-row .disui-form-flex > label:last-child {
            flex-basis: 90px;
        }
    </style>
</head>
<body ms-controller="basDrugInfoEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="basDrugInfoEdit_form" id="basDrugInfoEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label>ID</label>
                <div class="disui-form-flex">
                    <input type="hidden" name="drugInfoId" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>药品编码：</label>
                    <input type="text" name="materielNo" maxlength="32" lay-verify="required" ms-duplex="drugNo" :attr="@materielNo">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>药品名称：</label>
                    <input type="text" name="materielName" maxlength="50" lay-verify="required" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>拼音代码：</label>
                    <input type="text" name="pinyinCode" maxlength="50" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>一级分类：</label>
                    <select name="levelOne" ms-duplex="levelOneStr" lay-filter="levelOneStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.classificationCode}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @levelOneList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>规格：</label>
                    <input type="text" name="specifications" maxlength="50" lay-verify="required" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>预算显示名称：</label>
                    <input type="text" name="showName" maxlength="50" lay-verify="required" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>标准价格：</label>
                    <input type="text" name="costPrice" lay-verify="number" maxlength="10" :attr="@defaultPrice">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>二级分类：</label>
                    <select name="levelTwo" ms-duplex="levelTwoStr" lay-filter="levelTwoStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.classificationCode}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @levelTwoList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>采购单位：</label>
                    <select name="purchaseUnit" lay-verify="required">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('purSalesBaseUnit')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>库存上限：</label>
                    <input type="text" name="inventoryCap" lay-verify="required|number" maxlength="10" :attr="@readonly">
                    <label>（销售单位）</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>出库仓库：</label>
                    <select name="storageRoom" lay-verify="required">
                        <option value=""></option>
                        <option ms-attr="{value:el.warehouseId}" ms-text="@el.houseName"
                                ms-for="($index, el) in @warehouseList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>三级分类：</label>
                    <select name="levelThree" ms-duplex="levelThreeStr" lay-filter="levelThreeStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.classificationCode}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @levelThreeList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>销售单位：</label>
                    <select name="salesUnit" lay-verify="required">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('purSalesBaseUnit')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>库存下限：</label>
                    <input type="text" name="inventoryFloor" lay-verify="required|number" maxlength="10" :attr="@readonly">
                    <label>（销售单位）</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>批准文号：</label>
                    <input type="text" name="approvalNo" maxlength="50" lay-verify="required" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>四级分类：</label>
                    <select name="levelFour" ms-duplex="levelFourStr" lay-filter="levelFourStr">
                        <option value=""></option>
                        <option ms-attr="{value:el.classificationCode}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @levelFourList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>基本单位：</label>
                    <select name="basicUnit" lay-verify="required">
                        <option value=""></option>
                        <option ms-attr="{value:el.value}" ms-text="@el.name"
                                ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('purSalesBaseUnit')"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>保质期：</label>
                    <input type="text" name="qualityGuaranteePeriod" lay-verify="required|number" maxlength="10" :attr="@readonly">
                    <label>个月</label>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md8 layui-col-lg6">
                <div class="disui-form-flex">
                    <label>厂家：</label>
                    <input type="text" name="manufactor" maxlength="100" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>发票归类：</label>
                    <select name="invoiceClassification" lay-verify="required">
                        <option value=""></option>
                        <option ms-attr="{value:el.invoiceClassificationId}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @invoiceClassificationList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>医保编码：</label>
                    <input type="text" name="medicalInsuranceNo" maxlength="50" lay-verify="required"
                           autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md8 layui-col-lg6">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>产地：</label>
                    <input type="text" name="placeOfOrigin" maxlength="100" lay-verify="required" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>财务归类：</label>
                    <select name="financialClassification" lay-verify="required">
                        <option value=""></option>
                        <option ms-attr="{value:el.financialClassificationId}" ms-text="@el.classificationName"
                                ms-for="($index, el) in @financialClassificationList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>B2B编码：</label>
                    <input type="text" name="b2bNo" maxlength="50" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md8 layui-col-lg6">
                <div class="disui-form-flex">
                    <label>应用范围：</label>
                    <input type="text" name="scopeOfApplication" maxlength="200" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md8 layui-col-lg6">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>转换关系1：</label>
                    <input style="text-align:center;" type="text" name="conversionRel1Purchase" lay-verify="required|number" maxlength="10" :attr="@conversionRatioReadonly">
                    <label style="flex-basis: 10px; text-align:center"> : </label>
                    <input style="text-align:center;" type="text" name="conversionRel1Sales" lay-verify="required|number" maxlength="10" :attr="@conversionRatio">
                    <label style="flex-basis: 250px; text-align:center; color: red"> 转换关系说明：【采购单位 : 销售单位】 </label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>出库方式：</label>
                    <input type="radio" lay-verify="radio" name="warehouseOutMode"
                           ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('warehouseOutMode')">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>种类：</label>
                    <input type="radio" lay-verify="radio" name="drugType"
                           ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('drugType')">
                </div>
            </div>
            <div class="layui-col-sm8 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>转换关系2：</label>
                    <input style="text-align:center;" type="text" name="conversionRel2Sales" lay-verify="required|number" maxlength="10" :attr="@conversionRatioReadonly">
                    <label style="flex-basis: 10px; text-align:center"> : </label>
                    <input style="text-align:center;" type="text" name="conversionRel2Basic" lay-verify="required|number" maxlength="10" :attr="@conversionRatio">
                    <label style="flex-basis: 250px; text-align:center; color: red"> 转换关系说明：【销售单位 : 基本单位】 </label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>允许拆分发药：</label>
                    <input type="radio" lay-verify="radio" name="allowSplitDispense"
                           ms-attr="{value:el.value,title:el.name,checked:true&&$index==1}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('YesOrNo')">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md4 layui-col-lg3">
                <div class="disui-form-flex">
                    <label>状态：</label>
                    <input type="radio" lay-verify="radio" name="dataStatus"
                           ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label>备注：</label>
                    <textarea name="remarks" maxlength="21845" autocomplete="off" :attr="@readonly"></textarea>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="basDrugInfoEdit_submit" id="basDrugInfoEdit_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/base/basDrugInfoEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>