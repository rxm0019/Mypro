/**
 * 报表查询--医嘱查询打印
 * @Author anders
 * @version: 1.0
 * @Date 2020-11-02
 */
var orderQueryPrint = avalon.define({
    $id: "orderQueryPrint",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    errMsg: '',
    allPatient: true,        //true--所有患者  false--单个患者
    orderList: [],         //医嘱数据
    categoryShow: false,         //类别 true--执行医嘱    false--长期医嘱或开药处方
    billTitle: '',         //标题
    patientName: '',         //患者姓名
    patientRecordNo: '',     //病历号
    currentTime: ''         //当前打印时间
});
layui.use(['index'], function () {
    avalon.ready(function () {

        initFun();

        avalon.scan();
    });
});

/**
 * 初始化
 */
function initFun() {
    var util = layui.util;
    // 获取查询参数
    var queryMode = GetQueryString("queryMode");   //查询模式   0--所有患者   1--单个患者
    var category = GetQueryString('category');
    orderQueryPrint.billTitle = GetQueryString('billTitle');
    var sessionKey = GetQueryString("sessionKey");    //存session的key，用来获取对应的value
    var orderStr = sessionStorage.getItem(sessionKey);     //获取存在sessionStorage中的数据
    sessionStorage.removeItem(sessionKey);                 //删除sessionStorage中的数据

    orderQueryPrint.allPatient = queryMode === '0';
    orderQueryPrint.categoryShow = category === '1';     //1--执行医嘱  0--长期医嘱   2--开药处方
    orderQueryPrint.currentTime = util.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss');   //当前打印时间

    if (isNotEmpty(orderStr)) {
        var orderList = JSON.parse(orderStr);
        if (orderList.length === 0) {
            orderQueryPrint.errMsg = '查无数据';
            return;
        }

        orderQueryPrint.patientName = orderList[0].patientName;
        orderQueryPrint.patientRecordNo = orderList[0].patientRecordNo;

        orderList.forEach(function (item, i) {
            if (isNotEmpty(item.dialysisDate)) {
                item.dialysisDate = util.toDateString(item.dialysisDate, 'yyyy-MM-dd');
            } else {
                item.dialysisDate = '';
            }
            if (isNotEmpty(item.orderStatus) && item.orderStatus !== $.constant.orderStatus.NOT_COMMIT) {
                item.submitOrderDate = util.toDateString(item.submitOrderDate, "HH:mm");
            } else {
                item.submitOrderDate = '';
            }
            item.orderType = getSysDictName('OrderType', item.orderType);
            if (isNotEmpty(item.specifications) && isNotEmpty(item.channel) && isNotEmpty(item.frequency)) {
                item.orderContent = item.orderContent + '#' + item.specifications + '#' + getSysDictName('Route', item.channel) + '#' + getSysDictName('OrderFrequency', item.frequency);
            }
            if (isEmpty(item.orderStatus) || item.orderStatus === $.constant.orderStatus.NOT_COMMIT || item.orderStatus === $.constant.orderStatus.SUBMITTED) {
                item.executeOrderNurseName = '';
            }
            if (isNotEmpty(item.orderStatus) && (item.orderStatus === $.constant.orderStatus.EXECUTED || item.orderStatus === $.constant.orderStatus.CHECKED ||
                item.orderStatus === $.constant.orderStatus.CANCEL_CHECKED)) {
                item.executeOrderDate = util.toDateString(item.executeOrderDate, 'HH:mm');
            } else {
                item.executeOrderDate = '';
            }
            item.dataStatus = item.dataStatus === '0' ? '在用' : '停用';
            item.establishDate = util.toDateString(item.establishDate, 'yyyy-MM-dd');
        })
        orderQueryPrint.orderList = orderList;
    }
}

/**
 * 点击打印事件
 */
function onPrint() {
    window.print();
}




