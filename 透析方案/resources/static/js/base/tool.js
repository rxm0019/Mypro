/**
 * http请求状态错误信息
 * @type {{"400": string, "500": string, "403": string, "502": string, "404": string, "503": string, "405": string, "504": string}}
 */
var HttpStatusMsg = {
    '400': '请求参数错误！',
    '401': '无访问权限！',
    '403': '服务器拒绝请求！',
    '404': '找不到资源！',
    '405': '不支持的请求方法！',
    '500': '服务器内部错误！',
    '502': '网关错误！',
    '503': '服务不可用！',
    '504': '网关超时！'
};
var RtnCode = {
    OK: {code: 0, reasonPhrase: 'OK'},
    ERROR: {code: 1, reasonPhrase: '未知错误'},
    FORM_VALID_ERROR: {code: 2, reasonPhrase: '表单验证错误'},
    DATA_VALID_ERROR: {code: 3, reasonPhrase: '数据验证错误'},
    NO_LOIN: {code: 100, reasonPhrase: '用户未登陆'},
    TOKEN_EXPIRE: {code: 101, reasonPhrase: '签名超时'},
    TOKEN_WRONG: {code: 102, reasonPhrase: '签名错误'},
    NO_ACCESS: {code: 103, reasonPhrase: '无权限访问'}
};

/**
 * 批量导入
 * @param entityName 实体名（一般与Controller映射的名称保持一致）
 * @param serviceName 服务名
 * @param params 自定义参数
 */
batchImp = function (entityName, serviceName, params) {
    if (isNotEmpty(entityName) && isNotEmpty(serviceName)) {
        var title = '导入';
        var url = $.config.server + '/base/batchImport?entityName=' + entityName + '&serviceName=' + serviceName + '&params=' + params;

        _layerOpen({
            url: url,  //弹框自定义的url，会默认采取type=2
            width: 1024, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 570,  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            readonly: true,
            done: function (index, iframeWin) {
            }
        });
    } else {
        layer.alert('错误：FTL文件中入参不正确，请核实');
    }
};

/**
 * 获取的请求参数(表单、table)
 * @param filter 各自的filter值
 */
var requestParam = {};

function getRequestParam(filter) {
    if (isNotEmpty(filter)) {
        if (requestParam[filter] != null) {
            return requestParam[filter];
        }
    }
    return {};
}

/**
 * 截取url请求参数
 */
function GetQueryString(name) {
    return GetUrlQueryString(window.location.search.substr(1), name);
}

/**
 * 截取url请求参数
 */
function GetUrlQueryString(url, name) {
    var searchStr = decodeURI(url);
    var reg = new RegExp("(^|&|/?)" + name + "=([^&]*)(&|$)");
    var r = searchStr.match(reg);
    if (r != null)
        return unescape(r[2]).trim();
    return null;
}

/**
 * 获取数据字典的名称，专用于列表显示
 * @param code
 * @param value
 */
function getSysDictName(code, value) {
    return getSysDictProperty(code, value, 'name');
}

/**
 * 获取数据字典的简称
 * @param code
 * @param value
 */
function getSysDictShortName(code, value) {
    return getSysDictProperty(code, value, 'shortName');
}

/**
 * 获取数据字典的业务数据
 * @param code
 * @param value
 */
function getSysDictBizCode(code, value) {
    return getSysDictProperty(code, value, 'dictBizCode');
}

/**
 * 获取数据字典的默认值
 * @param code
 * @param value
 */
function getSysDictDefaultValue(code, value) {
    return getSysDictProperty(code, value, 'dictDataDefaultValue');
}

/**
 * 获取数据字典的属性值，专用于列表显示
 * @param code
 * @param value
 * @param propertyName 属性名，必填
 */
function getSysDictProperty(code, value, propertyName) {
    var dictMap = getSysDictMap(code);
    var name = "";
    if (isNotEmpty(value) && dictMap) {
        var vals = value.split(",");
        var names = [];
        $.each(vals, function (i1, val) {
            var dictItem = dictMap[val];
            if (dictItem) {
                names.push(dictItem[propertyName]);
            }
        });
        name = names.join(",");
    }
    return name;
}

/**
 * 获取数据字典的属性值，专用于列表显示
 * @param code
 * @returns {string}
 */
function getSysDictMap(code) {
    if (isEmpty(code)) {
        return null;
    }

    var dictMap = null;
    try {
        var list = eval("(" + getStorage("KEY_SYSDICT") + ")") || {};
        if (list[code] != null) {
            dictMap = {};
            var dictList = list[code];
            $.each(dictList, function (index, dictItem) {
                dictMap[dictItem.value] = dictItem;
            })
        }
    } catch (err) {
    }
    return dictMap;
}

function showMoreCondition(obj) {
    if ($(obj).hasClass("condition-open")) {
        $(obj).removeClass("condition-open");
        $("#condition_more").slideUp();
        $(obj).html('<cite>更多筛选条件</cite><span class="layui-icon layui-icon-down condition-icon"></span>');
    } else {
        $(obj).addClass("condition-open");
        $("#condition_more").slideDown();
        $(obj).html('<cite>收起筛选条件</cite><span class="layui-icon layui-icon-up condition-icon"></span>');
    }
}

/**
 * 判断该字符串是否不为空，且长度大于0
 * @param str
 * @returns {boolean}
 */
function isNotEmpty(str) {
    return str != null && str != undefined && $.trim(str).length > 0;
}

/**
 * 判断该字符串是否不为空，且长度大于0
 * @param str
 * @returns {boolean}
 */
function isEmpty(str) {
    return str == null || str == undefined || $.trim(str).length == 0;
}

/**
 * 弹框打开图片预览
 * @param src 图片的真实路径
 */
imagesOpen = function (src) {
    layui.use(['layer'], function () {
        layer.photos({
            photos: {
                "title": "查看图片" //相册标题
                , "start": 0
                , "data": [{src: src}]
            }
            , shade: 0.01
            , closeBtn: 1
            , anim: 5
        });
    });
};

/**
 * 弹框打开图片预览
 * @param data 图片的真实路径（获取多组图片信息，如 [{ src: "原图地址", alt: "图片名" }, { src: "原图地址", alt: "图片名" }, ...]）
 * @param start 初始显示的图片序号，默认0
 */
imagesPreview = function (photosData, start) {
    layui.use(['layer'], function () {
        layer.photos({
            photos: {
                "title": "查看图片" //相册标题
                , "start": start
                , "data": photosData
            }
            , shade: 0.5
            , closeBtn: 1
            , anim: 5
        });
    });
};

/**
 * 系统定义的错误框
 * @param msg
 * @param time
 */
errorToast = function (msg, time) {
    layui.use(['layer'], function () {
        var layer = layui.layer;
        var t = 2000;
        if (time) {
            t = time;
        }
        layer.msg(msg, {
            icon: 2,
            time: t,
            shade: [0.2, '#838B83'] //0.1透明度的白色背景
        });
    });
}

/**
 * 系统定义的成功框
 * @param msg
 * @param time
 */
successToast = function (msg, time) {
    layui.use(['layer'], function () {
        var layer = layui.layer;
        var t = 1000;
        if (time) {
            t = time;
        }
        layer.msg(msg, {
            icon: 1,
            time: t,
            shade: [0.2, '#838B83'] //0.1透明度的白色背景
        });
    });
}

/**
 * 系统定义的警告框
 * @param msg
 * @param time
 */
warningToast = function (msg, time) {
    layui.use(['layer'], function () {
        var layer = layui.layer;
        var t = 2000;
        if (time) {
            t = time;
        }
        layer.msg(msg, {
            icon: 7,
            time: t,
            shade: [0.2, '#838B83'] //0.1透明度的白色背景
        });
    });
}

/**
 * 增加缓存
 * @param key
 * @param obj
 */
function addStorage(key, obj) {
    window.localStorage.setItem(key, obj);
}

/**
 * 获取Storage
 * @param key
 */
function getStorage(key) {
    return window.localStorage.getItem(key);
}

/**
 * 去除Storage
 * @param key
 */
