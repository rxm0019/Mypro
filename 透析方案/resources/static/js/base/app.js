/**
 * Created by huoquan on 2017/9/26.
 * 此文件用于公共业务的逻辑处理
 */

//定义框架基本方法,这样定义的话，avalon也能直接调用baseFuncInfo所有方法
var baseFuncInfo = {
    //获取个人信息
    userInfoData: {
        authToken: getStorage("KEY_AUTH_TOKEN") || "",
        email: getStorage("KEY_EMAIL") || "",
        userid: getStorage("KEY_USERID") || "",
        loginid: getStorage("KEY_LOGINID") || "",
        username: getStorage("KEY_USERNAME") || "",
        userType: getStorage("KEY_USER_TYPE") || "",
        hospitalNo: getStorage("KEY_HOSPITAL_NO") || "",
        hospitalName: getStorage("KEY_HOSPITAL_NAME") || "",
        loginHospitalNo: getStorage("KEY_LOGIN_HOSPITAL_NO") || "",
        loginHospitalName: getStorage("KEY_LOGIN_HOSPITAL_NAME") || "",
        roleid: getStorage("KEY_ROLEIDLIST") || "",
        roles: getStorage("KEY_ROLES") || "",
        isArchiveQuery: getStorage("KEY_IS_ARCHIVE_QUERY") === "true" // 归档查询，默认false，不开启
    },
    //菜单权限方法
    authorityTag: function (code) {
        var keyCodes = eval(getStorage("KEY_ROLES")) || [];
        for (var i = 0; i < keyCodes.length; i++) {
            if (code == keyCodes[i]) {
                return true;
            }
        }
        return false;
    },

    /** 获取所有菜单（排除患者管理、透析管理/透析记录） **/
    getMenus: function () {
        var excludeMenuName = [ "患者管理" ];
        var rawList = eval(getStorage("KEY_MENUS")) || [];
        var list = [];
        $.each(rawList, function(index, item) {
            if (item.menuName == "患者管理") {
                // 排除“患者管理”下的子菜单
                item.children = [];
            } else if (item.menuName == "透析管理") {
                // 排除“透析管理/透析记录”下的子菜单
                $.each((item.children || []), function(subIndex, subItem) {
                    if (subItem.menuName == "透析记录") {
                        subItem.children = [];
                    }
                });
            }
            list.push(item);
        });
        return list;
    },

    /** 获取患者管理菜单 **/
    getMenusForPatient: function () {
        var patientMenuName = "患者管理";
        var rawList = eval(getStorage("KEY_MENUS")) || [];
        var list = [];
        $.each(rawList, function(index, item) {
            if (item.menuName == patientMenuName) {
                list =  item.children ;
                return false;
            }
        });
        return list;
    },

    /** 获取透析管理/透析记录菜单 **/
    getMenusForDialysis: function () {
        var rawList = eval(getStorage("KEY_MENUS")) || [];
        var list = [];
        $.each(rawList, function(index, item) {
            if (item.menuName == "透析管理") {
                $.each((item.children || []), function(subIndex, subItem) {
                    if (subItem.menuName == "透析记录") {
                        list =  subItem.children ;
                        return false;
                    }
                });
            }
        });
        return list;
    },

    //获取数据字典
    getSysDictByCode: function (code, addEmpty) {
        return getSysDictByCode(code, addEmpty);
    },

    // 获取数据字典的名称，专用于列表显示
    getSysDictName: function(code, value) {
        return getSysDictName(code, value);
    },

    getHttpPath: function() {
        return getHttpPath();
    },

    // 重设Ajax全局设定
    resetAjaxSetup: function() {
        var authToke = getStorage('KEY_AUTH_TOKEN');
        var isArchiveQuery = getStorage('KEY_IS_ARCHIVE_QUERY');
        var bearerValue = isEmpty(authToke) ? "" : 'Bearer ' + authToke;
        $.ajaxSetup({
            headers: { Authorization: bearerValue, isArchiveQuery: isArchiveQuery}
        });
    },

    // 静默登出方法
    onSilenceLogout: function () {
        // 清除cookie token Cookie：用于文件访问权限
        $.cookie('Authorization', "", {expires: -1, path: '/'});

        // 清除所有缓存，并重设Ajax全局设定
        // clearStorage();
        removeStorage("KEY_AUTH_TOKEN");// 验证令牌
        removeStorage("KEY_EMAIL");
        removeStorage("KEY_USERID");//用户id
        removeStorage("KEY_LOGINID"); //用户登陆账号
        removeStorage("KEY_USERNAME"); //用户账号名称
        removeStorage("KEY_USER_TYPE"); //用户类型
        removeStorage("KEY_HOSPITAL_NO");//用户所属中心代号
        removeStorage("KEY_HOSPITAL_NAME");//用户所属中心名称
        removeStorage("KEY_LOGIN_HOSPITAL_NO");//用户登录中心代号
        removeStorage("KEY_LOGIN_HOSPITAL_NAME");//用户登录中心名称
        removeStorage("KEY_HTTPPATH"); //文件的http路径
        removeStorage("KEY_MENUS"); //菜单
        removeStorage("KEY_ROLES"); //权限
        removeStorage("KEY_SYSDICT"); //数据字典
        removeStorage("KEY_ROLEIDLIST"); //角色
        removeStorage("KEY_IS_ARCHIVE_QUERY"); //归档查询

        baseFuncInfo.resetAjaxSetup();
    },

    // 登录成功回调方法
    onLoginSuccess: function (loginUser) {
        // token Cookie：用于文件访问权限
        $.cookie('Authorization', loginUser.authToken || "", {expires: 1, path: '/'});

        addStorage("KEY_AUTH_TOKEN", loginUser.authToken || "");// 验证令牌
        addStorage("KEY_EMAIL", loginUser.email || "");//用户邮箱
        addStorage("KEY_USERID", loginUser.userid || "");//用户id
        addStorage("KEY_LOGINID", loginUser.loginid || ""); //用户登陆账号
        addStorage("KEY_USERNAME", loginUser.username || ""); //用户账号名称
        addStorage("KEY_USER_TYPE", loginUser.userType || ""); //用户类型
        addStorage("KEY_HOSPITAL_NO", loginUser.hospitalNo || "");//用户所属中心代号
        addStorage("KEY_HOSPITAL_NAME", loginUser.hospitalName || "");//用户所属中心名称
        addStorage("KEY_LOGIN_HOSPITAL_NO", loginUser.loginHospitalNo || "");//用户登录中心代号
        addStorage("KEY_LOGIN_HOSPITAL_NAME", loginUser.loginHospitalName || "");//用户登录中心名称
        addStorage("KEY_HTTPPATH", loginUser.httpPath || ""); //文件的http路径
        addStorage("KEY_MENUS", loginUser.menus || ""); //菜单
        addStorage("KEY_ROLES", loginUser.roles || ""); //权限
        addStorage("KEY_SYSDICT", loginUser.sysDict || ""); //数据字典
        addStorage("KEY_ROLEIDLIST", loginUser.roleIdList || ""); //角色
        addStorage("KEY_IS_ARCHIVE_QUERY", "false"); // 归档查询，默认false，不开启

        window.location.href = $.config.server + "/index";
    },

    // 刷新数据字典缓存
    onRefreshDictData: function() {
        _ajax({
            type: "POST",
            url: $.config.services.system + "/refreshDictData.do",
            dataType: "json",
            done: function(data) {
                addStorage("KEY_SYSDICT", data || "");
                successToast("数据字典已刷新");
            }
        });
    },

    // 切换归档查询状态
    onToggleArchiveQuery: function() {
        var isArchiveQuery = baseFuncInfo.userInfoData.isArchiveQuery;
        layer.confirm('确定' + (isArchiveQuery ? '关闭' : '启用') + '归档查询吗？', {
            btn: ['确定并刷新页面', '取消'] //按钮
        }, function (index) {
            console.log("onToggleArchiveQuery", isArchiveQuery, !isArchiveQuery);
            addStorage("KEY_IS_ARCHIVE_QUERY", !isArchiveQuery);
            window.location.reload();
            layer.close(index);
        });
    },

    /**
     * 批量导入
     * @param entityName 实体名（一般与Controller映射的名称保持一致）
     * @param serviceName 服务名
     * @param params 自定义参数
     */
    batchImp: function(entityName, serviceName, params) {
        batchImp(entityName, serviceName, params);
    },

    /**
     * 重置面包屑
     * @param appendBreadcrumbs 追加的导航项
     */
    resetBreadcrumbs: function (appendBreadcrumbs) {
        setTimeout(function () {
            var layThisTabObj = $(window.parent.document).find("#LAY_app_tabsheader .layui-this");
            if (layThisTabObj.length > 0) {
                var breadcrumbs = [];

                // 从菜单结构中获取当前导航项
                var layThisId = layThisTabObj.attr("lay-id");
                var layThisMenuObj = $(window.parent.document).find("#LAY-system-side-menu a[lay-href='" + layThisId + "']");
                $.each(layThisMenuObj.parents("li, dl, dd").find("> a > cite"), function (index, item) {
                    breadcrumbs.push($(item).text());
                });

                // 添加追加的导航项
                if (appendBreadcrumbs && appendBreadcrumbs.length > 0) {
                    breadcrumbs = breadcrumbs.concat(appendBreadcrumbs);
                }

                if (window.parent.onBreadcrumbsChange) { window.parent.onBreadcrumbsChange(breadcrumbs); }
            }
        }, 200);
    },

    /**
     * 打开患者管理页面
     * @param options
     */
    openPatientLayoutPage: function (options) {
        var params = $.extend({
            pageHref: "/patient/patPatientInfo",
            patientId: "",
            query: {
                patientName: "",
                mobilePhone: "",
                patientRecordNo: "",
                customerType: ""
            }
        }, options);

        var urlParams = [];
        isNotEmpty(params.pageHref) && urlParams.push("href=" + params.pageHref);
        isNotEmpty(params.patientId) && urlParams.push("patientId=" + params.patientId);
        isNotEmpty(params.query.patientName) && urlParams.push("qPatientName=" + params.query.patientName);
        isNotEmpty(params.query.mobilePhone) && urlParams.push("qMobilePhone=" + params.query.mobilePhone);
        isNotEmpty(params.query.patientRecordNo) && urlParams.push("qPatientRecordNo=" + params.query.patientRecordNo);
        isNotEmpty(params.query.customerType) && urlParams.push("qCustomerType=" + params.query.customerType);
        var baseSrc = $.config.server + "/patient/patLayout";
        var newSrc = baseSrc + "#?" + urlParams.join("&");

        // 若已有patLayout页签页面，则刷新对应页签页面；否则打开新的页签页面
        var targetTab = $(window.top.document).find("#LAY_app_tabsheader li[lay-id='" + baseSrc + "']");
        if (targetTab.length > 0) {
            // 触发对应页签选中
            targetTab.trigger("click");
        } else {
            top.layui.index.openTabsPage(baseSrc, "病历信息")
        }

        // 触发选中页签刷新链接
        var targetIframe = $(window.top.document).find("#LAY_app_body .layadmin-tabsbody-item.layui-show iframe");
        if (targetIframe.length > 0) {
            targetIframe.attr("src", newSrc);
            targetIframe[0].contentWindow.location.reload();
        }
    },

    /**
     * 打开透析记录页面
     * @param options
     */
    openDialysisLayoutPage: function (options) {
        var params = $.extend({
            pageHref: "",
            patientId: "", // 患者ID
            diaRecordId: "", // 透析记录ID
            query: {
                dialysisDate: "", // 透析日期
                scheduleShift: "", // 班次
                regionSettingId: "", // 区组
                patientName: "" // 姓名
            }
        }, options);

        var urlParams = [];
        isNotEmpty(params.pageHref) && urlParams.push("href=" + params.pageHref);
        isNotEmpty(params.patientId) && urlParams.push("patientId=" + params.patientId);
        isNotEmpty(params.diaRecordId) && urlParams.push("diaRecordId=" + params.diaRecordId);
        isNotEmpty(params.query.dialysisDate) && urlParams.push("qDialysisDate=" + params.query.dialysisDate);
        isNotEmpty(params.query.scheduleShift) && urlParams.push("qScheduleShift=" + params.query.scheduleShift);
        isNotEmpty(params.query.regionSettingId) && urlParams.push("qRegionSettingId=" + params.query.regionSettingId);
        isNotEmpty(params.query.patientName) && urlParams.push("qPatientName=" + params.query.patientName);
        var baseSrc = $.config.server + "/dialysis/dialysisLayout";
        var newSrc = baseSrc + "#?" + urlParams.join("&");

        // 若已有patLayout页签页面，则刷新对应页签页面；否则打开新的页签页面
        var targetTab = $(window.top.document).find("#LAY_app_tabsheader li[lay-id='" + baseSrc + "']");
        if (targetTab.length > 0) {
            // 触发对应页签选中
            targetTab.trigger("click");
        } else {
            top.layui.index.openTabsPage(baseSrc, "透析记录")
        }

        // 触发选中页签刷新链接
        var targetIframe = $(window.top.document).find("#LAY_app_body .layadmin-tabsbody-item.layui-show iframe");
        if (targetIframe.length > 0) {
            targetIframe.attr("src", newSrc);
            targetIframe[0].contentWindow.location.reload();
        }
    },

    /**
     * 删除临时文件
     * @param filePath
     * @returns {boolean}
     */
    onDeleteTempFile: function(filePath) {
        var deleteSucess = false;
        _ajax({
            type: "POST",
            url: $.config.services.system + "/system/deleteTempFile.do",
            data: {tempFilePath: filePath},
            dataType: "json",
            async: false,
            done: function(data) {
                successToast("临时文件已删除");
                deleteSucess = true;
            }
        });
        return deleteSucess;
    },

    /**
     * 患者照片加载错误时，设置默认图片
     * @param target
     * @param gender
     */
    onPatientPhotoError: function (target, gender) {
        var errorImg = ($.constant.gender.FEMALE === gender) ? $.config.server + "/static/images/female.png" : $.config.server + "/static/images/male.png";
        target.src = errorImg;
    },

    /**
     * 从内容模板导入
     * @param title
     * @param templateType
     * @param successCallback function(templateConten, layer) { }
     */
    onImportFromContentTemplate: function (title, templateType, $successCallback) {
        _layerOpen({
            openInParent: true,
            url: $.config.server + "/backstage/bacContentTemplateList?templateType=" + templateType,  //弹框自定义的url，会默认采取type=2
            width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 700,  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            btn: ["导入", "取消"],
            // readonly: true,   //true - 查看详情  false - 编辑
            done: function (index, iframeWin, layer) {
                /**
                 * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                 * 利用iframeWin可以执行弹框的方法，比如save方法
                 */
                var ids = iframeWin.save(function (data) {
                    typeof $successCallback === 'function' && $successCallback(data);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                });
            }
        });
    },

    /**
     * 导出内容模板
     * @param title
     * @param templateType
     * @param templateContent
     * @param $successCallback
     */
    onExportContentTemplate: function (title, templateType, templateContent, $successCallback) {
        // 缓存模板内容
        var uuid = guid();
        sessionStorage.setItem(uuid, templateContent);

        //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
        _layerOpen({
            openInParent: true,
            url: $.config.server + "/backstage/bacContentTemplateEdit?templateType=" + templateType + "&uuid=" + uuid,  //弹框自定义的url，会默认采取type=2
            width: 500, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 400,  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            btn: ["保存", "取消"],
            // readonly: true,   //true - 查看详情  false - 编辑
            done: function (index, iframeWin, layer) {
                /**
                 * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                 * 利用iframeWin可以执行弹框的方法，比如save方法
                 */
                var ids = iframeWin.save(function (data) {
                    typeof $successCallback === 'function' && $successCallback(data);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                });
            }
        });
    },

    /**
     * 获取公式计算值
     * @param formulaObj
     * @param formulaKey
     * @param formulaData
     * @returns {*}
     */
    getFormulaValue: function (formulaObj, formulaKey, formulaData) {
        var formulaReturnValue = null;
        if (formulaObj != null && typeof formulaObj[formulaKey] === 'function') {
            formulaReturnValue = formulaObj[formulaKey](formulaData);
        } else {
            console.error("公式（" + formulaKey + "）不存在或格式错误。");
        }
        return formulaReturnValue;
    }
    //可继续添加其他方法
    //……
};

