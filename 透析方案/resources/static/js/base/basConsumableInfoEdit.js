/**
 * basConsumableInfoEdit.ftl的js文件，包括查询，编辑操作
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/08/20
 */
var basConsumableInfoEdit = avalon.define({
    $id: "basConsumableInfoEdit"
    ,baseFuncInfo: baseFuncInfo//底层基本方法
    ,readonly: {readonly: false} // 文本框设置只读
    ,conversionRatioReadonly: {value: 1, readonly: true} // 默认转换比率，不可编辑
    ,conversionRatio: {value: 1} // 默认转换比率
    ,defaultPrice: {value: 0.00} // 默认标准价格
    ,invoiceClassificationList: [] // 发票归类下拉值
    ,financialClassificationList: [] // 财务归类下拉值
    ,warehouseList: [] // 仓库下拉值
    ,materielNo:{readonly: false} // 物料编码
    ,levelOneList: getClassificationOfOne() // 获取一级分类下拉列表
    ,levelOneStr: '' // 一级分类名称
    ,levelTwoList: [] // 二级分类下拉列表
    ,levelTwoStr: '' // 二级分类名称
    ,levelThreeList: [] // 三级分类下拉列表
    ,levelThreeStr: '' // 三级分类名称
    ,levelFourList: [] // 四级分类下拉列表
    ,levelFourStr: '' // 四级分类名称
    ,consumableNo: '' // 耗材编码，由编码规则自动生成
    ,isAutoNumber: '' // 是否自动取号
});

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
            basConsumableInfoEdit.levelOneList = data;
        }
    });
}

/**
 * 一级分类列表监听
 */
basConsumableInfoEdit.$watch('levelOneStr', function (code) {
    if (code !== '') {
        getClassificationOfTwo(code);
        basConsumableInfoEdit.levelTwoStr = '';
        layui.form.render();
    } else {
        basConsumableInfoEdit.levelTwoList = [];
        basConsumableInfoEdit.levelThreeList = [];
        basConsumableInfoEdit.levelFourList = [];
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
            basConsumableInfoEdit.levelTwoList = data;
        }
    });
}

/**
 * 二级分类列表监听
 */
basConsumableInfoEdit.$watch('levelTwoStr', function (code) {
    if (code !== '') {
        getClassificationOfThree(code);
        basConsumableInfoEdit.levelThreeStr = '';
        layui.form.render();
    } else {
        basConsumableInfoEdit.levelThreeList = [];
        basConsumableInfoEdit.levelFourList = [];
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
            basConsumableInfoEdit.levelThreeList = data;
        }
    });
}

/**
 * 三级分类列表监听
 */
basConsumableInfoEdit.$watch('levelThreeStr', function (code) {
    if (code !== '') {
        getClassificationOfFour(code);
        basConsumableInfoEdit.levelFourStr = '';
        layui.form.render();
    } else {
        basConsumableInfoEdit.levelFourList = [];
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
            basConsumableInfoEdit.levelFourList = data;
        }
    });
}

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        var form = layui.form;
        laydate.render({
            elem: '#createTime'
            ,type: 'date'
        });
        laydate.render({
            elem: '#updateTime'
            ,type: 'date'
        });
        var id=GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (layEvent === 'detail') {
            basConsumableInfoEdit.readonly = {readonly: true};
            basConsumableInfoEdit.defaultPrice = basConsumableInfoEdit.readonly;
            basConsumableInfoEdit.conversionRatio = basConsumableInfoEdit.readonly;
            basConsumableInfoEdit.materielNo = basConsumableInfoEdit.readonly;
            $('input[type="radio"]').prop('disabled', true);
            $('select').prop('disabled', true);
        } else if (layEvent === 'edit') {
            basConsumableInfoEdit.materielNo = {readonly: true};
        } else if (layEvent === null) { // 新增
            isAutoNumber(); // 获取当前中心是否自动编号
        }
        getInvoiceClassificationList();
        getFinanceClassificationList();
        getWarehouseList();
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
        });

        // 监听一级分类下拉事件
        form.on('select(levelOneStr)', function (data) {
            basConsumableInfoEdit.levelOneStr = data.value;
            form.val("basConsumableInfoEdit_form", {
                levelOneStr: data.value
            });
            form.render();
        });

        // 监听二级分类下拉事件
        form.on('select(levelTwoStr)', function (data) {
            basConsumableInfoEdit.levelTwoStr = data.value;
            form.val("basConsumableInfoEdit_form", {
                levelTwoStr: data.value
            });
            form.render();
        });

        // 监听三级分类下拉事件
        form.on('select(levelThreeStr)', function (data) {
            basConsumableInfoEdit.levelThreeStr = data.value;
            form.val("basConsumableInfoEdit_form", {
                levelThreeStr: data.value
            });
            form.render();
        });

        // 监听四级分类下拉事件
        form.on('select(levelFourStr)', function (data) {
            basConsumableInfoEdit.levelFourStr = data.value;
            form.val("basConsumableInfoEdit_form", {
                levelFourStr: data.value
            });
            form.render();
        });

        avalon.scan();
    });
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
            if (data.isNumber === $.constant.isNumber.Y) {
                basConsumableInfoEdit.materielNo = { readonly: true }; // 新增时设置只读
                basConsumableInfoEdit.consumableNo = '由系统自动取号';
                basConsumableInfoEdit.isAutoNumber = data.isNumber;
            }
        }
    });
}

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
            basConsumableInfoEdit.invoiceClassificationList = data;
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
            basConsumableInfoEdit.financialClassificationList = data;
            layui.form.render();
        }
    });
}