function removeStorage(key) {
    window.localStorage.removeItem(key);
}

/**
 * 清除所有缓存
 */
function clearStorage() {
    window.localStorage.clear();
}

//全部替换字符串
String.prototype.replaceAll = function (FindText, RepText) {
    regExp = new RegExp(FindText, "g");
    return this.replace(regExp, RepText);
}

function hideZtree() {
    _hideZreeDiv();
    //延迟执行，为的是table能自适应宽度
    setTimeout(function () {
        var table = layui.table;
        $.each(table.cache, function (key, value) {
            if (isNotEmpty(key)) {
                table.resize(key);
            }
        });
    }, 300);
}

/**
 * 获取数据字典
 * @param code 数据字典的code
 * @param addEmpty true 或者false； 是否加入空的一项（即“{value:"",name:"全部"}”），多用于搜索下拉框，默认false
 * @returns {Array}
 */
function getSysDictByCode(code, addEmpty) {
    var dicts = [];
    if (isNotEmpty(addEmpty) && addEmpty) {
        dicts.push({value: "", name: "全部"});
    }
    if (isNotEmpty(code)) {
        try {
            var list = eval("(" + getStorage("KEY_SYSDICT") + ")") || {};
            if (list[code] != null) {
                dicts = dicts.concat(list[code]);
            }
        } catch (err) {
        }
    }
    return dicts;
}


/**
 * 重新封装jq的ajax方法
 * @param opt
 */
_ajax = function (opt) {
    layui.use(['layer'], function () {
        var layer = layui.layer;
        opt.data = opt.data || {};
        opt.headers = opt.headers || {};
        opt.loading = opt.loading == undefined || opt.loading == null ? true : opt.loading; //是否开启loading
        opt.loadMsg = opt.loadMsg || '数据请求中'; //是否开启loading的信息
        var loadlayer = null;
        showLoading = function () {
            loadlayer = layer.msg(opt.loadMsg, {icon: 16, shade: 0, time: 1000000});
        };
        hideLoading = function () {
            if (loadlayer) {
                layer.close(loadlayer);
            }
        };
        var beforeSend = opt.beforeSend;
        var success = opt.success;
        var error = opt.error;
        delete opt.beforeSend;
        delete opt.success;
        delete opt.error;
        return $.ajax($.extend({
            dataType: 'json'
            , beforeSend: function (xhr) {
                if (opt.loading) {
                    showLoading();
                }
                typeof beforeSend === 'function' && beforeSend(xhr);
            }
            , success: function (res) {
                //只要 http 状态码正常，无论 response 的 code 是否正常都执行 success
                typeof success === 'function' && success(res);

                if (opt.loading) {
                    hideLoading();
                }

                if (res.rtnCode == RtnCode.OK.code) {
                    // 只有 response 的 code 一切正常才执行 done
                    typeof opt.done === 'function' && opt.done(res.bizData);
                } else {
                    // 请求错误处理
                    requestErrorHandle(res);
                }
            }
            , error: function (e, code) {
                if (opt.loading) {
                    hideLoading();
                }

                // 请求错误处理
                var res = e.responseJSON || {};
                var status = e.status;
                requestErrorHandle(res, status);

                typeof error === 'function' && error(e);
            }
        }, opt));
    });
};

/**
 * 异步下载文件
 * @param url
 * @param args
 * @private
 */
_downloadFile = function (opt) {
    layui.use(['layer'], function () {
        var layer = layui.layer;
        var loadlayer;

        // 设定值项初始化
        opt.data = opt.data || {};
        opt.loadMsg = opt.loadMsg || '数据请求中'; //是否开启loading的信息
        opt.fileName = opt.fileName || '未知文件';

        // 请求参数转为表单
        var formData = new FormData();
        $.each(opt.data, function (key, value) {
            formData.append(key, value);
        });

        var xhr = new XMLHttpRequest();
        xhr.open('POST', opt.url, true);//get请求，请求地址，是否异步
        xhr.responseType = "blob";    // 返回类型blob
        xhr.setRequestHeader("Authorization", 'Bearer ' + getStorage('KEY_AUTH_TOKEN'));
        xhr.onloadstart = function (ev) {
            loadlayer = layer.msg(opt.loadMsg, {icon: 16, shade: 0, time: 1000000});
        };
        xhr.onload = function () {// 请求完成处理函数
            layer.close(loadlayer);
            if (this.status === 200) {
                var blob = this.response;// 获取返回值
                var aLink = document.createElement('a');
                aLink.target = "_blank";
                aLink.download = opt.fileName;
                aLink.href = window.URL.createObjectURL(blob);
                aLink.click();
            } else {
                requestErrorHandle(null, this.status);
            }
        };
        xhr.send(formData);
    });
}

/**
 * 隐藏ztree的div
 */
function _hideZreeDiv(type) {
    if (isNotEmpty(type)) {
        if (type === "auto") {
            //自动调整
            if ($(window).width() < 900) {
                if (!$(".tree-side-div").hasClass("tree-hide-div")) {
                    $(".tree-side-div").addClass("tree-hide-div");
                }
            }
            if ($(window).width() >= 1100) {
                $(".tree-side-div").removeClass("tree-hide-div");
            }
        }
    } else {
        if ($(".tree-side-div").hasClass("tree-hide-div")) {
            $(".tree-side-div").removeClass("tree-hide-div");
        } else {
            $(".tree-side-div").addClass("tree-hide-div");
        }
    }
}

/**
 * 重新封装ztree
 * @param opt
 */
_initZtree = function (obj, opt, zNodes) {
    var zTreeObj;
    layui.use(['layer'], function () {
        var layer = layui.layer;
        //重新定义一些常用的属性
        opt.id = opt.id || ''; //新增自定义参数，同ztree的data.simpleData.idKey
        opt.pId = opt.pId || ''; //新增自定义参数，同ztree的data.simpleData.pIdKey
        opt.name = opt.name || ''; //新增自定义参数，同ztree的data.key.name
        opt.checkbox = opt.checkbox || false; //新增自定义参数，开启checkbox
        opt.radio = opt.radio || false; //新增自定义参数，开启radio
        var check = {};
        var view = {};
        var callback = {};
        if (opt.checkbox) {
            check.enable = true;
            check.chkStyle = "checkbox";
            check.chkboxType = {"Y": "s", "N": "s"};
            view.showIcon = false;
            //定义默认的beforeClick事件
            callback.beforeClick = function (treeId, treeNode, clickFlag) {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                treeObj.checkNode(treeNode, !treeNode.checked, false, true);
                return true;
            };
        }
        if (opt.radio) {
            check.enable = true;
            check.chkStyle = "radio";
            check.radioType = "all";
            view.showIcon = false;
            //定义默认的beforeClick事件
            callback.beforeClick = function (treeId, treeNode, clickFlag) {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                treeObj.checkNode(treeNode, !treeNode.checked, false, true);
                return true;
            };
        }
        //data默认配置
        var data = {
            key: {},
            simpleData: {
                enable: true
            }
        };
        if (isNotEmpty(opt.id)) {
            data.simpleData.idKey = opt.id;
        }
        if (isNotEmpty(opt.pId)) {
            data.simpleData.pIdKey = opt.pId;
        }
        if (isNotEmpty(opt.name)) {
            data.key.name = opt.name;
        }
        var setting = $.extend(true, {
            data: data,
            check: check,
            view: view,
            callback: callback
        }, opt);
        zTreeObj = $.fn.zTree.init(obj, setting, zNodes);
        typeof opt.done === 'function' && opt.done(zTreeObj);
    });
    //获取勾选的记录
    zTreeObj.getCheckedList = function () {
        var treeObj = zTreeObj;
        var nodes = treeObj.getCheckedNodes(true);//获取勾选的节点
        return nodes;
    };
    //查询方法
    zTreeObj.searchTree = function (searchStr) {
        var treeObj = zTreeObj;
        var objs = treeObj.transformToArray(treeObj.getNodes());
        treeObj.expandAll(false);
        treeObj.refresh();  //特殊处理，刷新重置tree，
        var highlight = false;
        for (var j = 0; j < objs.length; j++) {
            if (objs[j].highlight) {
                highlight = true;
            }
        }
        if (isNotEmpty(searchStr)) {
            var nodes = treeObj.getNodesByParamFuzzy(opt.name, searchStr, null);
            if (nodes.length === 0) {
                warningToast("没有搜索到记录", 1000);
            }
            var isSelect = false;
            for (var i = 0; i < nodes.length; i++) {
                if (!highlight && i === 0) {
                    treeObj.selectNode(nodes[i]);
                    nodes[i].highlight = true;
                    isSelect = true;
                } else {
                    //将搜索到的节点展开
                    if (nodes[i].highlight) {
                        nodes[i].highlight = false;
                        if (i + 1 < nodes.length) {
                            nodes[i + 1].highlight = true;
                            treeObj.selectNode(nodes[i + 1]);
                            isSelect = true;
                            break;
                        }
                    }
                }
            }
            if (nodes.length > 0 && !isSelect) {
                treeObj.selectNode(nodes[0]);
                nodes[0].highlight = true;
            }
        }
    };
    return zTreeObj;
};

