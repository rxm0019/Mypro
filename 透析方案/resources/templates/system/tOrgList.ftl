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
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/lib/zTree/v3/css/layuiStyle/layuiStyle.css">
<body ms-controller="tOrgList">
<!--左侧树的div-->
<div id="left_tree"></div>
<div class="layui-fluid">
    <div class="layui-card" style="height: -webkit-fill-available;">
        <div class="layui-card-body">
            <div id="sysMenuList_top">
                <button class="layui-btn" :visible="@baseFuncInfo.authorityTag('tOrgList#addFirstOrg')"
                        onclick="saveOrEdit(1)">添加一级组织
                </button>
            </div>
        </div>
        <div class="layui-tab layui-tab-brief">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <div class="layui-form" lay-filter="tOrgList_form" id="tOrgList_form"
                         style="padding: 20px 10px 10px 0;">
                        <div class="layui-form-item  layui-hide">
                            <label class="layui-form-label">ID</label>
                            <div class="layui-input-inline">
                                <input type="hidden" name="uuid" placeholder="请输入" autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item  layui-hide">
                            <label class="layui-form-label">节点类型</label>
                            <div class="layui-input-inline">
                                <input type="hidden" name="type" placeholder="请输入" autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>编号</label>
                            <div class="layui-input-inline">
                                <input type="text" name="code" lay-verify="required" placeholder="请输入"
                                       autocomplete="off" class="layui-input" maxlength="100">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>名称</label>
                            <div class="layui-input-inline">
                                <input type="text" name="orgName" lay-verify="required" placeholder="请输入"
                                       autocomplete="off" class="layui-input" maxlength="100">
                            </div>
                        </div>
                        <#--<div class="layui-form-item layui-hide" id="orgType">-->
                            <#--<label class="layui-form-label"><span class="edit-verify-span">*</span>类型</label>-->
                            <#--<div class="layui-input-inline">-->
                                <#--<select name="category" >-->
                                    <#--<option value=""></option>-->
                                    <#--<option  ms-attr="{value:el.value}" ms-text="@el.name"-->
                                             <#--ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('t_org_type_')"></option>-->
                                <#--</select>-->
                            <#--</div>-->
                        <#--</div>-->
                        <div class="layui-form-item  layui-hide">
                            <label class="layui-form-label">省名</label>
                            <div class="layui-input-inline">
                                <input type="hidden" name="provinceName" placeholder="请输入" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item  layui-hide">
                            <label class="layui-form-label">市名</label>
                            <div class="layui-input-inline">
                                <input type="hidden" name="cityName" placeholder="请输入" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item  layui-hide">
                            <label class="layui-form-label">区/县名</label>
                            <div class="layui-input-inline">
                                <input type="hidden" name="countyName" placeholder="请输入" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item layui-hide" id="selectPrison">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>请选择地区</label>
                            <div class="layui-input-inline">
                                <select name="prisonProvince" id="prisonProvince" lay-filter="prisonProvince" >

                                </select>
                            </div>
                            <div class="layui-input-inline">
                                <select name="prisonCity" id="prisonCity" lay-filter="prisonCity" >

                                </select>
                            </div>
                            <div class="layui-input-inline">
                                <select name="prisonCounty" id="prisonCounty" lay-filter="prisonCounty">

                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item layui-hide">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>地区代码</label>
                            <div class="layui-input-inline">
                                <input type="input" name="areaCode" maxlength="200"  placeholder="请输入" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item layui-hide">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>地区名称</label>
                            <div class="layui-input-inline">
                                <input type="input" name="areaName" maxlength="200"  placeholder="请输入" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item layui-hide">
                            <button class="layui-btn" lay-submit lay-filter="tOrgEdit_submit" id="tOrgEdit_submit">
                                提交
                            </button>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"></label>
                            <button class="layui-btn" onclick="save()" :visible="@baseFuncInfo.authorityTag('tOrgList#save')">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->

<script type="text/javascript" src="${ctxsta}/static/lib/zTree/v3/js/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/loadJsonData.js"></script>
<script type="text/javascript" src="${ctxsta}/static/js/system/tOrgList.js?t=${currentTimeMillis}"></script>
</body>
</html>