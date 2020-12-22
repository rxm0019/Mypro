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
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="tBaseSetList">

    <div class="layui-fluid">

        <div class="layui-card layui-form" lay-filter="tBaseSetlist_form" id="tBaseSetlist_form">
            <!--搜素栏的div-->
            <div class=" layui-card-header layuiadmin-card-header-auto">
                <#--<button class="layui-btn  layui-btn-lg" lay-filter="tBaseSetlist_submit" onclick="save()">保存</button>-->
                    <div class="layui-form-item  layui-hide">
                        <label class="layui-form-label">ID</label>
                        <div class="layui-input-inline">
                            <input type="hidden" name="uuid" placeholder="请输入" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                <div class="layui-form-item">
                    <div class="layui-input-inline">
                        <button class="layui-btn layui-btn-lg" lay-submit lay-filter="tBaseSetlist_submit" :visible="@baseFuncInfo.authorityTag('tBaseSetList#save')" id="tBaseSetlist_submit" >保存</button>
                    </div>
                </div>
            </div>

            <div class="layui-card-body">
                <ul>
                    <li>
                        <fieldset class="layui-elem-field site-demo-button" style="margin-top: 30px;">
                            <legend>开门方式</legend>
                        <div class="layui-row" style="height: 30px"></div>
                        <#--<div class="layui-row">-->
                            <#--<div class="layui-col-md11 layui-col-md-offset1">-->
                                <#--<div class="layui-form-item">-->
                                    <#--<label class="layui-form-label">组合开门配置：</label>-->
                                    <#--<div class="layui-input-block">-->
                                        <#--<input type="checkbox" lay-verify="checkbox" lay-verify-msg="复选框至少选一项"  name="combDoor" ms-attr="{value:el.value,title:el.name}"-->
                                               <#--lay-skin="primary" ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('t_base_set_comb_door_')" lay-filter="combDoor_filter">-->
                                    <#--</div>-->
                                <#--</div>-->
                            <#--</div>-->
                        <#--</div>-->
                        <div class="layui-row">
                            <div class="layui-col-md11 layui-col-md-offset1">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">联动开门配置：</label>
                                    <div class="layui-input-block">
                                        <input type="radio" lay-verify="radio" lay-verify-msg="单选框至少选一项"  name="linkageDoor" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                                               ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('t_base_set_linkage_door_')">
                                    </div>
                                </div>
                            </div>
                        </div>
                        </fieldset>
                    </li>
                    <li>
                        <fieldset class="layui-elem-field site-demo-button" style="margin-top: 30px;">
                        <legend>报警时间设置</legend>
                            <div class="layui-row" style="height: 30px"></div>
                            <div class="layui-row">
                                <div class="layui-col-md11 layui-col-md-offset1">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">报警时间：</label>
                                        <div class="layui-input-block">
                                            <input type="radio" lay-verify="radio" lay-verify-msg="单选框至少选一项"  name="alarmTime" ms-attr="{value:el.value,title:el.name,checked:true&&$index==0}"
                                                   ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('t_base_set_alarm_time_')">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </li>
                </ul>
            <#--<!--工具栏的按钮的div，注意：需要增加权限控制&ndash;&gt;-->
            <#--<div style="padding-bottom: 10px;" id="tBaseSetList_tool">-->
            <#--<button :visible="@baseFuncInfo.authorityTag('tBaseSetList#batchDel')"-->
            <#--class="layui-btn"  onclick="batchDel()">删除</button>-->
            <#--<button :visible="@baseFuncInfo.authorityTag('tBaseSetList#add')"-->
            <#--class="layui-btn"  onclick="saveOrEdit()">添加</button>-->
            <#--</div>-->
            <#--<!--table定义&ndash;&gt;-->
            <#--<table id="tBaseSetList_table" lay-filter="tBaseSetList_table"></table>-->
            <#--<!--table的工具栏按钮定义，注意：需要增加权限控制&ndash;&gt;-->
            <#--<script type="text/html" id="tBaseSetList_bar">-->
            <#--{{#  if(baseFuncInfo.authorityTag('tBaseSetList#edit')){ }}-->
            <#--<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>-->
            <#--{{#  } }}-->
            <#--{{#  if(baseFuncInfo.authorityTag('tBaseSetList#del')){ }}-->
            <#--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>-->
            <#--{{#  } }}-->
            <#--</script>-->
            </div>
        </div>

    </div>


    <!--请在下方写此页面业务相关的脚本-->
    <script type="text/javascript" src="${ctxsta}/static/js/system/tBaseSetList.js?t=${currentTimeMillis}"></script>
</body>
</html>