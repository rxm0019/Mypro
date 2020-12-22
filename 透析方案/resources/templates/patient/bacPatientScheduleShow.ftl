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
        .title-month {
            text-align: center;
            border-bottom: 1px solid #f6f6f6;
            padding: 15px 0px;
            font-size: 22px;
            font-weight: bold;
        }
        .title-month span{
            padding: 0px 5px;
        }
        .title-month i{
            font-size: 24px;
        }
        .day-div{
            float: left;
            text-align: justify;
            display: flex;
            justify-content: center;
            align-items: center;
            height: inherit;
        }
        .day-div div{
            font-size: 18px;
        }
        .patient-div{
            float: left;
            text-align: justify;
            display: flex;
            align-items: center;
            height: inherit;
        }
        .patient-div .layui-col-xs1{
            height: inherit;
        }
        .my-table tbody tr{
            height: 90px;
        }
        .my-table tr th{
            text-align: center !important;
            font-size: 18px !important;
            font-weight: bold !important;
        }
        .my-table tr td{
            padding: 0px !important;
        }
        .my-table .layui-table tbody tr:hover {
            background-color: white;
        }
        .my-table .layui-table tbody tr:hover{
            background-color: white !important;
            color: #000000 !important;
        }
        .my-table .layui-table tbody td:hover{
            cursor: pointer;
        }
        .cur-day{
            color: rgb(118, 192, 187);
            font-size: 22px !important;
        }
        .layui-badge{
            float: left;
            border-radius: 50px;
            height: auto;
            line-height: inherit;
            margin-right: 2px;
            margin-bottom: 2px;
            background-color: #FF8722;
        }
        .morning{
            background-color: #C6E4EE;
        }
        .afternoon{
            background-color: #FAEF71;
        }
        .night{
            background-color: #E4C2D2;
        }
    </style>

</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="bacPatientScheduleShow">
<div class="layui-fluid" style="padding: 0px 10px 10px 10px;">
    <div class="layui-card">
        <div class="layui-tab layui-tab-brief" lay-filter="showTab" >
            <ul class="layui-tab-title" style="right: 10px;position: absolute;left: unset;padding-top: 10px;">
                <li class="layui-this">
                    日历
                </li>
                <li>表格</li>
            </ul>

            <div style="padding: 10px;" >
                <button class="layui-btn layui-btn-dismain" :visible="@baseFuncInfo.authorityTag('bacPatientScheduleShow#edit')"
                        onclick="monthSchedule()">修改</button>
            </div>

            <div class="layui-tab-content" style="padding: 10px;">
                <div class="layui-tab-item layui-show">
                    <div class="layui-card patient-body">
                        <div class="layui-card-body title-month">
                            <i class="layui-icon layui-icon-left" style="cursor: pointer" onclick="lastMonth()"></i>
                            <span> {{@month}} </span>
                            <i class="layui-icon layui-icon-right" style="cursor: pointer" onclick="nextMonth()"></i>
                        </div>

                        <div class="layui-row layui-col-space1 demo-list">

                            <div class="layui-form my-table">
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
                                            <td ms-for="($index, el2) in @el.detailList" ms-attr="{day:el2.day}">
                                                <div class="day-div layui-col-xs2":visible="@el.detailList.length>0 && el2.patientList.length==0" style="display: none;"   >
                                                    <div :class="[(el2.cerDay=='Y' ? 'cur-day':'')]">{{el2.dayIndex}}</div>
                                                </div>
                                                <div class="patient-div layui-col-xs10" ms-attr="{day:el2.day,patientScheduleId:''}" onclick="saveOrEdit(this)"
                                                     :visible="@el.detailList.length>0 && el2.patientList.length==0" style="display: none;"  >
                                                </div>

                                                <div class="day-div layui-col-xs2" :visible="@el.detailList.length>0 && el2.patientList.length>0 " style="display: none;">
                                                    <div :class="[(el2.cerDay=='Y' ? 'cur-day':'')]">{{el2.dayIndex}}</div>
                                                </div>
                                                <div class="patient-div layui-col-xs10" :visible="@el.detailList.length>0 && el2.patientList.length==1" style="display: none;"
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

                                                <div class="layui-col-xs10"  :visible="@el.detailList.length>0 && el2.patientList.length>=2" style="display: none;">
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

                <div class="layui-tab-item">
                    <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
                         id="bacPatientScheduleShow_search" lay-filter="bacPatientScheduleShow_search">
                    </div>

                    <div class="layui-card-body">
                        <!--table定义-->
                        <table id="bacPatientScheduleShow_table" lay-filter="bacPatientScheduleShow_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>


</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/bacPatientScheduleShow.js?t=${currentTimeMillis}"></script>
</body>
</html>