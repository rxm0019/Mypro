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
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<style>
    .layui-table-view .layui-table td, .layui-table-view .layui-table th {
        border-top: unset !important;
        border-left: unset !important;
    }
    .layui-table td{
        padding: 9px 0px !important;
    }
    .layui-table-cell {
        padding: 0 !important;
    }
    .border-input{
        border: none !important;
        border-radius: 0 !important;
        border-bottom: solid 0.5px rgba(83, 100, 113,0.5) !important;
    }

    /*输入框*/
    .report .layui-row .disui-form-flex>label {
        flex: unset !important;

    }
    .report .layui-form-label {
        width: unset !important;
        min-width: 85px !important;
    }

    .report .layui-table thead tr, .layui-table-header, .layui-table-mend, .layui-table-patch {
        background-color: unset !important;
        color: unset !important;
    }

    .report .layui-table tbody tr:hover,.report .layui-table thead tr,.report .layui-table-click,
    .report .layui-table-header,.report .layui-table-hover,.report .layui-table-mend,.report .layui-table-patch,
    .report .layui-table-tool,.report .layui-table-total,.report .layui-table-total tr,
    .report .layui-table[lay-even] tr:nth-child(even) {
        border: solid;
        border-width: 1px;
        border-color: rgb(230, 230, 230);
        background-color: unset !important;
        color: unset !important;
    }

    .divarea{
        flex: 1 10 0px;flex-grow: 1; flex-shrink: 10;
        flex-basis: 0px;
        width: 0px;
        padding-left: 10px;
        /*padding: 5px 10px;*/
        /*border: 0.5px solid rgba(83, 100, 113, 0.5);*/
        /*border-radius: 6px;*/
        /*margin: 3px;*/
        /*min-height: 30px;*/
    }
    .layui-row .disui-form-flex > input {
        background-color: unset !important;
        margin: unset !important;
        min-height: unset !important;
    }

    .layui-row .disui-form-flex>label {
         line-height: unset !important;
    }

    .layui-form-label {
         height: unset !important;
         line-height: unset !important;
    }
</style>
<body ms-controller="diaRecordReport">
<div class="layui-fluid">
    <div class="layui-card-body" style="background-color: rgb(255, 255, 255);">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="diaRecordReport_search" lay-filter="diaRecordReport_search" style="border-bottom: 1px solid #f6f6f6;">
        </div>

        <!--工具栏的按钮的div，注意：需要增加权限控制-->
        <div style="padding: 10px 10px 0px 10px;" id="patPatientReport_tool">
            <button class="layui-btn layui-btn-dissub" :visible="@baseFuncInfo.authorityTag('diaRecordReport#export')"
                    onclick="exportPDF()">导出</button>
        </div>

        <div style="width: 24%;float: left;">
            <!--table定义-->
            <table id="diaRecordReport_table" lay-filter="diaRecordReport_table"></table>
        </div>
        <div style="width: 75%;float: right;overflow: auto;height: calc(100vh - 130px);" class="report">
            <div class="layui-form" lay-filter="diaRecordReport_form" id="diaRecordReport_form">
                <div class="layui-row" style="text-align: center;">
                    <h2 style="margin: 10px;">血液透析（滤过）记录表单</h2>
                </div>

                <table cellspacing="0" cellpadding="0" border="0" class="layui-table last-table" style="margin-bottom: 15px;">
                    <tr>
                        <td colspan="3">
                            <div style="text-align: center">
                                <label>治疗日期：</label>
                                <input type="text" name="dialysisDateStr" style="border: none;" readonly>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div class="layui-row">
                                <div class="layui-col-sm4">
                                    <div class="disui-form-flex" >
                                        <label class="layui-form-label">姓名：</label>
                                        <input type="text" name="patientName"  style="border: none;background-color: unset;" readonly>
                                    </div>
                                </div>
                                <div class="layui-col-sm4">
                                    <div class="disui-form-flex" >
                                        <label class="layui-form-label">性别：</label>
                                        <input type="text" name="gender"  style="border: none;background-color: unset;" readonly>
                                    </div>
                                </div>
                                <div class="layui-col-sm4">
                                    <div class="disui-form-flex" >
                                        <label class="layui-form-label">透析机号：</label>
                                        <input type="text" name="bedNo" style="border: none;background-color: unset;" readonly>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div class="layui-row">
                                <div class="disui-form-flex" >
                                    <label class="layui-form-label">上机前病情：</label>
                                    <div class="divarea" name="illness" ms-text="@illness">
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div class="layui-row">
                                <div class="disui-form-flex" >
                                    <label class="layui-form-label">治疗方式：</label>
                                    <input type="text" name="dialysisMode" style="border: none;" readonly>
                                </div>
                            </div>
                        </td>
                        <td style="width: 33%">
                            <div class="layui-row">
                                <div class="disui-form-flex" >
                                    <label class="layui-form-label">治疗时间：</label>
                                    <input type="text" name="dialysisRealTime" style="border: none;" readonly>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div class="layui-row">
                                <div class="disui-form-flex" >
                                    <label class="layui-form-label">治疗抗凝：</label>
                                    <input type="text" name="anticoagulant" style="border: none;" readonly>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div class="layui-row">
                                <div class="layui-col-sm6">
                                    <div class="disui-form-flex" >
                                        <label class="layui-form-label">处方脱水量：</label>
