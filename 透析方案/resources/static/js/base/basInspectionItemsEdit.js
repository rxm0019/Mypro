/**
 * 检验项目明细
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/17
 */

var basInspectionItemsEdit = avalon.define({
    $id: "basInspectionItemsEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    readonly: {readonly: false} // 文本框设置只读
    , itemNo: {readonly: false} // 文本框设置只读
    ,levelOneList: getClassificationOfOne() // 获取一级分类下拉列表
    ,levelOneStr: '' // 一级分类名称
    ,levelTwoList: [] // 二级分类下拉列表
    ,levelTwoStr: '' // 二级分类名称
    ,levelThreeList: [] // 三级分类下拉列表
    ,levelThreeStr: '' // 三级分类名称
    ,levelFourList: [] // 四级分类下拉列表
    ,levelFourStr: '' // 四级分类名称
    ,invoiceClassificationList: [] // 发票归类下拉值
    ,financialClassificationList: [] // 财务归类下拉值
    , inspectionNo: "" //检验项目编码
    , isNumber: ""
});

/**
 * 是否自动编号(当前中心)
 */
function isAutoNumber() {
    _ajax({
        type: "POST",
        loading: false,
        url: $.config.services.system + "/sysHospital/hospitalList.do",
        dataType: "json",
        async: false,
        done: function (data) {
            if (data.isNumber === 'Y') {
                basInspectionItemsEdit.isNumber = data.isNumber
                basInspectionItemsEdit.itemNo = {readonly: true}; // 新增时设置只读
                // 按编码规则自动获取检验编码
                basInspectionItemsEdit.inspectionNo = "由系统自动取号"
            }
        }
    });
}


/**
 * 获取一级分类列表
 */
function getClassificationOfOne() {
    var param = {
        classificationLevel: '1'
    };
    _ajax({
        type: "POST",
        async: false,
        url: $.config.services.platform + "/basMaterialClassification/getLists.do",
        data: param,
        dataType: "json",
        done: function (data) {
            basInspectionItemsEdit.levelOneList = data;
        }
    });
}

/**
 * 一级分类列表监听
 */
basInspectionItemsEdit.$watch('levelOneStr', function (code) {
    if (code !== '') {
        getClassificationOfTwo(code);
        basInspectionItemsEdit.levelTwoStr = '';
        layui.form.render();
    } else {
        basInspectionItemsEdit.levelTwoList = [];
        basInspectionItemsEdit.levelThreeList = [];
        basInspectionItemsEdit.levelFourList = [];
    }
});

/**
 * 获取二级分类列表
 */
function getClassificationOfTwo(code) {
    var param = {
        classificationLevel: '2',
        classificationCode: code.substring(0, 1)
    };
    _ajax({
        type: "POST",
        async: false,
        url: $.config.services.platform + "/basMaterialClassification/getLists.do",
        data: param,
        dataType: "json",
        done: function (data) {
            basInspectionItemsEdit.levelTwoList = data;
        }
    });
}

/**
 * 二级分类列表监听
 */
basInspectionItemsEdit.$watch('levelTwoStr', function (code) {
    if (code !== '') {
        getClassificationOfThree(code);
        basInspectionItemsEdit.levelThreeStr = '';
        layui.form.render();
    } else {
        basInspectionItemsEdit.levelThreeList = [];
        basInspectionItemsEdit.levelFourList = [];
    }
});

/**
 * 获取三级分类列表
 */
function getClassificationOfThree(code) {
    var param = {
        classificationLevel: '3',
        classificationCode: code.substring(0, 3)
    };
    _ajax({
        type: "POST",
        async: false,
        url: $.config.services.platform + "/basMaterialClassification/getLists.do",
        data: param,
        dataType: "json",
        done: function (data) {
            basInspectionItemsEdit.levelThreeList = data;
        }
    });
}

/**
 * 三级分类列表监听
 */
basInspectionItemsEdit.$watch('levelThreeStr', function (code) {
    if (code !== '') {
        getClassificationOfFour(code);
        basInspectionItemsEdit.levelFourStr = '';
        layui.form.render();
    } else {
        basInspectionItemsEdit.levelFourList = [];
    }
});

/**
 * 获取四级分类列表
 */
