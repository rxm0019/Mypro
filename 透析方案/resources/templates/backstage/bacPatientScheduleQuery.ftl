<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>

    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/bac_patient_schedule_query.css?t=${currentTimeMillis}" />
<body ms-controller="bacPatientScheduleQuery">
<div class="layui-fluid">

<#-- 侧边栏患者列表 -->
    <div class="layui-card patient-search-layout">
        <div class="title-header">
            <h2>患者列表</h2>
            <div class="title-header-line"></div>
            <div class="layui-card-body">
                <div class="layui-form">
                    <div class="layui-row layui-col-space1 demo-list">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex" >
                                <input type="text" class="title-header-input" name="patientName" id="patientName"
                                       maxlength="20"  placeholder="搜索姓名/病历号" autocomplete="off"  >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <#-- 患者列表 -->
        <div class="layui-side-scroll">
        <#-- 显示空提示或错误信息 -->
            <div ms-if="@patientList.errorMsg" class="patient-list-error">{{patientList.errorMsg}}</div>

            <div class="patient-search-dropdown-item"  ms-for="($index,el) in @patientList.data" onclick="onSelectedPatientInfo(this)"
                 :attr="{'data-patient-id': @el.patientId}">
                <div class="left-wrapper" >
                    <img src="${ctxsta}/static/images/u6399.png">
                </div>
                <div class="right-wrapper ">
                    <div class="one-item">
                        <div class="layui-col-xs6">
                            <div class="grid-demo grid-demo-bg1">{{el.patientName}}</div>
                        </div>
                        <div class="layui-col-xs6">
                            <div class="patient-age">
                                <span>{{el.age}}岁</span>
                                <img class="before-upload" src="${ctxsta}/static/svg/male.svg">
                            </div>
                        </div>
                    </div>
                    <div class="two-item">
                        <div class="layui-col-xs9">
                            <div class="grid-demo grid-demo-bg1">{{el.patientRecordNo}}</div>
                        </div>
                        <div class="layui-col-xs4" ms-visible="@el.infectionStatus != null && @el.infectionStatus != ''">
                            <div class="layui-btn layui-btn-warm layui-btn-radius layui-btn-xs patient-infection-status">
                                {{el.infectionStatus}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="layui-card patient-body">
        <div class="layui-card-body title-month">
            <i class="layui-icon layui-icon-left" style="cursor: pointer" onclick="lastMonth()"></i>
            <span> {{@month}} </span>
            <i class="layui-icon layui-icon-right" style="cursor: pointer" onclick="nextMonth()"></i>
        </div>

        <div class="layui-row layui-col-space1 demo-list">

            <div class="layui-form">
                <table class="layui-table">
                    <colgroup>
                        <col width="150">
                        <col width="150">
                        <col width="150">
                        <col width="150">
                        <col width="150">
                        <col width="150">
                        <col width="150">
                    </colgroup>
                    <thead>
                    <tr>
                        <th>日</th>
                        <th>一</th>
                        <th>二</th>
                        <th>三</th>
                        <th>四</th>
                        <th>五</th>
                        <th>六</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr ms-for="($index, el) in @list" :visible="@list.length>0" style="display: none;">
                            <td ms-for="($index, el2) in @el.detailList"    ms-attr="{day:el2.day}">
                                <div class="day-div layui-col-xs2" :visible="@el.detailList.length>0 && el2.patientList.length==0" style="display: none;">
                                    <div :class="[(el2.cerDay=='Y' ? 'cur-day':'')]">{{el2.dayIndex}}</div>
                                </div>
                                <div class="patient-div layui-col-xs10" ms-attr="{day:el2.day,patientScheduleId:''}" onclick="saveOrEdit(this)"
                                     :visible="@el.detailList.length>0 && el2.patientList.length==0" style="display: none;">
                                </div>


                                <div class="day-div layui-col-xs2" :visible="@el.detailList.length>0 && el2.patientList.length>0 " style="display: none;">
                                    <div :class="[(el2.cerDay=='Y' ? 'cur-day':'')]">{{el2.dayIndex}}</div>
                                </div>
                                <div class="patient-div layui-col-xs10" :visible="@el.detailList.length>0 && el2.patientList.length==1 " style="display: none;"
                                     ms-for="($index, el3) in @el2.patientList"
                                     ms-attr="{day:el2.day,patientScheduleId:el3.patientScheduleId}" :class="[el3.colorShift]" onclick="saveOrEdit(this)">
                                    <div class="layui-col-xs9">
                                        <span>{{el3.scheduleShiftName}}</span>
                                        <br>
                                        <span>{{el3.regionName}}</span>
                                        <br>
                                        <span>{{el3.dialysisMode}}</span>
                                        <br>
                                        <span>{{el3.bedName}}</span>
                                    </div>
                                    <div class="layui-col-xs1" >
                                        <span class="layui-badge" :visible="el3.markList.length>0" style="display: none;" ms-for="($index4,el4) in el3.markList">{{el4.mark}}</span>
                                        <span class="layui-badge" :visible="el3.markList.length==0" style="display: none;"></span>
                                    </div>
                                </div>

                                <div class="layui-col-xs10" :visible="@el.detailList.length>0 && el2.patientList.length>=2" style="display: none;">
                                    <div class="layui-col-xs12" style="padding: 5px 0px;" ms-for="($index, el3) in @el2.patientList" ms-attr="{day:el2.day,patientScheduleId:el3.patientScheduleId}" :class="[el3.colorShift]" onclick="saveOrEdit(this)">
                                        <div class="layui-col-xs9">
                                            <span>{{el3.scheduleShiftName}}</span>
                                            <br>
                                            <span>{{el3.regionName}}</span>
                                            <br>
                                            <span>{{el3.dialysisMode}}</span>
                                            <br>
                                            <span>{{el3.bedName}}</span>
                                        </div>
                                        <div class="layui-col-xs1" >
                                            <span class="layui-badge" :visible="el3.markList.length>0" style="display: none;" ms-for="($index4,el4) in el3.markList">{{el4.mark}}</span>
                                            <span class="layui-badge" :visible="el3.markList.length==0" style="display: none;"></span>
                                        </div>
                                    </div>
                                </div>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacPatientScheduleQuery.js?t=${currentTimeMillis}"></script>
</body>
</html>