/**
 * 封装弹框的ztree
 * @param obj
 * @param opt
 * @param zNodes
 * @returns {*}
 */
_initLayOpenZtree = function (opt, zNodes, $callback) {
    var layerOpen;
    layui.use(['layer'], function () {
        opt.url = opt.url || $.config.services.system + "/system/sysOpenTree";
        opt.width = opt.width || 350;
        opt.height = opt.height || 450;
        opt.title = opt.title || "请选择";
        var url = opt.url;
        var width = opt.width;
        var height = opt.height;
        var title = opt.title;
        delete opt.url;
        delete opt.width;
        delete opt.height;
        delete opt.title;
        layerOpen = _layerOpen({
            url: url,  //弹框自定义的url，会默认采取type=2
            width: width, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: height,  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']];//得到iframe页的窗口对象，执行iframe页的方法：
                iframeWin.initSysZtree(opt, zNodes);
            },
            done: function (index, iframeWin) {
                /**
                 * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                 * 利用iframeWin可以执行弹框的方法，比如save方法
                 */
                var ids = iframeWin.getCheckedList(
                    function success(data) {
                        typeof $callback === 'function' && $callback(data);
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                );
            }
        })
    });
    return layerOpen;
};

/**
 * 初始化左侧树
 * 参数：
 *  opt.title 树标题
 *  opt.width 树的div默认230
 *  opt.isHide 默认true 是否开启隐藏树
 *  opt.isSearch 默认true 是否开启搜索框
 *  opt.onSearch 搜索事件
 *
 */
function _initLeftZtree(obj, opt, zNodes) {
    var treeId = "treeDemo"; //树的节点
    //搜索事件
    var searchZtree = function () {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        treeObj.searchTree($("#tree_search_name").val());
    };
    opt.title = opt.title || ''; //树的title
    opt.width = opt.width || 230;//左侧的宽度
    opt.isHide = opt.isHide == undefined || opt.isHide == null ? true : opt.isHide; //是否开启隐藏树
    opt.isSearch = opt.isSearch == undefined || opt.isSearch == null ? true : opt.isSearch; //是否开启搜索框
    opt.onSearch = opt.onSearch || searchZtree; //是否开启搜索框
    var html = "";
    html += '<div class="tree-side-title">' +
        '        <span>' + opt.title + (opt.isSearch ? '<span class="fly-search LAY_search"><i class="layui-icon"></i></span>' : '') + '</span>';
    //收缩按钮
    if (opt.isHide) {
        html += '   <a href="javascript:;" onclick="hideZtree();">' +
            '        <i class="layui-icon tree-side-hide layui-icon-triangle-r"></i>' +
            '     </a>';
    }
    html += ' </div>';
    //ztree树
    html += '   <div class="layui-fluid">' +
        '        <div class="layui-card">' +
        '            <ul id="treeDemo" class="ztree"></ul>' +
        '        </div>' +
        '    </div>';
    obj.css("margin-top", "50px");
    obj.addClass('layui-side');
    obj.addClass('tree-side-div');
    if ($(window).width() < 900) {
        obj.addClass("tree-hide-div");
    }
    obj.width(opt.width);
    if (!obj.next().hasClass("layui-body")) {
        obj.next().wrapAll('<div class="layui-body" style="left:' + (opt.width + 10) + "px" + '"></div>');
    }
    obj.html(html);
    //搜索事件
    if (opt.isSearch) {
        $(".fly-search").click(function () {
            _layerOpen({
                type: 1,
                width: 350,
                height: 80,
                closeBtn: 0,
                shadeClose: true,
                fixed: false,
                scrollbar: false,
                title: false,
                maxmin: false,
                content: '<div class="layui-form layui-row pt-20 pl-20 pr-20">' +
                    '                    <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">' +
                    '                        <div class="disui-form-flex">\n' +
                    '                            <input type="text" id="tree_search_name" placeholder="关键字搜索" autocomplete="off">' +
                    '                            <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach" style="width: 50px;" id="leftTree_search"><i class="layui-icon layui-icon-search"></i></button>' +
                    '                        </div>' +
                    '                    </div>' +
                    '                </div>',
                success: function () {
                    $("#leftTree_search").click(opt.onSearch);
                }
            });
        });
    }
    if (opt.isHide) {
        $(window).resize(function () {
            setTimeout(function () {
                _hideZreeDiv("auto");
            }, 100);
        });
    }
    typeof opt.initZtree === 'function' && opt.initZtree($("#" + treeId));
}

/**
 * 封装搜索条件方法
 * @param opt
 * search:搜索事件
 * done：表单加载完回调事件
 */