/**
 * 获取仓库下拉值
 */
function getWarehouseList() {
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basWarehouse/getLists.do",
        dataType: "json",
        async: false,
        done: function (data) {
            basConsumableInfoEdit.warehouseList = data;
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
function  getInfo(id,$callback){
    if(isEmpty(id)){
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "consumableInfoId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basConsumableInfo/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                // 初始化表单元素,日期时间选择器
                var util=layui.util;
                data.createTime=util.toDateString(data.createTime,"yyyy-MM-dd");
                data.updateTime=util.toDateString(data.updateTime,"yyyy-MM-dd");
                basConsumableInfoEdit.levelOneStr = data.levelOne;
                basConsumableInfoEdit.levelTwoStr = data.levelTwo;
                basConsumableInfoEdit.levelThreeStr = data.levelThree;
                basConsumableInfoEdit.levelFourStr = data.levelFour;
                form.val('basConsumableInfoEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 数据验证
 * @param field
 * @returns {boolean}
 */
function validation(field) {
    var str = '';
    var msg = '超出栏位定义的最大值';

    // 标准价格
    var costPrice = field.costPrice;
    if (parseFloat(costPrice) > 9999999.99) {
        str += '标准价格' + msg + '<br>';
    }

    // 库存上限
    var inventoryCap = field.inventoryCap;
    if (parseInt(inventoryCap) > 2147483647) {
        str += '库存上限' + msg + '<br>';
    }

    // 库存下限
    var inventoryFloor = field.inventoryFloor;
    if (parseInt(inventoryFloor) > 2147483647) {
        str += '库存下限' + msg + '<br>';
    }

    // 保质期
    var qualityGuaranteePeriod = field.qualityGuaranteePeriod;
    if (parseInt(qualityGuaranteePeriod) > 2147483647) {
        str += '保质期' + msg + '<br>';
    }

    // 转换关系1（采购单位比例）
    var conversionRel1Purchase = field.conversionRel1Purchase;
    if (parseInt(conversionRel1Purchase) > 2147483647) {
        str += '转换关系1（采购单位比例）' + msg + '<br/>';
    }

    // 转换关系1（销售单位比例）
    var conversionRel1Sales = field.conversionRel1Sales;
    if (parseInt(conversionRel1Sales) > 2147483647) {
        str += '转换关系1（销售单位比例）' + msg + '<br/>';
    }

    // 转换关系2（销售单位比例）
    var conversionRel2Sales = field.conversionRel2Sales;
    if (parseInt(conversionRel2Sales) > 2147483647) {
        str += '转换关系2（销售单位比例）' + msg + '<br/>';
    }

    // 转换关系2（基本单位比例）
    var conversionRel2Basic = field.conversionRel2Basic;
    if (parseInt(conversionRel2Basic) > 2147483647) {
        str += '转换关系2（基本单位比例）' + msg + '<br/>';
    }

    if (str !== '') {
        var error = [
            '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + (str)
        ].join('');
        errorToast(error);
        return false;
    } else {
        return true;
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(basConsumableInfoEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        if (!validation(field)) {
            return false;
        }
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basConsumableInfoEdit_submit").trigger('click');
}

/**
 * 添加
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        if (basConsumableInfoEdit.isAutoNumber === $.constant.isNumber.Y) {
            field.isAutoNumber = $.constant.isNumber.Y;
        }
        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basConsumableInfo/save.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

/**
 * 编辑
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function edit($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basConsumableInfo/edit.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

