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
    <style type="text/css">
        .layui-elem-quote {
            background-color: #FFF;
            line-height: 20px;
            padding: 5px;
            margin-top: 10px;
            border-left: 4px solid rgba(118, 189, 187, 1);
        }

        .layui-elem-quote > label {
            color: rgba(118, 189, 187, 1);
            font-weight: bold;
        }

        .layui-bg-green {
            height: 3px;
            background-color: rgba(118, 189, 187, 1) !important;
        }
        .empty-tags {
            color: rgba(83, 100, 113, 0.5);
            text-align: center;
            line-height: 32px;
        }

        .tab-style {
            display: inline-block;
            width: 20%;
            text-align: center;
            height: 34px;
            line-height: 34px;
            background-color: #f4f4f4;
            cursor: pointer;
        }

        .tab-style:nth-of-type(1) {
            border-radius:  5px 0 0 5px;
        }

        .tab-style:last-child {
            border-radius: 0 5px 5px 0;
        }

        .tab-style:hover {
            background-color: #d2d2d2;
            color: #ffffff;
        }

        .tab-click {
            background-color: #76C0BB;
            color: #ffffff;
        }

        .layui-row .disui-form-flex > label {
            flex-basis: 100px;
        }
        .patient-item{
            width: 100%;
        }
        .patient-item label{
            margin-right: 24pt;
        }
        .layui-table-view {
            border: 1px solid #e6e6e6;
        }
        .layui-table-view .layui-table {
            width: 100%;
        }
    </style>