_initSearch = function (opt) {
    layui.use(['form', 'laydate', 'formSelects'], function () {
        var form = layui.form;
        var laydate = layui.laydate;
        var formSelects = layui.formSelects;
        opt.elem = opt.elem || ''; //elem: '#layui_form_condition' //指定搜索框表单的元素选择器（推荐id选择器）
        opt.filter = opt.filter || '';//指定的lay-filter
        opt.conds = opt.conds || [];//condition的列表
        if (isNotEmpty(opt.elem)) {
            // 生成筛选条件
            var conditionArr = []; //用于存储每个搜索条件的html字符串
            var timeArr = []; //用于存储日期时间的集合
            var valueMap = {}; //获取初始化值
            $.each(opt.conds, function (i, item) {
                if (item == undefined || item == null) {
                    return true;
                }
                var conditionStr = "";
                item.field = item.field || ''; //必填，字段名字，用作于搜索条件返回的key
                item.title = item.title || ''; //搜索框名称
                item.placeholder = item.placeholder || ''; //搜索框提示
                item.type = item.type || 'input'; //搜索框类型，默认是input，还有select、time（时间）、radio
                item.templet = item.templet || ''; //搜索框条件模板
                item.data = item.data || []; //数据，只有select才有，格式{name:'选项名字',value:'选项值'}
                item.value = item.value || ''; //必填，字段名字，用作于搜索条件返回的key
                item.readonly = item.readonly || false;//控制input框readonly
                if (isNotEmpty(item.value)) {
                    if (item.type === "date_range" || item.type === "datetime_range" || item.type === "time_range") {
                        //会有2个值
                        item.value1 = item.value1 || ''; //必填，字段名字，用作于搜索条件返回的key
                        valueMap[item.field + '_begin'] = item.value; //存初始化值
                        valueMap[item.field + '_end'] = item.value1; //存初始化值
                    } else {
                        valueMap[item.field] = item.value; //存初始化值
                    }
                }
                if (item.type === "radio"
                    || item.type === "date_range" || item.type === "datetime_range" || item.type === "time_range") {
                    if (item.title !== '' && item.title !== null) {
                        conditionStr +=
                            '<div class="layui-inline" style="height: 30px;">' +
                            '   <label class="layui-form-label">' + item.title + '</label>' +
                            '   <div class="layui-input-block">';
                    } else {
                        conditionStr +=
                            '<div class="layui-inline dis_radio" style="height: 25px">' +
                            '   <div class="layui-input-block">';
                    }
                } else {
                    conditionStr +=
                        '<div class="layui-inline" style="width:300px;">' +
                        '   <label class="layui-form-label">' + item.title + '</label>' +
                        '   <div class="layui-input-inline">';
                }
                if (isNotEmpty(item.templet)) {
                    //如果有模板，直接填充模板
                    conditionStr += item.templet;
                } else {
                    if (item.type === "input") {
                        if (isEmpty(item.placeholder)) {
                            item.placeholder = '';
                        }
                        if (item.readonly) {
                            conditionStr += '<input type="text" name="' + item.field + '" placeholder="' + item.placeholder + '" ' +
                                'autocomplete="off" class="layui-input" readonly>';
                        } else {
                            conditionStr += '<input type="text" name="' + item.field + '" placeholder="' + item.placeholder + '" ' +
                                'autocomplete="off" class="layui-input" >';
                        }
                    } else if (item.type === "select") {
                        conditionStr += '<select name="' + item.field + '" lay-filter="' + item.field + '"' + (item.search ? ' lay-search' : '') + '>';
                        $.each(item.data, function (i1, item1) {
                            if (item1 == undefined || item1 == null) {
                                return true;
                            }
                            conditionStr += '<option value="' + item1.value + '">' + item1.name + '</option>';
                        });
                        conditionStr += '</select>';
                    } else if (item.type === "date" || item.type === "datetime" || item.type === "time" || item.type === "month" || item.type === "year") {
                        item.format = item.format || '';
                        if (isEmpty(item.placeholder)) {
                            if (item.type === "date") {
                                item.placeholder = 'yyyy-MM-dd';
                            } else if (item.type === "datetime") {
                                item.placeholder = 'yyyy-MM-dd HH:mm:ss';
                            } else if (item.type === "time") {
                                item.placeholder = 'HH:mm:ss';
                            } else if (item.type === "month") {
                                item.placeholder = 'yyyy-MM';
                            } else if (item.type === "year") {
                                item.placeholder = 'yyyy';
                            }
                            if (isNotEmpty(item.format)) {
                                item.placeholder = item.format;
                            }
                        }
                        conditionStr += '<input type="text" name="' + item.field + '" placeholder="' + item.placeholder + '" ' +
                            'id="' + item.field + '" class="layui-input">';
                        var timeitem = {
                            elem: '#' + item.field,
                            type: item.type
                        };
                        if (isNotEmpty(item.format)) {
                            timeitem.format = item.format;
                        }
                        if (typeof item.done === 'function') {
                            timeitem.done = item.done;
                        }
                        timeArr.push(timeitem);
                    } else if (item.type === "date_range" || item.type === "datetime_range" || item.type === "time_range") {
                        //时间范围选择
                        item.format = item.format || '';
                        if (isEmpty(item.placeholder)) {
                            if (item.type === "date_range") {
                                item.placeholder = 'yyyy-MM-dd';
                            } else if (item.type === "datetime_range") {
                                item.placeholder = 'yyyy-MM-dd HH:mm:ss';
                            } else if (item.type === "time_range") {
                                item.placeholder = 'HH:mm:ss';
                            }
                            if (isNotEmpty(item.format)) {
                                item.placeholder = item.format;
                            }
                        }
                        //开始时间
                        conditionStr += '<div class="layui-input-inline">' +
                            '<input type="text" name="' + item.field + '_begin' + '" placeholder="' + item.placeholder + '" ' +
                            'id="' + item.field + '_begin' + '" class="layui-input">';
                        conditionStr += '</div>';
                        var time_begin = {
                            elem: '#' + item.field + '_begin',
                            type: item.type.replace("_range", "")
                        };
                        if (isNotEmpty(item.format)) {
                            time_begin.format = item.format;
                        }
                        timeArr.push(time_begin);
                        //结束时间
                        conditionStr += '<div class="layui-form-mid layui-word-aux"> - </div>';
                        conditionStr += '<div class="layui-input-inline">' +
                            '<input type="text" name="' + item.field + '_end' + '" placeholder="' + item.placeholder + '" ' +
                            'id="' + item.field + '_end' + '" class="layui-input">';
                        conditionStr += '</div>';
                        var time_end = {
                            elem: '#' + item.field + '_end',
                            type: item.type.replace("_range", "")
                        };
                        if (isNotEmpty(item.format)) {
                            time_end.format = item.format;
                        }
                        timeArr.push(time_end);
                    } else if (item.type === "checkbox") {
                        conditionStr += '<select name="' + item.field + '" xm-select="' + item.field + '" xm-select-height="36px">';
                        $.each(item.data, function (i1, item1) {
                            if (item1 == undefined || item1 == null) {
                                return true;
                            }
                            conditionStr += '<option value="' + item1.value + '">' + item1.name + '</option>';
                        });
                        conditionStr += '</select>';
                    } else if (item.type === "radio") {
                        $.each(item.data, function (i1, item1) {
                            if (item1 == undefined || item1 == null) {
                                return true;
                            }
                            conditionStr += '<input type="radio" name="' + item.field + '" value="' + item1.value + '" title="' + item1.name + '" lay-filter="' + item.field + '">';
                        });
                    }
                }
                conditionStr += '</div>' +
                    '</div>';
                conditionArr.push(conditionStr);
            });

            //搜索表单内容拼接
            var htmlStr = "";
            // 搜索表单 - 筛选条件
            htmlStr += '<div class="layui-form-item condition-box">';
            htmlStr += (conditionArr).join("");
            htmlStr += '</div>';
            // 搜索表单 - 搜索按钮
            htmlStr += '<div class="layui-form-item btn-box" style="margin-bottom: 0px;">';
            htmlStr +=
                '<div class="layui-inline">' +
                '   <button class="layui-btn layui-btn-dis-xs layui-btn-dis-seach " lay-submit lay-filter="' + opt.filter + '_search">' +
                '   搜 索' +
                '   </button>' +
                '   <a href="javascript:;" class="pl-10 condition-toogle">' +
                '       <cite></cite><span class="layui-icon condition-icon"></span>' +
                '   </a>' +
                '</div>';
            htmlStr += '</div>';
            $(opt.elem).html(htmlStr);

            // 切换筛选条件是否显示事件
            $(opt.elem).on("click", ".condition-toogle", function () {
                if ($(opt.elem).hasClass("more-condition")) {
                    $(opt.elem).removeClass("more-condition");
                } else {
                    $(opt.elem).addClass("more-condition");
                }
            });
        }
        //完成html载入，可进行一些插件方法的初始化事件
        typeof opt.done === 'function' && opt.done(opt.filter, valueMap);
        //常规用法,填充时间
        $.each(timeArr, function (i, item) {
            laydate.render(item);
        });

        //以下方式则重新渲染所有的已存在多选
        formSelects.render();
        //dropdown.render();
        //刷新表单
        form.render();
        //表单初始赋值
        form.val(opt.filter, valueMap);
        //监听搜索
        form.on('submit(' + opt.filter + '_search)', function (data) {
            //返回信息
            requestParam[opt.filter] = data.field;
            typeof opt.search === 'function' && opt.search(data);
        });

        // 定义“重设筛选条件中搜索条件区域宽度”方法
        var onSearchForResize = function () {
            // 计算搜索表单宽度
            var boxWidth = $(opt.elem).width() || $(window).width();
            var conditionItems = $(opt.elem).find(".condition-box > div"); // 搜索条件元素数组
            var totalCondition = conditionItems.length; // 总的搜索条件数
            var maxCondition = 0; // 最大显示搜索条件数
            var conditionBoxWidth = 0; // 搜索条件区域宽度
            conditionItems.each(function(index, item) {
                var itemWidth = $(item).width();
                if ((boxWidth - 220) > (conditionBoxWidth + itemWidth)) {
                    conditionBoxWidth += itemWidth;
                    maxCondition += 1;
                } else {
                    return false;
                }
            });

            if (totalCondition == 1 || maxCondition == totalCondition) {
                // 搜索表单可以完整显示时，隐藏“更多筛选条件/收起筛选条件”
                $(opt.elem).find(".condition-box").width("auto");
                $(opt.elem).removeClass("part-condition");
            } else {
                // 搜索表单不可以完整显示时，显示“更多筛选条件/收起筛选条件”
                $(opt.elem).addClass("part-condition");
                $(opt.elem).find(".condition-box").width(conditionBoxWidth);

                // 按筛选条件区域宽度，设定“更多筛选条件”时需要隐藏哪些条件
                $(opt.elem).find(".condition-box .layui-inline").removeClass("more-item");
                $(opt.elem).find(".condition-box .layui-inline:gt(" + (maxCondition - 1) + ")").addClass("more-item");
            }
        };
        // 搜索表单宽度改变时，重设筛选条件中搜索条件区域宽度
        $(opt.elem).resize(onSearchForResize);
        // 重设筛选条件中搜索条件区域宽度
        onSearchForResize();
    });
};

