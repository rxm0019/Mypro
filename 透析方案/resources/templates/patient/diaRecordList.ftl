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
        .layui-fluid {
            padding: 0px 10px !important;
        }
        .content-box {
            border: 1px solid #e6e6e6;
            border-radius: 6px;
            padding: 10px;
        }
        .content-box.layui-form {
            height: calc(100vh - 145px);
            overflow-y: auto;
        }

        /** 病程记录表格 **/
        .record-table-box .disui-form-flex>input {
            flex: none;
            width: 80px;
        }
        .record-table-box .disui-form-flex>label:last-child {
            flex: none;
            font-weight: bold;
            text-align: left;
            padding-left: 10px;
        }

        /* 诊断标签 */
        .disease-diagnosis-box .empty-tags, .patient-tag-box .empty-tags {
            color: rgba(83, 100, 113,0.5);
            text-align: center;
            line-height: 32px;
        }
        .disease-diagnosis-box .diagnose-tag {
            position: relative;
            display: inline-block;
            border: 1px solid rgba(83, 100, 113,0.5);
            border-radius: 5px;
            margin-right: 10px;
            height: 32px;
            line-height: 32px;
            margin-bottom: 5px;
        }
        .disease-diagnosis-box .diagnose-tag:last-child {
            margin-right: 0;
        }
        .disease-diagnosis-box .diagnose-tag .color-label {
            position: absolute;
            color: #FFFFFF;
            font-weight: bold;
            top: -5px;
            left: 4px;
        }
        .disease-diagnosis-box .diagnose-tag .color-block {
            position: absolute;
            width: 0;
            height: 0;
            border-width: 0 0 32px 32px;
            border-style: solid;
            border-color: transparent transparent transparent #1E9FFF;
        }
        .disease-diagnosis-box .diagnose-tag .tag-label {
            display: inline-block;
            margin-left: 32px;
            padding-right: 9px;
        }

        /* 圆角分组标题 */
        .dis-fillet-groud-circular {
            margin: 5px 0;
        }

        /* 分组标题中的下拉 */
        .layui-field-title .layui-form-select {
            width: 320px;
        }

        /* 异常情况 */
        .unusual-record-box .layui-table-cell {
            height: auto;
            white-space: normal;
            word-break: break-all;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="diaRecordList">
<div class="layui-fluid">
    <div class="layui-card">
        <!-- 搜素栏的div -->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="diaRecordList_search" lay-filter="diaRecordList_search">
        </div>

        <div class="layui-card-body" style="padding: 10px;">
            <!--工具栏的按钮的div，注意：需要增加权限控制-->
            <div class="layui-row">
                <!-- 常规按钮 -->
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg2">
                    <button :visible="@baseFuncInfo.authorityTag('diaRecordList#add')"
                            class="layui-btn layui-btn-dismain" onclick="onAddRecord();">添加</button>
                    <button :visible="@baseFuncInfo.authorityTag('diaRecordList#export')"
                            class="layui-btn layui-btn-dismain" onclick="exportWord()">导出</button>
                </div>
                <div class="layui-col-sm9 layui-col-md9 layui-col-lg10" style="text-align: right">
                    <!-- 病程记录详情模式按钮 -->
                    <div ms-if="@currentDiaRecord && @currentDiaRecord.diaRecordId && !@isEditMode">
                        <button :visible="@baseFuncInfo.authorityTag('diaRecordList#edit')"
                                class="layui-btn layui-btn-dismain" onclick="renderCurrentDiaRecord(true)">修改</button>
                        <button :visible="@baseFuncInfo.authorityTag('diaRecordList#delete')"
                                class="layui-btn layui-btn-dissub" onclick="deleteCourseRecord()">删除</button>
                    </div>

                    <!-- 病程记录编辑模式按钮 -->
                    <div ms-if="@isEditMode">
                        <button class="layui-btn layui-btn-dismain" onclick="saveCoursInfo()">保存</button>
                        <button class="layui-btn layui-btn-dissub" onclick="onCancelEditRecord()">取消</button>
                    </div>
                </div>
            </div>

            <!-- 病程记录内容 -->
            <div class="layui-row layui-col-space10 mt-5">
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg3 record-table-box">
                    <!-- 病程记录表格 -->
                    <div class="layui-row content-box">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <table id="diaRecordList_table" lay-filter="diaRecordList_table"></table>
                        </div>
                    </div>
                </div>
                <div class="layui-col-sm8 layui-col-md8 layui-col-lg9">
                    <!-- 病程记录表单 -->
                    <div class="layui-form content-box" lay-filter="diaRecordList_form" id="diaRecordList_form">
                        <div class="layui-row">
                            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label"><span ms-if="!@formReadonly" class="edit-verify-span">*</span>透析日期：</label>
                                    <input type="text" id="dialysisDate" name="dialysisDate" placeholder="yyyy-MM-dd" autocomplete="off" ms-attr="{disabled: @formReadonly}"
                                           lay-verify="fieldRequired" data-field-name="透析日期">
                                </div>
                            </div>
                            <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label"><span ms-if="!@formReadonly" class="edit-verify-span">*</span>记录人：</label>
                                    <select name="courseRecordUser" lay-verify="fieldRequired" data-field-name="记录人" ms-attr="{disabled: @formReadonly}">
                                        <option value=""></option>
                                        <option ms-for="($index, el) in @options.doctors"
                                                ms-attr="{value:el.id}" ms-text="@el.userName"></option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-row">
                            <div :visible="!@currentDiaRecord.isAddCourse" class="layui-col-sm12 layui-col-md12 layui-col-lg12 dis-legend-title">
                                <fieldset class="layui-elem-field layui-field-title">
                                    <legend  ms-text="'透析信息' + (@currentDiaRecord.upDate ? '(上机时间：' + @currentDiaRecord.upDate + ')' : '')"></legend>
                                </fieldset>
                            </div>
                            <div :visible="@currentDiaRecord.isAddCourse" class="layui-col-sm12 layui-col-md12 layui-col-lg12 dis-legend-title">
                                <fieldset class="layui-elem-field layui-field-title">
                                    <legend>
                                        <select name="diaRecordId" lay-filter="diaRecordId" lay-verify="required">
                                            <option ms-for="($index, el) in @options.diaRecords"
                                                    ms-attr="{value: el.diaRecordId}" ms-text="'透析信息' + '(上机时间：' + @el.upDate + ')'"></option>
                                        </select>
                                    </legend>
                                </fieldset>
                            </div>
                        </div>
                        <div class="layui-row pl-10 pr-10">
                            <!-- 透析信息 - 患者信息 -->
                            <div class="personInfo">
                                <label>姓名：<span ms-text="@currentDiaRecord.patientName"></span></label>
                                <label class="ml-40">性别：<span ms-text="@currentDiaRecord.sex"></span></label>
                                <label class="ml-40">年龄：<span ms-text="@currentDiaRecord.age"></span>岁</label>
                            </div>
                            <!-- 透析信息 - 诊断 -->
                            <fieldset class="layui-elem-field layui-field-title dis-fillet-groud-circular">
                                <legend>诊断</legend>
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 disease-diagnosis-box personInfo">
                                    <div ms-if="@currentDiaRecord.diseaseDiagnosis.length == 0" class="empty-tags">暂无诊断记录</div>
                                    <div class="diagnose-tag" ms-for="($index, el) in @currentDiaRecord.diseaseDiagnosis">
                                        <div class="color-block" :css="{borderColor: 'transparent transparent transparent ' + el.color}"></div>
                                        <div class="color-label" :text="el.shortName"></div>
                                        <div class="tag-label" :text="el.icdCode + ' ' + el.diagnoseDetailName"></div>
                                    </div>
                                </div>
                            </fieldset>
                            <!-- 透析信息 - 异常情况 -->
                            <fieldset class="layui-elem-field layui-field-title dis-fillet-groud-circular unusual-record-box">
                                <legend>异常情况</legend>
                                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                    <table id="diaUnusualRecordList_table" lay-filter="diaUnusualRecordList_table"></table>
                                </div>
                            </fieldset>
                        </div>

                        <!-- 病程内容 -->
                        <div class="layui-row">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 dis-legend-title">
                                <fieldset class="layui-elem-field layui-field-title">
                                    <legend><span ms-if="!@formReadonly" class="edit-verify-span">*</span>病程内容</legend>
                                </fieldset>
                            </div>
                        </div>
                        <div class="layui-row pl-10 pr-10">
                            <div ms-if="!@formReadonly" class="layui-col-sm12 layui-col-md12 layui-col-lg12 mb-5">
                                <button class="layui-btn layui-btn-dissub layui-btn-dis-s" style="width: auto;"
                                        onclick="onImportCourseRecordTemplate()">从模板中导入</button>
                                <button class="layui-btn layui-btn-dissub layui-btn-dis-s" style="width: auto;"
                                        onclick="onSaveCourseRecordTemplate()">导出到模板</button>
                            </div>
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <div class="disui-form-flex ">
                                    <textarea type="text" name="courseRecord" autocomplete="off" rows="5" style="margin: 0;" maxlength="4000"
                                              lay-verify="fieldRequired" data-field-name="病程内容" ms-attr="{readonly: @formReadonly}"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                        <div class="layui-form-item layui-hide">
                            <a class="layui-btn" lay-submit lay-filter="diaRecordList_submit" id="diaRecordList_submit">提交</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/patient/diaRecordList.js?t=${currentTimeMillis}"></script>
</body>
</html>