</head>
<body ms-controller="diaDoctorShiftEdit">
<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
    <ul class="layui-tab-title">
        <li class="layui-this">医护交班</li>
        <li>交班日志</li>
    </ul>
    <div class="layui-tab-content" style="height: 100px;">
        <div class="layui-tab-item layui-show">
            <div class="layui-form" lay-filter="diaDoctorShiftEdit_form" id="diaDoctorShiftEdit_form">
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                        <div class="disui-form-flex">
                            <label class="layui-form-label">doctorShiftId</label>
                            <input type="hidden" name="doctorShiftId" id="doctorShiftId" placeholder="请输入" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex">
                            <label>交班类型：</label>
                            <input type="radio" name="shiftType" lay-filter="shiftType" value="1" title="班次" >
                            <input type="radio" name="shiftType" lay-filter="shiftType" value="2" title="肾友" checked>
                        </div>
                    </div>
                    <div ms-visible="@shiftShow" class="layui-col-sm6 layui-col-md6 layui-col-lg6" id="scheduleShiftShow">
                        <div class="disui-form-flex">
                            <label>班次：</label>
                            <select name="scheduleShift"
                                    lay-filter="scheduleShift">
                                <option value=""></option>
                                <option ms-attr="{value:el.value}" ms-text="@el.name"
                                        ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Shift')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div>
                            <blockquote class="layui-elem-quote">
                                <label>病患名单：</label>
                            </blockquote>
                            <hr class="layui-bg-green">
                            <table id="patientList_table" lay-filter="patientList_table"></table>
                        </div>

                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex">
                            <label>交班日期：</label>
                            <input type="text" name="shiftDate" lay-verify="required" id="shiftDate"
                                   placeholder="yyyy-MM-dd" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex">
                            <label>接班人：</label>
                            <select name="replaceDoctor" id="replaceDoctor" xm-select="replaceDoctor"
                                    xm-select-height="36px"
                                    lay-filter="replaceDoctor">
                                <option value=""></option>
                                <option ms-for="($index,el) in @makerName"
                                        ms-attr="{value: el.id}">
                                    {{el.userName}}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex">
                            <label>内容：</label>
                            <textarea type="text" name="remarks" id="remarks" maxlength="65535" lay-verify="required"
                                      placeholder="请输入"
                                      autocomplete="off">
                        </textarea>
                        </div>
                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="text-align: center">
                        <div class="layui-input-inline">
                            <button class="layui-btn layui-btn-dismain" style="margin-left: 5px;"
                                    onclick="onDoctorShift()" >保存
                            </button>
                            <button class="layui-btn layui-btn-dissub" onclick="cancelBtn()">取消</button>
                        </div>
                    </div>

                </div>

                <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                <div class="layui-form-item layui-hide">
                    <button class="layui-btn" lay-submit lay-filter="diaDoctorShiftEdit_submit"
                            id="diaDoctorShiftEdit_submit">提交
                    </button>
                </div>
            </div>
        </div>
        <div class="layui-tab-item">
            <div class="layui-form" lay-filter="diaShiftJournal_form" id="diaShiftJournal_form">
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                        <div class="disui-form-flex">
                            <label class="layui-form-label">ID</label>
                            <input type="hidden" name="nurseShiftId" placeholder="请输入" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" style="height: 39px; line-height: 39px;">
                        <div class="disui-form-flex">
                            <label>交班类型：</label>
                            <div class="tab-style" ms-for="($index, el) in scheduleShiftList" ms-attr="{value:el.value}" ms-text="@el.name" onclick="clickScheduleShift(this)"></div>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label>日期：</label>
                            <input type="text" name="shiftDateLog" id="shiftDateLog">
                        </div>
                    </div>
                    <div class="layui-col-sm5 layui-col-md5 layui-col-lg5">
                        <div class="disui-form-flex">
                            <button class="layui-btn layui-btn-dismain" style="margin-left: 5px;"
                                    onclick="searchOrder()">搜索
                            </button>
                            <button class="layui-btn layui-btn-dissub" onclick="onExportWord()">导出</button>
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <blockquote class="layui-elem-quote">
                            <label>概况</label>
                        </blockquote>
                        <hr class="layui-bg-green">
                        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                            <div class="disui-form-flex">
                                <label>透析人数/人：</label>
                                <label style="line-height: 38px;">{{dialuSum}}</label>
                            </div>
                        </div>
                        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                            <div class="disui-form-flex">
                                <label>转入患者/人：</label>
                                <label style="line-height: 38px;">{{increaseSum}}</label>
                            </div>
                        </div>
                        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                            <div class="disui-form-flex">
                                <label>转出患者/人：</label>
                                <label style="line-height: 38px;">{{outInSum}}</label>
                            </div>
                        </div>
                        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                            <div class="disui-form-flex">
                                <label>留治患者/人：</label>
                                <label style="line-height: 38px;">{{rujiSum}}</label>
                            </div>
                        </div>
                        <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                            <div class="disui-form-flex">
                                <label>死亡患者/人：</label>
                                <label style="line-height: 38px;">{{deathSum}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div>
                            <blockquote class="layui-elem-quote">
                                <label>血管通路</label>
                            </blockquote>
                            <hr class="layui-bg-green">
                            <table id="catheterList_table" lay-filter="catheterList_table"></table>
                            <table id="punctureList_table" lay-filter="punctureList_table"></table>
                        </div>
                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div>
                            <blockquote class="layui-elem-quote">
                                <label>故障透析机</label>
                                <button :visible="@baseFuncInfo.authorityTag('diaMachineFailureList#add')"
                                        style="margin-left: 10px" class="layui-btn layui-btn-sm layui-btn-dismain"
                                        onclick="machineFailureAdd()">添加
                                </button>
                            </blockquote>
                            <hr class="layui-bg-green">
                            <table id="diaMachineFailureList_table" lay-filter="diaMachineFailureList_table"></table>
                            <script type="text/html" id="diaMachineFailureList_bar">
                                {{#  if(baseFuncInfo.authorityTag('diaMachineFailureList#delete')){ }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black"
                                   lay-event="delete">删除</a>
                                {{#  } }}
                            </script>
                        </div>

                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div>
                            <blockquote class="layui-elem-quote">
                                <label>透析例次</label>
                            </blockquote>
                            <hr class="layui-bg-green">
                            <div ms-if="@diaInstanceRows.length == 0" class="empty-tags">暂无透析例次</div>
                            <table id="dialysisRoutineList_table" lay-filter="dialysisRoutineList_table"></table>
                        </div>

                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div>
                            <blockquote class="layui-elem-quote">
                                <label>并发症统计</label>
                            </blockquote>
                            <hr class="layui-bg-green">
                            <div ms-if="@unusualRows.length == 0" class="empty-tags">暂无并发症</div>
                            <table id="complicaList_table" lay-filter="complicaList_table"></table>
                        </div>
                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div>
                            <blockquote class="layui-elem-quote">
                                <label>穿刺/导管</label>
                            </blockquote>
                            <hr class="layui-bg-green">
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                                <div class="disui-form-flex">
                                    <label>穿刺(例)：</label>
                                    <label style="line-height: 38px;">{{sumPuncture}}</label>
                                </div>
                            </div>
                            <div class="layui-col-sm2 layui-col-md2 layui-col-lg2">
                                <div class="disui-form-flex">
                                    <label>导管(例)：</label>
                                    <label style="line-height: 38px;">{{sumCatheter}}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex">
                            <label>备注：</label>
                            <textarea type="text" name="remarks" maxlength="65535" lay-verify="required" placeholder="请输入" autocomplete="off"></textarea>
                        </div>
                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12" style="text-align: center">
                        <div class="layui-input-inline" >
                            <button class="layui-btn layui-btn-dismain" style="margin-left: 5px;"
                                    onclick="onShiftJournal()">保存
                            </button>
                            <button class="layui-btn layui-btn-dissub" onclick="cancelBtn()">取消</button>
                        </div>
                    </div>
                    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                    <div class="layui-form-item layui-hide">
                        <button class="layui-btn" lay-submit lay-filter="diaShiftJournal_submit"
                                id="diaShiftJournal_submit">提交
                        </button>
                    </div>
                </div>
                <#--导出word文档-->
                <div id="exportWord" style="display: none">
                    <div class="patient-item">
                        <label>交班类型：
                            <span ms-if="@scheduleShift===''">全天</span>
                            <span ms-if="@scheduleShift==='1'">上午</span>
                            <span ms-if="@scheduleShift==='2'">下午</span>
                            <span ms-if="@scheduleShift==='3'">晚上</span>
                        </label>&#8203;
                        <label>日期：<span>{{dialysisDateVal}}</span></label>&#8203;
                    </div>
                    <div class="patient-item">
                        <label>透析人数/人：<span>{{dialuSum}}</span></label>&#8203;
                        <label>转入患者/人：<span>{{increaseSum}}</span></label>&#8203;
                        <label>转出患者/人：<span>{{outInSum}}</span></label>&#8203;
                        <label>留治患者/人：<span>{{rujiSum}}</span></label>&#8203;
                        <label>死亡患者/人：<span>{{deathSum}}</span></label>&#8203;
                    </div>
                    <div class="patient-item">
                        <div>
                            <label>血管通路 ：</label>
                            <table class="words-table" width="100%"  ms-if="@catheterListTable != null && @catheterListTable.length > 0">
                                <thead>
                                    <tr style="height: 20px">
                                        <th ms-for="($index, el) in @catheterColumnList" style="text-align: center">{{el.title}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr ms-for="($index, catheter) in @catheterListTable">
                                    <td style="text-align: center" ms-for="($index1, el) in @catheter">{{el}}</td>
                                </tr>
                                </tbody>
                            </table>
                            <br>
                            <table class="words-table" style="" width="100%"  ms-if="@punctureListTable != null && @punctureListTable.length > 0">
                                <thead>
                                    <tr style="height: 20px">
                                        <th ms-for="($index, el) in @punctureColumnList" style="text-align: center">{{el.title}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ms-for="($index, puncture) in @punctureListTable">
                                        <td style="text-align: center" ms-for="($index1, el) in @puncture">{{el}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="patient-item">
                        <div>
                            <label>故障透析机：</label>
                            <table class="words-table" style="" width="100%"  ms-if="@diaMachineFailureListList != null && @diaMachineFailureListList.length > 0">
                                <thead>
                                <tr style="height: 20px">
                                    <th style="text-align: center">设备名称</th>
                                    <th style="text-align: center">设备类型</th>
                                    <th style="text-align: center">＊机号</th>
                                    <th style="text-align: center">故障发生阶段</th>
                                    <th style="text-align: center">故障提示信息及代码</th>
                                    <th style="text-align: center">故障描述</th>
                                    <th style="text-align: center">故障是否排除</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr ms-for="($index, diaMachineFailure) in @diaMachineFailureListList">
                                    <td>{{diaMachineFailure.deviceName}}</td>
                                    <td>{{baseFuncInfo.getSysDictName('deviceType', diaMachineFailure.deviceType)}}</td>
                                    <td>{{diaMachineFailure.deviceNo}}</td>
                                    <td>{{diaMachineFailure.occurrenceStage}}</td>
                                    <td>{{diaMachineFailure.faultTips}}</td>
                                    <td>{{diaMachineFailure.faultDescribe}}</td>
                                    <td>{{diaMachineFailure.troubleshooting}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="patient-item">
                        <div>
                            <label>透析例次 ：</label>
                            <table class="words-table" style="" width="100%"  ms-if="@dialysisRoutineListTable != null && @dialysisRoutineListTable.length > 0">
                                <thead>
                                    <tr style="height: 20px">
                                        <th ms-for="($index, el) in @routineColumnList" style="text-align: center">{{el.title}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ms-for="($index, routine) in @dialysisRoutineListTable">
                                        <td style="text-align: center" ms-for="($index1, el) in @routine">{{el}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="patient-item">
                        <div>
                            <label>并发症统计 ：</label>
                            <table class="words-table" style="" width="100%"  ms-if="@complicaListTable != null && @complicaListTable.length > 0">
                                <thead>
                                <tr style="height: 20px">
                                    <th ms-for="($index, el) in @complicaColumnList" style="text-align: center">{{el.title}}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr ms-for="($index, complica) in @complicaListTable">
                                    <td style="text-align: center" ms-for="($index1, el) in @complica">{{el}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="patient-item">
                        <label>穿刺(例)：<span>{{sumPuncture}}</span></label>
                        <label>导管(例)：<span>{{sumCatheter}}</span></label>
                    </div>
                    <div class="patient-item">
                       <label>备注：<span>{{remarks}}</span></label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaDoctorShiftEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>