/**
 * 重新封装layui的table
 * @param opt
 * 目前重新定义,具体看layui的文档
 * render（填充table），
 * sort:（监听排序切换），
 * tool:（监听工具条），
 * edit:（监听单元格编辑），
 * checkbox:（监听复选框选择），
 */
_layuiTable = function (opt) {
    layui.use(['table'], function () {
        var table = layui.table;
        var laytpl = layui.laytpl;
        opt.elem = opt.elem || ''; //elem: '#layui_table' 必填，指定搜索框表单的元素选择器（推荐id选择器）
        opt.filter = opt.filter || '';//必填，指定的lay-filter的名字
        opt.render = opt.render || {};//执行渲染的参数
        opt.render.cols = opt.render.cols || [];
        var cols = [];
        $.each(opt.render.cols[0], function (i, item) {
            var append = true;
            var align = "left";
            if (isNotEmpty(item.align)) {
                align = item.align;
            }
            var style = "";
            if (isNotEmpty(item.style)) {
                style = item.style;
            }
            item.align = "center"; //表头全部居中
            item.style = "text-align:" + align + ";" + style;//内容自定义
            //操作栏设定
            if (!item.width && isNotEmpty(item.toolbar)) {
                var btnObj;
                laytpl($(item.toolbar).html()).render((item.defaultData || {}), function (string) {
                    //如果工具栏为空，则不显示该栏位
                    if (isEmpty(string)) {
                        append = false;
                    } else {
                        btnObj = $("<div>" + string + "</div>");
                    }
                });
                //动态设定按钮长度
                if (append) {
                    if (btnObj != null && btnObj != undefined) {
                        var btnWidth = 0; //按钮数量，默认一个按钮给定40宽度
                        btnObj.find("a").each(function () {
                            var obj = $(this);
                            if (isNotEmpty(obj)) {
                                var text = $(this).html();
                                if (isNotEmpty(text)) {
                                    btnWidth += text.length * 15 + 10 + 8;
                                }
                            }
                        });
                        item.width = btnWidth + 40;
                    }
                }
            }
            if (append) {
                cols.push(item);
            }
        });
        opt.render.cols[0] = cols;
        //执行渲染table
        var done = opt.render.done;
        delete opt.render.done;
        table.render($.extend(true, {
            elem: opt.elem //指定原始表格元素选择器（推荐id选择器）
            , page: true //开启分页
            , limit: 20 //每页显示的条数（默认：20）
            , limits: [10, 20, 50, 100, 150, 200, 250, 300]
            , method: "POST"  //默认是post
            , autoSort: false //若为 false，则需自主排序，通常由服务端直接返回排序好的数据。
            // ,contentType: 'application/json;charset=utf-8' //设置请求头信息
            , page: {theme: '#72C0BB'}
            , request: {
                pageName: 'page.pageNum' //改变页码的参数名称，默认：page
                , limitName: 'page.pageSize' //改变每页数据量的参数名，默认：limit
            }
            , response: {
                statusName: 'rtnCode' //数据状态的字段名称，默认：code
                , statusCode: 0 //成功的状态码，默认：0
                , msgName: 'msg' //状态信息的字段名称，默认：msg
                , countName: 'total' //数据总数的字段名称，默认：count
                , dataName: 'bizData' //数据列表的字段名称，默认：data
            }
            , done: function (res, curr, count) {
                //如果是异步请求数据方式，res即为你接口返回的信息。
                if (res.rtnCode == RtnCode.NO_LOIN.code) {
                    noLoginHandle();
                }
                typeof done === 'function' && done(res, curr, count);
            }, error: function (e, table, css) {
                var res = e.responseJSON || {};
                var status = e.status;
                if (res.rtnCode == RtnCode.NO_LOIN.code) {
                    noLoginHandle();
                } else {
                    var errorMsg = getRequestErrorMsg(res, status);
                    table.errorView('数据接口请求异常：' + errorMsg);
                    table.renderForm();
                    table.setColsWidth();
                }
            }
        }, opt.render));
        //监听排序切换
        table.on('sort(' + opt.filter + ')', function (obj) {
            if (opt.sort == undefined || !(typeof opt.sort === 'function')) {
                //获取自定义的中的sort字段
                var field = obj.field;
                opt.render.cols = opt.render.cols || [];
                if (opt.render.cols.length > 0) {
                    $.each(opt.render.cols[0], function (i, item) {
                        if ((isNotEmpty(item) && isNotEmpty(item.field) && item.field == field)) {
                            if (isNotEmpty(item.sortField)) {
                                field = item.sortField;
                                return true;
                            }
                        }
                    });
                }
                var orderBy = "";
                if (isNotEmpty(field) && isNotEmpty(obj.type)) {
                    orderBy = field + " " + obj.type //排序字段
                }
                //记录请求参数
                requestParam[opt.filter] = { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                    'page.orderBy': orderBy //排序字段
                };
                table.reload(opt.filter, {
                    initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
                    , where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                        'page.orderBy': orderBy //排序字段
                    }
                });
                typeof opt.sortOrder === 'function' && opt.sortOrder(orderBy);
            } else {
                typeof opt.sort === 'function' && opt.sort(obj, opt.filter);
            }
        });
        //监听工具条
        table.on('tool(' + opt.filter + ')', function (obj) {
            typeof opt.tool === 'function' && opt.tool(obj, opt.filter);
        });
        //监听单元格编辑
        table.on('edit(' + opt.filter + ')', function (obj) {
            typeof opt.edit === 'function' && opt.edit(obj, opt.filter);
        });
        //监听复选框选择
        table.on('checkbox(' + opt.filter + ')', function (obj) {
            typeof opt.checkbox === 'function' && opt.checkbox(obj, opt.filter);
        });
        // table.on('select('+opt.filter+')', function(obj){
        //     typeof opt.select === 'function' && opt.select(obj,opt.filter);
        // });
    });
};

/**
 * 重新封装layer的弹框
 * @param opt
 */
