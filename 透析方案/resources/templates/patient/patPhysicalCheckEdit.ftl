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
<body ms-controller="patPhysicalCheckEdit">
<div class="layui-form" lay-filter="patPhysicalCheckEdit_form" id="patPhysicalCheckEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="physicalCheckId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>患者ID（Ref: pat_patient_info.patient_id）</label>
            <div class="layui-input-inline">
                <input type="text" name="patientId" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>检查日期</label>
            <div class="layui-input-inline">
                <input type="text" name="checkDate" lay-verify="required" id="checkDate" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>检查人（Ref: sys_user_info.user_id）</label>
            <div class="layui-input-inline">
                <input type="text" name="checkUserId" maxlength="32" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>食欲（选项来自数据字典“食欲情况(AppetiteStatus)”，单选）</label>
            <div class="layui-input-inline">
                <input type="text" name="appetiteStatus" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>睡眠（选项来自数据字典“睡眠情况(SleepStatus)”，单选）</label>
            <div class="layui-input-inline">
                <input type="text" name="sleepStatus" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>大便（选项来自数据字典“大便情况(StoolStatus)”，单选）</label>
            <div class="layui-input-inline">
                <input type="text" name="stoolStatus" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>取值范围：0-5000，整数</label>
            <div class="layui-input-inline">
                <input type="text" name="urineVolume" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>夜尿（取值范围：0-20，整数）</label>
            <div class="layui-input-inline">
                <input type="text" name="nocturiaTimes" lay-verify="required|number" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>出血情况 - 状况（选项来自数据字典“出血情况(BleedingStatus)”，单选）</label>
            <div class="layui-input-inline">
                <input type="text" name="bleedingStatus" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>出血情况 - 详情</label>
            <div class="layui-input-inline">
                <input type="text" name="bleedingDetails" maxlength="1000" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>收缩压（取值范围：0-300，整数）</label>
            <div class="layui-input-inline">
                <input type="text" name="systolicPressure" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>舒张压（取值范围：0-300，整数）</label>
            <div class="layui-input-inline">
                <input type="text" name="diastolicPressure" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>体重（取值范围：0-200，可输入两位小数）</label>
            <div class="layui-input-inline">
                <input type="text" name="weight" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>HR(心率)（取值范围：0-300，整数）</label>
            <div class="layui-input-inline">
                <input type="text" name="heartRate" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>R(呼吸)（取值范围：0-100，整数）</label>
            <div class="layui-input-inline">
                <input type="text" name="respire" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>T(体温)	（取值范围：35-42，可输入一位小数）</label>
            <div class="layui-input-inline">
                <input type="text" name="temperature" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>一般情况	(选项来自数据字典“身体情况(BodyStatus)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="ordinaryStatus" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>营养状态	(选项来自数据字典“身体情况(BodyStatus)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="nutritionalStatus" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>贫血面容	(选项来自数据字典“贫血面容(AnemicFace)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="anemicFace" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>体位	(选项来自数据字典“体位(Posture)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="posture" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>浮肿	(选项来自数据字典“浮肿(DropsyStatus)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="dropsyStatus" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>浮肿程度	(选项来自数据字典“浮肿程度(DropsyLevel)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="dropsyLevel" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>出血点/瘀斑/血肿等 - 状况	(选项来自数据字典“出血点/瘀斑/血肿等状况(HematomaStatus)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="hematomaStatus" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>出血点/瘀斑/血肿等 - 部位及描述</label>
            <div class="layui-input-inline">
                <input type="text" name="hematomaRemarks" maxlength="1000" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>呼吸音</label>
            <div class="layui-input-inline">
                <input type="text" name="breathSounds" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>胸膜摩擦音	(选项来自数据字典“胸膜摩擦音(PleuralRubSounds)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="pleuralRubSounds" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>啰音	(选项来自数据字典“啰音(RaleSounds)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="raleSounds" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>心律	选项来自数据字典“心律(HeartRhythm)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="heartRhythm" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>心率	取值范围：0-300，整数</label>
            <div class="layui-input-inline">
                <input type="text" name="pulseRate" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>心脏大小(选项来自数据字典“心脏大小(CardiacSize)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="cardiacSize" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>心包摩擦音	(选项来自数据字典“心脏音(CardiacSounds)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="pericardialRubSounds" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>杂音	(选项来自数据字典“心脏音(CardiacSounds)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="murmurSounds" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>附加音	(选项来自数据字典“心脏音(CardiacSounds)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="extraSounds" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>心包积液体征	(选项来自数据字典“心包积液体征(PericardialEffusionSign)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="pericardialEffusionSign" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>腹水征	(选项来自数据字典“腹水征(AscitesSign)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="ascitesSign" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>肝颈动脉回流征	(选项来自数据字典“肝颈动脉回流征(ArterialRefluxSign)”，单选)</label>
            <div class="layui-input-inline">
                <input type="text" name="arterialRefluxSign" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>创建人员 Ref: sys_user.id</label>
            <div class="layui-input-inline">
                <input type="text" name="createBy" maxlength="32" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>创建时间</label>
            <div class="layui-input-inline">
                <input type="text" name="createTime" lay-verify="required" id="createTime" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>修改人员 Ref: sys_user.id</label>
            <div class="layui-input-inline">
                <input type="text" name="updateBy" maxlength="32" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>修改时间</label>
            <div class="layui-input-inline">
                <input type="text" name="updateTime" lay-verify="required" id="updateTime" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>数据状态 0-启用，1-停用，2-删除</label>
            <div class="layui-input-inline">
                <input type="text" name="dataStatus" maxlength="2" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>数据同步状态 0-未同步，1-已同步</label>
            <div class="layui-input-inline">
                <input type="text" name="dataSync" maxlength="2" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>医院代码 Ref: sys_hospital.hospital_no</label>
            <div class="layui-input-inline">
                <input type="text" name="hospitalNo" maxlength="32" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="patPhysicalCheckEdit_submit" id="patPhysicalCheckEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/patient/patPhysicalCheckEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>