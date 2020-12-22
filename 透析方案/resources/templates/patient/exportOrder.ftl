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
    .layui-table-cell {
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
</style>
<body ms-controller="exportOrder">
<div class="layui-form" lay-filter="exportOrder_form" id="exportOrder_form" style="padding: 20px;">
    <div class="layui-form-item layui-hide">
        <button class="layui-btn" lay-submit lay-filter="exportOrder_submit" id="exportOrder_submit">提交</button>
    </div>
    <div class="layui-form-item">
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label><span class="edit-verify-span">*</span>组套名称：</label>
                    <input type="text" name="orderGroupName" maxlength="100" lay-verify="required" id="orderGroupName" autocomplete="off">
                </div>
            </div>
        </div>
        <div class="layui-row layui-col-space1">
            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <div class="disui-form-flex" >
                    <label><span class="edit-verify-span">*</span>组套内容：</label>
                    <span></span>
                </div>
            </div>
        </div>
        <!--table定义-->
        <table id="exportOrder_table" lay-filter="exportOrder_table"></table>
    </div>
    <!--table的工具栏按钮定义，注意：需要增加权限控制-->
    <script type="text/html" id="exportOrder_bar">
        {{# if(isEmpty(d.parentOrderId)) { }}
            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
        {{# } }}
    </script>
    <!-- 医嘱内容template -->
    <script type="text/html" id="orderContentTemplet">
        <#-- 子医嘱-->
        {{#  if (d.parentOrderId) { }}
        <div class="order-content sub-order" data-parent-order-id="{{d.parentOrderId}}">
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
        {{#  if (!d.parentOrderId) { }}
        <div class="order-content" data-order-id="{{d.orderId}}">
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
    <script type="text/javascript" src="${ctxsta}/static/js/patient/exportOrder.js?t=${currentTimeMillis}"></script>
</div>
</body>
</html>