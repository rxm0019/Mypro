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
        .card-nurse{
            padding: 5px 10px;
           margin-bottom: 10px;
        }
        .un-handle{
            margin: 3px 5px 3px 3px;
            float: left;
            background: rgb(118, 192, 187);
            color: white;
            padding: 0px 10px;
            line-height: 34px;
            border-radius: 6px;
            border-radius: 6px;
            min-width: 50px;
        }
        .on-handel{
            margin: 3px 5px 3px 3px;
            float: left;
            background: rgb(118, 192, 187);
            color: white;
            padding: 0px 0px 0px 10px;
            border-radius:6px;
        }
        .on-handel button{
            width: 30px;
            float: right;
        }
        .on-handel-name{
            float: left;
            line-height: 34px;
            min-width: 30px;
        }
    </style>
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="eduNurse">
<div class="layui-fluid">
    <div class="layui-card" style="margin-bottom: 10px;">
        <!--搜素栏的div-->
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="eduNurse_search" lay-filter="eduNurse_search">
        </div>
    </div>

    <div class="layui-card card-nurse">
        <div class="layui-row">
            <div class="disui-form-flex">
                <label class="layui-form-label" style="flex:0 0 90px;">未分配患者：</label>
                <div>
                    <div class="un-handle" ms-for="($index, el) in @patientList" :visible="@patientList.length>0" style="display: none;" >{{el.patientName}}</div>
                </div>
            </div>
    </div>
    </div>

    <div class="layui-card card-nurse" ms-for="($index, el) in @nurseList" :visible="@nurseList.length>0" style="display: none;" >
        <div class="layui-row">
            <div class="disui-form-flex" >
                <label class="layui-form-label" style="flex: 0 0 90px;">{{el.userName}}({{el.patientInfoList.length}})</label>
            </div>
        </div>
        <div class="layui-row">
            <div class="disui-form-flex" >
                <label class="layui-form-label" style="flex: 0 0 90px;">负责患者：</label>
                <div>
                    <div class="on-handel" ms-for="($index, el2) in @el.patientInfoList" :visible="@el.patientInfoList.length>0" style="display: none;">
                        <div class="on-handel-name">
                        {{el2.patientName}}
                        </div>
                        <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach layui-btn layui-btn-dismain"
                                ms-attr="{patientId:el2.patientId}" onclick="del(this)"><i class="layui-icon">&#xe640;</i></button>
                    </div>
                </div>
                <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach layui-btn layui-btn-dismain" ms-attr="{nurseId:el.id}" style="margin: 3px;width: 30px;"  onclick="edit(this)"><i class="layui-icon">&#xe654;</i></button></div>
            </div>
        </div>
    </div>



</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/education/eduNurse.js?t=${currentTimeMillis}"></script>
</body>
</html>