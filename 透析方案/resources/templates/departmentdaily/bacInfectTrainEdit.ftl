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
        .layui-row .disui-form-flex>label{
            flex-basis: 120px;
        }
        .layui-layedit {
            border-width: 1px;
            border-style: solid;
            border-radius: 2px;
            width: 100%;
        }
        .layui-elem-field legend{
            font-size: 14px;
        }
        #uploadFile{
            margin-left: 15px;
        }
        .layui-field-title {
            margin: 10px 0 10px;
            border-width: 1px 0 0;
        }
    </style>

</head>
<body ms-controller="bacInfectTrainEdit">
<div class="layui-form" lay-filter="bacInfectTrainEdit_form" id="bacInfectTrainEdit_form" style="padding: 20px 30px 0 0;">
    <div class="layui-row layui-col-space1">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="disui-form-flex">
                <input type="hidden" name="infectTrainId" autocomplete="off" >
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>培训主题：</label>
                <input type="text" name="planTheme" maxlength="50" lay-verify="required" autocomplete="off" :attr="@readonly">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>计划培训日期：</label>
                <input type="text" name="planDate" lay-verify="required" id="planDate" placeholder="yyyy-MM-dd" autocomplete="off" :attr="@disabled">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>计划参加人员：</label>
                <select name="joinUser" xm-select="joinUser" lay-verify="required" xm-select-search="" :attr="@disabled" xm-select-height="30px">
                    <option value=""></option>
                    <option  ms-attr="{value:el.id}" ms-text="@el.userName"
                             ms-for="($index, el) in joinUsers"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>培训地点：</label>
                <input type="text" name="trainSite" maxlength="50" autocomplete="off" :attr="@readonly">
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>主持人：</label>
                <select id="compere" name="compere" xm-select="compere" xm-select-radio="" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.id}" ms-text="@el.userName"
                             ms-for="($index, el) in comperes"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>制定人：</label>
                <select id="designer" name="designer" xm-select="designer" xm-select-radio="" :attr="@disabled" >
                    <option value=""></option>
                    <option  ms-attr="{value:el.id}" ms-text="@el.userName"
                             ms-for="($index, el) in designers"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>科室：</label>
                <select name="department" lay-verify="required" :attr="@disabled">
                    <option value=""></option>
                    <option  ms-attr="{value:el.value}" ms-text="@el.name"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Department')"></option>
                </select>
            </div>
        </div>
        <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
            <div class="disui-form-flex">
                <label><span class="edit-verify-span">*</span>培训方式：</label>
                <input type="radio" name="trainMethod" value="0" title="线上培训" checked="checked" :attr="@disabled"/>
                <input type="radio" name="trainMethod" value="1" title="口授" :attr="@disabled" />
            </div>
        </div>
        <div style="padding: 10px">
            <fieldset class="layui-elem-field layui-field-title">
                <legend>附件</legend>
            </fieldset>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <div class="layui-upload" style="width: 100%;">
                            <input type="hidden" id="fileList" name="fileList" maxlength="1024" autocomplete="off">
                            <!--工具栏的按钮的div，注意：需要增加权限控制-->
                            <div style="padding: 10px;float:right " id="bacInfectTrainEdit_tool">
                                <button :visible="@baseFuncInfo.authorityTag('bacInfectTrainEdit#knowledge')"
                                        class="layui-btn layui-btn-dismain"  onclick="knowledgeBase()" :attr="@disabled">知识库</button>
                                <#--<button type="button" class="layui-btn layui-btn-dismain" id="uploadFile" >上传附件</button>-->
                            </div>
                            <div class="" id="fileShowDiv" style="padding-left: 15px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
            <div class="disui-form-flex">
                <label>培训内容：</label>
                <textarea id="content" lay-verify="content" name="content" :attr="@readonly"></textarea>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" type="button" lay-submit lay-filter="bacInfectTrainEdit_submit" id="bacInfectTrainEdit_submit">提交</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/departmentdaily/bacInfectTrainEdit.js?t=${currentTimeMillis}"></script>
<script type="text/javascript" src="${ctxsta}/static/layuiadmin/layui/lay/modules/ace/ace.js"></script>
</body>
</html>