(function($) {
    $.config = {
        server: "",
        services: {
            system: "/api/system",  // 系统管理API服务
            platform: "/api/platform",  // 平台管理API服务
            dialysis:"/api/dialysis",  // 患者透析API服务
            schedule:"/api/schedule",  // 排班管理API服务
            logistics:"/api/logistics",  // 后勤管理API服务
            pharmacy:"/api/pharmacy",  // 药房管理API服务
        },
    };

    // 字典类型
    $.dictType = {
        sysStatus: "sys_status", // 系统状态
        userType: "UserType", // 用户类型
        sex: "Sex", // 性别
        title: "Title", // 职称
        customerType: "CustomerType", // 客户类型
        idCardType: "IdCardType", // 证件类型
        infectionMark: "InfectionMark", // 感染标志
        patientTagsColor: "PatientTagsColor", // 患者标签颜色
        shift: "Shift", // 透析班次
        ThemeType: "ThemeType", // 主题类型
        EducationType:"EducationType",//教育类型
        EducationMethod:"EducationMethod",//教育方式
        ContentType:"ContentType",//教材类型
        ApplicationStatus:"ApplicationStatus",//申请单状态
        ApplySendStatus:"ApplySendStatus",//送检状态
        HospitalInspection:"HospitalInspection",//检验机构名称
        Examination:"Examination",//检体
        SampleType:"SampleType",//检验类型
        ExamineItemUnit:"ExamineItemUnit",//检验项单位
        AnticoagulantUnit:"AnticoagulantUnit",//抗凝剂单位
        Anticoagulant:"Anticoagulant",//抗凝剂
        DialysisMode:"DialysisMode",//透析方式
        SubstituteMode:"SubstituteMode",//置换方式
        UnusualType:"UnusualType",//病症及体征分类
        UnusualDetails:"UnusualDetails",//病症及体征详细
        HandleDetails:"HandleDetails",//处理
        Dialyzer:"Dialyzer", // 透析器/血滤器
        Irrigator:"Irrigator", // 灌流器
        AllergicDrug: "AllergicDrug", // 过敏药物
        DiagnosisType: "DiagnosisType", // 诊断类型
        ChannelType: "ChannelType", // 通路类型
        ChannelPlace: "ChannelPlace", // 通路部位
        purSalesBaseUnit: 'purSalesBaseUnit', // 采购销售基本单位
        DiaCoagulation: 'DiaCoagulation', // 透析器凝血
        BloodClotting: 'BloodClotting', // 透析管路凝血
        GaitWatch: 'GaitWatch', // 步态观察
        DisinfectOrder: "DisinfectOrder", // 消毒程序
        SheetChange: "SheetChange", // 床单更换
        DisinfectSurface: "DisinfectSurface", // 表面消毒方法
        PatientSummaryAssess: "PatientSummaryAssess", // 患者阶段小结评估值
        UpToTheStandard: "UpToTheStandard",
        DialysateIntakeType: "DialysateIntakeType", // 透中摄入类型
        FallAssess: "FallAssess", // 坠床
        CatheterDrop: "CatheterDrop", // 导管脱出
        Hemostasis: "Hemostasis", // 止血方式
        HemostasisTime: "HemostasisTime", // 止血时间
        FistulaNoise: "FistulaNoise", // 杂音
        FistulaTremor: "FistulaTremor", // 震颤
        SealingPipe: "SealingPipe", // 封管方式
        DrugSealing: "DrugSealing", // 封管用药
        MonitoringRecords: "MonitoringRecords", // 监测记录表
        LinkSafe: "LinkSafe", // 管路安全
    };

    // 常量
    $.constant = {
        /**
         * 透析记录状态：0-未签到，1-已签到/待接诊，2-已接诊/待评估，3-已评估/待核对，4-已核对/待监测，5-已监测/待结束，6-已结束/待小结，7-已小结/待消毒，8-已消毒/待归档，9-归档
         */
        dialysisRecordStatus: {
            UNSIGNED: "0", // 未签到
            SIGNED: "1", // 已签到/待接诊
            RECEIVED: "2", // 已接诊/待评估
            ASSESSED: "3", // 已评估/待核对
            CHECKED: "4", // 已核对/待监测
            MONITORED: "5", // 已监测/待结束
            COMPLETED: "6", // 已结束/待小结
            SUMMARIZED: "7", // 已小结/待消毒
            STERILIZED: "8", // 已消毒/待归档
            FILED: "9", // 已归档
        },
        /**
         * 病史模板类型
         */
        medicalHistoryTemplateType: {
            PATIENTCOMPLAINT: "PatientComplaint",//患者主诉
            PRESENTHISTORY: "PresentHistory",//现病史
            CARDIOVASCULARDISEASESHISTORY: "CardiovascularDiseasesHistory",//心血管疾病史
            HYPERTENSIONHISTORY: "HypertensionHistory",//高血压病史
            BRAINVASCULARHISTORY: "BrainVascularHistory",//脑血管疾病史
            DIABETESHISTORY: "DiabetesHistory",//糖尿病史
            HEPATITISHISTORY: "HepatitisHistory",//肝炎病史
            OTHERHISTORY: "OtherHistory",//其他疾病
            FAMILYHISTORY: "FamilyHistory",//家族史
            ALLERGICHISTORY: "AllergicHistory",//过敏史
            MARRIAGEHISTORY: "MarriageHistory",//婚史
            MENSTRUALHISTORY: "MenstrualHistory",//月经史
            PROGRESSCONTENT: "ProgressContent",//病程内容
            SUMMARY: "Summary",//小结
            ILLNESS: "Illness",//病情
        }
        /**
         * 服务名称
         */
        ,ServiceName: {
            SYSTEM: 'system',  // 系统管理服务名称
            PLATFORM: 'platform',  // 平台管理服务名称
            DIALYSIS: 'dialysis',  // 患者透析服务名称
            SCHEDULE: 'schedule',  // 排班管理服务名称
            LOGISTICS: 'logistics',  // 后勤管理服务名称
            PHARMACY: 'pharmacy',  // 药房管理服务名称
        }
        /**
         * 数据状态
         */
        ,DataStatus: {
            ENABLED: '0', // 启用
            DISABLED: '1', // 停用
            DELETED: '2' // 删除
        }
        /**
         * B2B供应商
         */
        ,b2bSupplier: {
            Y: '是',
            N: '否'
        }
        /**
         * 预算类型
         */
        ,BudgetType: {
            WITH_MATERIAL_CODE: '0', // 有物料编码
            NO_MATERIAL_CODE: '1' // 无物料编码
        }
        /**
         * 采购申请单状态
         */
        ,PRStatus: {
            UN_SUBMIT_FOR_APPLY: 'A0', // 未提交
            SUBMIT_FOR_APPLY: 'A1', // 已提交未核准
            GO_BACK_FOR_APPLY: 'A2', // 退回

            UN_SUBMIT: '0', // 未提交
            SUBMIT: '1', // 已提交未核准
            GO_BACK: '2', // 退回
            APPROVAL: '3', // 已核准
            GENERATED: '4' // 已生成
        }
        /**
         *采购订单导入标识
         */
        ,ImportFlag: {
            SYSTEM_GENERATION: '0', // 系统生成
            MANUAL_IMPORT: '1' // 手动导入
        }
        /**
         *采购订单状态
         */
        ,POStatus: {
            WAREHOUSING: '0', // 已入库
            UN_WAREHOUSING: '1', // 待入库
            PARTIAL_WAREHOUSING: '2', // 部分入库
            PENDING_APPROVAL: '3' // 待审批
        }
        /**
         * 采购订单上报状态
         */
        ,POReportingStatus: {
            TO_BE_REPORTED: '0', // 待上报
            REPORTED: '1' // 已上报
        }
        /**
         * 采购订单采购状态
         */
        ,POPurchaseStatus: {
            TO_BE_PURCHASED: '0', // 待采购
            PURCHASING: '1', // 采购中
            PURCHASE_COMPLETED: '2' // 采购完成
        }
        /**
         * 入库单状态
         */
        ,WarehouseInStatus: {
            UN_SUBMIT: '0', // 待入库
            SUBMIT: '1', // 已入库
            CLOSE: '2' // 已关闭
        }
        /**
         * 入库类型
         */
        ,WarehouseInType: {
            PURCHASE: '0', // 采购入库
            SALE: '1', // 销售退货入库
            INVENTORY_PROFIT: '2', // 盘盈入库
            ALLOCATION: '3', // 调拨入库
            OTHER: '4' // 其他入库
        }
        /**
         * 出库单状态
         */
        ,WarehouseOutStatus: {
            UN_SUBMIT: '0', // 待出库
            SUBMIT: '1', // 已出库
            CLOSE: '2' // 已关闭
        }
        /**
         * 反审核数据来源
         */
        ,DeAuditDataSource: {
            IN: '1', // 入库
            OUT: '0' // 出库
        }
        /**
         * 医嘱状态
         */
        ,orderStatus: {
            NOT_COMMIT: "0",        // 未提交
            SUBMITTED: "1",         // 已提交/待执行
            EXECUTED: "2",          // 已执行/待核对
            CHECKED: "3",           // 已核对
            CANCEL_CHECKED: "4",    // 已取消核对/取消执行/核对
            CANCELLED_EXECUTE: "5"  // 已取消执行
        }
        /**
         * 盘点状态
         */
        ,InventoryType:{
            BUILD:"0",  //新增
            START:"1",  //开始盘点
            END:"2"     //结束盘点
        }
        /**
         * 患者维持类型
         */
        ,sustainType : {
            newPatient: "0", // 新患者
            keepPatient: "1" // 维持患者
        }

        /**
         * 用户类型
         */
        ,userType: {
            doctor: "1", // 医生
            nurse: "2", // 护士
            manager:"3" //行政人员
        }

        /**
         * 宣教管理-主题来源
         */
        ,themeSource: {
            local: "0", // 中心建立
            superior: "1" // 总部推送
        }
        /**
         * 宣教管理-教育方式
         */
        ,educationMethod: {
            SCENE: "Scene", // 中心建立
            WECHAT: "WeChat" // 总部推送
        }
        /**
         * 宣教管理-测评
         */
        ,teachAssess: {
            NO: "1", // 无测评
            FAIL: "2", // 不合格
            PASS: "3", // 合格
        }
        /**
         * 班次类型
         */
        ,Shift: {
            AM: '1',   //上午
            PM: '2',   //下午
            NIGHT: '3'  //晚上
        }
        /**
         * 推送状态
         */
        ,pushStatus: {
            UNPUSH: "0", // 未推送
            SUCCESS: "1", // 成功
            FAIL: "2" ,// 失败
            PUSHING: "3" //推送中
        }
        /**
         * 申请单状态
         */
        ,ApplicationStatus: {
            NO_SUBMIT: "1", // 未提交
            SUBMITTED: "2" // 已提交
        }
        /**
         * 送检状态
         */
        ,ApplySendStatus: {
            NO_SEND: "1", // 未送检
            SENT: "2" // 已送检
        }
        /**
         * 申请单来源
         */
        ,SourceType: {
            DIALYSIS: "1", // 透析
            CLINIC: "2", // 门诊
            EXAMINE: "3", // 检验
        }
        /**
         * 推送模块
         */
        ,PushModule: {
            HEALTHEDUCATION: "1", //健康教育推送
            PATIENTSCHEDUL: "2", //患者排班推送
            NOTICE: "3"     //公告推送
        },
        /*
        * 检验计划状态
        * */
        TestPlan:{
            OPEN:"0",//启用，
            OFF:'1'//停用
        },
        /**消毒类型**/
        DisinfectionType:{
            MACHINE:"0",//透析机消毒
            AIR:"1",//空气消毒
            RAY:"2"//紫外线消毒
        },
        /**区域消毒方式**/
        RegionDisinfectionType:{
            AIR:"4",//空气消毒
            RAY:"5"//紫外线消毒
        },
        /**消毒设备类型**/
        DeviceDisinfectionType:{
            AIR:"4",//空气消毒机
            RAY:"5"//紫外线消毒灯
        },
        /** 检验项参考值类型 **/
        examineItemCategory: {
            COMMON: "0", // 通用
            WITH_SEX: "1", // 参考值分男女
            WITH_AGE: "2", // 参考值分大人与小孩
            WITH_AGE_AND_SEX: "3", // 参考值分大人和小孩且有男女之别
        },
        /** 性别 **/
        gender: {
            MALE: "1", // 男
            FEMALE: "2", // 女
        },
        /**
         * 是否自动编号
         */
        isNumber: {
            Y: "Y",   //是
            N: "N"    //否
        },
        /**
         * 医保平台处方单状态
         * 0-未上传，1-已上传，2-已归档，3-已收费
         **/
        ReceivableStatus: {
            NOTUPLOAD: "0",   // 未上传
            UPLOAD: "1",      // 已上传
            ARCHIVED: "2",    // 已归档
            CHARGE: "3"       // 已收费
        },
        /**
         *  检体
         */
        Examination: {
            SERUM:"0",  //血清
            PLASMA:"1",  //血浆
            BLOOD:"2",  //全血
            SECRETION:"3",  //分泌物
            PATHOLOGY:"4",  //病理
            OTHER:"5",  //其他
            URINE:"6",  //尿
        },
        /**
         * 首推剂量的单位
         */
        AnticoagulantUnit: {
            MG:"mg",
            ML: "ml",
            U: "u",
            IU: "IU",
        },

        /**
         *透析方式
         */
        DialysisMode: {
            HD: "HD",
            HDF: "HDF",
            HDHP:"HD+HP",
            HP: "HP",
            HF: "HF",
        },

        /**
         * 过敏药物 - 状态：Y-有，N-无，U-不详
         */
        AllergicDrugStatus: {
            YES: "Y", // 有
            NO: "N", // 无
            UNKNOWN: "U" // 不详
        },

        /**
         * 是或否
         */
        YesOrNo: {
            YES: "Y", // 是
            NO: "N", // 否
        },

        /** 血管通路分类：穿刺/导管 **/
        ChannelGroup: {
            PUNCTURE: "0", // 穿刺
            CATHETER: "1", // 导管
        },

        /** 中心配置公式名称 **/
        FormulaKey: {
            RealBeforeWeight: "getRealBeforeWeightValue", // 公式1：实际体重(透前)
            TargetDehydration: "getTargetDehydrationValue", // 公式2：目标脱水量
            DepositDehydration: "getDepositDehydrationValue", // 公式3：存(脱水量)
            ActualDehydration: "getActualDehydrationValue", // 公式4：实际脱水量
            AfterRealWeight: "getAfterRealWeightValue", // 公式5：透后实际体重
            DifferDehydration: "getDifferDehydrationValue", // 公式6：差(脱水量)
            Ktv: "getKtvValue", // 公式7：KT/V计算公式
            Urr: "getUrrValue", // 公式8：URR计算公式
            CaP: "getCaPValue", // 公式10：CaMultiplyP钙磷乘积计算公式
        },
        //患者上传的文书类型
        FileType:{
            IMG:"img",//图片
            PDF:'application/pdf'//pdf
        },
        //证件类型
        IdCardType:{
            IdCard:'1',//身份证
            Passport:'2',//护照
            ArmyCard:'3',//军官证
            Other:'4'//其它
        },
        //物料来源(-> 发药记录资料来源)
        MaterielSource:{
            //透析治疗
            DIALYSISTREATMENT:"0",
            //门诊收费
            OUTPATIENTFEE:"1"

        },

        /**
         * 阶段小结类型：M-月份，Q-季度
         */
        SummaryType: {
            MONTH: "M", // 月份
            QUARTER: "Q" // 季度
        }
        /**
         * 患者排班模板周期
         */
        ,TemplateType: {
            SHIFT: '0', // 本班次
            DAY: '1', // 当天
            WEEK: '2' // 本周
        },

        /**
         * 管路安全位置
         */
        LinkSafePosition: {
            A: {name: "A", value: "1"},
            V: {name: "V", value: "2"},
        }
    };

    // 重设Ajax全局设定
    baseFuncInfo.resetAjaxSetup();
    // 重置面包屑
    baseFuncInfo.resetBreadcrumbs();
})(jQuery);

//获取http路径
function getHttpPath(){
    return getStorage("KEY_HTTPPATH")||""
}



