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
<body ms-controller="diaSummaryEdit">
<div class="layui-form" lay-filter="diaSummaryEdit_form" id="diaSummaryEdit_form" style="padding: 20px 30px 0 0;">
        <div class="layui-form-item  layui-hide">
            <label class="layui-form-label">ID</label>
            <div class="layui-input-inline">
                <input type="hidden" name="summaryId" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>透析记录id	Ref:dia_record</label>
            <div class="layui-input-inline">
                <input type="text" name="diaRecordId" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>透后体重	取值范围(0, 200]，可输入两位小数</label>
            <div class="layui-input-inline">
                <input type="text" name="afterPlanWeight" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>实际透后体重	取值范围(0, 200]，可输入两位小数</label>
            <div class="layui-input-inline">
                <input type="text" name="afterRealWeight" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>体重差	取值范围(0, 200]，可输入两位小数</label>
            <div class="layui-input-inline">
                <input type="text" name="differWeight" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>实际脱水量	取值范围(0, 10000]，整数可输入两位小数</label>
            <div class="layui-input-inline">
                <input type="text" name="actualDehydration" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>机显脱水量	取值范围(0, 10000]，整数可输入两位小数</label>
            <div class="layui-input-inline">
                <input type="text" name="machineDehydration" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>实际透析时长(小时)</label>
            <div class="layui-input-inline">
                <input type="text" name="dialysisTimeHour" lay-verify="required|number" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>实际透析时长(分钟)</label>
            <div class="layui-input-inline">
                <input type="text" name="dialysisTimeMin" lay-verify="required|number" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>收缩压</label>
            <div class="layui-input-inline">
                <input type="text" name="systolicPressure" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>舒张压</label>
            <div class="layui-input-inline">
                <input type="text" name="diastolicPressure" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>脉博</label>
            <div class="layui-input-inline">
                <input type="text" name="pulse" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>置换方式	选项来自数据字典“透析置换方式(SubstituteMode)”，单选</label>
            <div class="layui-input-inline">
                <input type="text" name="substituteMode" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>置换液总量	取值范围(0, 100]，可输入两位小数</label>
            <div class="layui-input-inline">
                <input type="text" name="replacementFluidTotal" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>实际置换液总量	取值范围(0, 100]，可输入两位小数</label>
            <div class="layui-input-inline">
                <input type="text" name="relReplacementFluidTotal" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>置换液流速	取值范围(0, 10000]，整数</label>
            <div class="layui-input-inline">
                <input type="text" name="replacementFluidFlowRate" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>坠床（跌倒）	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="fallAssess" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>导管脱出	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="catheterDrop" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>透析器凝血	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="diaCoagulation" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>透析器更换	N-无，Y-有</label>
            <div class="layui-input-inline">
                <input type="text" name="dialyzerChange" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>透析管路凝血	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="bloodClotting" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>管理更换	N-无，Y-有</label>
            <div class="layui-input-inline">
                <input type="text" name="pipingChange" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>发热	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="fever" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>透中摄入	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="dialysateIntakeType" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>透中摄入	取值范围(0, 10000]，整数可输入两位小数</label>
            <div class="layui-input-inline">
                <input type="text" name="dialysateIntake" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>步态观察	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="gaitWatch" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>陪同者	Ref: sys_user_info.user_id</label>
            <div class="layui-input-inline">
                <input type="text" name="accompanyUser" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>止血方式	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="hemostasis" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>止血时间	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="hemostasisTime" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>内瘘震颤	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="fistulaTremor" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>内瘘杂音	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="fistulaNoise" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>内瘘其他	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="fistulaOther" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>是否已更换敷料	N-无，Y-有</label>
            <div class="layui-input-inline">
                <input type="text" name="dressingChange" maxlength="2" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>测量部位	0-上肢，1-下肢</label>
            <div class="layui-input-inline">
                <input type="text" name="measuringPart" maxlength="2" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>封管方式</label>
            <div class="layui-input-inline">
                <input type="text" name="sealingMethod" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>管腔容量A	取值范围(0, 999]，可输入两位小数</label>
            <div class="layui-input-inline">
                <input type="text" name="capacityA" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>管腔容量V	取值范围(0, 999]，可输入两位小数</label>
            <div class="layui-input-inline">
                <input type="text" name="capacityV" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>封管用药	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="drugSealing" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>动脉端	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="catheterArterySide" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>静脉端	来源字典</label>
            <div class="layui-input-inline">
                <input type="text" name="catheterVeinSide" maxlength="50" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>小结</label>
            <div class="layui-input-inline">
                <input type="text" name="summary" maxlength="3" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>冲管者	Ref: sys_user_info.user_id</label>
            <div class="layui-input-inline">
                <input type="text" name="washpipeUser" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>穿刺者	Ref: sys_user_info.user_id</label>
            <div class="layui-input-inline">
                <input type="text" name="punctureUser" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>接血者	Ref: sys_user_info.user_id</label>
            <div class="layui-input-inline">
                <input type="text" name="bloodReceiver" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>回血者	Ref: sys_user_info.user_id</label>
            <div class="layui-input-inline">
                <input type="text" name="rebleedingUser" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>巡视者	Ref: sys_user_info.user_id</label>
            <div class="layui-input-inline">
                <input type="text" name="inspector" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>责任护士	Ref: sys_user_info.user_id</label>
            <div class="layui-input-inline">
                <input type="text" name="principalNurse" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>查对护士	Ref: sys_user_info.user_id</label>
            <div class="layui-input-inline">
                <input type="text" name="checkNurse" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>医生签名	Ref: sys_user_info.user_id</label>
            <div class="layui-input-inline">
                <input type="text" name="doctorSign" maxlength="35" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>保存标志	固定；Y-保存过，N-未保存过</label>
            <div class="layui-input-inline">
                <input type="text" name="saveStatus" maxlength="2" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>建立人员(Ref: sys_user_info)</label>
            <div class="layui-input-inline">
                <input type="text" name="createBy" maxlength="32" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>建立日期</label>
            <div class="layui-input-inline">
                <input type="text" name="createTime" lay-verify="required" id="createTime" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>修改人员(Ref: sys_user_info)</label>
            <div class="layui-input-inline">
                <input type="text" name="updateBy" maxlength="32" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>修改日期</label>
            <div class="layui-input-inline">
                <input type="text" name="updateTime" lay-verify="required" id="updateTime" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>数据状态(0-启用，1-停用，2-删除)</label>
            <div class="layui-input-inline">
                <input type="text" name="dataStatus" maxlength="1" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>数据同步状态(0-未同步，1-已同步)</label>
            <div class="layui-input-inline">
                <input type="text" name="dataSync" maxlength="1" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="edit-verify-span">*</span>医院代码</label>
            <div class="layui-input-inline">
                <input type="text" name="hospitalNo" maxlength="7" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
            </div>
        </div>
        <!-- 隐藏的提交按钮，必须要，用于验证表单，触发提交表单的作用-->
        <div class="layui-form-item layui-hide">
            <button class="layui-btn" lay-submit lay-filter="diaSummaryEdit_submit" id="diaSummaryEdit_submit">提交</button>
        </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaSummaryEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>