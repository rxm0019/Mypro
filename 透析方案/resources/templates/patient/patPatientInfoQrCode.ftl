<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <script type="text/javascript" src="${ctxsta}/static/lib/jquery.base64/jquery.base64.js"></script>
    <style>
        .patient-item {
            padding: 10px;
            border: 1px solid #EFEFEF;
            display: inline-block;
            margin: 5px;
        }
        .patient-item .item-label {
            text-align: center;
            margin-top: 5px;
            max-width: 90px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
        }
        .patient-item .item-qrcode-box {
            width: 90px;
            height: 90px;
            border: 1px solid #CCCCCC;
            margin: 0 auto;
        }
        .patient-item .item-qrcode-box .qrcode-content {
            width: 100%;
            height: 100%;
            line-height: 90px;
            color: #CCCCCC;
            font-size: 12px;
            text-align: center;
        }
        .patient-list-error {
            text-align: center;
            padding: 50px 10px;
            color: #999;
        }
        @media print {
            .layui-fluid.layui-card {
                padding: 0 !important;
                margin: 0;
            }
            .patient-item {
                padding: 0px;
                border: none;
                display: block;
                margin: auto;
                margin-top: 5px;
                page-break-after:always;
            }
            .patient-item:last-child {
                height: auto;
            }
            .patient-item .item-label {
                text-align: center;
                margin-top: 0px;
                max-width: unset;
            }
            .patient-item .item-qrcode-box {
                width: 60px;
                height: 60px;
            }
            .patient-item .item-qrcode-box .qrcode-content {
                width: 60px;
                height: 60px;
                line-height: 14px;
                font-size: 8px;
            }
            .patient-item .item-qrcode-box .qrcode-content canvas {
                width: 60px;
                height: 60px;
            }
        }
    </style>
</head>
<body ms-controller="patPatientInfoQrCode">
<div class="layui-fluid layui-card" style="box-shadow: none;">
    <div class="layui-card-body">
        <#-- 显示空提示或错误信息 -->
        <div ms-if="@patientList.errorMsg" class="patient-list-error">{{patientList.errorMsg}}</div>

        <div class="patient-item" ms-for="($index, el) in @patientList.data">
            <div class="item-qrcode-box">
                <div class="qrcode-content" :attr="{'data-hospital-no': @el.hospitalNo, 'data-patient-record-no': @el.patientRecordNo}"></div>
            </div>
            <div class="item-label" :attr="{title: el.patientName}" :text="el.patientName"></div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPatientInfoQrCode.js?t=${currentTimeMillis}"></script>
</body>
</html>
