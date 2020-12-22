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
    .layui-form-item .layui-input-inline {
        width: 160px;
    }
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="orderQuery">
<div>
    <#-- 头部查询 -->
    <div class="order-layout-header">
        <div class="layui-form layuiadmin-card-header-auto search-form" style="padding: 10px !important;">
            <div class="layui-form-item condition-box">
                <div class="layui-inline schedule-shift-options">
                    <div class="tab-item" ms-for="($index, el) in scheduleShiftList" ms-attr="{value:el.value}" ms-text="@el.name" onclick="clickScheduleShift(this)"></div>
                </div>
                <div class="layui-inline" style="width:260px;">
                    <label class="layui-form-label">中心：</label>
                    <div class="layui-input-inline">
                        <select id="hospitalNo" name="hospitalNo"></select>
                    </div>
                </div>
                <div class="layui-inline" style="width:260px;">
                    <label class="layui-form-label">医嘱名称：</label>
                    <div class="layui-input-inline">
                        <input type="text" id="orderContent" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline" style="width: 260px;">
                    <label class="layui-form-label">开嘱医生：</label>
                    <div class="layui-input-inline">
                        <input type="text" id="establishUserName" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline" style="height: 30px;">
                    <label class="layui-form-label">医嘱类别：</label>
                    <div class="layui-input-block" style="line-height: 30px;">
                        <input type="radio" name="category" lay-filter="category" value="0" title="长期医嘱" checked>
                        <input type="radio" name="category" lay-filter="category" value="1" title="执行医嘱">
                        <input type="radio" name="category" lay-filter="category" value="2" title="开药处方">
                    </div>
                </div>
                <div class="layui-inline" style="height: 30px;">
                    <label class="layui-form-label">开嘱日期：</label>
                    <div class="layui-input-block">
                        <div class="layui-input-inline">
                            <input type="text" id="establishDate_begin" placeholder="yyyy-MM-dd" class="layui-input">
                        </div>
                        <div class="layui-form-mid layui-word-aux"> - </div>
                        <div class="layui-input-inline">
                            <input type="text" id="establishDate_end" placeholder="yyyy-MM-dd" class="layui-input">
                        </div>
                    </div>
                </div>

                <div class="layui-inline" style="width:260px;">
                    <label class="layui-form-label">类型：</label>
                    <div class="layui-input-inline">
                        <select id="orderType" lay-filter="orderType">
                            <option value=""></option>
                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                    ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('OrderType')"></option>
                        </select>
                    </div>
                </div>
                <div class="layui-inline" style="width:260px;" id="orderSubTypeDiv">
                    <label class="layui-form-label">子类型：</label>
                    <div class="layui-input-inline">
                        <select id="orderSubType" name="orderSubType">
                            <option value=""></option>
                            <option ms-attr="{value:el.value}" ms-text="@el.name"
                                    ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('MedicalTherapy')"></option>
                        </select>
                    </div>
                </div>
                <div class="layui-inline" style="height: 30px;">
                    <label class="layui-form-label">查询模式：</label>
                    <div class="layui-input-block" style="line-height: 30px;">
                        <input type="radio" name="queryMode" lay-filter="queryMode" value="0" title="所有患者" checked>
                        <input type="radio" name="queryMode" lay-filter="queryMode" value="1" title="单个患者">
                    </div>
                </div>
                <div class="layui-inline">
                    <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" style="margin-left: 5px;" onclick="searchFun()">搜索</button>
                </div>

            </div>
        </div>
    </div>

    <#-- 侧边栏 -->
    <div ms-if="showPatientSide" class="patient-layout-side layui-card">
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

    <#-- 主体内容 -->
    <div class="layui-card order-layui-body">

        <div class="layui-card-body" style="padding: 5px;">

            <div style="padding: 5px 0;">
                <button class="layui-btn layui-btn-dismain" :visible="@baseFuncInfo.authorityTag('orderQuery#exportOtherOrderExcel') || @baseFuncInfo.authorityTag('orderQuery#exportExecuteOrderExcel')" onclick="exportOrderExcel()">导出</button>
                <button class="layui-btn layui-btn-dissub" :visible="@baseFuncInfo.authorityTag('orderQuery#printWord')" onclick="printOrderWord()">打印</button>
            </div>

            <div ms-if="@currentPatient.patientId!=''" class="layui-row layui-col-space1" style="margin-bottom: 0;display: flex;align-items: center;" >
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
                <table id="orderQuery_table" lay-filter="orderQuery_table"></table>
            </div>
        </div>

    </div>

</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/report/orderQuery.js?t=${currentTimeMillis}"></script>
</body>
</html>