_layerOpen = function (opt) {
    var layerOpen;
    layui.use(['layer'], function () {
        var layer = layui.layer;
        var targetWindow = window;
        if (opt.openInParent && parent.layer) {
            //在父窗口打开
            layer = parent.layer;
            targetWindow = parent.window;
        }
        opt.url = opt.url || ''; //自定义的弹窗的url
        opt.width = opt.width || ''; //自定义的弹窗的width宽度，会自动判断是否超过当前页面
        opt.height = opt.height || ''; //自定义的弹窗的height高度，会自动判断是否超过当前页面
        //弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看
        opt.readonly = (opt.readonly === undefined || opt.readonly === null) ? false : opt.readonly;
        var win_width = $(targetWindow).width();
        var win_height = $(targetWindow).height();
        var w = win_width - 50;
        var h = win_height - 20;
        if (isNotEmpty(opt.width) && (opt.width < win_width)) {
            w = opt.width;
        }
        if (isNotEmpty(opt.height) && (opt.height < win_height)) {
            h = opt.height;
        }
        if (opt.readonly) {
            opt.btn = ["确定"];
            opt.done = function (index, iframeWin) {
                layer.close(index);
            };

            // 弹窗只读下，自定义按钮和回调方法
            opt.btnFlag = (opt.btnFlag === undefined || opt.btnFlag === null) ? '' : opt.btnFlag;
            // 自定义按钮的标记值
            var btnFlagList = [
                'approvalAndReject', // 采购申请单核准和退回
                'seeReasonAndHandle', // 采购申请单退回原因查看和处理
                'approvalAndDetail' // 采购订单审批和详情
            ];
            if ($.inArray(opt.btnFlag, btnFlagList) >= 0) {
                if (opt.btnType === 0) {
                    opt.btn = opt.btnArr;
                    opt.yes;
                    opt.btn2;
                }
            }
        }
        var yes = opt.yes;
        var url = opt.url;
        var setting = {
            type: 2,
            area: [w + 'px', h + 'px'],
            fix: true, //固定
            maxmin: true,//最大化
            content: url,//url
            yes: function (index, layero) {
                if (isEmpty(opt.type) || opt.type == '2') {
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = targetWindow[layero.find('iframe')[0]['name']];//得到iframe页的窗口对象，执行iframe页的方法：
                    typeof opt.done === 'function' && opt.done(index, iframeWin, layer);
                } else {
                    typeof opt.done === 'function' && opt.done(index, layer);
                }
                typeof yes === 'function' && yes(index, layero, layer);
            }
        };
        opt.closeBtn = (opt.closeBtn === undefined || opt.closeBtn === null) ? 1 : opt.closeBtn;
        if (opt.closeBtn === 1) {
            setting.btn = ["确定", "取消"];
        }
        delete opt.width;
        delete opt.height;
        delete opt.url;
        delete opt.yes;
        delete opt.openInParent;
        layerOpen = layer.open($.extend(setting, opt));
    });
    return layerOpen;
};
/**
 * 重新封装upload组件
 */
_layuiUploadImg = function (opt) {
    var defaultOpt = {
        onAddItem: function (itemData) {
            var target = $(this.showFileDiv);
            var withDelete = this.withDelete;
            var fileTitle = itemData.fileTitle;
            var filePath = itemData.filePath;
            // 1. 图片对象
            var imgObj = '<img src="' + filePath + '" alt="' + fileTitle + '" title="' + fileTitle + '">';
            // 2. 删除按钮对象
            var deleteObj = withDelete ? '<i class="layui-icon icon-delete">&#x1006;</i>' : "";
            // 3. 图片项 = 图片对象 + 删除按钮对象
            var imgItemObj = $("<div>").addClass("layui-upload-item").addClass("with-img").data("itemData", itemData)
                .append(imgObj).append(deleteObj);
            target.append(imgItemObj);
            imgItemObj.data("itemData", itemData);
        },
        onAddItemEvent: function () {
            var target = $(this.showFileDiv);
            var withDelete = this.withDelete;
            var deleteItemCallack = this.deleteItemCallack;

            // 1. 添加图片对象点击事件
            target.on("click", ".layui-upload-item img", function () {
                var photoData = [];
                var imgObjs = target.find(".layui-upload-item img");
                var start = imgObjs.index(this);
                $.each(imgObjs, function (index, item) {
                    var imgObj = $(item);
                    photoData.push({src: imgObj.attr("src"), alt: imgObj.attr("alt")});
                });
                parent.imagesPreview(photoData, start);
            });

            // 2. 添加删除按钮对象点击事件
            if (withDelete) {
                target.on("click", ".layui-upload-item .icon-delete", function () {
                    var imgItemObj = $(this).closest('.layui-upload-item');
                    var deleteItemData = imgItemObj.data("itemData");
                    // 删除回调
                    typeof deleteItemCallack === 'function' && deleteItemCallack.call(this, deleteItemData, imgItemObj);
                });
            }
        }
    };
    opt = $.extend({}, defaultOpt, opt);
    return _layuiUploadFile(opt);
};

/**
 * 重新封装upload组件
 * fileDatas: [
 *     {fileId: "1", fileTitle: "文件1", filePath: "文件路径1"},
 *     {fileId: "2", fileTitle: "文件2", filePath: "文件路径2"},
 *     ...
 * ]
 */
_layuiUploadFile = function (opt) {
    var defaultOpt = {
        showFileDiv: "", // 自定义字段，可选，用来显示上传后的文件的div
        fileDatas: [], // 文件数据列表
        withDelete: true, // 是否可删除文件（true/false）

        /**
         * 添加文件项显示
         * @param itemData 文件数据
         */
        onAddItem: function (itemData) {
            var target = $(this.showFileDiv);
            var withDelete = this.withDelete;
            var fileTitle = itemData.fileTitle;
            var filePath = itemData.filePath;
            // 1. 文件对象
            var fileObj = '<a href="' + filePath + '" title="' + fileTitle + '" target="_blank">' + fileTitle + '</a>';
            // 2. 删除按钮对象
            var deleteObj = withDelete ? '<i class="layui-icon icon-delete">&#x1006;</i>' : "";
            // 3. 文件项 = 图片对象 + 删除按钮对象
            var fileItemObj = $("<div>").addClass("layui-upload-item").addClass("with-file").data("itemData", itemData)
                .append(fileObj).append(deleteObj);
            target.append(fileItemObj);
            fileItemObj.data("itemData", itemData);
        },

        /**
         * 添加文件项事件
         */
        onAddItemEvent: function () {
            var target = $(this.showFileDiv);
            var withDelete = this.withDelete;
            var deleteItemCallack = this.deleteItemCallack;

            // 1. 添加删除按钮对象点击事件
            if (withDelete) {
                target.on("click", ".layui-upload-item .icon-delete", function () {
                    var fileItemObj = $(this).closest('.layui-upload-item');
                    var deleteItemData = fileItemObj.data("itemData");
                    // 删除回调
                    typeof deleteItemCallack === 'function' && deleteItemCallack.call(this, deleteItemData, fileItemObj);
                });
            }
        },

        /**
         * 删除文件项回调事件
         * @param deleteFileId 删除的文件数据
         * @param deleteFileId 删除的文件元素
         */
        deleteItemCallack: function (deleteItemData, deleteItemObj) {
        },

        /**
         * 获取当前已有文件项数据
         */
        getItemsData: function () {
            var itemsData = [];
            var target = $(this.showFileDiv);
            $.each(target.find(".layui-upload-item"), function (index, item) {
                var fileItemData = $(item).data("itemData");
                itemsData.push(fileItemData);
            });
            return itemsData;
        },

        /**
         * 获取当前已有文件项数量
         */
        getItemsCount: function () {
            var target = $(this.showFileDiv);
            return target.find(".layui-upload-item").length;
        },

        /**
         * 文件选择回调
         * @param obj
         * @param uploader
         * @returns {boolean} false：中断上传
         */
        choose: function (obj, uploader) {
            var maxFileNum = parseInt(this.number) || -1;
            var currentCount = this.getItemsCount();
            if (maxFileNum > 0 && currentCount + uploader.fileLength > maxFileNum) {
                warningToast("最多只能上传的数量为：" + maxFileNum);
                return false;
            }
        }
    };
    opt = $.extend({}, defaultOpt, opt);

    // 显示文件列表
    if (isNotEmpty(opt.showFileDiv)) {
        if (opt.fileDatas && opt.fileDatas.length > 0) {
            $.each(opt.fileDatas, function (index, item) {
                opt.onAddItem(item);
            });
        }
        opt.onAddItemEvent();
    }

    // 上传控件设置
    var uploadObj;
    layui.use(['upload'], function () {
        // loading弹窗
        var loadLayer = null;
        var showLoading = function () {
            loadLayer = layer.msg("上传中...", {icon: 16, shade: 0, time: 1000000});
        };
        var hideLoading = function () {
            if (loadLayer) {
                layer.close(loadLayer);
            }
        };

        var upload = layui.upload;
        var uploadChoose = opt.choose;
        var uploadDone = opt.done;
        var uploadBefore = opt.before;
        var uploadError = opt.error;
        delete opt.choose;
        delete opt.done;
        delete opt.before;
        delete opt.error;
        uploadObj = upload.render($.extend({
            choose: function (obj, uploader) {
                if (typeof uploadChoose === 'function') {
                    return uploadChoose.call(this, obj, uploader);
                }
            },
            before: function (obj) {
                showLoading();
                typeof uploadBefore === 'function' && uploadBefore.call(this, obj);
            },
            progress: function (percent, item, e) {
                showLoading();
            },
            error: function (index, upload) {
                typeof uploadError === 'function' && uploadError.call(this, index, upload);
            },
            done: function (res, index, upload) {
                hideLoading();
                //只有 response 的 code 一切正常才执行 done
                if (res.rtnCode == RtnCode.OK.code) {
                    if (isNotEmpty(opt.showFileDiv) && res.bizData) {
                        opt.onAddItem(res.bizData);
                    }
                    typeof uploadDone === 'function' && uploadDone.call(this, res, index, upload);
                } else {
                    // 请求错误处理
                    requestErrorHandle(res);
                }
            },
            allDone: function (result) {
                hideLoading();
            }
        }, opt));
    });
    return uploadObj;
};

