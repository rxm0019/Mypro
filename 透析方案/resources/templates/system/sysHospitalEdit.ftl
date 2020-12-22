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
    <style>
        .layui-row .disui-form-flex > label {
            flex-basis: 120px;
        }
    </style>
</head>

<body ms-controller="sysHospitalEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="sysHospitalEdit_form" id="sysHospitalEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex">
                    <label class="layui-form-label">ID</label>
                    <input type="hidden" name="hospitalId" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>上级：</label>
                    <select name="superior" id="superior" :attr="{disabled: true}" lay-verify="superior">
                        <option value=""></option>
                        <option ms-for="($index, el) in @superiorOptions.platforms" ms-attr="{value: el.hospitalNo}"
                                ms-text="@el.hospitalName + '（' + @el.hospitalNo + '）'"></option>
                        <optgroup label="集团">
                            <option ms-for="($index, el) in @superiorOptions.group" ms-attr="{value: el.hospitalNo}"
                                    ms-text="@el.hospitalName + '（' + @el.hospitalNo + '）'"></option>
                        </optgroup>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>中心代码：</label>
                    <input type="text" name="hospitalNo" id="hospitalNo" maxlength="7" lay-verify="required|hospitalNo"
                           autocomplete="off" :attr="{readonly: true}">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>中心名称：</label>
                    <input type="text" name="hospitalName" maxlength="100" lay-verify="required" autocomplete="off"
                           :attr="{readonly: @readonly}">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">电话：</label>
                    <input type="text" name="tel" maxlength="30" autocomplete="off" :attr="{readonly: @readonly}">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md6 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">地址：</label>
                    <input type="text" name="address" maxlength="500" autocomplete="off" :attr="{readonly: @readonly}">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">医嘱显示价格：</label>
                    <select name="isPrice" maxlength="1" :attr="{disabled: @readonly}">
                        <option value='Y'>是</option>
                        <option value='N' selected>否</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">是否自动发药：</label>
                    <select name="isAutomatic" maxlength="1" :attr="{disabled: @readonly}">
                        <option value='Y'>是</option>
                        <option value='N' selected>否</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">是否自动编码：</label>
                    <select name="isNumber" maxlength="1" :attr="{disabled: @readonly}">
                        <option value='Y'>是</option>
                        <option value='N' selected>否</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">是否锁库：</label>
                    <select name="isLock" maxlength="1" :attr="{disabled: @readonly}">
                        <option value='Y'>是</option>
                        <option value='N' selected>否</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">处方笺打印：</label>
                    <select name="notesType" maxlength="1" :attr="{disabled: @readonly}">
                        <option value='1'>全部</option>
                        <option value='2' >精二</option>
                        <option value='3'>大类</option>
                        <option value='4' >用药途径</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">记录透析痕迹：</label>
                    <select name="isLog" maxlength="1" :attr="{disabled: @readonly}">
                        <option value='Y'>是</option>
                        <option value='N'>否</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">警示提前天数：</label>
                    <input type="number" name="days" maxlength="3" lay-verify="days"  autocomplete="off" :attr="{readonly: @readonly}">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">启用日期：</label>
                    <input type="text" name="openingDate" id="openingDate" placeholder="yyyy-MM-dd" autocomplete="off" :attr="{disabled: @readonly}">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>管理者MAIL：</label>
                    <input type="text" name="mail" maxlength="300" lay-verify="required"  autocomplete="off" :attr="{readonly: @readonly}">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">应收单对接Key：</label>
                    <input type="text" name="receivablesAppKey" maxlength="50"  autocomplete="off" :attr="{readonly: @readonly}">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex">
                    <label class="layui-form-label">状态：</label>
                    <div class="layui-input-block">
                        <input type="radio" lay-verify="radio" name="dataStatus"
                               ms-for="($index, el) in @dataStatusOptions"
                               ms-attr="{value: el.value, title: el.name, checked: true && $index == 0, disabled: @readonly}">
                    </div>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md6 layui-col-lg4">
                <div class="disui-form-flex">
                    <label class="layui-form-label">备注：</label>
                    <textarea type="text" name="remarks" maxlength="255" autocomplete="off" :attr="{readonly: @readonly}"></textarea>
                </div>
            </div>
            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2 layui-hide">
                <button class="layui-btn" lay-submit lay-filter="sysHospitalEdit_submit" id="sysHospitalEdit_submit">提交</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysHospitalEdit.js?t=${currentTimeMillis}"></script>

</body>
</html>
