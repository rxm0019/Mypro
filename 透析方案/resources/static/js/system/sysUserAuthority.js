/**
 * 用户管理 - （管理中心）权限设置
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/26
 */
var hospitalTreeObj; // 医院中心树对象
var sysUserAuthority = avalon.define({
    $id: "sysUserAuthority",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
    id: "",
    hospitalRole: []
});

layui.use(['index'],function(){
    avalon.ready(function () {
        // 获取URL参数
        var hospitalRole = GetQueryString("hospitalRole") || "";
        sysUserAuthority.id = GetQueryString("id");
        sysUserAuthority.hospitalRole = hospitalRole.split(",");

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
        url: $.config.services.system + "/sysUser/selectHospitalTree.do",
        data: param,
        done: function (data) {
            // ztree树参数设置
            var setting = {
                id: 'hospitalNo',
                pId: 'superior',
                name: 'hospitalName',
                checkbox: true,
                check: {chkboxType: {"Y": "", "N": ""}},
                done: function (treeObj) {
                    // 回显勾选的菜单列表
                    if (sysUserAuthority.hospitalRole != null && sysUserAuthority.hospitalRole.length > 0) {
                        $.each(data, function (dataIndex, dataItem) {
                            var isSelected = $.inArray(dataItem.hospitalNo, sysUserAuthority.hospitalRole) >= 0;
                            if (isSelected) {
                                var node = treeObj.getNodeByParam("hospitalNo", dataItem.hospitalNo, null);
                                if (node != null) {
                                    treeObj.checkNode(node, true, false); // 加载勾选
                                    treeObj.selectNode(node); // 选中展开
                                }
                            }
                        });
                    }
                    treeObj.expandAll(true);

                    // 禁用当前用户所属中心（用户对所属中心有默认登录权限）
                    var userUospitalNo = baseFuncInfo.userInfoData.hospitalNo;
                    var userUospitalNoNode = treeObj.getNodeByParam("hospitalNo", userUospitalNo, null);
                    if (userUospitalNoNode != null) {
                        treeObj.checkNode(userUospitalNoNode, true, false);
                        treeObj.setChkDisabled(userUospitalNoNode, true);
                    }
                }
            };

            // 加载ztree树
            hospitalTreeObj = _initZtree($("#sysHospitalTree"), setting, data);
        }
    });
}

/**
 * 权限事件：保存中心权限设置信息
 * @param $callBack
 */
function onAuthoritySave($callBack) {
    // 获取全部勾选的角色权限
    var nodes = hospitalTreeObj.getCheckedList();
    var hospitalRoles = [];
    if (nodes.length > 0) {
        for (var i = 0; i < nodes.length; i++) {
            hospitalRoles.push(nodes[i].hospitalNo);
        }
    }

    var param = {
        userId: sysUserAuthority.id,
        hospitalRole: hospitalRoles.join(",")
    };
    var url = $.config.services.system + "/sysUser/saveAuthority.do";
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

