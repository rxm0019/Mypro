/**
 * 患者管理 - Layout共用布局
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/18
 */
var patLayout = avalon.define({
    $id: "patLayout",
    baseFuncInfo: baseFuncInfo, //底层基本方法
    serverTime: new Date(),
    menuList: [], // 菜单列表
    patientList: {  // 患者列表
        data: [], // 患者列表数据
        isFixed: false, // 是否固定
        isShow: false,  // 是否显示
        errorMsg: ''
    },
    currentPageHref: '',
    currentPatient: { // 当前选中患者信息
        patientId: '', // 患者ID
        patientPhoto: '', // 照片
        patientName: '', // 姓名
        patientRecordNo: '', // 病历号
        gender: '', // 性别
        genderDesc: '', // 性别名称
        age: '', // 年龄
        infectionStatus: '', // 感染
        customerType: '', // 客户类型
    }
});

layui.use(['index'], function () {
    avalon.ready(function () {
        patLayout.menuList = patLayout.baseFuncInfo.getMenusForPatient();

        // 获取请求参数
        var requestUrl = window.location.href;
        var firstPageHref = $(".patient-layout-side-menu a[data-href]").first().attr("data-href");
        patLayout.currentPageHref = GetUrlQueryString(requestUrl, "href") || firstPageHref;
        patLayout.currentPatient.patientId = GetUrlQueryString(requestUrl, "patientId");
        var searchParams = {
            patientName: GetUrlQueryString(requestUrl, "qPatientName"),
            mobilePhone: GetUrlQueryString(requestUrl, "qMobilePhone"),
            patientRecordNo: GetUrlQueryString(requestUrl, "qPatientRecordNo"),
            customerType: GetUrlQueryString(requestUrl, "qCustomerType")
        };

        // 初始化搜索框
        initSearch(searchParams);
        // 初始化侧边栏菜单
        initSideMenu();

        // 查询患者列表事件
        getPatientList();

        // 根据参数，初始化选中功能选中效果
        $(".patient-layout-side-menu .layui-nav-tree").find(".layui-nav-item, a").removeClass("selected");
        var selectedMenuObj = $(".patient-layout-side-menu .layui-nav-tree a[data-href='" + patLayout.currentPageHref + "']");
        selectedMenuObj.addClass("selected");
        selectedMenuObj.closest(".layui-nav-item").addClass("selected");
        selectedMenuObj.closest(".layui-nav-item").addClass("layui-nav-itemed");
        // 重新渲染头部导航
        onBreadcrumbsChange();

        avalon.scan();
    });
});

/**
 * 初始化侧边栏菜单
 */
function initSideMenu() {
    // 侧边栏 - 菜单：一级菜单项、二级菜单项点击事件
    $(".patient-layout-side-menu .layui-nav-tree").on("click", "a[data-href]", function () {
        // 标记菜单项选中
        $(".patient-layout-side-menu .layui-nav-tree").find(".layui-nav-item, a").removeClass("selected");
        $(this).addClass("selected");
        $(this).closest(".layui-nav-item").addClass("selected");
        $(this).closest(".layui-nav-item").addClass("layui-nav-itemed");

        // 更新当前功能页面链接
        patLayout.currentPageHref = $(this).attr("data-href");

        // 刷新功能页面
        onRefreshFunctionPage();
        // 重新渲染头部导航
        onBreadcrumbsChange();
    });
    // 侧边栏 - 菜单：一级菜单组点击事件，展开、关闭二级菜单组
    $(".patient-layout-side-menu .layui-nav-tree").on("click", ".layui-nav-item > a", function () {
        $(this).closest(".layui-nav-item").toggleClass("layui-nav-itemed");
    });
}

/**
 * 选中菜单改变时，重新渲染头部导航
 */
function onBreadcrumbsChange() {
    var selectedAObj = $(".patient-layout-side-menu .layui-nav-tree").find(".layui-nav-item.selected > a, .layui-nav-child > dd > a.selected");
    if (selectedAObj.length > 0) {
        var appendBreadcrumbs = ["病历信息"];
        $.each(selectedAObj.find("> cite"), function (index, item) {
            appendBreadcrumbs.push($(item).text());
        });
        patLayout.baseFuncInfo.resetBreadcrumbs(appendBreadcrumbs);
    }
}

/**
 * 初始化搜索框
 */
function initSearch(searchParams) {
    _initSearch({
        elem: '#patLayout_search',
        filter: 'patLayout_search',
        conds: [
            {field: 'patientName', title: '姓名：', type: 'input', value: searchParams.patientName},
            {field: 'mobilePhone', title: '个人手机：', type: 'input', value: searchParams.mobilePhone},
            {field: 'patientRecordNo', title: '病历号：', type: 'input', value: searchParams.patientRecordNo},
            {field: 'customerType', title: '客户类型：', type: 'select', value: searchParams.customerType, data: getSysDictByCode($.dictType.customerType, true)},
        ],
        done: function (filter, data) {

        },
        search: function (data) {
            // 清空当前选中患者简要信息
            patLayout.currentPatient = $.extend(patLayout.currentPatient, {
                patientId: '',
                patientPhoto: '',
                patientName: '',
                patientRecordNo: '',
                gender: '',
                genderDesc: '',
                age: '',
                infectionStatus: '',
                customerType: '',
            });

            // 查询时，显示患者列表面板
            patLayout.patientList.isShow = true;
            // 按条件查患者列表
            var field = data.field;
            getPatientList(field);
        }
    });
}

