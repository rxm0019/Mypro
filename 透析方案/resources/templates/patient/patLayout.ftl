<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/dis_patient_layout.css?t=${currentTimeMillis}" />
</head>
<body ms-controller="patLayout">
<div class="patient-layout">
    <#-- 头部查询 -->
    <div class="patient-layout-header">
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="patLayout_search" lay-filter="patLayout_search">
        </div>
    </div>

    <#-- 侧边栏 -->
    <div class="patient-layout-side layui-card">
        <button :class="['layui-btn', 'layui-btn-sm', 'patient-list-dropdown', (@patientList.isShow ? 'opend' : '')]" onclick="togglePatientListDropdownShow()" >
            <span>患者列表&nbsp;</span>
            <i class="layui-icon layui-icon-triangle-d"></i>
        </button>

        <#-- 侧边栏菜单 -->
        <div class="layui-side-scroll patient-layout-side-menu">
            <#-- 菜单 -->
            <ul class="layui-nav layui-nav-tree">
                <#-- 一级菜单组 -->
                <li data-name="home" class="layui-nav-item" ms-for="($index,el) in @menuList">
                    <#-- 一级菜单项（无二级菜单） -->
                    <a ms-if="el.children.length == 0" href="javascript:;" ms-attr="{'data-href': @el.menuUrl}" lay-direction="2">
                        <cite style="font-size: 14px;" ms-text="@el.menuName"></cite>
                    </a>

                    <#-- 一级菜单项（有二级菜单） -->
                    <a ms-if="el.children.length > 0" href="javascript:;"  lay-direction="2">
                        <cite style="font-size: 14px;"  ms-text="@el.menuName"></cite>
                        <span class="layui-nav-more"></span>
                    </a>
                    <#-- 二级菜单组 -->
                    <dl ms-if="el.children.length > 0" class="layui-nav-child">
                        <dd ms-for="($index2,e2) in el.children">
                            <#-- 二级菜单项 -->
                            <a href="javascript:;" ms-attr="{'data-href': @e2.menuUrl}">
                                <span class="layui-badge-dot"></span>
                                <cite>{{e2.menuName}}</cite>
                            </a>
                        </dd>
                    </dl>
                </li>
            </ul>
        </div>

        <#-- 侧边栏患者列表 -->
        <div class=" patient-layout-side-list" ms-visible="@patientList.isShow">
            <#-- 患者列表 -->
            <div class="layui-side-scroll">
                <#-- 显示空提示或错误信息 -->
                <div ms-if="@patientList.errorMsg" class="patient-list-error">{{patientList.errorMsg}}</div>

                <div class="patient-dropdown-item"  ms-for="($index,el) in @patientList.data" onclick="onSelectedPatientInfo(this)"
                     :attr="{'data-patient-id': @el.patientId, 'data-patient-name': @el.patientName,'data-patient-photo': @el.patientPhoto, 'data-patient-record-no': @el.patientRecordNo, 'data-gender': @el.gender, 'data-age': @el.age, 'data-infection-status': @el.infectionStatus, 'data-customer-type': @el.customerType}">
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
                            <label :visible="@el.infectionStatus != null && @el.infectionStatus != ''" class="infection-status">{{el.infectionStatus}}</label>
                        </div>
                    </div>
                </div>
            </div>

            <#-- 固定/取消固定按钮 -->
            <button class="layui-btn layui-btn-sm patient-list-fixed" onclick="togglePatientListDropdownFixed()" >
                <span>{{@patientList.isFixed ? '取消固定' : '固定'}}</span>
            </button>
        </div>
    </div>

    <#-- 患者概览信息 -->
    <div class="layui-card patient-brief-info">
        <div class="layui-card-body" style="height: 60px">
            <div ms-if="@currentPatient.patientId == null || @currentPatient.patientId == ''" style="text-align: center; color: #999; line-height: 60px;">
                请选择患者
            </div>

            <div ms-if="@currentPatient.patientId" class="layui-row layui-col-space1" style="margin-bottom: 0;display: flex;align-items: center;" >
                <div class="layui-col-sm1 layui-col-md1 layui-col-lg1">
                    <div style="text-align: center;width: 100%;height: 40px">
                        <img ms-attr="{'src': @currentPatient.patientPhoto, 'data-gender': @currentPatient.gender}" onerror="onPatientPhotoError(this)" style="width: 40px;height: 40px;border-radius: 50%;">
                    </div>
                </div>
                <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                    <label>姓名：<span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 79%;float: right;"
                                    :attr="{title: @currentPatient.patientName}" ms-text="@currentPatient.patientName"></span></label>
                </div>
                <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                    <label>病历号：<span ms-text="@currentPatient.patientRecordNo"></span></label>
                </div>
                <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                    <label>性别：<span ms-text="@currentPatient.genderDesc"></span></label>
                </div>
                <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                    <label>年龄：<span ms-text="@currentPatient.age"></span>岁</label>
                </div>
                <div class="layui-col-sm1 layui-col-md1 layui-col-lg1">
                    <label ms-if="@currentPatient.infectionStatus !=null && @currentPatient.infectionStatus !=''">
                        <span class="layui-btn layui-btn-warm layui-btn-radius layui-btn-xs" ms-text="@currentPatient.infectionStatus"></span>
                    </label>
                </div>
                <div class="layui-col-sm1 layui-col-md1 layui-col-lg1" style="height: 60px;text-align: right">
                        <span class="layui-btn layui-btn-sm layui-btn-radius" style="border-radius: 0 0 5px 5px;top:0;background-color: #1E9FFF;">
                            <span >{{currentPatient.customerType}}</span>
                        </span>
                </div>
            </div>
        </div>
    </div>
    <#-- 主体内容 -->
    <div class="patient-layui-body">
        <#-- 功能页面 -->
        <div class="layadmin-tabsbody-item layui-show">
            <div ms-if="@currentPageHref == null || @currentPageHref == ''" style="text-align: center; color: #999; line-height: 60px;">
                请选择功能菜单
            </div>
            <iframe ms-if="@currentPageHref" id="patientAppBodyIframe" src=""></iframe>
        </div>
    </div>
</div>

<script type="text/javascript" src="${ctxsta}/static/js/patient/patLayout.js?t=${currentTimeMillis}"></script>
</body>
</html>
