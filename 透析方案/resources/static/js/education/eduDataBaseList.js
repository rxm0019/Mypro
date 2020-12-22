/**
 * eduDataBaseList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 健康教育--宣教资料
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/10
 */
var eduDataBaseList = avalon.define({
    $id: "eduDataBaseList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    eduBaseList:[],//获取所有教育主题
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表


        //监控教育类型，联动主题类型
        var form=layui.form;
        form.on('select(eduBaseType)', function(data){
            debugger
            if(isNotEmpty(data.value)){
                //清空数据，重新绑定值
                var htmlTheme ='<option value="">全部</option>';
                $.each(eduDataBaseList.allThemeType,function(i,item){
                    if(data.value == item.dictBizCode){
                        htmlTheme+='<option value="'+item.value+'">'+item.name+'</option>';
                    }
                });
                $("select[name='themeType']").html(htmlTheme);
                $("select[name='themeType']").val("");
                //刷新表单渲染
                form.render();
            }
        });

        //获取字典数据
        eduDataBaseList.allThemeType = getSysDictMap($.dictType.ThemeType);

        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#eduDataBaseList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'eduDataBaseList_search'  //指定的lay-filter
        ,conds:[
            {field: 'eduBaseName', title: '教育主题：',type:'input'}
            ,{field: 'eduBaseFrom',type:'select', title: '主题来源：'
                ,data:getThemeSource()}
            ,{field: 'eduBaseType',type:'select', title: '教育类型：'
                ,data:getSysDictByCode($.dictType.EducationType,true)} //加载数据字典
            ,{field: 'themeType',type:'select', title: '主题类型：'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框

        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('eduDataBaseList_table',{
                where:field
            });
        }
    });
}

/**
 * 主题来源
 */
function getThemeSource() {
    var data = [];
    data.push({value: "", name: "全部"});
    data.push({value: "0", name: "中心建立"});
    data.push({value: "1", name: "总部推送"});
    return data;
}

/**
 * 查询列表事件
 */
function getList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#eduDataBaseList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'eduDataBaseList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/eduDataBase/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'eduBaseName', title: '教育主题',align:'center'}
                ,{field: 'eduBaseFrom', title: '主题来源',align:'center',templet: function(d){
                    if(d.eduBaseFrom == $.constant.themeSource.local){
                        return "中心建立";
                    }else {
                        return "总部推送";
                    }
                }}
                ,{field: 'eduBaseType', title: '教育类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.EducationType,d.eduBaseType);
                }}
                ,{field: 'themeType', title: '主题类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.ThemeType,d.themeType);
                }}
                ,{field: 'contentType', title: '教材类型',align:'center',templet: function(d){
                    return getSysDictName($.dictType.ContentType,d.contentType);
                }}
                ,{field: 'remarks', title: '备注'}
                ,{fixed: 'right',title: '操作',width: 160, align:'center'
                    ,toolbar: '#eduDataBaseList_bar'}
            ]]
            ,done:function (res, curr, count) {
                //遍历设置复选框禁用--总部推送不可删
                for(var i=0;i<res.length;i++){
                    //该方法全选不可用，所以删除按钮那边还需要判断总部推送不可删
                    if(res[i].eduBaseFrom == $.constant.themeSource.superior){
                        $(".layui-table tr[data-index="+list[i]+"] input[type='checkbox']").next().remove();
                        $(".layui-table tr[data-index="+list[i]+"] input[type='checkbox']").remove();
                    }
                }
            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.eduBaseId)){
                    saveOrEdit(data.eduBaseId);
                }
            }else if(layEvent === 'show'){ //显示
                //do something
                if(isNotEmpty(data.eduBaseId)){
                    show(data.eduBaseId,"",data.eduBaseName);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.eduBaseId)){
                        var ids=[];
                        ids.push(data.eduBaseId);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id){
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=$.config.server + "/education/eduDataBaseEdit";
    }else{  //编辑
        title="编辑";
        url=$.config.server +"/education/eduDataBaseEdit?id="+id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:1000,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('eduDataBaseList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 预览显示
 */
function show(eduBaseId,patientId,eduBaseName) {
    var url="";
    var title="";
    title="预览";
    url=$.config.server +"/education/eduDataBaseShow?eduBaseId="+eduBaseId;
    parent.layui.index.openTabsPage(url, title); //这里要注意的是 parent 的层级关系
}



/**
 * 删除事件
 * @param ids
 */
function del(ids){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.logistics + "/eduDataBase/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('eduDataBaseList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('eduDataBaseList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                //判断是否中心建立，中心建立才能删除，总部推送不能删
                if(item.eduBaseFrom == $.constant.themeSource.local){
                    ids.push(item.eduBaseId);
                }
            });
            if(ids.length<=0){
                warningToast("请至少选择一条记录");
                return false;
            }
            del(ids);
        });
    }
}

