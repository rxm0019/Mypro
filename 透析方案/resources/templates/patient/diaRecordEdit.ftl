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
</head>
<style type="text/css">
    /* 病程记录更多 */
    #moreLast {
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        border: 1px solid #A9B1B8;
        position: absolute;
        top: 400px;
        right: 8px;
        padding: 10px 0;
        width: 65%;
        height: 300px;
        z-index: 99;
    }
</style>
<body ms-controller="diaRecordEdit">

<div class="layui-collapse" lay-filter="orderColla">
    <div class="layui-colla-item" >
        <p class="layui-colla-title">病程记录</p>
        <div class="layui-colla-content layui-show">
            <div class="layui-row layui-col-space1" ms-if="!@formReadonly">
                <div class="layui-col-md12 layui-inline">
                    <button class="layui-btn layui-btn-dismain layui-btn-dis-xs"
                            onclick="saveCourseRecord()">保存
                    </button>
                    <button class="layui-btn layui-btn-dissub layui-btn-dis-xs"
                            onclick="onSaveCourseRecordTemplate()">保存模板
                    </button>
                    <button class="layui-btn layui-btn-dissub layui-btn-dis-xs"
                            onclick="onImportCourseRecordTemplate()">提取模板
                    </button>
                    <button class="layui-btn layui-btn-dismain layui-btn-dis-xs"
                            id="getMore">更多
                    </button>
                </div>
            </div>
            <div class="layui-form" lay-filter="diaRecordEdit_form" id="diaRecordEdit_form">
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12 layui-hide">
                        <div class="disui-form-flex">
                            <input type="text" name="diaRecordId" id="diaRecordId"
                                   lay-verify="required" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex">
                            <textarea type="text" name="courseRecord" id="courseRecord"
                                      rows="28" lay-verify="fieldRequired" data-field-name="病程內容" maxlength="4000" :attr="{readonly: @formReadonly}" ></textarea>
                        </div>
                    </div>
                    <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
                    <div class="layui-form-item layui-hide">
                        <button class="layui-btn" lay-submit lay-filter="diaRecordEdit_submit"
                                id="diaRecordEdit_submit">
                            提交
                        </button>
                    </div>
                </div>
            </div>
            <#--更多-->
            <div id="moreLast" class="layui-card layui-hide" style="overflow-y:auto;">
                        <div ms-if="!moreShow" style="margin: 10px;">上次记录：{{courseRecord}}</div>
                        <div ms-if="moreShow" style="margin: 10px;text-align: center">暂无上次记录</div>

            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/diaRecordEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>