/**
 * 重新封装upload组件
 * @param opt
 */
_layuiUpload = function (opt) {
    var uploadObj;
    layui.use(['upload'], function () {
        opt.showImgDiv = opt.showImgDiv || ''; //自定义字段，可选，用来显示上传后的图片的div
        opt.showHttpPath = opt.showHttpPath || ''; //自定义字段，可选，用于拼接显示图片的http映射路径，比如http:192.168.1.126:8081
        opt.showImgSrc = opt.showImgSrc || ''; //自定义字段，可选，在div显示图片的src，通常用于编辑后的回显，相对路径，比如‘/upload/XXX/XXX.jpg’
        //显示图片
        var showImage = function (url) {
            if (opt.multiple != undefined && opt.multiple != null && opt.multiple == true) {
                //多张图片上传
                if (url.indexOf(",") > -1) {
                    var urlArr = url.split(",");
                    $.each(urlArr, function (i, item) {
                        var imgId = new Date().getTime() + Math.floor(Math.random() * 9000 + 1000);
                        $(opt.showImgDiv).append('<img class="layui-upload-img"' +
                            'src="' + opt.showHttpPath + item + '" onclick="parent.imagesOpen(\'' + opt.showHttpPath + item + '\')">' +
                            '<i class="layui-icon layui-upload-close" id="' + imgId + '" value="' + item + '">&#x1006;</i>');
                        //删除图片
                        $('#' + imgId).on('click', function () {
                            var value = $(this).attr("value"); //获取值
                            $(this).prev().remove();
                            $(this).remove();
                            var urls = $(opt.elem).prev().val();
                            var arr = urls.split(",");
                            var data = [];
                            $.each(arr, function (i, item) {
                                if (item != value && isNotEmpty(item)) {
                                    data.push(item);
                                }
                            });
                            $(opt.elem).prev().val(data.join(","));
                        });
                    });
                } else {
                    var imgId = new Date().getTime() + Math.floor(Math.random() * 9000 + 1000);
                    $(opt.showImgDiv).append('<img class="layui-upload-img"' +
                        'src="' + opt.showHttpPath + url + '" onclick="parent.imagesOpen(\'' + opt.showHttpPath + url + '\')">' +
                        '<i class="layui-icon layui-upload-close" id="' + imgId + '" value="' + url + '">&#x1006;</i>');
                    //删除图片
                    $('#' + imgId).on('click', function () {
                        var value = $(this).attr("value"); //获取值
                        $(this).prev().remove();
                        $(this).remove();
                        var urls = $(opt.elem).prev().val();
                        var arr = urls.split(",");
                        var data = [];
                        $.each(arr, function (i, item) {
                            if (item != value && isNotEmpty(item)) {
                                data.push(item);
                            }
                        });
                        $(opt.elem).prev().val(data.join(","));
                    });
                }
                //赋值
                var urls = $(opt.elem).prev().val();
                urls = urls.replaceAll(url, "");
                urls = urls.replaceAll(",,", ",");
                if (isNotEmpty(urls)) {
                    $(opt.elem).prev().val(urls + "," + url);
                } else {
                    $(opt.elem).prev().val(url);
                }
            } else {
                //单张图片上传，依然用以前的逻辑处理
                $(opt.showImgDiv).html('<img class="layui-upload-img"' +
                    'src="' + opt.showHttpPath + url + '" onclick="parent.imagesOpen(\'' + opt.showHttpPath + url + '\')">' +
                    '<i class="layui-icon layui-upload-close">&#x1006;</i>');
                //赋值
                $(opt.elem).prev().val(url);
                //删除图片
                $(opt.showImgDiv + ' .layui-upload-close').on('click', function () {
                    $(opt.elem).prev().val("");
                    $(opt.showImgDiv).html("");
                });
            }
        };
        var loadlayer = null;
        var showLoading = function () {
            loadlayer = layer.msg("上传中...", {icon: 16, shade: 0, time: 1000000});
        };
        var hideLoading = function () {
            if (loadlayer) {
                layer.close(loadlayer);
            }
        };
        var done = opt.done;
        var before = opt.before;
        var error = opt.error;
        delete opt.done;
        delete opt.before;
        delete opt.error;
        var upload = layui.upload;
        uploadObj = upload.render($.extend({
            before: function (obj) {
                showLoading();
                typeof before === 'function' && before.call(this, obj);
            },
            error: function (index, upload) {
                hideLoading();
                typeof error === 'function' && error.call(this, index, upload);
            },
            done: function (res, index, upload) {
                hideLoading();
                //只有 response 的 code 一切正常才执行 done
                if (res.rtnCode == RtnCode.OK.code) {
                    //正常返回
                    //设置多文件上传的数量 by yupeng
                    var strA = $(opt.elem).prev().val();
                    var str = strA.split(",");
                    if (str.length == 5) {
                        warningToast("最多上传5张图片", 1000);
                    } else {
                        if (isNotEmpty(opt.showImgDiv) && isNotEmpty(res.bizData)) {
                            showImage(res.bizData.path);
                        }
                    }
                    typeof done === 'function' && done.call(this, res, index, upload);
                } else {
                    // 请求错误处理
                    requestErrorHandle(res);
                }
            }
        }, opt));
        if (isNotEmpty(opt.showImgDiv) && isNotEmpty(opt.showImgSrc)) {
            showImage(opt.showImgSrc);
        }
    });
    return uploadObj;
};

/**
 * 请求错误处理
 * @param res
 * @param status
 */
function requestErrorHandle(res, status) {
    if (res && res.rtnCode == RtnCode.NO_LOIN.code) {
        // 用户未登陆
        noLoginHandle();
    } else if (res && res.rtnCode == RtnCode.FORM_VALID_ERROR.code) {
        var errorMsg = getRequestErrorMsg(res, status);
        warningToast(errorMsg);
    } else {
        var errorMsg = getRequestErrorMsg(res, status);
        errorToast(errorMsg);
    }
}

/**
 * 获取请求错误信息
 * @param res
 * @returns {string}
 */
function getRequestErrorMsg(res, status) {
    var errorMsg;
    if (res && res.rtnCode == RtnCode.FORM_VALID_ERROR.code) {
        // 表单验证错误
        errorMsg = [(res.msg || '表单验证错误') + "："].concat(res.bizData).join('<br/>');
    } else if (status) {
        if (HttpStatusMsg[status.toString()]) {
            // 已知Http状态错误
            errorMsg = HttpStatusMsg[status.toString()];
        } else {
            // 未知错误
            errorMsg = '未知错误(' + status + ')';
        }
    } else {
        errorMsg = (res.msg || '返回状态码异常');
    }
    return errorMsg;
}

/**
 * 未登录处理
 */
