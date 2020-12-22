<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
</head>
<style type="text/css">
    .layui-elem-field legend{
        font-size: 14px;
    }
    .layui-upload-img {
        width: 80px;
        height: 80px;
    }
    #uploadImg {
        height: 80px;
        width: 80px;
        background-color: #ffffff;
        border: 2px solid #e6e6e6;
        color: #e6e6e6;
        vertical-align: middle;
        cursor: pointer;
    }
    #uploadImg i {
        font-size: 30px;
    }
</style>
<body ms-controller="patVascularInspectEdit">
<div class="layui-form" lay-filter="patVascularInspectEdit_form" id="patVascularInspectEdit_form" style="padding: 20px;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="vascularInspectId" autocomplete="off">
                <input type="hidden" name="patientId" autocomplete="off">
                <input type="hidden" name="fileId" id="fileId" autocomplete="off">
            </div>
        </div>
        <div class="layui-form-item">
            <div style="width: 68%; float: left;">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend>基本信息</legend>
                </fieldset>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex" >
                            <label><span class="edit-verify-span">*</span>检查日期：</label>
                            <input type="text" name="inspectDate" lay-verify="required" id="inspectDate" placeholder="yyyy-MM-dd" autocomplete="off" readonly :attr="@disabled">
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex" >
                            <label><span class="edit-verify-span">*</span>记录人：</label>
                            <select name="inspectUserId" id="inspectUserId"  lay-verify="required" :attr="@disabled">
                                <option value=""></option>
                                <option ms-attr="{value:el.id}" ms-text="@el.userName"
                                        ms-for="($index, el) in doctorMakers"></option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex" >
                            <label><span class="edit-verify-span">*</span>检查类型：</label>
                            <select name="inspectType" :attr="@disabled" lay-verify="required" lay-filter="inspectType">
                                <option value=""></option>
                                <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                         ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ChannelMonitorType')"></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="disui-form-flex" >
                            <label><span class="edit-verify-span">*</span>检查部位：</label>
<#--                            <input type="text" name="inspectPlace" maxlength="100" lay-verify="required" placeholder="请输入" autocomplete="off" :attr="@readonly">-->
                            <select name="inspectPlace" :attr="@disabled" lay-verify="required" lay-filter="inspectType">
                                <option value=""></option>
                                <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                         ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('InspectPlace')"></option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex" >
                            <label><span class="edit-verify-span">*</span>检查结果：</label>
                            <textarea rows="5" name="inspectResult" maxlength="21845" :attr="@readonly"></textarea>
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex" >
                            <label>备注：</label>
                            <textarea rows="5" name="remarks" maxlength="21845" :attr="@readonly"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div style="width: 30%; float: left;padding-left: 2%;">
                <fieldset class="layui-elem-field layui-field-title">
                    <legend>图片上传</legend>
                </fieldset>
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                        <div class="disui-form-flex">
                            <div class="layui-upload" style="padding-left: 15px; ">
                                <div class="" id="showImgDiv" style="display: inline;"></div>
                                <input type="hidden" id="listPhoto" name="listPhoto" maxlength="1024" autocomplete="off" >
                                <button type="button" id="uploadImg"><i class="layui-icon layui-icon-add-1"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="patVascularInspectEdit_submit" id="patVascularInspectEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patVascularInspectEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
