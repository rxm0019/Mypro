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
    .layui-tab-title {
        margin: 0 20px;
        border-bottom: 2px solid #e5e5e5;
    }

    .layui-tab-title {
        margin: 0;
    }

    .layui-tab-content {
        padding: 10px 0 0 0 !important;
    }

    .layui-this {
        color: #33AB9F !important;
    }

    .layui-this:after {
        border-bottom: 2px solid #33AB9F !important;
    }

    .layui-colla-content {
        padding: 0;
    }

    .text-style {
        font-size: 12px;
        margin-left: 8px;
    }
</style>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="diaExecuteOrderList">
<div class="layui-fluid" style="padding: 0 !important;">
    <div class="layui-card" style="padding: 0">

        <div class="layui-card-body">
            <div class="layui-collapse" lay-filter="orderColla">
                <#--长期医嘱-->
                <div class="layui-colla-item">
                    <p class="layui-colla-title">长期医嘱</p>
                    <div class="layui-colla-content layui-show">
                        <!--医嘱页签-->
                        <div class="layui-tab layui-tab-brief" lay-filter="diaExecuteOrderTab">
                            <ul class="layui-tab-title">
                                <li lay-id="standingOrder" class="layui-this">透析长期医嘱</li>
                                <li lay-id="medicalRecords">用药记录</li>
                                <li lay-id="templateOrder">模板医嘱</li>
                            </ul>
                            <div class="layui-tab-content">
                                <div class="layui-tab-item layui-show">
                                    <!--工具栏的按钮的div，注意：需要增加权限控制-->
                                    <div class="layui-form">
                                        <div class="layui-form-item">
                                            <div style="padding-bottom: 10px;padding-left: 10px;display: inline-block;">
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#addOrder') && @showBtn"
                                                        class="layui-btn layui-btn-dismain" onclick="saveOrEditOrder()">
                                                    添加医嘱
                                                </button>
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#import') && @showBtn"
                                                        class="layui-btn layui-btn-dismain" onclick="importAdvice()">
                                                    从组套导入
                                                </button>
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#editOrder') && @showBtn"
                                                        class="layui-btn layui-btn-dismain" onclick="editOrder()">修改
                                                </button>
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#deleteOrder') && @showBtn"
                                                        class="layui-btn layui-btn-dissub" onclick="deleteOrder()">删除
                                                </button>
                                            </div>
                                            <div style="display: inline-block;padding-left: 20px;">
                                                <input type="radio" name="standStatus" lay-filter="standStatus"
                                                       value="0" title="在用" checked="">
                                                <input type="radio" name="standStatus" lay-filter="standStatus"
                                                       value="1" title="停用">
                                                <input type="radio" name="standStatus" lay-filter="standStatus" value=""
                                                       title="全部">
                                            </div>
                                        </div>
                                    </div>
                                    <!--table定义-->
                                    <table id="standingOrder_table" lay-filter="standingOrder_table"></table>
                                </div>
                                <div class="layui-tab-item">
                                    <!--工具栏的按钮的div，注意：需要增加权限控制-->
                                    <div class="layui-form">
                                        <div class="layui-form-item">
                                            <div style="padding-bottom: 10px;padding-left:10px;display: inline-block;">
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#addOrder') && @showBtn"
                                                        class="layui-btn layui-btn-dismain" onclick="saveOrEditOrder()">
                                                    添加医嘱
                                                </button>
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#import') && @showBtn"
                                                        class="layui-btn layui-btn-dismain" onclick="importAdvice()">
                                                    从组套导入
                                                </button>
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#editOrder') && @showBtn"
                                                        class="layui-btn layui-btn-dismain" onclick="editOrder()">修改
                                                </button>
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#deleteOrder') && @showBtn"
                                                        class="layui-btn layui-btn-dissub" onclick="deleteOrder()">删除
                                                </button>
                                            </div>
                                            <div style="display: inline-block;padding-left: 20px;">
                                                <input type="radio" name="medicalStatus" lay-filter="medicalStatus"
                                                       value="0" title="在用" checked="">
                                                <input type="radio" name="medicalStatus" lay-filter="medicalStatus"
                                                       value="1" title="停用">
                                                <input type="radio" name="medicalStatus" lay-filter="medicalStatus"
                                                       value="" title="全部">
                                            </div>
                                        </div>
                                    </div>
                                    <!--table定义-->
                                    <table id="medicalRecords_table" lay-filter="medicalRecords_table"></table>
                                </div>
                                <div class="layui-tab-item">
                                    <!--工具栏的按钮的div，注意：需要增加权限控制-->
                                    <div class="layui-form">
                                        <div class="layui-form-item">
                                            <div style="padding-bottom: 10px;padding-left: 10px;display: inline-block;">
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#addOrder') && @showBtn"
                                                        class="layui-btn layui-btn-dismain" onclick="saveOrEditOrder()">
                                                    添加医嘱
                                                </button>
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#import') && @showBtn"
                                                        class="layui-btn layui-btn-dismain" onclick="importAdvice()">
                                                    从组套导入
                                                </button>
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#editOrder') && @showBtn"
                                                        class="layui-btn layui-btn-dismain" onclick="editOrder()">修改
                                                </button>
                                                <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#deleteOrder') && @showBtn"
                                                        class="layui-btn layui-btn-dissub" onclick="deleteOrder()">删除
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <!--table定义-->
                                    <table id="templateOrder_table" lay-filter="templateOrder_table"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <#-- 当日医嘱 -->
                <div class="layui-colla-item">
                    <p class="layui-colla-title">当日医嘱</p>
                    <div class="layui-colla-content layui-show">
                        <div style="padding: 10px;">
                            <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#commit') && @showBtn"
                                    class="layui-btn layui-btn-dismain" onclick="commitAll()">全部提交
                            </button>
                            <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#check') && @showBtn"
                                    class="layui-btn layui-btn-dismain" onclick="checkAll()">全部核对
                            </button>
                            <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#orderHistory')"
                                    class="layui-btn layui-btn-dismain" onclick="orderHistory()">医嘱历史
                            </button>
                            <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#add') && @showBtn"
                                    class="layui-btn layui-btn-dismain" onclick="saveOrEdit()">添加医嘱
                            </button>
                            <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#recentItem') && @showBtn" id="recentItem"
                                    class="layui-btn layui-btn-dissub" onclick="recentItem()">近期检验项目
                            </button>
                            <button :visible="@baseFuncInfo.authorityTag('diaExecuteOrderList#print') && @showBtn"
                                    class="layui-btn layui-btn-dissub" onclick="printOrder()">列印
                            </button>
                        </div>

                        <!--table定义-->
                        <table id="diaExecuteOrderList_table" lay-filter="diaExecuteOrderList_table"></table>
                    </div>
                </div>
            </div>


            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="orderList_bar">
                {{# if(diaExecuteOrderList.showBtn) { }}
                    {{# if(baseFuncInfo.authorityTag('diaExecuteOrderList#addOrder')) { }}
                        {{# if(isEmpty(d.parentOrderId) && d.orderType != '3') { }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="addSubOrder">子医嘱</a>
                        {{# } }}
                    {{# } }}
                    {{# if(diaExecuteOrderList.category === '2') { }}
                        {{# if(baseFuncInfo.authorityTag('diaExecuteOrderList#addPerform') && isEmpty(d.parentOrderId)) { }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="addPerform">添加执行</a>
                        {{# } }}
                        {{# if(baseFuncInfo.authorityTag('diaExecuteOrderList#continueOpen') && isEmpty(d.parentOrderId)) { }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="continueOpen">续开</a>
                        {{# } }}
                    {{# } else { }}
                        {{# if(baseFuncInfo.authorityTag('diaExecuteOrderList#disable') && isEmpty(d.parentOrderId)) { }}
                            {{# if(d.dataStatus === '0') { }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="disable">停用</a>
                            {{# } else { }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="disable">启用</a>
                            {{# } }}
                        {{# } }}
                    {{# } }}
                {{# } }}
            </script>


            <!--table的工具栏按钮定义，注意：需要增加权限控制-->
            <script type="text/html" id="diaExecuteOrderList_bar">
                {{# if(diaExecuteOrderList.showBtn) { }}
                    <#-- 检验类型显示申请单 -->
                    {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#applyForm') && d.orderType === '3'){ }}
                        <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="applyForm">申请单</a>
                    {{#  } }}
                    <#--  医嘱状态  未提交  -->
                    {{# if(d.orderStatus === $.constant.orderStatus.NOT_COMMIT) { }}
                        {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#add')){ }}
                            {{# if(d.orderType !== '3' && isEmpty(d.parentExecuteOrderId)) { }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="addSubOrder">子医嘱</a>
                            {{# } }}
                        {{#  } }}
                        {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#edit') && d.orderType !== '3'){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="edit">编辑</a>
                        {{#  } }}
                        {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#commit') && isEmpty(d.parentExecuteOrderId)){ }}
                             <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="commit">提交</a>
                        {{#  } }}
                        {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#delete')){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="del">删除</a>
                         {{#  } }}
                        <#-- 护士显示未提交 -->
                        {{#  if(diaExecuteOrderList.currentUserType===diaExecuteOrderList.userType.nurse && isEmpty(d.parentExecuteOrderId)){ }}
                            <span class="text-style">未提交</span>
                        {{#  } }}
                    {{# } }}
                    <#--  医嘱状态  已提交/待执行  -->
                    {{# if(d.orderStatus === $.constant.orderStatus.SUBMITTED) { }}
                        {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#cancelCommit') && isEmpty(d.parentExecuteOrderId)){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="cancelCommit">取消提交</a>
                        {{#  } }}
                        {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#execute') && isEmpty(d.parentExecuteOrderId)){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="execute">执行</a>
                        {{#  } }}
                    {{# } }}
                    <#--  医嘱状态  已执行/待核对  -->
                    {{# if(d.orderStatus === $.constant.orderStatus.EXECUTED) { }}
                        <#-- 医生显示已执行 -->
                        {{#  if(diaExecuteOrderList.currentUserType===diaExecuteOrderList.userType.doctor && isEmpty(d.parentExecuteOrderId)){ }}
                            <span class="text-style">已执行</span>
                        {{#  } }}
                        <#--  当前护士(取消执行)  其他护士(核对)  -->
                        {{#  if(d.executeOrderNurse === diaExecuteOrderList.userId){ }}
                            {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#cancelExecute') && isEmpty(d.parentExecuteOrderId)){ }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="cancelExecute">取消执行</a>
                            {{# } }}
                        {{#  } else { }}
                            {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#check') && isEmpty(d.parentExecuteOrderId)){ }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="check">核对</a>
                            {{# } }}
                        {{# } }}
                    {{# } }}
                    <#--  医嘱状态  已核对  -->
                    {{# if(d.orderStatus === $.constant.orderStatus.CHECKED) { }}
                        <#-- 当前护士(取消核对)   其他护士和医生 (已核对 【文本】) -->
                        {{#  if(d.checkOrderNurse === diaExecuteOrderList.userId){ }}
                            {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#cancelCheck') && isEmpty(d.parentExecuteOrderId)){ }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="cancelCheck">取消核对</a>
                            {{# } }}
                        {{# } else { }}
                            {{# if(isEmpty(d.parentExecuteOrderId)) { }}
                                <span class="text-style">已核对</span>
                            {{# } }}
                        {{# } }}
                    {{# } }}
                    <#--  医嘱状态  已取消核对/取消执行/核对  -->
                    {{# if(d.orderStatus === $.constant.orderStatus.CANCEL_CHECKED) { }}
                        <#-- 当前登录者是核对护士   -->
                        {{# if(d.checkOrderNurse === diaExecuteOrderList.userId) { }}
                            {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#check') && isEmpty(d.parentExecuteOrderId)){ }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="check">核对</a>
                            {{# } }}
                        <#-- 当前登录者是执行护士 -->
                        {{# } else if(d.executeOrderNurse === diaExecuteOrderList.userId) { }}
                            {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#cancelExecute') && isEmpty(d.parentExecuteOrderId)){ }}
                                <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="cancelExecute">取消执行</a>
                            {{# } }}
                        {{# } else { }}
                            {{# if(isEmpty(d.parentExecuteOrderId)){ }}
                                <span class="text-style">已取消核对</span>
                            {{# } }}
                        {{# } }}
                    {{# } }}
                    <#--  医嘱状态  已取消执行  -->
                    {{# if(d.orderStatus === $.constant.orderStatus.CANCELLED_EXECUTE) { }}
                        {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#cancelCommit') && isEmpty(d.parentExecuteOrderId)){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-black" lay-event="cancelCommit">取消提交</a>
                        {{#  } }}
                        {{#  if(baseFuncInfo.authorityTag('diaExecuteOrderList#execute') && isEmpty(d.parentExecuteOrderId)){ }}
                            <a class="layui-btn layui-btn-dissmall layui-btn-xs layui-btn-dis-red" lay-event="execute">执行</a>
                        {{#  } }}
                    {{# } }}
                {{# } }}
            </script>

            <#-- 执行医嘱   个人出库复选框 -->
            <script type="text/html" id="selfDrugsTemplet">
                {{# if(d.orderStatus === $.constant.orderStatus.NOT_COMMIT && diaExecuteOrderList.showBtn) {  }}
                    {{# if(d.selfDrugs === 'Y') {  }}
                        <input type="checkbox" lay-skin="primary" lay-filter="selfDrugs" data-id="{{d.executeOrderId}}" checked>
                    {{# } else { }}
                        <input type="checkbox" lay-skin="primary" lay-filter="selfDrugs" data-id="{{d.executeOrderId}}">
                    {{# } }}
                {{# } else { }}
                    {{# if(d.selfDrugs === 'Y') {  }}
                        <input type="checkbox" lay-skin="primary" checked disabled>
                    {{# } else { }}
                        <input type="checkbox" lay-skin="primary" disabled>
                    {{# } }}
                {{# } }}
            </script>

            <!-- 长期医嘱内容template -->
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

            <!-- 执行医嘱内容template -->
            <script type="text/html" id="execute_orderContent_templet">
                <#-- 子医嘱-->
                {{#  if (d.parentExecuteOrderId) { }}
                    <div class="order-content sub-order" data-parent-order-id="{{d.parentExecuteOrderId}}">
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
                {{#  if (!d.parentExecuteOrderId) { }}
                    <div class="order-content" data-order-id="{{d.executeOrderId}}">
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
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript"
        src="${ctxsta}/static/js/dialysis/diaExecuteOrderList.js?t=${currentTimeMillis}"></script>
</body>
</html>