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
        .layui-layedit{
            margin: 3px;
        }
        .with-img{
            width: 160px !important;
        }
    </style>
</head>
<body ms-controller="eduDataBaseEdit">
<div class="layui-card-body">
    <div class="layui-form" lay-filter="eduDataBaseEdit_form" id="eduDataBaseEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label>ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="eduBaseId" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label><span class="edit-verify-span">*</span>教育主题：</label>
                    <input type="text" name="eduBaseName" maxlength="50" lay-verify="required"  autocomplete="off">
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label ><span class="edit-verify-span">*</span>教育类型：</label>
                    <select name="eduBaseType" lay-filter="eduBaseType"
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode(dictType.EducationType)"></option>
                    </select>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label ><span class="edit-verify-span">*</span>主题类型：</label>
                    <select name="themeType"  lay-filter="themeType"></select>
                </div>
            </div>

            <div class="layui-col-sm6 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <label ><span class="edit-verify-span">*</span>教材类型：</label>
                    <select name="contentType" class="select" lay-verify="required">
                        <option value=""></option>
                        <option  ms-attr="{value:el.value}" ms-text="@el.name"
                                 ms-for="($index, el) in @baseFuncInfo.getSysDictByCode(dictType.ContentType)"></option>
                    </select>
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label>备注：</label>
                    <input type="text" name="remarks" maxlength="250"  autocomplete="off" class="layui-input">
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label><span class="edit-verify-span">*</span>封面图片：</label>
                    <!-- 隐藏的文本域，用于存文件url-->
                    <input type="hidden" name="eduImgFile"  autocomplete="off" >
                    <button style="float: left;" type="button" class="layui-btn" id="uploadImg" style="margin: 3px;">上传图片</button>
                    <!-- 用于显示上传完的图片-->
                    <div class="layui-input-block" style="margin-left:10px;" id="showImgDiv"></div>
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label> </label>
                    <p style="color: red">PS：请上传宽高比为2:1的图片</p>
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label><span class="edit-verify-span">*</span>教育内容：</label>
                    <textarea id="eduBaseContent" name="eduBaseContent" style="margin: 3px;"></textarea>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="eduDataBaseEdit_submit" id="eduDataBaseEdit_submit">提交</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/education/eduDataBaseEdit.js?t=${currentTimeMillis}"></script>
<script type="text/javascript" src="${ctxsta}/static/layuiadmin/layui/lay/modules/ace/ace.js?t=${currentTimeMillis}"></script>
</body>
</html>