function noLoginHandle() {
    try {
        layer.confirm('用户未登录或登录超时。请重新登录，谢谢', {
            btn: ['确定'] // 按钮
        }, function () {
            clearStorage();
            if (window.top.location.href != location.href) {
                window.top.location.href = $.config.server + "/logout.do";
            } else {
                window.location.href = $.config.server + "/logout.do";
            }
        });
    } catch (err) {
    }
}

/**
 * 获取年份选项（上下50年）
 * @returns {Array}
 */
function getYearOptions() {
    var myDate = new Date();
    var startYear = myDate.getFullYear() - 50; // 起始年份
    var endYear = myDate.getFullYear() + 50; // 结束年份

    var options = [];
    for (var i = startYear; i <= endYear; i++) {
        options.push({name: i + "年", value: i});
    }
    return options;
}

/**
 * 获取年份选项（上下50年）
 * @returns {Array}
 */
function getMonthOptions() {
    var options = [];
    for (var i = 1; i <= 12; i++) {
        var monthDesc = ("0" + i);
        monthDesc = monthDesc.substr(monthDesc.length - 2, 2);
        options.push({name: monthDesc + "月", value: i});
    }
    return options;
}

/**
 * 获取年份选项（上下50年）
 * @returns {Array}
 */
function getQuarterOptions() {
    var options = [];
    for (var i = 1; i <= 4; i++) {
        options.push({name: "第" + i + "季度", value: i});
    }
    return options;
}

/**
 * 判断是否为数字
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; // 非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}


/**
 * 计算年龄
 * @param serverTime
 * @param userBirthday
 * @returns {number}
 */
function getUserAge(serverTime, userBirthday) {
    var thisYear = serverTime.getFullYear();
    var bDate = new Date(userBirthday);
    var brith = bDate.getFullYear();
    var age = (thisYear - brith);
    return age;
}

function getAge(dateTime) {
    var aDate = new Date();
    var thisYear = aDate.getFullYear();
    var bDate = new Date(dateTime);
    var brith = bDate.getFullYear();
    var age = (thisYear - brith);
    return age;
}

/**
 * 获取uuid
 * @returns {string}
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 数字转换为星期
 */
function numToWeek(str) {
    var arr = str.split(',');
    var result = [];
    var resultStr = '';
    arr.forEach(function (item, i) {
        if (item === '1') {
            result.push('周一');
        } else if (item === '2') {
            result.push('周二');
        } else if (item === '3') {
            result.push('周三');
        } else if (item === '4') {
            result.push('周四');
        } else if (item === '5') {
            result.push('周五');
        } else if (item === '6') {
            result.push('周六');
        } else if (item === '7') {
            result.push('周日');
        }
    })
    if (result.length > 0) {
        resultStr = result.join('、');
    }
    return resultStr;
}

/*
获取富文本编辑框里面的内容
参数1 layedit=layui.layedit;  参数2 使用build方法创建富文本编辑器时的返回值
返回值：富文本编辑框的内容
 */
function getLayEditValue(layedit, returnLayedit) {
    var temp = layedit.getContent(returnLayedit)
    return temp;
}

/**
 * 获取下个月的日期
 * @param date
 * @returns {string}
 * 2020-09-29 --> 2020-10-29
 */
function getNextMonth(date) {
    var util = layui.util;
    var dateTime = util.toDateString(date, 'yyyy-MM-dd');
    var arr = dateTime.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var nextYear = year;
    var nextMonth = parseInt(month) + 1;
    if (nextMonth == 13) {
        nextYear = parseInt(nextYear) + 1;
        nextMonth = 1;
    }
    var nextDay = day;
    var nextDays = new Date(nextYear, nextMonth, 0);   //下个月的天数
    nextDays = nextDays.getDate();
    if (nextDay > nextDays) {
        nextDay = nextDays;
    }
    if (nextMonth < 10) {
        nextMonth = '0' + nextMonth;
    }

    var t2 = nextYear + '-' + nextMonth + '-' + nextDay;
    return t2;
}

/**
 * 自定义监听事件监听新消息
 * @type {CustomEvent<any>}
 */
var newMessage = new CustomEvent('newMessage', {
    message: null
});

/**
 * 自定义监听事件监听推送状态修改
 * @type {CustomEvent<any>}
 */
var pushStatusEvent = new CustomEvent('pushStatusEvent', {
    message: null
});

/**
 * 字符串折行
 * @param provideNumber
 * @returns {*}
 */
function stringWrap(str, provideNumber) {
    provideNumber = provideNumber || 4;// 每行能显示的字的个数

    var newStrName = "";// 最终拼接成的字符串
    var strLength = str.length;// 实际标签的个数
    var rowNumber = Math.ceil(strLength / provideNumber);// 换行的话，需要显示几行，向上取整
    /**
     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
     */
    // 条件等同于rowNumber>1
    if (strLength > provideNumber) {
        /** 循环每一行,p表示行 */
        for (var p = 0; p < rowNumber; p++) {
            var tempStr = "";// 表示每一次截取的字符串
            var start = p * provideNumber;// 开始截取的位置
            var end = start + provideNumber;// 结束截取的位置
            // 此处特殊处理最后一行的索引值
            if (p == rowNumber - 1) {
                // 最后一次不换行
                tempStr = str.substring(start, strLength);
            } else {
                // 每一次拼接字符串并换行
                tempStr = str.substring(start, end) + "\n";
            }
            newStrName += tempStr;// 最终拼成的字符串
        }

    } else {
        // 将旧标签的值赋给新标签
        newStrName = str;
    }
    //将最终的字符串返回
    return newStrName;
}

/**
 * 字段必填校验
 * @param value
 * @param fieldName
 * @returns {string}
 */
function fieldRequired(value, fieldName) {
    fieldName = fieldName || "";
    if (isEmpty(value) || isEmpty(value.trim())) {
        return fieldName + "不能为空";
    }
}

/**
 * 判断字段值是否在范围内
 * @param value
 * @param config {
 *     fieldName: "", // 字段名
 *     minValue: 0,  // 最小值
 *     maxValue: 0, // 最大值
 *     isInteger: true, // 是否是整数
 * }
 * @returns {string}
 */
function fieldNotInRange(value, config) {
    var fieldName = config.fieldName || "";
    var minValue = Number(config.minValue) || 0;
    var maxValue = Number(config.maxValue) || 0;
    var isInteger = (config.isInteger == "true" || config.isInteger);

    if (value.trim() === "") {
        return;
    }

    // 判断输入是否是数值
    if (isInteger) {
        if (!(/^\d+$/).test(value.trim())) {
            return fieldName + "只能填数字，且数值为整数";
        }
    } else {
        if (!(/^\d+\.?\d{0,2}$/).test(value)) {
            return fieldName + "只能填数字，且小数不能超过两位";
        }
    }

    // 判断输入是否是有效的数值
    if (value.trim() < minValue || value.trim() > maxValue) {
        return fieldName + "只能输入" + minValue +"~" + maxValue + "的值";
    }
}


function checkMonth(){
    if (i<10){
        i="0" + i;
    }
    return i;
}

/**
 * 增加月份
 * @param date
 * @returns {string}
 */
function addMonth(date,month) {
    if (typeof month == "string"){
        month =  month.trim()
    }else{
        month = month*1
    }
    if(isEmpty(date) || !(/^\d+$/).test(month)){
        return null;
    }
    currentDate = new Date(date);
    var lastDate = currentDate.setMonth(currentDate.getMonth() + (month*1)); // 输出日期格式为毫秒形式1551398400000
    return layui.util.toDateString(lastDate, 'yyyy-MM-dd')
}

/**
 * 减少月份
 * @param date
 * @returns {string}
 */
function subtractMonth(date,month) {
    if (typeof month == "string"){
        month =  month.trim()
    }else{
        month = month*1
    }
    if(isEmpty(date) || !(/^\d+$/).test(month)){
        return null;
    }
    currentDate = new Date(date);
    var lastDate = currentDate.setMonth(currentDate.getMonth() - (month*1)); // 输出日期格式为毫秒形式1551398400000
    return layui.util.toDateString(lastDate, 'yyyy-MM-dd')
}
