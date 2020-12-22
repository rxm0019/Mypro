/**
 * 登录 - 切换中心
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/31
 */
var hospitalTreeObj; // 医院中心树对象
var loginSwitch = avalon.define({
    $id: "loginSwitch",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
    id: ""
});

layui.use(['index'],function(){
    avalon.ready(function () {
        // 获取URL参数
        loginSwitch.id = GetQueryString("id");
        // 初始化菜单树
        onHospitalTreeLoad();

        avalon.scan();
    });
});

/**
 * 医院中心树事件：加载树结构
 */
function onHospitalTreeLoad() {
    var param = {};
    _ajax({
        type: "POST",
        url: $.config.services.system + "/listHospitalRoles.do",
        data: param,
        done: function (data) {
            // ztree树参数设置
            var setting = {
                id: 'hospitalNo',
                pId: 'superior',
                name: 'hospitalName',
                radio: true,
                done: function (treeObj) {
                    // 回显勾选的菜单列表
                    $.each(data, function (dataIndex, dataItem) {
                        var isSelected = $.inArray(dataItem.hospitalNo, loginSwitch.hospitalRole) >= 0;
                        if (isSelected) {
                            var node = treeObj.getNodeByParam("hospitalNo", dataItem.hospitalNo, null);
                            if (node != null) {
                                treeObj.checkNode(node, true, false); // 加载勾选
                                treeObj.selectNode(node); // 选中展开
                            }
                        }
                    });
                    treeObj.expandAll(true);

                    // 禁用当前用户登录中心
                    var loginHospitalNo = baseFuncInfo.userInfoData.loginHospitalNo;
                    var loginHospitalNode = treeObj.getNodeByParam("hospitalNo", loginHospitalNo, null);
                    if (loginHospitalNode != null) {
                        treeObj.checkNode(loginHospitalNode, true, false);
                        treeObj.setChkDisabled(loginHospitalNode, true);
                    }
                }
            };

            // 加载ztree树
            hospitalTreeObj = _initZtree($("#sysHospitalTree"), setting, data);
        }
    });
}

/**
 * 登录：切换登录中心
 * @param $callBack
 */
function onLoginSwitch($callBack) {
    // 获取全部勾选的角色权限
    var nodes = hospitalTreeObj.getCheckedList();
    var loginHospitalNo = (nodes.length > 0) ? nodes[0].hospitalNo : "";
    if (isEmpty(loginHospitalNo)) {
        errorToast("请选择需切换的中心");
        return;
    }

    var param = {
        loginHospitalNo: loginHospitalNo
    };
    var url = $.config.services.system + "/loginSwitch.do";
    _ajax({
        type: "POST",
        url: url,
        data: param,
        dataType: "json",
        done: function (data) {
            if ($callBack != undefined) {
                $callBack(data);
            }
        }
    });
}

