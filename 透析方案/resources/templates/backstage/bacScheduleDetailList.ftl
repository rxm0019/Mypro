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
        .week-btn{
            height: auto;
            min-height: 42px;
            line-height: 20px;
        }
        .select-week-btn{
            background-color: #009688;
        }
        .line-table{
            border: 1px solid rgb(246, 246, 246);
            text-align: center;
            padding: 5px;
        }
        .table-group{
            text-align: center;
            padding: 5px;
            font-size: 18px;
            font-weight: bold;
        }
        .table-Shift{
            font-size: 18px;
            font-weight: bold;
            text-align: justify;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid rgb(246, 246, 246);
        }
        .layui-btn .layui-icon{
            margin-right: 0px;
        }
        .layui-btn-del{
            height: 25px;
            line-height: 25px;
            padding: 0px 5px;
            border-radius: 50px;
            float: right;
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
        .back-color{
            background-color: white;
        }
        .min-height-me{
            min-height: 96px;
            cursor: pointer;
        }
        .spanOver{
            width: 100%;
            display:  inline-grid;;
            overflow: hidden;
        }
        .layui-none{
            line-height: 26px;
            padding: 15px;
            text-align: center;
            color: rgb(153, 153, 153);
        }
        .calc-height{
            height:calc(100vh - 85px);
            overflow-x: hidden;
            overflow-y: auto;
        }
        .calc-week-height{
            height:calc(100vh - 150px);
            overflow-x: hidden;
            overflow-y: auto;
        }
    </style>

</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="bacScheduleDetailList">
<div class="layui-fluid">
    <div class="layui-card" style="margin-bottom: 10px;">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="bacScheduleDetailList_search" lay-filter="bacScheduleDetailList_search">
        </div>
    </div>

    <div class="layui-card" :visible="@templateType == type.WEEK" style="padding: 5px 0px 5px 0px;margin-bottom: 10px;">
        <div style="text-align: center" id="weekBtn">
            <button class="layui-btn layui-btn-dismain week-btn" id="mon" onclick="listSchedule(1)" ms-html="@mon"></button>
            <button class="layui-btn layui-btn-dismain week-btn" id="tue" onclick="listSchedule(2)" ms-html="@tue"></button>
            <button class="layui-btn layui-btn-dismain week-btn" id="web" onclick="listSchedule(3)" ms-html="@web"></button>
            <button class="layui-btn layui-btn-dismain week-btn" id="thur" onclick="listSchedule(4)" ms-html="@thur"></button>
            <button class="layui-btn layui-btn-dismain week-btn" id="fri" onclick="listSchedule(5)" ms-html="@fri"></button>
            <button class="layui-btn layui-btn-dismain week-btn" id="sat" onclick="listSchedule(6)" ms-html="@sat"></button>
            <button class="layui-btn layui-btn-dismain week-btn" id="sun" onclick="listSchedule(0)" ms-html="@sun"></button>
        </div>
    </div>

    <div class="layui-card-body" :class="[(@templateType == type.WEEK? 'calc-week-height':'calc-height')]">
        <div class="layui-row layui-col-space1 demo-list" >

            <div class="layui-none" :visible="@errorMsg!=''">无数据</div>

            <div class="layui-row back-color" ms-for="($index, el) in @list" :visible="@list.length>0" style="display: none;" >
                <div class="layui-col-sm2 layui-col-md2 layui-col-lg1">
                    <div class="layui-row table-Shift" ms-attr="{shift:el.shift}">
                        <div>
                            <p>{{el.shiftName}}</p>
                            <p>{{el.personTotal}} / {{el.shiftTotal}}</p>
                        </div>
                    </div>
                </div>

                <div class="layui-col-sm10 layui-col-md10 layui-col-lg11 table-Right">
                    <div ms-for="($index1,el1) in el.regionList">
                        <div class="layui-row line-table table-group">
                            <span>{{el1.regionName}}  {{el1.personTotal}} / {{el1.shiftTotal}}</span>
                        </div>
                        <div class="layui-row">
                            <div class="layui-col-xs12 layui-col-sm4 layui-col-md3 layui-col-lg2 line-table" ms-for="($index2,el2) in el1.bedList">
                                <div class="layui-col-xs2 layui-col-sm2 layui-col-md1 layui-col-lg1">
                                    <span class="layui-badge" :visible="el2.markList.length>0" style="display: none;" ms-for="($index3,el3) in el2.markList">{{el3.mark}}</span>
                                    <span class="layui-badge" :visible="el2.markList.length==0" style="display: none;"></span>
                                </div>
                                <div class="layui-col-xs8 layui-col-sm8 layui-col-md10 layui-col-lg10 text-center min-height-me"
                                     ms-attr="{scheduleId:el2.patientScheduleId,bedId:el2.bedId,shift:el2.shift,regionId:el2.regionId}" onclick="saveOrEdit(this)">
                                    <span>{{el2.bedName}}</span>
                                    <br>
                                    <span>{{el2.features}}</span>
                                    <br>
                                    <span class="spanOver">{{el2.personName}}</span>
                                    <br>
                                    <span>{{el2.dialysisMode}}</span>
                                    <br>
                                    <span>{{el2.dialyzer}}</span>
                                </div>
                                <div class="layui-col-xs2 layui-col-sm2 layui-col-md1 layui-col-lg1">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-danger layui-btn-del" :visible="@el2.patientScheduleId!=''" style="display: none;" ms-attr="{scheduleId:el2.patientScheduleId}" onclick="batchDel(this)">
                                        <i class="layui-icon">&#x1006;</i>
                                    </button>
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
<script type="text/javascript" src="${ctxsta}/static/js/backstage/bacScheduleDetailList.js?t=${currentTimeMillis}"></script>
</body>
</html>