/**
 * 患者回访-新增、详情
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/28
 */
var basVisitEdit = avalon.define({
    $id: "basVisitEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientRecordNo:'',//病历号
    patientName:'',//患者姓名
    readonly:'',
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        basVisitEdit.id=GetQueryString("id");  //接收变量
        basVisitEdit.patientRecordNo=GetQueryString("patientRecordNo");  //接收变量
        basVisitEdit.patientName=GetQueryString("patientName");  //接收变量
        basVisitEdit.readonly=GetQueryString("readonly");  //接收变量
        if(basVisitEdit.readonly=="Y"){
            $("#patientName").val(basVisitEdit.patientName);
            var form=layui.form;
            form.render();
            getList();
        }else{
            //初始化表单元素,日期时间选择器
            var laydate=layui.laydate;
            laydate.render({
                elem: '#visitDate'
                ,type: 'date'
                ,trigger: 'click'
            });
            //获取访问方式
            var list = baseFuncInfo.getSysDictByCode('AccessMethod');
            var form=layui.form; //调用layui的form模块
            var util=layui.util;
            form.val('basVisitEdit_form', {
                visitDate: util.toDateString(new Date(),"yyyy-MM-dd")
            });
            var html = '';
            html +='<div class="layui-col-sm6 layui-col-md6 layui-col-lg6">'+
                '<div class="disui-form-flex " >'+
                '<label>访问方式：</label>'
            html +=  '<select name="visitType">'
            $.each(list,function(index, item){
                html +=  '<option value=' +item.value+ '>' +item.name+ '</option>'
            })
            html +='</select>'
            html +='</div>'
            html +='</div>'
            $('#AccessMethod').html(html);
            form.render();
        }
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList() {
    var param = {
        patientRecordNo:basVisitEdit.patientRecordNo,
        patientId: GetQueryString("patientId")
    };
    debugger
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#basVisitList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'basVisitList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.logistics + "/basVisit/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page:false,
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'visitDate', title: '访问日期',align:'center'
                    ,templet: function(d){
                        return util.toDateString(d.visitDate,"yyyy-MM-dd");
                    }}
                ,{field: 'userName', title: '访问者',align:'center'}
                ,{field: 'visitType', title: '访问方式',align:'center'
                    ,templet: function(d){
                        //返回数据字典的名称
                        return getSysDictName("AccessMethod",d.visitType);
                    }}
                ,{field: 'remarks', title: '访问内容'}
                , {
                    fixed: 'right', title: '操作', align: 'center'
                    ,toolbar: '#basVisitEdit_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'delete'){ //删除
                debugger
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.basVisitId)){
                        var ids=[];
                        ids.push(data.basVisitId);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids){
    //type:list表示点击的是回访主查询界面的删除，根据病历号删除；edit表示点击的是详情界面中的删除，根据回访ID删除
    var param={
        "ids":ids,
        "type":"edit"
    };
    _ajax({
        type: "POST",
        url: $.config.services.logistics + "/basVisit/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('basVisitList_table'); //重新刷新table
            parent.layui.table.reload('basVisitList_table'); //重新刷新父页面
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('basVisitList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.basVisitId);
            });
            del(ids);
        });
    }
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(basVisitEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basVisitEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        param.patientId = GetQueryString("patientId")
        //可以继续添加需要上传的参数
        param.patientRecordNo=basVisitEdit.patientRecordNo;
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/basVisit/save.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



