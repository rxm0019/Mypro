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
    p {
        line-height: 40px
    }

    /*.layui-card {*/
    /*    padding: 20px !important;*/
    /*}*/
    /*修改layui input输入框前的长度*/
    .layui-row .disui-form-flex > .title-style {
        flex-basis: 110px;
    }
</style>
<body ms-controller="patDeathRecordEdit">
<div class="layui-card" style="display: none;margin-left: 13px;margin-right: 13px;padding: 20px !important;"
     id="noDeathRecord">
    <button class="layui-btn layui-btn-dismain" onclick="addDeathRecord()"
            :visible="@baseFuncInfo.authorityTag('pathDeathRecord#add')" style="padding-left: 15px;margin-top: 20px">添加
    </button>
    <blockquote class="layui-elem-quote layui-quote-nm"
                style="height: 300px;text-align: center;line-height: 300px;border: 1px solid rgb(204, 204, 204);border-radius: 7px;margin-top: 20px;margin-right: 14px">
        <span style="color: #999">无死亡记录</span>
    </blockquote>
    <div style="height: 30px;visibility: hidden"></div>
</div>
<div class="layui-fluid" style="padding-top: 0 !important;">
    <div class="layui-card" style="display: none" id="deathForm">
        <div>
            <div class="layui-form" lay-filter="patDeathRecordEdit_form" id="patDeathRecordEdit_form"
                 style="padding: 20px;border: 1px solid rgb(204, 204, 204);border-radius: 7px;">
                <div class="layui-form-item layui-hide">
                    <button class="layui-btn" lay-submit lay-filter="patDeathRecordEdit_submit"
                            id="patDeathRecordEdit_submit">提交
                    </button>
                </div>
                <div class="layui-form-item  layui-hide">
                    <label class="layui-form-label">ID</label>
                    <div class="layui-input-inline">
                        <input type="hidden" name="deathRecordId" autocomplete="off"
                               class="layui-input">
                    </div>
                </div>
                <div>
                </div>
                <#--修改或删除按钮div-->
                <div id="updateOrDelete" style="padding-left: 15px">
                    <button class="layui-btn layui-btn-dismain" id="update" onclick="update()"
                            :visible="@baseFuncInfo.authorityTag('pathDeathRecord#edit')">修改
                    </button>
                    <button class="layui-btn layui-btn-dissub" id="delete" onclick="deleteDeathRecord()"
                            :visible="@baseFuncInfo.authorityTag('pathDeathRecord#deleRecord')">删除
                    </button>
                </div>
                <div class="layui-form-item  layui-hide">
                    <label class="layui-form-label">ID</label>
                    <div class="layui-input-inline">
                        <input type="hidden" name="deathRecordId" id="deathRecordId"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-row layui-col-space1" style="padding-top: 15px">
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>记录时间：</label>
                            <input type="text" name="recordDatetime" maxlength="32" lay-verify="required"
                                   :attr="@disabled"
                                   id="recordDatetime" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                        <div class="disui-form-flex">
                            <label class="layui-form-label"><span class="edit-verify-span">*</span>记录人：</label>
                            <select name="recordUserId" lay-verify="required" lay-filter="deathType" id="recordUserId"
                                    :attr="@disabled">
                                <option value="" selected>请选择</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="selectDeathType">
                        <div class="disui-form-flex">
                            <label><span class="edit-verify-span">*</span>死亡类型：</label>
                            <select name="deathType" lay-verify="required" lay-filter="deathType" id="deathType"
                                    :attr="@disabled">
                                <option value="I" selected>院内死亡</option>
                                <option value="O">院外死亡</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-row layui-col-space1">
                    <fieldset class="layui-elem-field layui-field-title" style="margin-bottom: 10px">
                        <legend style="font-size: 14px;">联系人</legend>
                    </fieldset>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label class="layui-form-label">联系人：</label>
                                <input type="text" name="contactPerson" maxlength="20" id="contactPerson"
                                       autocomplete="off"
                                       :attr="@disabled">
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label class="layui-form-label">与肾友关系：</label>
                                <input type="text" name="relationship" id="relationship"
                                       :attr="@disabled"
                                       autocomplete="off" maxlength="20">
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                            <div class="disui-form-flex">
                                <label class="layui-form-label">联系方式：</label>
                                <input type="text" name="contactInfo" maxlength="11" :attr="@disabled"
                                       id="contactInfo"
                                       autocomplete="off" lay-verify="phoneVerify">
                            </div>
                        </div>
                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="selectContact">
                            <div class="disui-form-flex">
                                <span style="padding-left: 15px;padding-top:8px;cursor: pointer"> <a
                                            style="text-decoration: underline;color: #33AB9F;"
                                            onclick="showMemberList()">选择肾友家属</a></span>
                                <div class="layui-card"
                                     style="margin-left: -54px;width: 240px;height: auto;display: none;width: 240px;height: auto;position: absolute;top: 40px;z-index: 100;border: 1px solid rgb(204, 204, 204);border-radius: 7px;"
                                     id="patientMemberDiv">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <fieldset class="layui-elem-field layui-field-title" style="margin-bottom: 10px">
                            <legend style="font-size: 14px;"><span class="edit-verify-span">*</span>主要诊断</legend>
                        </fieldset>
                    </div>
                    <div class="layui-row layui-col-space1">
                        <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                            <div class="disui-form-flex">
                            <textarea name="mainDiagnosis"
                                      :attr="@disabled" lay-verify="required" id="mainDiagnosis"
                                      maxlength="100"></textarea>
                            </div>
                        </div>
                    </div>
                    <#--院内死亡控制区域div 起点-->
                    <div id="inDeath">
                        <fieldset class="layui-elem-field layui-field-title" style="margin-bottom: 10px">
                            <legend style="font-size: 14px;">院内死亡</legend>
                        </fieldset>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label"><span class="edit-verify-span">*</span>死亡时间：</label>
                                        <input type="text" name="deathDatetime" maxlength="50" lay-verify="required"
                                               :attr="@disabled"
                                               id="deathDatetime" autocomplete="off"
                                               class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label">抢救经过：</label>
                                    <textarea name="rescueProcess" maxlength="100"
                                              :attr="@disabled"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label">死亡诊断：</label>
                                    <textarea name="deathDiagnosis" maxlength="100"
                                              :attr="@disabled"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label">死亡原因：</label>
                                    <textarea name="deathReason" maxlength="100"
                                              :attr="@disabled"></textarea>
                                </div>
                            </div>
                        </div>
                        <div style="height: 30px;visibility: hidden"></div>
                    </div>
                    <#--^^^^^^^店内死亡控制区域div终点-->
                    <#--^^^^^^^店外死亡控制区域div起点-->
                    <div id="outDeath" style="display: none">
                        <fieldset class="layui-elem-field layui-field-title" style="margin-bottom: 10px">
                            <legend style="font-size: 14px;">死亡登记（院外死亡）</legend>
                        </fieldset>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label title-style"><span
                                                class="edit-verify-span">*</span>上次透析时间：</label>
                                    <input type="text" name="lastDialysisDatetime" maxlength="32"
                                           id="lastDialysisDatetime" :attr="@disabled"
                                           autocomplete="off">
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label title-style"><span
                                                class="edit-verify-span">*</span>离开中心时间：</label>
                                    <input type="text" name="departureHospitalDatetime"
                                           id="departureHospitalDatetime" :attr="@disabled"
                                           maxlength="32" autocomplete="off">
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label title-style"><span class="edit-verify-span">*</span>死亡地点：</label>
                                    <input type="text" name="deathPlace" maxlength="50"
                                           :attr="@disabled" id="deathPlace"
                                           autocomplete="off">
                                </div>
                            </div>
                            <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label title-style"><span></span>信息来源：</label>
                                    <input type="text" name="infoSource" maxlength="20"
                                           :attr="@disabled"
                                           autocomplete="off">
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space1">
                            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                                <div class="disui-form-flex">
                                    <label class="layui-form-label title-style"><span></span>中心对患者死亡原因的分析：</label>
                                    <textarea name="deathReasonAnalysis" :attr="@disabled" rows="4"
                                              maxlength="100"></textarea>
                                </div>
                            </div>
                        </div>
                        <div style="height: 30px;visibility: hidden"></div>
                    </div>
                    <#--^^^^^^^店外死亡控制区域div终点-->
                    <#--保存和取消按钮设置在同一个div里控制 -->
                    <div style="text-align: center;display: none;" id="saveAndCancelButton">
                        <button class="layui-btn layui-btn-dismain" onclick="save() " :attr="@disabled">保存</button>
                        <button class="layui-btn layui-btn-dissub" onclick="cancelEditOrSave()">取消</button>
                        <div style="height: 30px;visibility: hidden"></div>
                    </div>
                </div>
                <script type="text/javascript"
                        src="${ctxsta}/static/js/patient/patDeathRecordEdit.js?t=${currentTimeMillis}"></script>
            </div>
        </div>
    </div>
</div>
</body>
</html>