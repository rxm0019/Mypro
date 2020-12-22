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
        flex: 0 0 130px;
    }
    .layui-elem-field {
        margin: 10px!important;
    }
    .layui-elem-field legend {
        font-size: 14px;
    }
</style>
<body ms-controller="bacWaterSterilizeEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="bacWaterSterilizeEdit_form" id="bacWaterSterilizeEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="waterSterilizeId" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>选择设备：</label>
                    <select name="deviceId" :attr="@disabled">
                        <option value=""></option>
                        <option  ms-attr="{value:el.codeNo}" ms-text="@el.deviceName"
                                 ms-for="($index, el) in deviceList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>消毒日期：</label>
                    <input type="text" name="sterilizeDate" id="sterilizeDate" autocomplete="off" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>供水方式：</label>
                    <input type="radio" name="waterDelivery" value="产水直供" title="产水直供">
                    <input type="radio" name="waterDelivery" value="直供水带纯水回水箱" title="直供水带纯水回水箱">
                    <input type="radio" name="waterDelivery" value="储供" title="储供">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>消毒液品牌：</label>
                    <input type="text" name="disinfectantBrand" maxlength="20" :attr="@readonly">
                </div>
            </div>
        </div>
        <fieldset class="layui-elem-field layui-field-title">
            <legend>消毒液浓度配置</legend>
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>A+B瓶体积：</label>
                    <input type="text" name="abBluk" id="abBluk" onchange="peroxyaceticAcidChange()" :attr="@readonly">
                    <label>L</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>瓶标浓度：</label>
                    <input type="text" name="flaskConcentration" id="flaskConcentration" onchange="peroxyaceticAcidChange()" :attr="@readonly">
                    <label>%</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>过氧乙酸含量：</label>
                    <input type="text" name="peroxyaceticAcid" id="peroxyaceticAcid" readonly>
                    <label>L</label>
                </div>
            </div>
        </div>
        <fieldset class="layui-elem-field layui-field-title">
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>箱内纯水体积：</label>
                    <input type="text" name="cisternBluk" id="cisternBluk" placeholder="根据供水方式填写，没有的填0" onchange="solventBlukChange()" :attr="@readonly">
                    <label>L</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>主机内纯水体积：</label>
                    <input type="text" name="hostPureBluk" id="hostPureBluk" onchange="solventBlukChange()" :attr="@readonly">
                    <label>L</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>管道内纯水体积：</label>
                    <input type="text" name="pipePureBluk" id="pipePureBluk" placeholder="DN20管0.31L/m,DN25管0.49L/m" onchange="solventBlukChange()" :attr="@readonly">
                    <label>L</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>溶剂体积：</label>
                    <input type="text" name="solventBluk" id="solventBluk" readonly>
                    <label>L</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>最终消毒液浓度：</label>
                    <input type="text" name="endConcentration" id="endConcentration" readonly>
                    <label>%</label>
                </div>
            </div>
        </div>
        <fieldset class="layui-elem-field layui-field-title">
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>消毒开始时刻：</label>
                    <input type="text" name="sterilizeTime" id="sterilizeTime" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>循环时间：</label>
                    <input type="text" name="loopTime" maxlength="3" :attr="@readonly">
                    <label>min</label>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>浸泡时间：</label>
                    <input type="text" name="soakTime" maxlength="3" :attr="@readonly">
                    <label>min</label>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>冲洗开始时刻：</label>
                    <input type="text" name="swillTime" id="swillTime" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>消毒液排放：</label>
                    <input type="text" name="letOutTime" maxlength="3" :attr="@readonly">
                    <label>min</label>
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>纯水冲洗：</label>
                    <input type="text" name="pureWaterSwill" maxlength="3" :attr="@readonly">
                    <label>min</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>残留测试时刻1：</label>
                    <input type="text" name="vestigitalTimeOne" id="vestigitalTimeOne" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>消毒液残留1：</label>
                    <input type="text" name="vestigitalSterilizeOne" :attr="@readonly">
                    <label>mg/L</label>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>结论1：</label>
                    <textarea name="vestigitalResultOne" maxlength="100" :attr="@readonly"></textarea>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>残留测试时刻2：</label>
                    <input type="text" name="vestigitalTimeTwo" id="vestigitalTimeTwo" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>消毒液残留2：</label>
                    <input type="text" name="vestigitalSterilizeTwo" :attr="@readonly">
                    <label>mg/L</label>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>结论2：</label>
                    <textarea name="vestigitalResultTwo" maxlength="100"  :attr="@readonly"></textarea>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>残留测试时刻3：</label>
                    <input type="text" name="vestigitalTimeThree" id="vestigitalTimeThree" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>消毒液残留3：</label>
                    <input type="text" name="vestigitalSterilizeThree" :attr="@readonly">
                    <label>mg/L</label>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>结论3：</label>
                    <textarea name="vestigitalResultThree" maxlength="100"  :attr="@readonly"></textarea>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>备注：</label>
                    <textarea name="remarks" maxlength="10000" :attr="@readonly"></textarea>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>消毒操作人：</label>
                    <input type="text" name="operatorUser" maxlength="30" :attr="@readonly">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>残留确认人：</label>
                    <input type="text" name="affirmUser" maxlength="30" :attr="@readonly">
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="bacWaterSterilizeEdit_submit" id="bacWaterSterilizeEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacWaterSterilizeEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>