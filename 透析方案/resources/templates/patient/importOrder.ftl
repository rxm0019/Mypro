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
<style type="text/css">
    #importOrder_table + div .layui-table-cell {
        height: 34px;
        line-height: 18px;
    }
    /* 子医嘱添加特殊背景色 */
    .sub-order-tr {
        background-color: rgba(242, 242, 242, 0.5);
    }

    /* 医嘱内容 */
    .order-content {
        display: inline-flex;
        align-content: stretch;
    }
    /* 医嘱内容 - 展开/折叠Icon */
    .order-content .icon-box {
        flex: 0 0 25px;
        padding-top: 10px;
    }
    .order-content .icon-box .layui-icon {
        border: 1px solid rgba(51, 171, 159, 1);
        color: rgba(51, 171, 159, 1);
        font-size: 12px;
        padding: 1px;
    }
    .order-content.fold .icon-box .layui-icon-subtraction:before {
        content: "\e624";
    }
    /* 医嘱内容 - 厂家 */
    .order-content .content-manufactor {
        color: #797979;
        line-height: 14px;
        font-size: 12px;
    }
    /* 医嘱内容 - 子医嘱内容缩进 */
    .order-content.sub-order .content {
        padding-left: 55px;
    }
    /** 医嘱内容过长，显示省略号 **/
    .content div {
        width: 355px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .span-class{
        float: left;
        line-height: 38px;
        margin-left: 5px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>
<body ms-controller="importOrder">
<div class="layui-fluid">
    <div class="layui-row layui-col-space1">
        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4" style="padding-right: 20px;">
            <div style="color: #000000;font-weight: bold;padding: 10px 0;">医嘱组套</div>
            <div style="position: relative;">
                <input type="text" id="orderGroupName" placeholder="组套名称" class="layui-input">
                <i class="layui-icon layui-icon-search" style="position: absolute;right: 10px;top: 6px;font-size: 24px;" onclick="searchGroup()"></i>
            </div>
            <table id="orderGroup_table" lay-filter="orderGroup_table"></table>
            <div style="position: absolute;">
                <button class="layui-btn layui-btn-dismain" :visible="@baseFuncInfo.authorityTag('patOrderList#groupDelete')" onclick="delOrderGroup()">删除组套</button>
            </div>
        </div>
        <div class="layui-col-sm8 layui-col-md8 layui-col-lg8" style="border: 1px solid #cccccc;border-radius: 7px;padding: 0 10px;" ms-if="showGroupItem">
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <label style="font-weight: bold;"><span class="edit-verify-span">*</span>已选择组套：</label>
                        <span></span>
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                    <div class="disui-form-flex">
                        <label>组套名称：</label>
                        <span class="span-class" :attr="{title: @groupItemName}">{{groupItemName}}</span>
                    </div>
                </div>
            </div>
            <div class="layui-row layui-col-space1">
                <div class="layui-col-sm5 layui-col-md5 layui-col-lg5">
                    <div class="disui-form-flex">
                        <label>模板内容：</label>
                        <span></span>
                    </div>
                </div>
                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex">
                        <label>创建人：</label>
                        <span class="span-class">{{founder}}</span>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                    <div class="disui-form-flex">
                        <label>创建时间：</label>
                        <span class="span-class">{{createTime}}</span>
                    </div>
                </div>
            </div>
            <!--table定义-->
            <table id="importOrder_table" lay-filter="importOrder_table"></table>
        </div>
        <!-- 医嘱内容template -->
        <script type="text/html" id="orderContentTemplet">
            <#-- 子医嘱-->
            {{#  if (d.parentOrderGroupItemId) { }}
            <div class="order-content sub-order" data-parent-order-id="{{d.parentOrderGroupItemId}}">
                <div class="content">
                    {{# if(d.specifications) { }}
                    <div title="{{d.orderContent}}＃{{d.specifications}}">{{d.orderContent}}<span>#</span>{{d.specifications}}</div>
                    {{# } else { }}
                    <div title="{{d.orderContent}}">{{d.orderContent}}</div>
                    {{# } }}
                    {{# if(d.manufactor) { }}
                    <div class="content-manufactor" style="color: #797979;">厂家：{{d.manufactor}}</div>
                    {{# } }}
                </div>
            </div>
            {{#  } }}

            <#-- 父医嘱-->
            {{#  if (!d.parentOrderGroupItemId) { }}
            <div class="order-content" data-order-id="{{d.orderGroupItemId}}">
                <div class="icon-box" lay-event="toggle-fold-suborder">
                    {{# if(d.subOrderId) { }}
                    <i class="layui-icon layui-icon-subtraction"></i>
                    {{# } }}
                </div>
                <div class="content">
                    {{# if(d.specifications) { }}
                    <div title="{{d.orderContent}}＃{{d.specifications}}">{{d.orderContent}}<span>#</span>{{d.specifications}}</div>
                    {{# } else { }}
                    <div title="{{d.orderContent}}">{{d.orderContent}}</div>
                    {{# } }}
                    {{# if(d.manufactor) { }}
                    <div class="content-manufactor" style="color: #797979;">厂家：{{d.manufactor}}</div>
                    {{# } }}
                </div>
            </div>
            {{#  } }}
        </script>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/importOrder.js?t=${currentTimeMillis}"></script>
</body>
</html>