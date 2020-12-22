<#include "../base/common.ftl">
<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/dis_dialysis_layout.css?t=${currentTimeMillis}"/>
</head>
<style type="text/css">
    /** 侧边栏 **/
    .patient-layout-side {
        top: 62px;
        height: calc(100vh - 66px - 10px - 10px);
    }

    .order-layui-body {
        top: 62px;
        left: calc(200px + 10px + 10px);
        width: calc(100% - 200px - 10px - 22px);
        height: calc(100vh - 66px - 10px - 10px);
    }
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="dryWeightAdjust">
<div>
    <div class="order-layout-header">
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form">
            <div class="layui-form-item condition-box">
                <div class="layui-inline" style="width:300px;">
                    <label class="layui-form-label">开始日期：</label>
                    <div class="layui-input-inline">
                        <input type="text" id="shiftDate_begin" readonly placeholder="yyyy-MM-dd"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline" style="width:300px;">
                    <label class="layui-form-label">结束日期：</label>
                    <div class="layui-input-inline">

                        <input type="text" id="shiftDate_end" readonly placeholder="yyyy-MM-dd" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline" style="width:300px;">
                    <label class="layui-form-label">客户类型：</label>
                    <div class="layui-input-inline">
                        <div class="layui-input-inline">
                            <select id="customerType" name="customerType" lay-filter="customerType"></select>
                        </div>
                    </div>
                </div>
                <div class="layui-inline" style="width:300px;">
                    <div class="disui-form-flex">
                        <label class="layui-form-label">中心：</label>
                        <div class="layui-input-inline">
                            <select id="regionId" name="regionId" lay-filter="regionId">
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-inline">
                    <div class="disui-form-flex">
                        <button
                                class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" style="margin-left: 5px;" onclick="searchOrder()">搜索
                        </button>
                        <button :visible="@baseFuncInfo.authorityTag('patReport#getDryWeightList')"
                                class="layui-btn layui-btn-dis-xs layui-btn-dissub" onclick="onExportExcel()">导出</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <#-- 侧边栏 -->
    <div class="patient-layout-side layui-card ">
        <div class="patient-search layui-form" lay-filter="orderLayout_searchOrder">
            <div class="layui-form-item">
                <div class="layui-input-inline title-line">
                    患者列表
                </div>
            </div>
        </div>
        <#-- 患者列表  ms-visible="@patientList.isShow" -->
        <div class="patient-layout-side-list">
            <div class="layui-side-scroll">
                <div style="position: relative;">
                    <input type="text" id="patName" placeholder="患者姓名" class="layui-input" style="height: 32px;">
                    <i class="layui-icon layui-icon-search"
                       style="position: absolute;right: 6px;top: 3px;font-size: 24px;"
                       onclick="getPatientList()"></i>
                </div>
                <div class="patient-dropdown-item"  ms-for="($index,el) in @patientList.data" onclick="onSelectedPatientInfo(this)"
                     :attr="{'data-patient-id': @el.patientId, 'data-patient-name': @el.patientName, 'data-patient-record-no': @el.patientRecordNo,
                     'data-gender': @el.gender, 'data-age': @el.age, 'data-patient-photo': '@el.patientPhoto'}">
                    <div class="patient-photo-box">
                        <img ms-attr="{'src': @el.patientPhoto, 'data-gender': @el.gender}" onerror="onPatientPhotoError(this)">
                    </div>
                    <div class="patient-info-box">
                        <div class="patient-info-row">
                            <label class="patient-name">{{el.patientName}}</label>
                            <label class="patient-age">{{el.age}}岁</label>
                            <img class="patient-sex" ms-attr="{'src': '${ctxsta}' + @el.sexPic}">
                        </div>
                        <div class="patient-info-row" >
                            <label class="patient-record-no">{{el.patientRecordNo}}</label>
                        </div>
                        <div class="patient-info-row">
                            <div ms-visible="@el.infectionStatus != null && @el.infectionStatus != ''">
                                <div class="layui-btn layui-btn-warm layui-btn-radius layui-btn-xs patient-infection-status" ms-for="infection in @el.infectionStatus">
                                    {{infection}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <#-- 主体内容 -->
    <div class="layui-card order-layui-body">
        <div class="layui-card-body" style="padding: 5px;">
            <#-- 功能页面 -->
            <div style="padding-top: 5px;">
                <table id="dryWeightAdjust_table" lay-filter="dryWeightAdjust_table"></table>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/report/dryWeightAdjust.js?t=${currentTimeMillis}"></script>
<!--覆盖表格样式，由于表格样式优先级较高，所以放在底部-->
<style>
    [data-field="bacDevices"] > .layui-table-cell {
        margin: 0;
        padding: 0;
        height: unset;
    }
</style>
</body>
</html>