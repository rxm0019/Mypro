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
<style type="text/css">
    .layui-colla-title {
        background-color: white;
    }

    .layui-fluid {
        padding: 0px !important;
        margin: 0px !important;
    }

    .layui-row .disui-form-flex > label {
        flex-basis: 160px;

    }

    .layui-row .disui-form-flex > span {
        line-height: 38px;
        padding: 0 5px;
    }

    /* 透前病情更多（上一次的透前病情） */
    #painGradeList {
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        border: 1px solid #A9B1B8;
        position: absolute;
        top: 180px;
        right: 10px;
        padding: 10px 0;
        max-width: 700px;
        min-width: 500px;
        z-index: 99;
    }
    .catheterMeasure {
        flex: 0 0 60px;
        text-align: center;
        padding-left: 5px;
    }
</style>

<body ms-controller="diaAssessList">
<div class="layui-fluid">
    <div class="layui-card">
        <div class="layui-card-body">
            <div class="layui-form" action="" name="" lay-filter="diaAssessList_form" id="diaAssessList_form">
                <div class="layui-collapse" lay-filter="test">
                    <div class="layui-colla-item">
                        <p class="layui-colla-title">身体状况</p>
                        <div class="layui-colla-content layui-show">
                            <div class="layui-row layui-col-space1">
                                <div class="layui-form">
                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3 layui-hide">
                                            <div class="disui-form-flex">
                                                <label class="layui-form-label">ID</label>
                                                <input type="hidden" name="diaAssessId" autocomplete="off"
                                                       class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>入室方式：</label>
                                                <select lay-verify="fieldRequired" data-field-name="入室方式" name="enterRoomMode" lay-filter="enterRoomMode"
                                                        :attr="{disabled: @formReadonly}">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('EnterRoomMode')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>意识状态：</label>
                                                <select lay-verify="fieldRequired" data-field-name="意识状态" name="mentality" :attr="{disabled: @formReadonly}"
                                                        lay-filter="mentality">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Mentality')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>出血：</label>
                                                <select lay-verify="fieldRequired" data-field-name="出血" id="hemorrhage" name="hemorrhage" :attr="{disabled: @formReadonly}"
                                                        lay-filter="hemorrhage">
                                                    <option value=""></option>
                                                    <option value="Y">有出血</option>
                                                    <option value="N">无出血</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div ms-visible="!@hemorrhageSiteDisabled" class="layui-col-sm3 layui-col-md3 layui-col-lg3" id="hemorrhageShow">
                                            <div class="disui-form-flex">
                                                <label>出血部位：</label>
                                                <input type="text" name="hemorrhageSite" id="hemorrhageSite"
                                                       maxlength="100" :attr="{readonly: @formReadonly}"
                                                       autocomplete="off">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>睡眠：</label>
                                                <select lay-verify="fieldRequired" data-field-name="睡眠" name="sleepType" :attr="{disabled: @formReadonly}"
                                                        lay-filter="sleepType">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('SleepStatus')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>食欲：</label>
                                                <select lay-verify="fieldRequired" data-field-name="食欲" name="appetiteType" :attr="{disabled: @formReadonly}"
                                                        lay-filter="appetiteType">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('AppetiteStatus')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>大便(次／日)：</label>
                                                <input lay-verify="fieldRequired" data-field-name="大便(次／日)" type="text" name="defecate" maxlength="50"
                                                       :attr="{readonly: @formReadonly}" autocomplete="off">
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>呼吸道症状：</label>
                                                <select lay-verify="fieldRequired" data-field-name="呼吸道症状" name="breathe" :attr="{disabled: @formReadonly}"
                                                        lay-filter="breathe">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Breathe')"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>跌倒(坠床)评估：</label>
                                                <input type="radio" lay-verify="radio" value="Y" name="fallAssess" lay-filter="fallAssess"
                                                       :attr="{disabled: @formReadonly}"
                                                       title="有" checked>
                                                <input type="radio" lay-verify="radio" value="N" name="fallAssess" lay-filter="fallAssess"
                                                       :attr="{disabled: @formReadonly}"
                                                       title="无">
                                            </div>
                                        </div>
                                        <div ms-visible="!@assessScoreDisabled" id="assessScoreShow" class="layui-col-sm3 layui-col-md3 layui-col-lg3"  >
                                            <div class="disui-form-flex">
                                                <label>跌倒评估得分：</label>
                                                <input type="text" name="assessScore" id="assessScore"
                                                       autocomplete="off" lay-verify="fieldNotInRange"  data-field-name="跌倒评估得分"  data-min-value="0" data-max-value="500"
                                                       data-integer="true" :attr="{readonly: @formReadonly||@assessScoreReadOnly}">
                                                <button ms-if="!@formReadonly"
                                                        class="layui-btn layui-btn-dismain layui-btn-dis-xs"
                                                        onclick="saveOrEdit()">跌倒评估
                                                </button>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>疼痛评估：</label>
                                                <input type="number" name="painAssess" id="painAssess" maxlength="2"
                                                       :attr="{readonly: @formReadonly}" lay-verify="fieldNotInRange|fieldRequired"
                                                       data-field-name="疼痛评估" data-min-value="0" data-max-value="10"
                                                       data-integer="true" autocomplete="off">
                                                <img id="openPainGradeId" src="/web/static/images/icon-face.png">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-colla-item" id="accessEvaluation" ms-if="accessShow">
                        <p class="layui-colla-title">导管评估</p>
                        <div class="layui-colla-content layui-show">
                            <div class="layui-row layui-col-space1">
                                <div class="layui-form" action="" name="">
                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>导管类型：</label>
                                                <select name="catheterType" :attr="{disabled: @formReadonly}"
                                                        lay-verify="fieldRequired" data-field-name="导管类型" lay-filter="catheterType">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @catheterTypeList"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>导管位置：</label>
                                                <select name="catheterLocation" :attr="{disabled: @formReadonly}"
                                                        lay-verify="fieldRequired" data-field-name="导管位置" lay-filter="catheterLocation">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ChannelPlace')"></option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>导管外置长度：</label>
                                                <input type="text" name="catheterOutLength" id="catheterOutLength"
                                                       :attr="{readonly: @formReadonly}"
                                                       lay-verify="fieldNotInRange|fieldRequired" data-field-name="导管外置长度"
                                                       data-min-value="0" data-max-value="100"
                                                       autocomplete="off">
                                                <label>CM</label>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>本次导管测量长度：</label>
                                                <input type="text" name="catheterMeasureLength" maxlength="5"
                                                       :attr="{readonly: @formReadonly}"
                                                       lay-verify="fieldNotInRange|fieldRequired" data-field-name="本次导管测量长度"
                                                       data-min-value="0" data-max-value="100"
                                                       autocomplete="off">
                                                <label class="catheterMeasure">CM<i class="layui-icon layui-icon-about" id="aboutIcon" style="font-size: 18px;padding: 0 10px;"></i> </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-row">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>皮肤周围：</label>
                                                <select name="catheterSkin" lay-verify="fieldRequired" data-field-name="皮肤周围" :attr="{disabled: @formReadonly}"
                                                        lay-filter="catheterSkin">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('CatheterSkin')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>分泌物：</label>
                                                <select name="secretion" lay-verify="fieldRequired" data-field-name="分泌物" :attr="{disabled: @formReadonly}"
                                                        lay-filter="secretion">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('Secretion')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>发热：</label>
                                                <select id="fever" name="fever" lay-verify="fieldRequired" data-field-name="发热" :attr="{disabled: @formReadonly}"
                                                        lay-filter="fever">
                                                    <option value=""></option>
                                                    <option value="Y">有</option>
                                                    <option value="N">无</option>
                                                </select>
                                                <input ms-visible="!@feverDegreeDisabled"  type="text" style="width: 20px;" name="feverDegree"
                                                       :attr="{readonly: @formReadonly}"
                                                       id="feverDegree" lay-verify="fieldNotInRange"
                                                       data-field-name="发热温度" data-min-value="35" data-max-value="42"
                                                       autocomplete="off">
                                                <label ms-visible="!@feverDegreeDisabled">度</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-row">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>导管脱出：</label>
                                                <select name="catheterDrop" lay-verify="fieldRequired" data-field-name="导管脱出" :attr="{disabled: @formReadonly}"
                                                        lay-filter="catheterDrop">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('CatheterDrop')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>动脉端：</label>
                                                <select name="catheterArterySide" lay-verify="fieldRequired" data-field-name="动脉端" id="catheterArterySide"
                                                        :attr="{disabled: @formReadonly}"
                                                        lay-filter="catheterArterySide">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ConduitStatus')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>静脉端：</label>
                                                <select name="catheterVeinSide" lay-verify="fieldRequired" data-field-name="静脉端" id="catheterVeinSide"
                                                        :attr="{disabled: @formReadonly}"
                                                        lay-filter="catheterVeinSide">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ConduitStatus')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <button ms-if="!@formReadonly"
                                                        class="layui-btn layui-btn-dismain layui-btn-dis-xs"
                                                        onclick="onDiaRoad('1')">通路图
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-colla-item" id="punctureEvaluation" ms-if="punctureShow">
                        <p class="layui-colla-title">穿刺评估</p>
                        <div class="layui-colla-content layui-show">
                            <div class="layui-row layui-col-space1">
                                <div class="layui-form" action="" name="">
                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>通路位置：</label>
                                                <select name="fistulaPosition" lay-verify="fieldRequired" data-field-name="通路位置" :attr="{disabled: @formReadonly}"
                                                        lay-filter="fistulaPosition">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('ChannelPlace')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>皮肤周围：</label>
                                                <select name="fistulaSkin" lay-verify="fieldRequired" data-field-name="皮肤周围" :attr="{disabled: @formReadonly}"
                                                        lay-filter="fistulaSkin">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('FistulaSkin')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>红肿：</label>
                                                <select name="fistulaSwelling" lay-verify="fieldRequired" data-field-name="红肿" id="fistulaSwelling"
                                                        :attr="{disabled: @formReadonly}"
                                                        lay-filter="fistulaSwelling">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('FistulaSwelling')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div ms-visible="!@swellingSiteDisabled" id="fistulaSwellingShow" class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label>红肿位置：</label>
                                                <input  type="text" name="swellingSite" id="swellingSite" maxlength="100"
                                                       :attr="{readonly: @formReadonly}"
                                                       autocomplete="off">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>渗血：</label>
                                                <select id="fistulaOozingBlood" lay-verify="fieldRequired" data-field-name="渗血" name="fistulaOozingBlood" :attr="{disabled: @formReadonly}"
                                                        lay-filter="fistulaOozingBlood">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('FistulaOozingBlood')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div ms-visible="!@oozingBloodSiteDisabled"  id="fistulaOozingBloodShow" class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label>渗血位置：</label>
                                                <input type="text" name="oozingBloodSite" id="oozingBloodSite"
                                                       :attr="{readonly: @formReadonly}"
                                                       maxlength="100"
                                                       autocomplete="off">
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>震颤：</label>
                                                <select name="fistulaTremor" lay-verify="fieldRequired" data-field-name="震颤" :attr="{disabled: @formReadonly}"
                                                        lay-filter="fistulaTremor">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('FistulaTremor')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>杂音：</label>
                                                <select name="fistulaNoise" lay-verify="fieldRequired" data-field-name="杂音" :attr="{disabled: @formReadonly}"
                                                        lay-filter="fistulaNoise">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('CardiacSounds')"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-row">
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>内娄清洁：</label>
                                                <select name="fistulaClean" lay-verify="fieldRequired" data-field-name="内娄清洁" :attr="{disabled: @formReadonly}"
                                                        lay-filter="fistulaClean">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('FistulaClean')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm3 layui-col-md3 layui-col-lg3">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>上次止血时间：</label>
                                                <select name="hemostasisTime" lay-verify="fieldRequired" data-field-name="上次止血时间" :attr="{disabled: @formReadonly}"
                                                        lay-filter="hemostasisTime">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('HemostasisTime')"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺针方式：</label><span>A</span>
                                                <select name="punctureModeA" lay-verify="fieldRequired" data-field-name="穿刺针方式A" id="punctureModeA"
                                                        :attr="{disabled: @formReadonly}"
                                                        lay-filter="punctureModeA">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureWay')"></option>
                                                </select>
                                                <span>V</span>
                                                <select name="punctureModeV" lay-verify="fieldRequired" data-field-name="穿刺针方式V" id="punctureModeV"
                                                        :attr="{disabled: @formReadonly}"
                                                        lay-filter="punctureModeV">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureWay')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺针类型：</label><span>A</span>
                                                <select name="punctureTypeA" lay-verify="fieldRequired" data-field-name="穿刺针类型A" id="punctureTypeA"
                                                        :attr="{disabled: @formReadonly}"
                                                        lay-filter="punctureTypeA">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureNeedleType')"></option>
                                                </select>
                                                <span>V</span>
                                                <select name="punctureTypeV" lay-verify="fieldRequired" data-field-name="穿刺针类型V" id="punctureTypeV"
                                                        :attr="{disabled: @formReadonly}"
                                                        lay-filter="punctureTypeV">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureNeedleType')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺针型号：</label><span>A</span>
                                                <select name="punctureModelA" lay-verify="fieldRequired" data-field-name="穿刺针型号V" id="punctureModelA"
                                                        :attr="{disabled: @formReadonly}"
                                                        lay-filter="punctureModelA">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureNeedleNum')"></option>
                                                </select>
                                                <span>V</span>
                                                <select name="punctureModelV" id="punctureModelV"
                                                        lay-verify="fieldRequired" data-field-name="穿刺针型号V" :attr="{disabled: @formReadonly}"
                                                        lay-filter="punctureModelV">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PunctureNeedleNum')"></option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-row layui-col-space1">
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺点：</label><span>A</span>
                                                <select name="puncturePointA" lay-verify="fieldRequired" data-field-name="穿刺点A" id="puncturePointA"
                                                        :attr="{disabled: @formReadonly}"
                                                        lay-filter="puncturePointA">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PointA')"></option>
                                                </select>
                                                <span>V</span>
                                                <select name="puncturePointV" lay-verify="fieldRequired" data-field-name="穿刺点V" id="puncturePointV"
                                                        :attr="{disabled: @formReadonly}"
                                                        lay-filter="puncturePointV">
                                                    <option value=""></option>
                                                    <option ms-attr="{value:el.value}" ms-text="@el.name"
                                                            ms-for="($index, el) in @baseFuncInfo.getSysDictByCode('PointV')"></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <label><span class="edit-verify-span">*</span>穿刺次数：</label><span>A</span>
                                                <input type="number" name="pointATimes" lay-verify="fieldNotInRange|fieldRequired"
                                                       :attr="{readonly: @formReadonly}"
                                                       data-field-name="穿刺次数A" data-min-value="0" data-max-value="50"
                                                       data-integer="true"
                                                       autocomplete="off">
                                                <span>V</span>
                                                <input type="number" name="pointVTimes" lay-verify="fieldNotInRange|fieldRequired"
                                                       :attr="{readonly: @formReadonly}"
                                                       data-field-name="穿刺次数V" data-min-value="0" data-max-value="50"
                                                       data-integer="true"
                                                       autocomplete="off">
                                            </div>
                                        </div>
                                        <div class="layui-col-sm4 layui-col-md4 layui-col-lg4">
                                            <div class="disui-form-flex">
                                                <button ms-if="!@formReadonly"
                                                        class="layui-btn layui-btn-dismain layui-btn-dis-xs"
                                                        onclick="onDiaRoad()">通路图
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item layui-hide">
                    <button class="layui-btn" lay-submit lay-filter="diaAssessList_submit" id="diaAssessList_submit">
                        提交
                    </button>
                </div>
            </div>
            <#--疼痛评估-->
            <div id="painGradeList" class="layui-card layui-hide">
                <img src="/web/static/images/icon-painAssess.png">
            </div>
        </div>
    </div>
</div>
<!--请在下方写此页面业务相关的脚本-->
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaAssessList.js?t=${currentTimeMillis}"></script>
</body>
</html>