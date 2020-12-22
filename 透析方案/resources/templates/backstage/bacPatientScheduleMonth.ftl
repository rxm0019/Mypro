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
            padding-right: 10px;
        }
        .day-div div{
            font-size: 18px;
            /*font-weight: bold;*/
        }
        .sum-div{
            height: inherit;
            display: table-cell;
            vertical-align: middle;
        }
        tr th{
            text-align: center !important;
            font-size: 18px !important;
            font-weight: bold !important;
        }
        tr td{
            height: 80px;
        }
        .layui-table tbody tr:hover {
            background-color: white;
        }

        .layui-table tbody tr:hover{
             background-color: white !important;
             color: #000000 !important;
        }
        .layui-table tbody td:hover{
             cursor: pointer;
        }
        .cur-day{
            color: rgb(118, 192, 187);
            font-size: 22px !important;
        }
        .full-total{
            color: #FF8722;
        }
        .miss-total{
            color: rgb(118, 192, 187);
        }

    </style>

</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="bacPatientScheduleMonth">
<div class="layui-fluid">

    <div class="layui-card" style="height: calc(100vh - 15px - 10px);">
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
                        <td ms-for="($index, el2) in @el.detailList" :visible="@el.detailList.length>0" style="display: none;"   ms-attr="{day:el2.day}" onclick="showList(this)">
                            <div class="day-div" >
                                <div :class="[(el2.cerDay=='Y' ? 'cur-day':'')]">{{el2.dayIndex}}</div>
                            </div>
                            <div class="sum-div">
                                <div ms-for="($index, el3) in @el2.totalList" :visible="@el2.totalList.length>0" style="display: none;"
                                     :class="[(el3.fullShift=='Y' ? 'miss-total':'full-total')]">{{el3.scheduleShiftName}}：{{el3.personTotal}} / {{el3.shiftTotal}}</div>
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
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacPatientScheduleMonth.js?t=${currentTimeMillis}"></script>
</body>
</html>