/**
 * 查询患者列表事件
 * @param field
 */
function getPatientList(field) {
    var param = isNotEmpty(field) ? field : {};
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patPatientInfo/options.do",
        data: param,
        dataType: "json",
        success: function(res) {
            patLayout.serverTime = new Date(res.ts);
        },
        done: function(data) {
            if (data != null && data.length > 0) {
                $.each(data, function(index, item) {
                    var age = getUserAge(patLayout.serverTime, item.birthday);

                    item.age = (age <= 0 ? "-" : age);
                    item.genderDesc = getSysDictName($.dictType.sex, item.gender);
                    if ($.constant.gender.MALE === item.gender) {
                        item.sexPic = '/static/svg/male.svg';
                    } else if($.constant.gender.FEMALE === item.gender){
                        item.sexPic = '/static/svg/female.svg';
                    }
                    if (isNotEmpty(item.infectionStatus)) {
                        item.infectionStatus = "感染";
                    } else {
                        item.infectionStatus = "";
                    }
                });
                patLayout.patientList.data = data;
                patLayout.patientList.errorMsg = "";

                // 设置默认选中患者（若没有则默认选中第一笔）
                var selectedPatientId = patLayout.currentPatient.patientId;
                if (isEmpty(selectedPatientId) && patLayout.patientList.data.length > 0) {
                    selectedPatientId = patLayout.patientList.data[0].patientId;
                }
                $(".patient-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");
                // 滚动定位至选中元素
                var scrollTop = $(".patient-layout-side-list .layui-side-scroll .patient-dropdown-item.selected").position().top;
                $(".patient-layout-side-list .layui-side-scroll").scrollTop(scrollTop);
            } else {
                patLayout.patientList.data = [];
                patLayout.patientList.errorMsg = "查无数据";
            }
        },
        error: function (error) {
            var res = error.responseJSON || {};
            var status = error.status;

            patLayout.patientList.data = [];
            patLayout.patientList.errorMsg = getRequestErrorMsg(res, status);
        }
    });
}

/**
 * 患者列表下拉 - 显示/隐藏切换
 */
function togglePatientListDropdownShow() {
    // 非固定时，可显示隐藏患者列表
    if (!patLayout.patientList.isFixed) {
        patLayout.patientList.isShow = !patLayout.patientList.isShow;
    }
}

/**
 * 患者列表下拉 - 固定/取消固定切换
 */
function togglePatientListDropdownFixed() {
    patLayout.patientList.isFixed = !patLayout.patientList.isFixed;
}

/**
 * 选中患者信息时，更新患者概览信息
 * @param obj
 */
function onSelectedPatientInfo(obj) {
    var dropdownItemObj = $(obj);

    // 设置患者列表项选中样式
    $(".patient-dropdown-item").removeClass("selected");
    dropdownItemObj.addClass("selected");

    // 更新当前患者概览信息
    patLayout.currentPatient.patientId = dropdownItemObj.attr("data-patient-id");
    patLayout.currentPatient.patientPhoto = dropdownItemObj.attr("data-patient-photo");
    patLayout.currentPatient.patientName = dropdownItemObj.attr("data-patient-name");
    patLayout.currentPatient.patientRecordNo = dropdownItemObj.attr("data-patient-record-no");
    patLayout.currentPatient.gender = dropdownItemObj.attr("data-gender");
    patLayout.currentPatient.genderDesc = getSysDictName($.dictType.sex, dropdownItemObj.attr("data-gender"));
    patLayout.currentPatient.age = dropdownItemObj.attr("data-age");
    patLayout.currentPatient.infectionStatus = dropdownItemObj.attr("data-infection-status");
    patLayout.currentPatient.customerType = getSysDictName($.dictType.customerType, dropdownItemObj.attr("data-customer-type"));

    // 刷新功能页面
    onRefreshFunctionPage();
}

/**
 * 刷新功能页面
 */
function onRefreshFunctionPage() {
    layui.use(['form', 'laydate', 'formSelects'], function () {
        var form = layui.form;

        // 获取页面参数
        var pageHref = patLayout.currentPageHref;
        var patientId = patLayout.currentPatient.patientId;
        var searchData = form.val("patLayout_search");

        // 更新当前iframe地址
        var newSrc = $.config.server + "/patient/patLayout#?href=" + pageHref + "&patientId=" + patientId
            + "&qPatientName=" + searchData.patientName + "&qMobilePhone=" + searchData.mobilePhone
            + "&qPatientRecordNo=" + searchData.patientRecordNo + "&qCustomerType=" + searchData.customerType;
        $(window.parent.document).find("#LAY_app_body .layadmin-tabsbody-item.layui-show iframe").attr("src", newSrc);

        // 更新嵌套iframe地址
        var newSubSrc = $.config.server + pageHref + "?patientId=" + patientId;
        $("#patientAppBodyIframe").attr("src", newSubSrc);
    });
}

/**
 * 患者照片加载错误时，设置默认图片
 * @param target
 */
function onPatientPhotoError(target) {
    var gender = $(target).attr("data-gender");
    baseFuncInfo.onPatientPhotoError(target, gender);
}

/**
 * 主体内容变化是，更新外部iframe高度
 */
// function onAppBodyResize() {
//     var ifameObj = document.getElementById("patientAppBodyIframe");
//     ifameObj.height = ifameObj.contentWindow.document.body.scrollHeight;
// }




