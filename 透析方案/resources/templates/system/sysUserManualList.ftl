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
        .u400_div {
            margin-top: 10px;
            width: 99.2%;
            height: calc(100vh - 180px);
            background:  #FFFFFF;
            border:1px solid #EFEFEF;
            border-radius: 8px;
        }
        .u400_divs {
            margin-top: 10px;
            width: 99.2%;
            height: calc(100vh);
            background:  #FFFFFF;
            border:1px solid #EFEFEF;
            border-radius: 8px;
        }

        .u400_div_left{
            height: calc(100vh - 80px);
            margin-right: 10px;
        }
        .u400_div_right{
            height: calc(100vh - 80px);
            margin-right: 5px;
            margin-left: 5px;
            overflow: auto;
        }
        .u400_div_content{
            margin:5%;
        }
        .dialysis-layout-side .patient-search .title-line {
            width: auto !important;
            margin: auto !important;
        }
        .layui-upload-item.with-file{
            float: left;
            width: auto;
            margin-left: 30px;
        }
        .layui-upload-item.with-file a {
            width: auto;
        }
        /*删除icon不显示*/
        .layui-upload-item .icon-delete {
            margin: 2px 0 0 2px;
            width: 0px;
            height: 0px;
        }
        .dialysis-layout-side {
            position: fixed;
            top: 5px !important;
            left: 5px;
            width: 275px;
            height: calc(98.5vh) !important;
        }
        .dialysis-layout-body {
            top: 5px !important;
            height: calc(98.5vh) !important;
        }
        .dialysis-dropdown-list {
            padding: 10px 10px 10px 20px;
            font-size: 14px;
            border-bottom: 1px solid #e6e6e6;
            cursor: pointer;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/dis_dialysis_layout.css?t=${currentTimeMillis}" />
<body ms-controller="sysUserManualList">
<div class="layui-fluid" ms-if="@manunal=='N'">
    <div class="layui-card">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="sysUserManualList_search" lay-filter="sysUserManualList_search">
        </div>
        <div class="layui-card-body">
            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                <div class="u400_div u400_div_left ">
                    <!--工具栏的按钮的div，注意：需要增加权限控制-->
                    <div style="padding: 10px;" id="sysUserManualList_tool">
                        <button :visible="@baseFuncInfo.authorityTag('sysUserManualList#add')"
                                class="layui-btn layui-btn-dismain"  onclick="saveOrEdit()">添加</button>
                        <button :visible="@baseFuncInfo.authorityTag('sysUserManualList#edit')"
                                class="layui-btn layui-btn-dismain"  onclick="edit()">编辑</button>
                        <button :visible="@baseFuncInfo.authorityTag('sysUserManualList#delete')"
                                class="layui-btn layui-btn-dissub"  onclick="batchDel()">删除</button>
                    </div>
                    <!--table定义-->
                    <table id="sysUserManualList_table" lay-filter="sysUserManualList_table"></table>
                </div>
            </div>
            <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
                <div class="u400_div u400_div_right" >
                    <div class="u400_div_content">
                        <div id="remarks" lay-verify="content" name="remarks"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="dialysis-layout" ms-if="@manunal=='Y'">
    <#-- 侧边栏 -->
    <div class="dialysis-layout-side layui-card">
        <div class="patient-search layui-form">
            <div class="layui-form-item">
                <div class="layui-input-inline title-line" style="left: 5px">
                    使用手册列表
                </div>
            </div>
        </div>

        <#-- 侧边栏患者列表 -->
        <div class="layui-side-scroll patient-list">
            <#-- 显示空提示或错误信息 -->
            <div ms-if="@manualList.length == 0" class="dialysis-list-error">查无数据</div>

            <div class="dialysis-dropdown-list" ms-for="($index, el) in @manualList" :click="@onSelected(this,el)">
                <div class="patient-info-box">
                    <div class="patient-info-row">
                        <label class="manualName">{{el.manualName}}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="layui-card dialysis-layout-body">
        <div class="layui-card-body" :visible="@manualList.length == 0">
            <div class="patient-unselect">请选择</div>
        </div>

        <div class="layui-card-body" :visible="@manualList.length > 0">
            <div style="width: 100%;">
                <div style="float: left;width: 100%">
                    <div id="fileShowDiv"></div>
                </div>
            </div>
            <div class="u400_divs u400_div_right" >
                <div class="u400_div_content">
                    <div id="remarks" lay-verify="content" name="remarks"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/system/sysUserManualList.js?t=${currentTimeMillis}"></script>
</body>
</html>