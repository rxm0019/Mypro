<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="${ctxsta}/static/css/dis_dialysis_layout.css?t=${currentTimeMillis}" />
</head>
<body ms-controller="dialysisLayout">
<div class="dialysis-layout">
    <#-- 头部查询 -->
    <div class="dialysis-layout-header">
        <div class="layui-form layui-card-header layuiadmin-card-header-auto search-form"
             id="dialysisLayout_search" lay-filter="dialysisLayout_search">
        </div>
    </div>

    <#-- 侧边栏 -->
    <div class="dialysis-layout-side layui-card">
        <div class="patient-search layui-form" lay-filter="dialysisLayout_searchOrder">
            <div class="layui-form-item">
                <div class="layui-input-inline title-line">
                    患者列表
                </div>
                <div class="layui-input-inline select-inline">
                    <select name="patientStatus" lay-filter="dialysisLayout_patientStatusSelect">
                        <option value="">所有患者</option>
                        <option value="sign|true">已签到</option>
                        <option value="sign|false">未签到</option>
                        <option value="top|true">已关注</option>
                    </select>
                </div>
                <div class="layui-input-inline select-inline">
                    <select name="patientOrder" lay-filter="dialysisLayout_patientOrderSelect">
                        <option value="signNum|true">签到升序</option>
                        <option value="signNum|false">签到降序</option>
                        <option value="bedNo|true">床号升序</option>
                        <option value="bedNo|false">床号降序</option>
                    </select>
                </div>
            </div>
        </div>

        <#-- 侧边栏患者列表 -->
        <div class="layui-side-scroll patient-list">
            <#-- 显示空提示或错误信息 -->
            <div ms-if="@patientList.errorMsg" class="dialysis-list-error">{{patientList.errorMsg}}</div>
            <div ms-if="(@patientList.errorMsg == null || @patientList.errorMsg == '') && @patientList.data.length == 0" class="dialysis-list-error">查无数据</div>

            <div class="dialysis-dropdown-item" ms-for="($index, el) in @patientList.data" onclick="onSelectedPatientInfo(this)"
                 :attr="{'data-patient-id': @el.patientId, 'data-patient-name': @el.patientName, 'data-dialysis-date': @el.dialysisDate}">
                <#-- 我的置顶标记 -->
                <div :if="el.top" class="item-topping">
                    <label>我</label>
                    <div></div>
                </div>

                <#-- 新患者标记 -->
                <div :if="el.lastDiaRecordId == null || el.lastDiaRecordId == ''" class="item-new">
                    <label><span>NEW</span></label>
                </div>

                <#-- 患者内容 -->
                <div class="item-content">
                    <div class="patient-photo-box">
                        <img ms-attr="{'src': @el.patientPhoto, 'data-gender': @el.gender}" onerror="onPatientPhotoError(this)">
                    </div>
                    <div class="patient-info-box">
                        <div class="patient-info-row">
                            <label class="patient-name">{{el.patientName}}</label>
                            <label class="patient-record-no">{{el.patientRecordNo}}</label>
                        </div>
                        <div class="patient-info-row">
                            <label class="bed-no">床位：<b>{{el.bedNo || "--"}}</b></label>
                            <label class="dialysis-mode"><b>{{el.dialysisMode || "--"}}</b></label>
                            <label class="patient-age"><span>{{el.age}}</span></label>
                            <img class="patient-sex" ms-attr="{'src': '${ctxsta}' + @el.sexPic}">
                        </div>
                        <div class="patient-info-row">
                            <div class="infection-status">
                                <label ms-for="infection in @el.infectionStatus">{{infection}}</label>
                            </div>
                            <label :visible="el.recordStatus != null && el.recordStatus != ''" class="record-status" :css="{backgroundColor: el.recordStatusColor}">{{el.recordStatus}}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <#-- 页签功能 -->
    <div class="layui-card dialysis-layout-body">
        <#-- 未选择患者时，提示请选择患者 -->
        <div class="layui-card-body" :visible="@patientList.rawData.length == 0">
            <div class="patient-unselect">请选择患者</div>
        </div>

        <#-- 已选择患者时，显示对应的透析功能 -->
        <div class="layui-card-body" :visible="@patientList.rawData.length > 0">
            <#-- 按钮功能 -->
            <div class="dialysis-btns">
                <#-- 加透："已签到 && 未归档"时可操作，否则禁用 -->
                <a ms-if="@baseFuncInfo.authorityTag('dialysisLayout#addRecord')" href="javascript: void(0);" onclick="onAddDialysis()"
                   :class="['icon-btn', 'icon-add-dialysis', (@currentPatient.isPatientSign && !@currentPatient.isRecordFiled ? '' : 'disabled')]">
                    <label>加透</label>
                </a>
                <#-- 应收单上传："已签到 && 未归档 && 处方单未归档 && 处方单未收费"时可操作，否则禁用 -->
                <a ms-if="@baseFuncInfo.authorityTag('dialysisLayout#uploadReceivable')" href="javascript: void(0);" onclick="onUploadReceivableDoc()"
                        :class="['icon-btn', 'icon-document-upload', (@currentPatient.isPatientSign && !@currentPatient.isRecordFiled
                            && @currentPatient.receivableStatus != @config.receivableStatus.ARCHIVED
                            && @currentPatient.receivableStatus != @config.receivableStatus.CHARGE ? '' : 'disabled')]">
                    <label :attr="{'is-patient-sign': @currentPatient.isPatientSign, 'is-record-filed': @currentPatient.isRecordFiled,
                            'receivable-status': @currentPatient.receivableStatus, 'prescription-item-count': @currentPatient.prescriptionItemCount}">
                        应收单上传
                    </label>
                    <#-- 未上传：应收单“已签到 && 未上传 && 有处方明细” -->
                    <span class="warning" ms-if="@currentPatient.isPatientSign && @currentPatient.receivableStatus == @config.receivableStatus.NOTUPLOAD && @currentPatient.prescriptionItemCount > 0">(未上传)</span>
                    <#-- 已上传：应收单“已上传” -->
                    <span ms-if="@currentPatient.receivableStatus == @config.receivableStatus.UPLOAD">(已上传)</span>
                    <#-- 已归档：应收单“已归档” -->
                    <span ms-if="@currentPatient.receivableStatus == @config.receivableStatus.ARCHIVED">(已归档)</span>
                    <#-- 已收费：应收单“已收费” -->
                    <span ms-if="@currentPatient.receivableStatus == @config.receivableStatus.CHARGE">(已收费)</span>
                </a>
                <#-- 自动排床："已签到 && 未归档"时可操作，否则禁用 -->
