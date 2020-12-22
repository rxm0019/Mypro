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
        .layui-row .disui-form-flex > label {
            flex-basis: 120px;
        }
    </style>
</head>
<body ms-controller="sysHospitalPublicNumberEdit">
<div class="layui-card" style="padding: 15px;margin-left: 10px;margin-right: 10px">
    <div class="layui-form" lay-filter="sysHospitalPublicNumberEdit_form" id="sysHospitalPublicNumberEdit_form"
         style="width: 600px;margin: auto">
        <div class="layui-row layui-col-space1" style="text-align: center">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>公众号名称：</label>
                    <input type="text" name="accountsName" maxlength="500" autocomplete="off" id="accountsName"
                           lay-verify="required">
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>公众号ID：</label>
                    <input type="text" name="appid" maxlength="100" autocomplete="off" id="appId" lay-verify="required">
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>Token：</label>
                    <input type="text" name="token" maxlength="100" autocomplete="off" id="token" lay-verify="required">
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>密钥：</label>
                    <input type="text" name="secret" maxlength="100" autocomplete="off" id="secret"
                           lay-verify="required">
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label"><span class="edit-verify-span">*</span>AesKey：</label>
                    <input type="text" name="aeskey" maxlength="100" autocomplete="off" id="aeskey"
                           lay-verify="required">
                    <input type="hidden" name="hospitalId" maxlength="20" autocomplete="off" id="hospitalId"
                           lay-verify="required">
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex">
                    <label class="layui-form-label">备注：</label>
                    <textarea rows="2" name="remarks" id="remarks" maxlength="100"></textarea>
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" style="padding-left: 250px;padding-top: 20px">
                    <button class="layui-btn layui-btn-dismain" lay-submit lay-filter="sysHospitalPublicNumberEdit_submit"
                            :visible="@baseFuncInfo.authorityTag('sysHospital#editPublicNumberMessage')"
                            id="sysHospitalPublicNumberEdit_submit" onclick="edit()">保存
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript"
        src="${ctxsta}/static/js/system/sysHospitalPublicNumberEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>
