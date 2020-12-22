<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/dis_dialysis_layout.css?t=${currentTimeMillis}" />
</head>
<style type="text/css">
    .patient-layout-side {
        top: 59px;
    }
    .order-layui-body {
        top: 59px;
        left: 220px;
        width: calc(100% - 200px - 10px - 22px);
    }
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="materialStatistics">
<div class="layui-fluid">

    <!-- 顶部搜索栏 -->
    <div class="order-layout-header">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="materialStatistics_search" lay-filter="materialStatistics_search" style="border-bottom: 1px solid #f6f6f6;">
        </div>
    </div>

    <#-- 侧边栏 -->
    <div class="patient-layout-side layui-card">
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
                    <i class="layui-icon layui-icon-search" style="position: absolute;right: 6px;top: 3px;font-size: 24px;" onclick="getPatientList()"></i>
                </div>
                <#-- 显示空提示或错误信息 -->
                <div ms-if="@patientList.errorMsg" class="patient-list-error">{{patientList.errorMsg}}</div>

                <div class="patient-dropdown-item"  ms-for="($index,el) in @patientList.data" onclick="onSelectedPatientInfo(this)"
                     :attr="{'data-patient-id': @el.patientId, 'data-patient-name': @el.patientName,
                     'data-patient-record-no': @el.patientRecordNo, 'data-gender': @el.gender, 'data-age': @el.age, 'data-patient-photo': @el.patientPhoto}">
                    <div class="patient-photo-box">
                        <img ms-attr="{'src': @el.patientPhoto, 'data-gender': @el.gender}" onerror="onPatientPhotoError(this)">
                    </div>
                    <div class="patient-info-box">
                        <div class="patient-info-row">
                            <label class="patient-name">{{el.patientName}}</label>
                            <label class="patient-age">{{el.age}}岁</label>
                            <img class="patient-sex" ms-attr="{'src': '${ctxsta}' + @el.sexPic}">
                        </div>
                        <div class="patient-info-row">
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

    <!-- 主题内容 -->
    <div class="layui-card order-layui-body">

        <div class="layui-card-body" style="padding: 5px;">

            <div style="padding: 5px 0;">
                <button class="layui-btn layui-btn-dismain" :visible="@baseFuncInfo.authorityTag('materialStatistics#exportMaterialExcel')" onclick="exportMaterialExcel()">导出</button>
            </div>

            <div class="layui-row layui-col-space1" style="margin-bottom: 0;display: flex;align-items: center;" >
                <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                    <label>病历号：<span ms-text="@currentPatient.patientRecordNo"></span></label>
                </div>
                <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                    <label>姓名：<span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 79%;float: right;"
                                    :attr="{title: @currentPatient.patientName}" ms-text="@currentPatient.patientName"></span></label>
                </div>
                <div class="layui-col-sm7 layui-col-md7 layui-col-lg7" style="text-align: right;">
                    <label>日期：<span>{{currentDate}}</span></label>
                </div>
            </div>

            <#-- 表格 -->
            <div class="layui-card-body" style="padding-top: 5px;">
                <table id="materialStatistics_table" lay-filter="materialStatistics_table"></table>
            </div>
        </div>

        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/report/materialStatistics.js?t=${currentTimeMillis}"></script>
</body>
</html>