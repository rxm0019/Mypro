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
    <style>
        @page{
            size: landscape;
            margin: auto 2mm;
        }
        .item-inline {
            display: inline-block;
        }
        .item-inline-over{
            display: inline-block;
            white-space: normal;
            word-break: break-all;
        }
        .item-large {
            margin: 0;
            height: 60px;
            text-align: justify;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .item-small{
            margin: 0;
            border-top: 1px solid #e6e6e6;
        }
        .item-ave{
            margin: 0;
            height: 45px;
            text-align: justify;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .item-input{
            width: 30px;
            border: none;
            border-radius: 0;
            border-bottom: solid 0.5px rgba(83, 100, 113,0.5);
            display: inherit;
            text-align: center;
        }
        .item-ave-border{
            border-top: 1px solid #e6e6e6;
        }

        .title-wrapper {
            text-align: center;
            position: relative;
        }
        .temp-form-check {
            display: inline-block;
        }
        .temp-form-check .check-item {
            display: inline-block; margin-left: 5px;
        }
        .temp-form-check .check-item .check-box {
            width: 13px;
            height: 13px;
            display: inline-block;
            border: 1px solid #e6e6e6;
            margin-right: 5px;
            line-height: 13px;
        }
        .temp-form-check .check-item .check-box.checked:before {
            content: '\2714';
            line-height: 13px;
            /*position: fixed;*/
        }
        .unchecked{
            float: left;
            margin-top: 4px;
        }
        .layui-table thead tr, .layui-table-header, .layui-table-mend, .layui-table-patch {
            background-color: unset !important;
            color: unset !important;
        }

        .layui-table tbody tr:hover, .layui-table thead tr, .layui-table-click,
        .layui-table-header, .layui-table-hover, .layui-table-mend, .layui-table-patch,
        .layui-table-tool, .layui-table-total, .layui-table-total tr,
        .layui-table[lay-even] tr:nth-child(even) {
            border: solid;
            border-width: 1px;
            border-color: rgb(230, 230, 230);
        }
        .layui-table-view .layui-table td, .layui-table-view .layui-table th {
            padding: 5px 0;
            border-top: unset !important;
            border-left: unset !important;
        }
        .layui-table td{
            padding: unset;
        }
        .layui-table th{
            padding: 8px 0px !important;
        }
        .layui-table-cell {
            padding: 0 !important;
        }
        .layui-none{
            line-height: 26px;
            padding: 15px;
            text-align: center;
            color: rgb(153, 153, 153);
        }
    </style>
</head>
<body ms-controller="tesApplySamplePrint">
<div class="layui-card-body">
    <div class="title-wrapper">
        <h2 style="position: absolute;left: 10px;margin: 10px;">{{mechanism}}</h2>
        <h2 style="display: inline-block;margin: 10px;">样品接收单</h2>
        <div style="position: absolute;right: 250px;top: 10px;">客户单位：</div>
        <div style="position: absolute;right: 100px;top: 10px;">编号：</div>
    </div>

    <!--table定义-->
    <table cellspacing="0" cellpadding="0" border="0" class="layui-table">
        <thead>
        <tr>
            <th colspan="2">
                <div class="layui-table-cell laytable-cell-group" align="center"><span>条形码</span></div>
            </th>
            <th >
                <div class="layui-table-cell " align="center" style="width: 75px;"><span>姓名</span></div>
            </th>
            <th >
                <div class="layui-table-cell " align="center" style="width: 80px;"><span>性别</span></div>
            </th>
            <th >
                <div class="layui-table-cell " align="center" style="width: 140px;"><span>年龄/出生年月</span></div>
            </th>
            <th >
                <div class="layui-table-cell " align="center" style="width: 190px;"><span>样品类型</span></div>
            </th>
            <th colspan="2" >
                <div class="layui-table-cell laytable-cell-group" align="center"><span>临床诊断</span></div>
            </th>
            <th rowspan="2">
                <div class="layui-table-cell " align="center" style="width: 200px;"><span>检验项目</span></div>
            </th>
            <th rowspan="2">
                <div class="layui-table-cell " align="center" style="width: 40px;"><span>价格</span></div>
            </th>
            <th  rowspan="2">
                <div class="layui-table-cell " align="center" style="width: 40px;"><span>备注</span></div>
            </th>
        </tr>
        <tr>
            <th >
                <div class="layui-table-cell" align="center" style="width: 40px;"><span>序号</span></div>
            </th>
            <th >
                <div class="layui-table-cell" align="center" style="width: 80px;"><span>个数</span></div>
            </th>
            <th >
                <div class="layui-table-cell " align="center"><span>住院/门诊</span></div>
            </th>
            <th >
                <div class="layui-table-cell " align="center"><span>床号</span></div>
            </th>
            <th >
                <div class="layui-table-cell " align="center"><span>科室/病区</span></div>
            </th>
            <th >
                <div class="layui-table-cell " align="center"><span>样品状态</span></div>
            </th>
            <th >
                <div class="layui-table-cell " align="center" style="width: 100px;"><span>采集时间</span></div>
            </th>
            <th >
                <div class="layui-table-cell " align="center" style="width: 60px;"><span>送检医生</span></div>
            </th>
        </tr>
        </thead>
        <tbody>
        <tr ms-for="($index, el) in @sampleList" :visible="@sampleList.length>0" >
            <td colspan="2">
                <div class="item-large">
                    <div class="item-inline">
                        <div class="item-inline-over" >{{el.sampleCode}}</div>
                    </div>
                </div>
                <div class="item-small">
                    <div class="item-inline" style="width: 40px;padding: 5px 0px;text-align: center;border-right: 1px solid #e6e6e6;">
                        <div class="item-inline">{{$index + 1}}</div>
                    </div>
                    <div class="item-inline" style="text-align: right;width: 75px;">
                        <div class="item-inline">个</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="item-ave">
                    <div class="item-inline">
                        <div class="item-inline-over">{{el.patientName}}</div>
                    </div>
                </div>
                <div class="item-ave item-ave-border">
                    <div class="item-inline">
                        <div class="item-inline">
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="item-ave">
                    <div class="item-inline">
                        <div class="temp-form-check">
                            <div class="check-item">
                                <span class="check-box" :class="[(el.gender==@constant.gender.MALE ? 'checked':'unchecked')]"></span>
                                <span>男</span>
                            </div>
                            <div class="check-item">
                                <span class="check-box" :class="[(el.gender==@constant.gender.FEMALE ? 'checked':'unchecked')]"></span>
                                <span>女</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-ave item-ave-border">
                    <div class="item-inline">
                        <div class="item-inline">
                            <div class="item-input"></div>
                            <span>床</span>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="item-ave">
                    <div class="item-inline">
                        <div class="item-inline">
                            <div class="item-input">{{el.patientAge}}</div>
                            <span>岁/</span>
                            <div class="item-input" style="width: 40px;">{{el.birthday | date("yyyy")}}</div>
                            <span>年</span>
                            <div class="item-input" style="width: 20px;">{{el.birthday | date("MM")}}</div>
                            <span>月</span>
                        </div>
                    </div>
                </div>
                <div class="item-ave item-ave-border">
                    <div class="item-inline">
                        <div class="item-inline">
                            <div class="item-input"></div>
                            <span>科/</span>
                            <div class="item-input"></div>
                            <span>病区</span>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="item-ave">
                    <div class="item-inline">
                        <div class="temp-form-check">
                            <div class="check-item">
                                <span class="check-box" :class="[(el.examination==@constant.Examination.SERUM ? 'checked':'unchecked')]"></span>
                                <span>血清</span>
                            </div>
                            <div class="check-item">
                                <span class="check-box" :class="[(el.examination==@constant.Examination.PLASMA ? 'checked':'unchecked')]"></span>
                                <span>血浆</span>
                            </div>
                            <div class="check-item">
                                <span class="check-box" :class="[(el.examination==@constant.Examination.BLOOD ? 'checked':'unchecked')]"></span>
                                <span>全血</span>
                            </div>
                            <div class="check-item">
                                <span class="check-box" :class="[(el.examination==@constant.Examination.URINE ? 'checked':'unchecked')]"></span>
                                <span>尿</span>
                            </div>
                            <div class="check-item">
                                <span class="check-box" :class="[(el.examination==@constant.Examination.SECRETION ? 'checked':'unchecked')]"></span>
                                <span>分泌物</span>
                            </div>
                            <div class="check-item">
                                <span>其他</span>
                                <div class="item-input" style="width: 40px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-ave item-ave-border">
                    <div class="item-inline">
                        <div class="temp-form-check">
                            <div class="check-item">
                                <span class="check-box unchecked"></span>
                                <span>正常</span>
                            </div>
                            <div class="check-item">
                                <span class="check-box unchecked"></span>
                                <span>脂血</span>
                            </div>
                            <div class="check-item">
                                <span class="check-box unchecked"></span>
                                <span>量少</span>
                            </div>
                            <div class="check-item">
                                <span class="check-box unchecked"></span>
                                <span>轻度溶血</span>
                            </div>
                            <div class="check-item">
                                <span>其他</span>
                                <div class="item-input" style="width: 50px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            <td colspan="2">
                <div class="item-large" style="display: block">
                    <div class="item-inline">
                        <div class="item-inline">临床诊断：</div>
                    </div>
                </div>
                <div class="item-small">
                    <div class="item-inline" style="width: 102px;padding: 5px 0px;text-align: center;border-right: 1px solid #e6e6e6;">
                        <div class="item-inline">
                            <div class="item-input" style="width: 20px;">{{el.sampleDate | date("dd")}}</div>
                            <span>日</span>
                            <div class="item-input" style="width: 20px;">{{el.sampleDate | date("HH")}}</div>
                            <span>时</span>
                            <div class="item-input" style="width: 20px;">{{el.sampleDate | date("mm")}}</div>
                            <span>分</span>
                        </div>
                    </div>
                    <div class="item-inline">
                        <div class="item-inline"></div>
                    </div>
                </div>
            </td>
            <td>
                <div class="item-inline">
                    <div class="item-inline-over">{{el.checkoutName}}</div>
                </div>
            </td>
            <td></td>
            <td></td>
        </tr>
        </tbody>
    </table>
    <div class="layui-none" :visible="@sampleList.length==0">无数据</div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesApplySamplePrint.js?t=${currentTimeMillis}"></script>
</body>
</html>
