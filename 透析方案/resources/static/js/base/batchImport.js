/**
 * 批量导入公共方法
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/09/27
 */
var batchImport = avalon.define({
    $id: 'batchImport',
    baseFuncInfo: baseFuncInfo,
    remarks: '', // 执行结果
    filePath: '', // 文件路径
    entityName: GetQueryString('entityName'), // 实体名称
    serviceName: GetQueryString('serviceName'), // 服务名称
    params: GetQueryString('params'), // 自定义参数
    url: '', // 后端业务接口URL
    isAutoNumber: $.constant.isNumber.Y // 是否自动编号
});

layui.use(['index', 'upload'], function () {
    avalon.ready(function () {
        var hostAPI = '';
        var params = ''; // 自定义URL参数
        var form = layui.form; //调用layui的form模块
        form.on('select(materielType)', function (data) {
            if (batchImport.entityName == 'purSalesPrice') { //销售价格维护
                params = '?params=' + data.value;
                batchImport.url = $.config.services.pharmacy + '/' + batchImport.entityName + '/batchImport.do' + params;
                uploadListIns.reload({url: batchImport.url});
            }
        });
        if (isNotEmpty(batchImport.serviceName) && isNotEmpty(batchImport.entityName)) {
            var serviceName = batchImport.serviceName.toLowerCase();

            if (serviceName === $.constant.ServiceName.SYSTEM) { // 系统管理服务
                hostAPI = $.config.services.system;
            } else if (serviceName === $.constant.ServiceName.PLATFORM) { // 平台管理服务
                hostAPI = $.config.services.platform;

                // 药品管理、耗材管理
                if (batchImport.entityName === 'basDrugInfo' || batchImport.entityName === 'basConsumableInfo') {
                    isAutoNumber();
                    params = '?params=' + batchImport.isAutoNumber;
                }
            } else if (serviceName === $.constant.ServiceName.DIALYSIS) { // 患者透析服务
                hostAPI = $.config.services.dialysis;
            } else if (serviceName === $.constant.ServiceName.SCHEDULE) { // 排班管理服务
                hostAPI = $.config.services.schedule;
            } else if (serviceName === $.constant.ServiceName.LOGISTICS) { // 后勤管理服务
                hostAPI = $.config.services.logistics;
            } else if (serviceName === $.constant.ServiceName.PHARMACY) { // 药房管理服务
                hostAPI = $.config.services.pharmacy;

                if (batchImport.entityName === 'purRequisition') { // 采购预算
                    params = '?params=' + batchImport.params;
                }
                if (batchImport.entityName == 'purSalesPrice') { //销售价格维护
                    params = '?params=' + $("[name='materielType']").val();
                }
            }

            batchImport.url = hostAPI + '/' + batchImport.entityName + '/batchImport.do' + params;
        } else {
            batchImport.url = '#';
        }
        if (batchImport.entityName == 'stoInventoryDetail' || batchImport.entityName =='purSalesPrice') { //隐藏销售价格管理、库存盘点的下载模板按钮
            $("#downloadTemplate").addClass("layui-hide");
        }
        if (batchImport.entityName == 'purSalesPrice') {
            $("#materielType").removeClass("layui-hide");
        } else {
            $("#materielType").addClass("layui-hide");
        }
        avalon.scan();
    });

    console.log("batchImport.url+++++++++", batchImport.url)
    // 上传、导入
    var upload = layui.upload;
    var listView = $('#dataList');
    var uploadListIns = upload.render({
        elem: '#selectFile'
        , url: batchImport.url
        , accept: 'file'
        , exts: 'xlsx'
        , multiple: false
        , auto: false
        , bindAction: '#doImport'
        , choose: function (obj) {

            // 清空缓存数据
            batchImport.remarks = '';
            $('#dataList > tr').remove();
            $('#doImport').prop('disabled', false); // 设置可执行

            // 读取本地上传的文件
            var files = this.files = obj.pushFile(); // 将每次选择的文件追加到文件队列
            obj.preview(function (index, file, result) {
                var tr = $(['<tr id="upload-' + index + '">'
                    , '<td>' + file.name + '</td>'
                    , '<td align="center">' + (file.size / 1024).toFixed(1) + 'kb</td>'
                    , '<td align="center">待执行</td>'
                    , '<td align="center">'
                    , '<button class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-black file-delete">删除</button>'
                    , '</td>'
                    , '</tr>'].join(''));

                // 删除
                tr.find('.file-delete').on('click', function () {
                    delete files[index]; // 删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                // 追加元素到 listView 对象
                listView.append(tr);
            });
        }, before: function (obj) {
            // console.log("batchImport.url++++++++++++++++++",batchImport.url)
            if ($('#dataList > tr').length === 1) {
                layer.load(); // 上传loading
            }
        }, done: function (res, index, upload) {
            layer.closeAll('loading'); // 关闭loading
            $('#doImport').prop('disabled', true); // 防止重复执行

            var tr = listView.find('tr#upload-' + index);
            var tds = tr.children();
            if (res.rtnCode === '0') { // 上传成功
                tds.eq(2).html('<span style="color: #5FB878;">导入成功</span>');
                tds.eq(3).html(''); // 清空操作
                batchImport.remarks = '成功导入了 (' + res.bizData.length + ') 条记录';

                if (batchImport.serviceName === $.constant.ServiceName.PHARMACY && batchImport.entityName === 'purRequisition') {
                    parent.refresh(batchImport.params.split('@')[0]);
                } else if (batchImport.serviceName === $.constant.ServiceName.PHARMACY && batchImport.entityName === 'purOrderMain') {
                    parent.refresh();
                }else if(batchImport.serviceName === $.constant.ServiceName.PHARMACY && batchImport.entityName === 'stoInventoryDetail'){
                    parent.refresh();
                    batchImport.remarks = '成功导入了 (' + res.bizData + ') 条记录';
                }else if(batchImport.serviceName === $.constant.ServiceName.PLATFORM && batchImport.entityName === 'basSupplierManagement'){
                    parent.refresh();
                }else if(batchImport.serviceName === $.constant.ServiceName.PLATFORM && batchImport.entityName === 'basDiagnosisTreatment'){ //诊疗项目
                    parent.refresh();
                }else if(batchImport.serviceName === $.constant.ServiceName.PLATFORM && batchImport.entityName === 'basInspectionItems'){ //检验项目
                    parent.refresh();
                }else if(batchImport.serviceName === $.constant.ServiceName.PLATFORM && batchImport.entityName === 'basFinancialClassification'){ //财务归类
                    parent.refresh();
                } else if (batchImport.serviceName === $.constant.ServiceName.PHARMACY && batchImport.entityName === 'purSalesPrice') { //销售价格管理
                    parent.refresh();
                    batchImport.remarks = '成功导入了 (' + res.bizData + ') 条记录';
                }
            } else if (res.rtnCode === '1') {
                batchImport.remarks = '导入失败：' + res.developMsg;
            } else if (res.rtnCode === '104') {
                tds.eq(2).html('<span style="color:red;">导入失败</span>');
                tds.eq(3).html('<button class="layui-btn layui-btn-xs layui-btn-dissmall layui-btn-dis-red" onclick="downloadErrorFile()">下载查看</button>');
                batchImport.filePath = res.bizData.filePath;
                batchImport.remarks = '导入失败：' + res.msg;
            }

            // 删除文件队列已经上传成功的文件
            return delete this.files[index];
        }
    });
});

/**
 * 下载文件，查看导入失败的原因
 */
function downloadErrorFile() {
    window.location.href = batchImport.filePath;
}

/**
 * 导入模板下载
 */
function downloadTemplate() {
    var entityName = batchImport.entityName;
    var params = batchImport.params;
    var templateFile = ''; // 模板文件

    if (entityName === 'basDrugInfo') { // 药品
        templateFile = '药品列表导入模板.xlsx';
    } else if (entityName === 'basConsumableInfo') { // 耗材
        templateFile = '耗材列表导入模板.xlsx';
    } else if (entityName === 'basInvoiceClassification') { // 发票归类
        templateFile = '发票归类列表导入模板.xlsx';
    } else if (entityName === 'basFinancialClassification') { // 财务归类
        templateFile = '财务归类列表导入模板.xlsx';
    } else if (entityName === 'purRequisition' && params.split('@')[0] === $.constant.BudgetType.WITH_MATERIAL_CODE) { // 采购预算（有物料编码）
        templateFile = '预算列表导入模板_有物料编码.xlsx';
    } else if (entityName === 'purRequisition' && params.split('@')[0] === $.constant.BudgetType.NO_MATERIAL_CODE) { // 采购预算（无物料编码）
        templateFile = '预算列表导入模板_无物料编码.xlsx';
    } else if (entityName === 'purOrderMain') { // 采购订单
        templateFile = '采购订单导入模板.xlsx';
    }else if(entityName === 'basSupplierManagement'){ //供应商管理
        templateFile = '供应商管理列表导入模板.xlsx';
    }else if(entityName === 'basDiagnosisTreatment'){ //诊疗项目
        templateFile = '诊疗项目列表导入模板.xlsx';
    }else if(entityName === 'basInspectionItems'){ //检验项目
        templateFile = '检验项目列表导入模板.xlsx';
    }

    window.location.href = $.config.server + '/static/xlsx/' + templateFile;
}

/**
 * 是否自动编号(当前中心)
 */
function isAutoNumber() {
    _ajax({
        type: "POST",
        data: { a: 'DRU' },
        loading: false,
        url: $.config.services.system + "/sysHospital/hospitalList.do",
        dataType: "json",
        async: false,
        done: function (data) {
            batchImport.isAutoNumber = data.isNumber;
        }
    });
}
