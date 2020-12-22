<#include "../base/common.ftl">
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/dis_dialysis_layout.css?t=${currentTimeMillis}" />
</head>
<!--layuiadmin的css-->
<link rel="stylesheet" type="text/css" href="${ctxsta}/static/layuiadmin/style/admin.css" media="all">
<body ms-controller="diaToppingList">
<#-- 头部查询 -->
<div class="dialysis-topping-header">
    <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
         id="diaToppingList_search" lay-filter="diaToppingList_search">
        <div class="layui-form-item condition-box">
            <div class="layui-inline" style="width:300px;">
                <label class="layui-form-label">日期：</label>
                <div class="layui-input-inline">
                    <input type="text" name="dialysisDate" id="dialysisDate" class="layui-input">
                </div>
            </div>
            <div class="layui-inline schedule-shift-options" style="margin-right: 40px;">
                <div class="tab-item" :attr="{'data-shift': false}">我的</div>
                <div class="tab-item" :attr="{'data-shift': true, 'data-value': ''}">全天</div>
                <div class="tab-item" ms-for="($index, el) in @scheduleShiftOptions" :attr="{'data-shift': true, 'data-value': el.value}" :text="el.name"></div>
            </div>
            <div class="layui-inline" style="width:200px;">
                <div class="layui-input-inline">
                    <input type="text" name="keyWord" placeholder="请输入病历号/患者姓名" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline" style="width:300px;">
                <label class="layui-form-label">区组：</label>
                <div class="layui-input-inline">
                    <select name="regionSettingId">
                        <option value="">全部</option>
                        <option ms-for="($index, el) in @regionOptions" :attr="{value: el.value}" :text="el.name"></option>
                    </select>
                </div>
            </div>
            <div class="layui-inline">
                <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach " onclick="getAllToppingList()">搜 索</button>
            </div>
        </div>
    </div>
</div>
<div class="layui-fluid">
    <#-- 就诊列表 -->
    <div class="dialysis-topping-list layui-row layui-col-space5">
        <div :if="!@toppingList || @toppingList.length == 0" class="empty-list">暂无就诊信息</div>
        <div :if="@toppingList && @toppingList.length > 0" class="dialysis-topping-item-box layui-col-sm6" ms-for="($index, el) in @toppingList">
            <div class="dialysis-topping-item with-clock" :attr="{'data-up-date': el.upDate, 'data-down-plan-date': el.downPlanDate, 'data-dialysis-time': el.dialysisTime}">
                <#-- 我的置顶标记 -->
                <div :if="el.toppingId" class="item-topping">
                    <label>我</label>
                    <div></div>
                </div>

                <#-- 新患者标记 -->
                <div :if="el.lastDiaRecordId == null || el.lastDiaRecordId == ''" class="item-new">
                    <label><span>NEW</span></label>
                </div>

                <div class="item-header">
                    <div class="photo-box">
                        <img ms-attr="{'src': @el.patientPhoto, 'data-gender': @el.gender}" onerror="onPatientPhotoError(this)">
                    </div>
                    <div class="info-box">
                        <div class="info-row mt-5">
                            <div class="info-column">
                                <label>病历号：</label>
                                <span :text="el.patientRecordNo" :attr="{title: el.patientRecordNo}"></span>
                            </div>
                            <div class="info-column">
                                <label>ACT：</label>
                                <span :text="@getAnticoagulantName(el.anticoagulant)" :attr="{title: @getAnticoagulantName(el.anticoagulant)}"></span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-column" style="flex: 6;">
                                <div class="info-row mt-5">
                                    <div class="info-column">
                                        <label>姓名：</label>
                                        <span :text="el.patientName" :attr="{title: el.patientName}"></span>
                                    </div>
                                    <div class="info-column">
                                        <label>脱水量：</label>
                                        <span :text="el.targetDehydration" :attr="{title: el.targetDehydration}"></span>
                                    </div>
                                </div>
                                <div class="info-row mt-5">
                                    <div class="info-column">
                                        <label>床号：</label>
                                        <span :text="el.bedNo" :attr="{title: el.bedNo}"></span>
                                    </div>
                                    <div class="info-column">
                                        <label>透析方式：</label>
                                        <span :text="@getDialysisModeName(el.dialysisMode)" :attr="{title: @getDialysisModeName(el.dialysisMode)}"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="info-column mt-5" style="flex: 4; margin: auto;">
                                <div class="clock"></div>
                            </div>
                        </div>
                        <div class="info-row mt-5">
                            <div class="info-column" style="padding-top: 1px; height: 28px;">
                                <span ms-for="($patientTagIndex, patientTag) in @getPatientTags(el.patientTags)" class="patient-tag"
                                      :css="{color: @getPatientTagColor(patientTag.tagColor)}" :text="patientTag.tagContent">
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-footer">
                    <div class="btn-box" style="flex: 1;"></div>
                    <div class="btn-box">
                        <button class="layui-btn layui-btn-dismain" :click="@onToUpdateOrder(el.patientId, el.diaRecordId)">修改处方</button>
                    </div>
                    <div class="btn-box">
                        <button class="layui-btn layui-btn-dismain" :click="@onToMakeOrder(el.patientId, el.diaRecordId)">制定医嘱</button>
                    </div>
                    <div class="btn-box">
                        <button class="layui-btn layui-btn-dismain" :click="@onToMonitor(el.patientId, el.diaRecordId)">透析监测</button>
                    </div>
                    <div class="btn-box" style="flex: 1;"></div>
                    <div class="btn-more">
                        <ul class="" lay-filter="layadmin-pagetabs-nav">
                            <li class="layui-nav-item" lay-unselect="">
                                <a href="javascript:;"><i class="layui-icon layui-icon-more"></i></a>
                                <dl class="layui-nav-child layui-anim-fadein layui-anim layui-anim-upbit">
                                    <dd :if="!el.toppingId"><a href="javascript:;" :click="@onTopping(el.patientId)">置顶</a></dd>
                                    <dd :if="el.toppingId"><a href="javascript:;" :click="@onToppingRecovery(el.patientId)">恢复</a></dd>
                                </dl>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaToppingList.js?t=${currentTimeMillis}"></script>
</body>
</html>
