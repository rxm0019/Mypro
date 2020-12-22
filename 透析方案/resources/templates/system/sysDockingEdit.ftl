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
<body ms-controller="sysDockingEdit">
<div class="layui-card-body" style="padding: 15px;">
    <div class="layui-form" lay-filter="sysDockingEdit_form" id="sysDockingEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-row layui-col-space1">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="dockingId"  autocomplete="off" >
                </div>
            </div>
              <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                 <div  class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>类别</label>
                    <input type="text" id="apiType" name="apiType" maxlength="50" lay-verify="required"  autocomplete="off" :attr="@readonly">
                  </div>
              </div>
              <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                  <div  class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>名称</label>
                    <input type="text" name="apiServer" maxlength="50" lay-verify="required"  autocomplete="off" :attr="@readonly"/>
                  </div>
              </div>
              <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                  <div  class="disui-form-flex">
                    <label><span class="edit-verify-span">*</span>地址</label>
                    <input type="text" name="apiUrl" maxlength="300" lay-verify="required"  autocomplete="off" :attr="@readonly"/>
                  </div>
              </div>
              <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                  <div  class="disui-form-flex">
                    <label>用户名</label>
                    <input type="text" name="apiName" maxlength="100"   autocomplete="off" :attr="@readonly"/>
                  </div>
              </div>
              <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                  <div  class="disui-form-flex">
                    <label>密码</label>
                    <input type="password" name="apiPwd" maxlength="100"  autocomplete="off" :attr="@readonly"/>
                  </div>
              </div>
              <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                  <div  class="disui-form-flex">
                    <label>医院ID</label>
                    <input type="text" name="clientId" maxlength="100"   autocomplete="off" :attr="@readonly"/>
                  </div>
              </div>
              <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                  <div  class="disui-form-flex">
                    <label>医院GUID</label>
                    <input type="text" name="clientGuid" maxlength="100"   autocomplete="off" :attr="@readonly"/>
                  </div>
              </div>

            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div  class="disui-form-flex">
                    <label>Token</label>
                    <input type="text"  name="token" maxlength="100"   autocomplete="off" :attr="@readonly"/>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div  class="disui-form-flex">
                    <label>端口</label>
                    <input type="text" name="port" maxlength="10"   autocomplete="off" :attr="@readonly"/>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3 layui-col-lg2">
                <div class="disui-form-flex " >
                    <label>状态：</label>
                    <input type="radio" name="dataStatus" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                           ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('sys_status')">
                </div>
            </div>
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex " >
                    <label>备注：</label>
                    <textarea name="remarks" maxlength="65535" rows="2" class="layui-textarea" :attr="@readonly"></textarea>
                </div>
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="sysDockingEdit_submit" id="sysDockingEdit_submit">提交</button>
        </div>
</div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/system/sysDockingEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>