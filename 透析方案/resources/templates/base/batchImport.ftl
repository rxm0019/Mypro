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
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/dis_layout.css?t=${currentTimeMillis}"/>
    <style>

        .layui-row .disui-form-flex > label:last-child {
            flex-basis: 90px;
        }

        .layui-table th {
            text-align: center;
        }
    </style>
</head>
<body ms-controller="batchImport">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="batchImport_form" id="batchImport_form">
        <div class="layui-row layui-col-space1">
            <div class="layui-upload">
                <div class="layui-row layui-col-space1">
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <button type="button" class="layui-btn layui-btn-dismain" id="selectFile">选择文件</button>
                        </div>
                        <div class="layui-col-sm8 layui-col-md8 layui-col-lg8 layui-hide" id="materielType">
                            <div class="disui-form-flex">
                                <label>类别：</label>
                                <select name="materielType" lay-filter="materielType">
                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('materielType')"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-sm6 layui-col-md6 layui-col-lg6">
                        <button type="button" class="layui-btn layui-btn-dismain" id="downloadTemplate"
                                onclick="downloadTemplate()"
                                style="float: right;">下载模板
                        </button>
                    </div>
                </div>

                <div class="layui-upload-list">
                    <table class="layui-table">
                        <thead>
                        <tr>
                            <th>文件名称</th>
                            <th>大小</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="dataList"></tbody>
                    </table>
                </div>
                <button type="button" class="layui-btn layui-btn-dismain" id="doImport">执行导入</button>
                <span id="tips" style="color: red"></span>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label">执行结果</label>
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <textarea name="remarks" class="layui-textarea" :text="@remarks" rows="10" readonly></textarea>
                </div>
            </div>

            <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
            <div class="layui-form-item layui-hide">
                <button class="layui-btn" lay-submit lay-filter="batchImport_submit"
                        id="batchImport_submit">提交
                </button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/base/batchImport.js?t=${currentTimeMillis}"></script>
</body>
</html>