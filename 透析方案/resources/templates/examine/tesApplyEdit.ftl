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
        .layui-elem-quote {
            float: left;
            padding: 5px;
            font-weight: bold;
            line-height: 28px;
            border-left: 5px solid #009688;
            border-radius: 0 2px 2px 0;
            color: rgba(118, 189, 187, 1);
            background-color: white;
            margin-bottom: 0px;
        }
        .layui-form-select .layui-unselect{
            border: none;
            border-radius: 0;
            border-bottom: solid 0.5px rgba(83, 100, 113,0.5);
        }
        /* 防止下拉框的下拉列表被隐藏---必须设置--- */
        .layui-table-cell {
            overflow: visible !important;
        }
    </style>
</head>
<body ms-controller="tesApplyEdit">
<div class="layui-card-body">
    <div class="layui-col-sm8 layui-col-md8 layui-col-lg8">
        <div class="layui-form" lay-filter="tesApplyEdit_form" id="tesApplyEdit_form" style="padding: 10px 10px 0px 10px;">
            <div class="layui-row layui-col-space1">
                <div class="layui-form-item  layui-hide">
                    <label class="layui-form-label">ID</label>
                    <div class="layui-input-inline">
                        <input type="hidden" name="applyId"  autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item  layui-hide">
                    <label class="layui-form-label">patientId</label>
                    <div class="layui-input-inline">
                        <input type="hidden" name="patientId" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item  layui-hide">
                    <label class="layui-form-label">sourceType</label>
                    <div class="layui-input-inline">
                        <input type="hidden" name="sourceType" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item  layui-hide">
                    <label class="layui-form-label">relationId</label>
                    <div class="layui-input-inline">
                        <input type="hidden" name="relationId" autocomplete="off" class="layui-input">
                    </div>
                </div>


                <div class="layui-row">
                    <blockquote class="layui-elem-quote">检验申请单</blockquote>
                    <button class="layui-btn layui-btn-dismain" style="float: right;margin-bottom: 5px ;" onclick="printMethod()">打印</button>
                    <hr class="layui-bg-green" style="margin:0;margin-bottom: 5px;">
                </div>
                <div class="layui-row" style="text-align: center;">
                    <h2>检验申请单</h2>
                </div>

                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label">申请日期：</label>
                        <input type="text" name="applyDate" readonly style="border: none;">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label">送检医院：</label>
                        <input type="text" name="hospitalName" readonly style="border: none;">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label"><span class="edit-verify-span">*</span>检验机构：</label>
                        <select name="mechanism" class="select" lay-filter="mechanism" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode(dictType.HospitalInspection)"></option>
                        </select>
                    </div>
                </div>

                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label">姓名：</label>
                        <input type="text" name="patientName" readonly style="border: none;">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label">性别：</label>
                        <input type="text" name="gender" readonly style="border: none;">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label">年龄：</label>
                        <input type="text" name="patientAge" readonly style="border: none;">
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label">病历号：</label>
                        <input type="text" name="patientRecordNo" readonly style="border: none;">
                    </div>
                </div>

                <div class="layui-row">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label">病情摘要：</label>
                        <input type="text" name="illness" maxlength="200" style="border: none;border-radius: 0;border-bottom: solid 0.5px rgba(83, 100, 113,0.5);">
                    </div>
                </div>
                <div class="layui-row">
                    <div class="disui-form-flex" >
                        <label class="layui-form-label">检验目的：</label>
                        <input type="text" name="purpose" maxlength="200" style="border: none;border-radius: 0;border-bottom: solid 0.5px rgba(83, 100, 113,0.5);">
                    </div>
                </div>
                <fieldset class="layui-elem-field layui-field-title" style="margin: 10px 0px;">
                    <legend><span class="edit-verify-span">*</span>检验项目</legend>
                </fieldset>

                <div class="layui-card-body">
                    <table id="tesApplyList_table" lay-filter="tesApplyList_table"></table>
                </div>

                <div class="layui-row" style="text-align: center;">
                    <button class="layui-btn layui-btn-dismain" :visible="@applyStatus!=constant.ApplicationStatus.SUBMITTED"
                            onclick="save()" >保存</button>
                    <button class="layui-btn layui-btn-dismain" :visible="@applyStatus==constant.ApplicationStatus.NO_SUBMIT"
                            onclick="submit()" >提交</button>
                    <button class="layui-btn layui-btn-dismain" :visible="@applyStatus==constant.ApplicationStatus.SUBMITTED && @applySendStatus==constant.ApplySendStatus.NO_SEND"
                            onclick="backSubmit()" >撤回提交</button>
                    <button class="layui-btn layui-btn-dissub"  onclick="cancel()">取消</button>
                    <div style="display: inline-flex;vertical-align: middle;padding-left: 10px;">
                        温馨提示：<i class="layui-icon layui-icon-about" id="aboutIcon" style="font-size: 20px;padding: 0 10px;"></i>
                    </div>
                </div>
                <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                <div class="layui-form-item layui-hide">
                    <button class="layui-btn" lay-submit lay-filter="tesApplyEdit_submit" id="tesApplyEdit_submit">提交</button>
                </div>
            </div>
        </div>
    </div>

    <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" style="padding: 0px 5px;border-left: 1px solid rgb(230, 230, 230);height: calc(100vh);">
        <div class="layui-tab" lay-filter="teachTab" style="margin: 10px 0;">
            <ul class="layui-tab-title">
                <li class="layui-this">
                    检验项目
                </li>
                <li>检验计划</li>
            </ul>
            <div class="layui-tab-content">
                <!--检验项目-->
                <div class="layui-tab-item layui-show">
                    <div class="layui-form layuiadmin-card-header-auto search-form"
                         id="tesProject_search" lay-filter="tesProject_search"
                         style="border-bottom: 1px solid #f6f6f6;">

                    </div>
                    <div class="layui-card-body">
                        <table id="tesProjectList_table" lay-filter="tesProjectList_table"></table>
                    </div>
                </div>
                <!--检验计划-->
                <div class="layui-tab-item">
                    <div class="layui-form layuiadmin-card-header-auto search-form"
                         id="tesPlan_search" lay-filter="tesPlan_search"
                         style="border-bottom: 1px solid #f6f6f6;">

                    </div>
                    <div class="layui-card-body">
                        <table id="tesPlanList_table" lay-filter="tesPlanList_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
<script type="text/javascript" src="${ctxsta}/static/js/examine/tesApplyEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>