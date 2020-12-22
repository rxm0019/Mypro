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
    .layui-tab-title{
        margin: 0 20px;
        border-bottom: 2px solid #e5e5e5;
    }
    .layui-this{
        color: #33AB9F !important;
    }
    .layui-this:after{
        border-bottom: 2px solid #33AB9F !important;
    }
    .u400_div {
        margin-top: 10px;
        width: 99.2%;
        height: calc(100vh - 180px);
        background: #FFFFFF;
        border: 1px solid #EFEFEF;
        border-radius: 8px;
    }

    .u400_div_left {
        height: calc(100vh - 122px);
        margin-right: 10px;
    }

    .u400_div_right {
        height: calc(100vh - 122px);
        margin-right: 10px;
        margin-left: 5px;
        overflow: auto;
    }

    .u400_div_content {
        margin: 5%;
    }
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="stoDispensingList">
<div class="layui-fluid">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="stoDispensingList_search" lay-filter="stoDispensingList_search">
        </div>
        <div class="layui-card-body">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="u400_div u400_div_left ">


                    <button  class="layui-btn layui-btn-dismain"  onclick="tableReload()" style="margin: 5px" >刷新</button>
<#--                    <button  class="layui-btn layui-btn-dismain"  onclick="TestAuto()" >模拟自动发药 </button>-->
<#--                    <button  class="layui-btn layui-btn-dismain"  onclick="TestAutoBack()" >模拟自动退药 </button>-->

                    <!--table定义-->
                    <table id="stoDispensingList_table" lay-filter="stoDispensingList_table"></table>
                </div>
            </div>

            <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
                <div class="u400_div u400_div_right">
                    <div class="layui-tab layui-tab-brief" lay-filter="patOrderTab">
                        <!--页签-->
                        <div class="layui-tab-brief  layui-col-sm6 layui-col-md6 layui-col-lg6">
                            <ul class="layui-tab-title">
                                <li lay-id="details" class="layui-this">详情</li>
                                <li lay-id="overview">总览</li>
                            </ul>
                        </div>
                        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                            <!--工具栏的按钮的div，注意：需要增加权限控制-->
                            <div>
                                <button :visible="@baseFuncInfo.authorityTag('stoDispensingList#dispensingTreatment')"
                                        class="layui-btn layui-btn-dismain" onclick="dispensingTreatment()" ms-if="treatmentShow">发药-治疗区
                                </button>
                                <button :visible="@baseFuncInfo.authorityTag('stoDispensingList#dispensingDelivery')"
                                        class="layui-btn layui-btn-dismain" onclick="dispensingDelivery()" ms-if="deliveryShow">发药-出库
                                </button>
                                <button :visible="@baseFuncInfo.authorityTag('stoDispensingList#withDrawal')"
                                        class="layui-btn layui-btn-dismain" onclick="withDrawal()" ms-if="withDrawalShow">退药
                                </button>
                            </div>
                        </div>

                        <div class="layui-tab-content layui-col-sm12 layui-col-md12layui-col-lg12 ">
                            <div class="layui-tab-item layui-show">
                                <div id="view"></div>
                            </div>
                            <div class="layui-tab-item">
                                <div class="layui-form" action="" name="" lay-filter= "overviewDiv" id="overviewDiv">
                                    <div class="layui-collapse" lay-filter="test" >
                                        <div class="layui-colla-item">
                                            <p class="layui-colla-title">基本资料</p>
                                            <div class="layui-colla-content layui-show">
                                                <div class="layui-row layui-col-space1">
                                                    <!--table定义-->
                                                    <table id="stoAllPatientList_table"
                                                           lay-filter="stoAllPatientList_table"></table>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-colla-item" id="drugList">
                                            <p class="layui-colla-title">药品清单</p>
                                            <div class="layui-colla-content layui-show">
                                                <div class="layui-row layui-col-space1">
                                                    <!--table定义-->
                                                    <table id="stoAllDrugList_table"
                                                           lay-filter="stoAllDrugList_table"></table>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-colla-item" id="consumablesList">
                                            <p class="layui-colla-title">耗材清单</p>
                                            <div class="layui-colla-content layui-show">
                                                <div class="layui-row layui-col-space1">
                                                    <!--table定义-->
                                                    <table id="stoAllConsumablesList_table"
                                                           lay-filter="stoAllConsumablesList_table"></table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/stock/stoDispensingList.js?t=${currentTimeMillis}"></script>
</body>
<!-- //第一步：编写模版。你可以使用一个script标签存放模板，如： -->
<script id="detailsHTML" type="text/html">
    <ul>
        {{# layui.each(d.bizData, function(index, item){ }}
        <div class="layui-form" action="" name="" lay-filter= {{"stoDispensingList_form_" + index}} id={{"stoDispensingList_form_" + index}}>
            <div class="layui-collapse" lay-filter="test" >
                <div class="layui-colla-item">
                    <p class="layui-colla-title">基本资料</p>
                    <div class="layui-colla-content layui-show">
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>姓名：<span>{{item.patient.patientName}}</span></label>
                            </div>
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>性别：<span>{{item.patient.sex}}</span></label>
                            </div>
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>年龄：<span>{{item.patient.age}}</span></label>
                            </div>
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>医保卡号：<span>{{item.patient.socialSecurityNo}}</span></label>
                            </div>
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>病历号：<span>{{item.patient.patientRecordNo}}</span></label>
                            </div>
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>收费类型：<span>{{item.patient.insuranceNm}}</span></label>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>医生姓名：<span>{{item.patient.doctorName}}</span></label>
                            </div>
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>西药费：<span>{{item.patient.westernMedicineFee}}</span></label>
                            </div>
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>中成药费：<span>{{item.patient.chineseMedicineFee}}</span></label>
                            </div>
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>耗材费用：<span>{{item.patient.consumablesCost}}</span></label>
                            </div>
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2 title-info">
                                <label>发药状态：<span>{{item.patient.statusNm}}</span></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-colla-item" id="drugList">
                    <p class="layui-colla-title">药品清单</p>
                    <div class="layui-colla-content ">
                        <div class="layui-row layui-col-space1">
                            <!--table定义-->
                            <table id={{"stoDispensingDrugList_table_" + index}}
                                   lay-filter={{"stoDispensingDrugList_table_" + index}}></table>
                        </div>
                    </div>
                </div>
                <div class="layui-colla-item" id="consumablesList">
                    <p class="layui-colla-title">耗材清单</p>
                    <div class="layui-colla-content ">
                        <div class="layui-row layui-col-space1">
                            <!--table定义-->
                            <table id={{"stoDispensingConsumablesList_table_" + index}}
                                   lay-filter={{"stoDispensingConsumablesList_table_" + index}}></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr class="">
        {{# }); }}
    </ul>
</script>
<script type="text/html" id="batchNo">
    {{# console.log(d) }}

    <select name="batchNo" lay-verify="required" lay-filter={{"batchNo_" + d.dispensingDrugId}} lay-search id={{"select_" + d.dispensingDrugId}}>
        <option value=""></option>
        {{# layui.each(d.batchNoList, function(node, item){ }}
        <option value={{ item }}>{{ item }}</option>
        {{# }); }}
    </select>
</script>
<style>
    /* 防止下拉框的下拉列表被隐藏---必须设置 */

    [data-field="batchNo"] .layui-table-cell,
    .layui-table-tool-panel li {
        overflow: visible !important;
    }
</style>
</html>