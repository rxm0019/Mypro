<#include "../base/common.ftl">
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <style>
        hr{
            margin: 5px 0;
        }
        .layui-form-checkbox{
            margin: 3px 5px 3px 0px;
        }
    </style>
</head>
<body ms-controller="diaCrossCheckEdit">
<div class="layui-card-body">
    <div class="layui-form" lay-filter="diaCrossCheckEdit_form" id="diaCrossCheckEdit_form">
        <div class="layui-row" style="padding: 0px 10px 10px 10px">
            <div class="layui-form-item  layui-hide">
                <label class="layui-form-label">ID</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="crossCheckId" autocomplete="off" >
                </div>
            </div>
            <div class="layui-form-item layui-hide">
                <label class="layui-form-label">透析记录id</label>
                <div class="layui-input-inline">
                    <input type="hidden" name="diaRecordId"  autocomplete="off" >
                </div>
            </div>
            <div class="layui-row">
                <div class="layui-col-sm3" style="padding: 10px 10px 0px 0px">
                    <div class="disui-form-flex" >
                        <label style="line-height: 32px;"><span class="edit-verify-span">*</span>核对人员：</label>
                        <div class="layui-input-inline">
                            <select name="checkNurse" lay-filter="checkNurse" lay-verify="required" >
                                <option  ms-attr="{value:el.id}" ms-text="@el.userName"
                                         ms-for="($index, el) in @sysUserList"></option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <span style="color: rgba(118, 189, 187, 1); font-weight: bold;">透析参数核查</span>
                <hr class="layui-bg-green">
            </div>

            <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <input type="checkbox" name="parameterCheck" title="正确" value="Y" lay-filter="checkOneAll">
                </div>
            </div>
            <div class="layui-col-sm8 layui-col-md9 layui-col-lg9">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">差错：</label>
                    <input type="text" name="parameterError" maxlength="200" ms-duplex="parameterError" autocomplete="off">
                </div>
            </div>
            <div class="check-one">
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterDehydration" title="处方脱水量(L)" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterDehydrationText" maxlength="100"  autocomplete="off" readonly >
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterAnticoagulant" title="抗凝剂" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterAnticoagulantText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterBlood" title="处方血流量(ml/min)" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterBloodText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterFluid" title="透析液流量(ml/min)" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterFluidText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterDose" title="首剂" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterDoseText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterKeep" title="维特" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterKeepText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterTotal" title="总量" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterTotalText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterDuration" title="透析时长(H)" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterDurationText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterMode" title="透析方式" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterModeText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3" :visible="@dialysisMode=='HDF'">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterSubTotal" title="置换总量(L)" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterSubTotalText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3" :visible="@dialysisMode=='HDF'">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="parameterSubMode" title="置换方式" value="Y" lay-filter="checkOne">
                        <input type="text" name="parameterSubModeText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <span style="color: rgba(118, 189, 187, 1); font-weight: bold;">血管通路核查</span>
                <hr class="layui-bg-green">
            </div>

            <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <input type="checkbox" name="accessCheck" title="正确" value="Y" lay-filter="checkTwoAll">
                </div>
            </div>
            <div class="layui-col-sm8 layui-col-md9 layui-col-lg9">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">差错：</label>
                    <input type="text" name="accessError" maxlength="200" ms-duplex="accessError" autocomplete="off" >
                </div>
            </div>
            <div class="check-two">
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="accessType" title="通路类型" value="Y" lay-filter="checkTwo">
                        <input type="text" name="accessTypeText" maxlength="100"  autocomplete="off" readonly>
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md2 layui-col-lg2">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="accessArteriovenous" title="动静脉接错" value="Y" lay-filter="checkTwo">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md2 layui-col-lg2">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="accessOozing" title="渗血" value="Y" lay-filter="checkTwo">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md2 layui-col-lg2">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="accessFixed" title="U型松动" value="Y" lay-filter="checkTwo">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md2 layui-col-lg2">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="accessDrop" title="滑脱" value="Y" lay-filter="checkTwo">
                    </div>
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <span style="color: rgba(118, 189, 187, 1); font-weight: bold;">管道连接核查</span>
                <hr class="layui-bg-green">
            </div>

            <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex">
                    <input type="checkbox" name="linkCheck" title="正确" value="Y" lay-filter="checkThirdAll">
                </div>
            </div>
            <div class="layui-col-sm8 layui-col-md9 layui-col-lg9">
                <div class="disui-form-flex" >
                    <label class="layui-form-label">差错：</label>
                    <input type="text" name="linkError" maxlength="200" ms-duplex="linkError" autocomplete="off" >
                </div>
            </div>
            <div class="check-third">
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="linkPump" title="泵前测管未夹" value="Y" lay-filter="checkThird">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="linkHeparin" title="肝素侧管夹未开启" value="Y" lay-filter="checkThird">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="linkDialysate" title="透析液连接错误" value="Y" lay-filter="checkThird">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="linkArteriovenous" title="动静脉壶液面不标准" value="Y" lay-filter="checkThird">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="linkVein" title="静脉管路未卡入空气监测夹" value="Y" lay-filter="checkThird">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="linkSensor" title="压力传感器管夹未打开" value="Y" lay-filter="checkThird">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="linkConnect" title="接口连接松动" value="Y" lay-filter="checkThird">
                    </div>
                </div>
                <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                    <div class="disui-form-flex" >
                        <input type="checkbox" name="linkPiping" title="管路有打折" value="Y" lay-filter="checkThird">
                    </div>
                </div>
            </div>

            <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">
                <span style="color: rgba(118, 189, 187, 1); font-weight: bold;">高频接触面消毒</span>
                <hr class="layui-bg-green">
            </div>

            <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <input type="checkbox" name="panelDisinfect" title="面板擦拭消毒" value="Y">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <input type="checkbox" name="reelDisinfect" title="转轮擦拭消毒" value="Y">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <input type="checkbox" name="flatDisinfect" title="平板擦拭消毒" value="Y">
                </div>
            </div>
            <div class="layui-col-sm4 layui-col-md3 layui-col-lg3">
                <div class="disui-form-flex" >
                    <input type="checkbox" name="vehicleDisinfect" title="治疗车擦拭消毒" value="Y">
                </div>
            </div>
            <div class="disui-form-flex layui-hide">
                <button class="layui-btn layui-btn-dismain layui-btn-dis-xs"
                        lay-submit lay-filter="diaCrossCheckEdit_submit" id="diaCrossCheckEdit_submit">提交
                </button>
            </div>
            <div style="clear: both"></div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctxsta}/static/js/dialysis/diaCrossCheckEdit.js?t=${currentTimeMillis}"></script>
</body>
</html>