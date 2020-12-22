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
    .layui-elem-field {
        margin: 10px!important;
    }
    .layui-elem-field legend {
        font-size: 14px;
    }
</style>
<body ms-controller="bacWaterUseEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="bacWaterUseEdit_form" id="bacWaterUseEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6 layui-hide">
                <div class="disui-form-flex " >
                    <label>ID</label>
                    <input type="hidden" name="waterUseId" placeholder="请输入" autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label><span class="edit-verify-span">*</span>选择水机：</label>
                    <select name="deviceId" lay-verify="required" lay-search :attr="@disabled">
                        <option value=""></option>
                        <option  ms-attr="{value:el.codeNo}" ms-text="@el.deviceName"
                                 ms-for="($index, el) in deviceList"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>登记人：</label>
                    <input type="text" name="registerUser" maxlength="50" :attr="@readonly"/>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>登记日期：</label>
                    <input type="text" name="registerDate" id="registerDate" :attr="@readonly"/>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>运行情况：</label>
                    <input type="text" name="runStatus" maxlength="50" :attr="@readonly"/>
                </div>
            </div>
        </div>
        <fieldset class="layui-elem-field layui-field-title">
            <legend>自来水</legend>
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>水质：</label>
                    <input type="text" name="waterQuality" :attr="@readonly"/>
                    <label>us/cm</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>压力：</label>
                    <input type="text" name="hydraulicPressure" :attr="@readonly"/>
                    <label>kg/cm2</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>原水泵：</label>
                    <input type="text" name="rawPump" :attr="@readonly"/>
                    <label>kg/cm2</label>
                </div>
            </div>
        </div>
        <fieldset class="layui-elem-field layui-field-title">
            <legend>前置</legend>
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>沙滤：</label>
                    <input type="text" name="sandFiltration" :attr="@readonly"/>
                    <label>kg/cm2</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>树脂：</label>
                    <input type="text" name="resin" :attr="@readonly"/>
                    <label>kg/cm</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>加盐量：</label>
                    <input type="text" name="addSalt" :attr="@readonly"/>
                    <label>kg</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>活性炭：</label>
                    <input type="text" name="activatedCarbon" :attr="@readonly"/>
                    <label>kg/cm</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>滤芯后：</label>
                    <input type="text" name="filterAfter" :attr="@readonly"/>
                    <label>kg/cm2</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>软硬程度：</label>
                    <input type="text" name="softWaterHardness" :attr="@readonly"/>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>总氯：</label>
                    <input type="text" name="uhr" :attr="@readonly"/>
                </div>
            </div>
        </div>
        <fieldset class="layui-elem-field layui-field-title">
            <legend>一段</legend>
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>水质：</label>
                    <input type="text" name="waterQualityOne" :attr="@readonly"/>
                    <label>us/cm</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>纯水流量：</label>
                    <input type="text" name="pureWaterFlow" :attr="@readonly"/>
                    <label>lpm</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>浓水流量：</label>
                    <input type="text" name="thickWaterFlow" :attr="@readonly"/>
                    <label>lpm</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>进水压：</label>
                    <input type="text" name="inHydraulicPressure" :attr="@readonly"/>
                    <label>kg/cm2</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>出水压：</label>
                    <input type="text" name="outHydraulicPressure" :attr="@readonly"/>
                    <label>kg/cm2</label>
                </div>
            </div>
        </div>
        <fieldset class="layui-elem-field layui-field-title">
            <legend>二段</legend>
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>水质：</label>
                    <input type="text" name="waterQualityTwo" :attr="@readonly"/>
                    <label>us/cm2</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>纯水流量：</label>
                    <input type="text" name="pureWaterTwo" :attr="@readonly"/>
                    <label>lpm</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>浓水流量：</label>
                    <input type="text" name="thickWaterTwo" :attr="@readonly"/>
                    <label>lpm</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>进水压：</label>
                    <input type="text" name="inHydraulicTwo" :attr="@readonly"/>
                    <label>kg/cm2</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>出水压：</label>
                    <input type="text" name="outHydraulicTwo" :attr="@readonly"/>
                    <label>kg/cm2</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>PH值：</label>
                    <input type="text" name="ph" :attr="@readonly"/>
                </div>
            </div>
        </div>
        <fieldset class="layui-elem-field layui-field-title">
            <legend>输送压</legend>
        </fieldset>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>进水压：</label>
                    <input type="text" name="intoWater" :attr="@readonly"/>
                    <label>kg/cm2</label>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                <div class="disui-form-flex " >
                    <label>回水压：</label>
                    <input type="text" name="returnWater" :attr="@readonly"/>
                    <label>us/cm2</label>
                </div>
            </div>
        </div>
    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="bacWaterUseEdit_submit" id="bacWaterUseEdit_submit">提交</button>
    </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/synthetical/bacWaterUseEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>