<#--                <a href="javascript: void(0);" onclick="onAutoScheduleBed()"-->
<#--                   :class="['icon-btn', 'icon-bed', (@currentPatient.isPatientSign && !@currentPatient.isRecordFiled ? '' : 'disabled')]">-->
<#--                    <label>自动排床</label>-->
<#--                </a>-->
                <#-- 归档："已签到"时可操作，否则禁用。"未归档"时显示操作 -->
                <a href="javascript: void(0);" onclick="onSaveRecordFiled(true)" ms-if="@baseFuncInfo.authorityTag('dialysisLayout#filed') && !@currentPatient.isRecordFiled"
                   :class="['icon-btn', 'icon-bed', (@currentPatient.isPatientSign ? '' : 'disabled')]">
                    <label>归档</label>
                </a>
                <#-- 取消归档："已归档"时显示操作 -->
                <a href="javascript: void(0);" onclick="onSaveRecordFiled(false)" ms-if="@baseFuncInfo.authorityTag('dialysisLayout#filed') && @currentPatient.isRecordFiled" class="icon-btn icon-filed">
                    <label>取消归档</label>
                </a>
                <a href="javascript: void(0);" onclick="onRefreshRecordOptions();" class="icon-btn icon-refresh">
                    <label>刷新</label>
                </a>
                <a ms-if="@baseFuncInfo.authorityTag('dialysisLayout#toExamine')" href="javascript: void(0);" onclick="onOpenTesApply();" class="icon-btn icon-examine">
                    <label>检查检验</label>
                </a>
                <a ms-if="@baseFuncInfo.authorityTag('dialysisLayout#toPortrait')" href="javascript: void(0);" onclick="onOpenPatientPortrait();" class="icon-btn icon-case">
                    <label>患者画像</label>
                </a>
                <a ms-if="@baseFuncInfo.authorityTag('dialysisLayout#toPatientInfo')" href="javascript: void(0);" onclick="onOpenPatientLayout();" class="icon-btn icon-case">
                    <label>病历信息</label>
                </a>
                <a ms-if="@baseFuncInfo.authorityTag('dialysisLayout#toHistory')" href="javascript: void(0);" onclick="onDiaHistory()" class="icon-btn icon-history">
                    <label>透析历史</label>
                </a>
            </div>
            <#-- 透析简要信息 -->
            <div class="dialysis-brief-info layui-form layui-row layui-col-space10" id="dialysisLayout_briefForm" lay-filter="dialysisLayout_briefForm">
                <div class="layui-col-sm9 layui-col-md9 layui-col-lg9">
                    <div class="layui-row">
                        <div class="layui-col-sm12 layui-col-md6 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label>姓名：</label>
                                <div class="patient-name" :attr="{title: currentPatient.patientName}" :text="currentPatient.patientName"></div>
                            </div>
                        </div>
                        <div class="layui-col-sm12 layui-col-md6 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label><span ms-if="!@currentPatient.isPatientSign" class="edit-verify-span">*</span>透析日期：</label>
                                <input type="text" name="dialysisDate" autocomplete="off">
                            </div>
                        </div>
                        <#-- 上机时间："未签到 || 已归档 || 没有保存透析（上下机）时间权限"时禁用表单 -->
                        <div ms-visible="@currentPatient.isPatientSign" class="layui-col-sm12 layui-col-md6 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label><span class="edit-verify-span">*</span>上机时间：</label>
                                <input type="text" name="upDate" autocomplete="off" :attr="{disabled: (!@currentPatient.isPatientSign || @currentPatient.isRecordFiled || !@withSaveBriefAuth)}">
                            </div>
                        </div>
                        <#-- 预计结束时间："未签到 || 已归档 || 没有保存透析（上下机）时间权限"时禁用表单 -->
                        <div ms-visible="@currentPatient.isPatientSign" class="layui-col-sm12 layui-col-md6 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label><span class="edit-verify-span">*</span>预计结束时间：</label>
                                <input type="text" name="downPlanDate" autocomplete="off" :attr="{disabled: (!@currentPatient.isPatientSign || @currentPatient.isRecordFiled || !@withSaveBriefAuth)}">
                            </div>
                        </div>
                        <#-- 实际结束时间："未签到 || 已归档 || 没有保存透析（上下机）时间权限"时禁用表单 -->
                        <div ms-visible="@currentPatient.isPatientSign" class="layui-col-sm12 layui-col-md6 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label>实际结束时间：</label>
                                <input type="text" name="downDate" autocomplete="off" :attr="{disabled: (!@currentPatient.isPatientSign || @currentPatient.isRecordFiled || !@withSaveBriefAuth)}">
                            </div>
                        </div>
                        <div ms-visible="@currentPatient.isPatientSign" class="layui-col-sm12 layui-col-md6 layui-col-lg4">
                            <div class="disui-form-flex">
                                <label>透析记录：</label>
                                <select name="diaRecordId" lay-filter="dialysisLayout_diaRecordIdSelect">
                                    <option ms-for="($index, el) in @currentPatient.recordOptions"
                                            ms-attr="{value: el.diaRecordId}"
                                            ms-text="($index + 1) + ' / ' + @currentPatient.recordOptions.length"></option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                    <#-- 保存："(保存透析（上下机）时间权限 || 保存子页面权限) && 已签到 && 未归档"时可操作按钮 -->
                    <button class="layui-btn layui-btn-dismain layui-btn-dis-xs"
                            ms-if="(@withSaveBriefAuth || @currentPageCallback.onSave) && @currentPatient.isPatientSign && !@currentPatient.isRecordFiled"
                            onclick="onSaveRecord()">保存</button>
                    <#-- 签到："未签到"时可操作按钮 -->
                    <button class="layui-btn layui-btn-dismain layui-btn-dis-xs" ms-if="@baseFuncInfo.authorityTag('dialysisLayout#sign') && !@currentPatient.isPatientSign"
                            onclick="onSavePatientSign(true)">签到</button>
                    <#-- 取消签到："已签到 && 未归档"时可操作按钮 -->
                    <button class="layui-btn layui-btn-dissub layui-btn-dis-xs" ms-if="@baseFuncInfo.authorityTag('dialysisLayout#sign') && @currentPatient.isPatientSign && !@currentPatient.isRecordFiled"
                            onclick="onSavePatientSign(false)">取消签到</button>
                    <#-- 交班："已签到"时可操作按钮 -->
                    <button class="layui-btn layui-btn-dissub layui-btn-dis-xs" ms-if="@baseFuncInfo.authorityTag('dialysisLayout#toHandover') && @currentPatient.isPatientSign"
                            onclick="onHandover()">交班</button>

                    <div class="layui-form-item layui-hide">
                        <button class="layui-btn" lay-submit lay-filter="sysMenuEdit_submit" id="sysMenuEdit_submit">提交</button>
                    </div>
                </div>
            </div>
            <#-- 页签 -->
            <div class="layui-tab layui-tab-dis-sub" lay-filter="dialysisLayout_progressTab">
                <#-- 页签 - 标题 -->
                <ul class="layui-tab-title">
                    <li ms-for="($index, el) in @menuList" :attr="{'data-href': el.menuUrl}">
                        {{el.menuName}}
                        <span class="layui-badge-dot layui-hide"></span>
                        <div><i></i></div>
                    </li>
                </ul>

                <#-- 页签 - 内容 -->
                <div class="layui-tab-content">
                    <div ms-if="!@currentPatient.isPatientSign" class="patient-unsign">当前患者未签到</div>
                    <div ms-if="@currentPatient.isPatientSign && (@currentPageHref == null || @currentPageHref == '')" class="patient-unsign">请选择功能页签</div>
                    <iframe ms-if="@currentPatient.isPatientSign && @currentPageHref" id="dialysisAppBodyIframe" src=""></iframe>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="${ctxsta}/static/js/dialysis/dialysisLayout.js?t=${currentTimeMillis}"></script>
</body>
</html>