<#--                                        <input type="text" name="parameterDehydration" style="border: none;" readonly>-->
                                        <label style="padding-left: 10px;min-width: 30px;text-align: left;">{{parameterDehydration}}</label>
                                        <label style="padding-left: 10px;">L</label>
                                    </div>
                                </div>
                                <div class="layui-col-sm6">
                                    <div class="disui-form-flex" >
                                        <label class="layui-form-label">透析液流量：</label>
<#--                                        <input type="text" name="replacementFluidFlow" style="border: none;" readonly>-->
                                        <label style="padding-left: 10px;min-width: 30px;text-align: left;">{{replacementFluidFlow}}</label>
                                        <label style="padding-left: 10px;">ml/min</label>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="layui-row">
                                <div class="disui-form-flex" >
                                    <label class="layui-form-label">医师签名：</label>
                                    <input type="text" name="doctorSign" style="border: none;" readonly>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="layui-row">
                                <div class="disui-form-flex" >
                                    <label class="layui-form-label">透析机：</label>
                                    <input type="text" name="modelNo" style="border: none;" readonly>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="layui-row">
                                <div class="disui-form-flex" >
                                    <label class="layui-form-label">透析(滤)器：</label>
                                    <input type="text" name="dialyzer" style="border: none;" readonly>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="layui-row">
                                <div class="disui-form-flex" >
                                    <label class="layui-form-label">透析液：</label>
                                    <input type="text" name="dialysateConcentration" style="border: none;" readonly>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div class="layui-row">
                                <div class="layui-col-sm8">
                                    <div class="disui-form-flex" >
                                        <label class="layui-form-label">血管通路：</label>
                                        <input type="text" name="vascularAccessId" style="border: none;" readonly>
                                    </div>
                                </div>
                                <div class="layui-col-sm4">
                                    <div class="disui-form-flex" >
                                        <label class="layui-form-label">穿刺者：</label>
                                        <input type="text" name="punctureUser" style="border: none;" readonly>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div style="text-align: center;">
                                治 疗 过 程 记 录
                            </div>
                        </td>
                    </tr>

                    <tr style="vertical-align: top;">
                        <td colspan="2" style="padding-top: 0px !important;">
                            <table cellspacing="0" cellpadding="0" border="0" class="layui-table" style="margin: 0 !important;">
                                <thead>
                                <tr>
                                    <th rowspan="2">
                                        <div style="text-align: center;">
                                            时间
                                        </div>
                                    </th>
                                    <th colspan="4">
                                        <div style="text-align: center;">透析参数</div>
                                    </th>
                                    <th colspan="4">
                                        <div style="text-align: center;">生命体征</div>
                                    </th>
                                </tr>
                                <tr>
                                    <th >
                                        <div style="text-align: center;">TMP<br/>mmHg</div>
                                    </th>
                                    <th >
                                        <div style="text-align: center;">静脉压<br/>mmHg</div>
                                    </th>
                                    <th >
                                        <div style="text-align: center;">血流量<br/>ml/min</div>
                                    </th>
                                    <th >
                                        <div style="text-align: center;">脱水量<br/>ml</div>
                                    </th>
                                    <th >
                                        <div style="text-align: center;">T<br/>°C</div>
                                    </th>
                                    <th >
                                        <div style="text-align: center;">HR<br/>bpm</div>
                                    </th>
                                    <th >
                                        <div style="text-align: center;">R<br/>bpm</div>
                                    </th>
                                    <th >
                                        <div style="text-align: center;">RP<br/>mmHg</div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr ms-for="($index, el) in @monitoringRecordData">
                                    <td style="text-align: center">{{el.monitorDate}}</td>
                                    <td style="text-align: center">{{el.transmembrane}}</td>
                                    <td style="text-align: center">{{el.veinPressure}}</td>
                                    <td style="text-align: center">{{el.bloodFlow}}</td>
                                    <td style="text-align: center">{{el.totalMoreDehydration}}</td>
                                    <td style="text-align: center">{{el.dialysateTemperature}}</td>
                                    <td style="text-align: center">{{el.pulse}}</td>
                                    <td style="text-align: center">{{el.respire}}</td>
                                    <td style="text-align: center">{{el.pressure}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                        <td style="padding-top: 0px !important;">
                            <table cellspacing="0" cellpadding="0" border="0" class="layui-table" style="margin: 0 !important;">
                                <thead>
                                <tr>
                                    <th colspan="2">
                                        <div style="text-align: center;">治疗中病情变化</div>
                                    </th>
                                </tr>
                                <tr>
                                    <th width="15%">
                                        <div style="text-align: center;">时间</div>
                                    </th>
                                    <th width="85%">
                                        <div style="text-align: center;">记  录</div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr ms-for="($index, el) in @diaUnusualItemList">
                                    <td style="text-align: center">{{el.monitorTime}}</td>
                                    <td style="padding-left: 5px !important;"><span ms-html="el.unusualDetails"></span></td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr style="vertical-align: top;">
                        <td colspan="2" style="padding-top: 0px !important;">
                            <table cellspacing="0" cellpadding="0" border="0" class="layui-table" style="margin: 0 !important;">
                                <thead>
                                <tr>
                                    <th width="10%">
                                        <div style="text-align: center;">时间</div>
                                    </th>
                                    <th width="70%">
                                        <div style="text-align: center;">医嘱执行记录</div>
                                    </th>
                                    <th width="10%">
                                        <div style="text-align: center;">执行</div>
                                    </th>
                                    <th width="10%">
                                        <div style="text-align: center;">核对</div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr ms-for="($index, el) in @diaExecuteOrderLists" >
                                    <td style="width: 60px;">
                                        <div style="text-align: center;">
                                            {{el.monitorTime}}
                                        </div>
                                    </td>
                                    <td>
                                        <div style="text-align: left;">
                                            {{el.orderContent}}
                                        </div>
                                    </td>
                                    <td style="width: 100px;">
                                        <div style="text-align: center;">
                                            {{el.executeOrderNurse}}
                                        </div>
                                    </td>
                                    <td style="width: 100px;">
                                        <div style="text-align: center;">
                                            {{el.checkOrderNurse}}
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                        <td style="vertical-align: top;padding-top: 0px !important;">
                            <table cellspacing="0" cellpadding="0" border="0" class="layui-table" style="margin: 0 !important;">
                                <tr>
                                    <td>
                                        <div class="layui-row">
                                            <label style="float: left;padding-left: 5px;">上次透后体重</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="layui-row" style="text-align: center">
                                            <label >{{befAfterRealWeight}}</label>
                                            <label style="float: right;padding-right: 10px;">kg</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="layui-row">
                                            <label style="float: left;padding-left: 5px;">透前体重</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="layui-row" style="text-align: center">
                                            <label >{{beforeWeight}}</label>
                                            <label style="float: right;padding-right: 10px;">kg</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="layui-row">
                                            <label style="float: left;padding-left: 5px;">体重增加量</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="layui-row" style="text-align: center">
                                            <label >{{weightAdd}}</label>
                                            <label style="float: right;padding-right: 10px;">kg</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="layui-row">
                                            <label style="float: left;padding-left: 5px;">干体重(DW)</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="layui-row" style="text-align: center">
                                            <label >{{dryWeight}}</label>
                                            <label style="float: right;padding-right: 10px;">kg</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="layui-row">
                                            <label style="float: left;padding-left: 5px;">较干体重增加量</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="layui-row" style="text-align: center">
                                            <label>{{dryWeightAdd}}</label>
                                            <label style="float: right;padding-right: 10px;">kg</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="layui-row">
                                            <label style="float: left;padding-left: 5px;">净脱水量</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="layui-row" style="text-align: center">
                                            <label>{{machineDehydration}}</label>
                                            <label style="float: right;padding-right: 10px;">L</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="layui-row">
                                            <label style="float: left;padding-left: 5px;">透后体重</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="layui-row" style="text-align: center">
                                            <label>{{afterRealWeight}}</label>
                                            <label style="float: right;padding-right: 10px;">kg</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="layui-row">
                                            <label style="float: left;padding-left: 5px;">本次透析体重下降量</label>
                                        </div>
                                    </td>
                                    <td width="35%">
                                        <div class="layui-row" style="text-align: center">
                                            <label>{{afterWeightiLess}}</label>
                                            <label style="float: right;padding-right: 10px;">kg</label>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div class="layui-row">
                                <div class="disui-form-flex" >
                                    <label class="layui-form-label">治疗小结：</label>
                                    <div class="divarea" style="min-height: 50px;" name="summary" ms-text="@summary">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-row">
                                <div class="layui-col-sm4 layui-col-sm-offset4 ">
                                    <div class="disui-form-flex" >
                                        <label class="layui-form-label">医师签名：</label>
                                        <input type="text" name="doctorSign" style="border: none;" readonly>
                                    </div>
                                </div>
                                <div class="layui-col-sm4">
                                    <div class="disui-form-flex" >
                                        <label class="layui-form-label">护士签名：</label>
                                        <input type="text" name="principalNurse" style="border: none;" readonly>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div style="clear: both;"></div>
    </div>
</div>

<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/report/diaRecordReport.js?t=${currentTimeMillis}"></script>
</body>
</html>