function getClassificationOfFour(code) {
    var param = {
        classificationLevel: '4',
        classificationCode: code.substring(0, 5)
    };
    _ajax({
        type: "POST",
        async: false,
        url: $.config.services.platform + "/basMaterialClassification/getLists.do",
        data: param,
        dataType: "json",
        done: function (data) {
            basInspectionItemsEdit.levelFourList = data;
        }
    });
}
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var id = GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (layEvent === 'detail') {
            basInspectionItemsEdit.readonly = {readonly: true};
            basInspectionItemsEdit.itemNo = {readonly: true};
            $('input[type="radio"]').prop('disabled', true);
            $('select').prop('disabled', true);
        } else if (layEvent === null) { // 新增
            isAutoNumber(); // 获取当前中心是否自动编号
        }else if(layEvent === 'edit'){
            basInspectionItemsEdit.itemNo = {readonly: true}; // 编辑时设置只读
        }
        getInvoiceClassificationList();
        getFinanceClassificationList();
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            layui.form.render();
        });
        var form = layui.form;
        // 监听一级分类下拉事件
        form.on('select(levelOneStr)', function (data) {
            basInspectionItemsEdit.levelOneStr = data.value;
            form.val("basInspectionItemsEdit_form", {
                levelOneStr: data.value
            });
            form.render();
        });

        // 监听二级分类下拉事件
        form.on('select(levelTwoStr)', function (data) {
            basInspectionItemsEdit.levelTwoStr = data.value;
            form.val("basInspectionItemsEdit_form", {
                levelTwoStr: data.value
            });
            form.render();
        });

        // 监听三级分类下拉事件
        form.on('select(levelThreeStr)', function (data) {
            basInspectionItemsEdit.levelThreeStr = data.value;
            form.val("basInspectionItemsEdit_form", {
                levelThreeStr: data.value
            });
            form.render();
        });

        // 监听四级分类下拉事件
        form.on('select(levelFourStr)', function (data) {
            basInspectionItemsEdit.levelFourStr = data.value;
            form.val("basInspectionItemsEdit_form", {
                levelFourStr: data.value
            });
            form.render();
        });
        avalon.scan();
    });
});

/**
 * 获取发票归类下拉值
 */
function getInvoiceClassificationList() {
    _ajax({
        type: "POST",
        loading: false,
        url: $.config.services.platform + "/basInvoiceClassification/getLists.do",
        dataType: "json",
        async: false,
        done: function (data) {
            basInspectionItemsEdit.invoiceClassificationList = data;
            layui.form.render();
        }
    });
}

/**
 * 获取财务归类下拉值
 */
function getFinanceClassificationList() {
    _ajax({
        type: "POST",
        loading: false,
        url: $.config.services.platform + "/basFinancialClassification/getLists.do",
        dataType: "json",
        async: false,
        done: function (data) {
            basInspectionItemsEdit.financialClassificationList = data;
            layui.form.render();
        }
    });
}


/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    if (isEmpty(id)) {
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "inspectionItemsId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basInspectionItems/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                basInspectionItemsEdit.levelOneStr = data.levelOne;
                basInspectionItemsEdit.levelTwoStr = data.levelTwo;
                basInspectionItemsEdit.levelThreeStr = data.levelThree;
                basInspectionItemsEdit.levelFourStr = data.levelFour;
                form.val('basInspectionItemsEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(basInspectionItemsEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        field.costPrice = isEmpty(field.costPrice) ? "0.00" : field.costPrice
        field.isNumber = basInspectionItemsEdit.isNumber;
        if(! isNumber(field.costPrice)){
            var error = [
                '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite> ' + ('标准价格格式错误')
            ].join('');
            errorToast(error);
            return false;
        }
        if(isNotEmpty(field.orderNo) && !(/(^[0-9]\d*$)/.test(field.orderNo))) {
            var error = [
                '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite> ' + ('排序号格式错误,请输入大于0的整数')
            ].join('');
            errorToast(error);
            return false;
        }
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basInspectionItemsEdit_submit").trigger('click');
}

/**
 * 新增方法
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        
        var url = $.config.services.platform + "/basInspectionItems/save.do";
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

/**
 * 编辑方法
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function edit($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        
        var param = field; //表单的元素
        var url = $.config.services.platform + "/basInspectionItems/edit.do";
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}


