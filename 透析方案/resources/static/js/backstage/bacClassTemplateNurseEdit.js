/**
 * bacClassTemplateNurseEdit.jsp的js文件，包括查询，编辑操作
 * 护士值班模板--编辑删除页面
 * @author: xcj
 * @version: 1.0
 * @date: 2020/08/04
 */
var bacClassTemplateNurseEdit = avalon.define({
    $id: "bacClassTemplateNurseEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    userId:'',
    userName:'',
    classTemplateId:'',
    classManageList:[], // 班种列表
    regionSettingList:[], //区组列表

});

layui.use(['index','formSelects'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var form=layui.form; //调用layui的form模块
        var formSelects=layui.formSelects; //调用layui的form模块
        bacClassTemplateNurseEdit.userId=GetQueryString("userId");  //接收变量 小心赋值underfine
        bacClassTemplateNurseEdit.userName=GetQueryString("userName");  //接收变量
        bacClassTemplateNurseEdit.classTemplateId=GetQueryString("templateId");  //接收变量
        //获取实体信息
        getInfo(bacClassTemplateNurseEdit.classTemplateId,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });

        // 选择下拉框后触发
        form.on('select(defaultTemplate)', function(data){
            form.val('bacClassTemplateNurseEdit_form',
                {
                    templateMon:data.value,
                    templateTue:data.value,
                    templateWed:data.value,
                    templateThur:data.value,
                    templateFri:data.value,
                    templateSat:data.value,
                }
            );
        });
        var formSelects = layui.formSelects;
        formSelects.on('defaultPart', function(id, vals, val, isAdd, isDisabled){
            //id:           点击select的id
            //vals:         当前select已选中的值
            //val:          当前select点击的值
            //isAdd:        当前操作选中or取消
            //isDisabled:   当前选项是否是disabled
            var ids = [];//要选中的值，
            $.each(vals,function (i,item){
                ids.push(item.value);
            }) ;
            formSelects.value('partMon', ids);
            formSelects.value('partTue', ids);
            formSelects.value('partWed', ids);
            formSelects.value('partThur', ids);
            formSelects.value('partFri', ids);
            formSelects.value('partSat', ids);
        }, true);
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(id,$callback){
    var param={
        "classTemplateId":id
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.schedule + "/bacClassTemplate/getTemplateNurse.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacClassTemplateNurseEdit.classManageList.pushArray(data.ClassManage);
            bacClassTemplateNurseEdit.regionSettingList.pushArray(data.RegionSetting);
            var classTemplateData = data.ClassTemplate;

            if(isEmpty(classTemplateData.templateSun)){
                $.each(bacClassTemplateNurseEdit.classManageList,function(i,item){
                    if(item.classAttr == "2"){
                        classTemplateData.templateSun = item.classManageId;
                    }
                });
            }

            var formSelects=layui.formSelects; //调用layui的form模块
            //以下方式则重新渲染所有的已存在多选
            //渲染下拉多选
            formSelects.data('defaultPart', 'local', {
                arr:bacClassTemplateNurseEdit.regionSettingList
            });
            formSelects.data('partMon', 'local', {
                arr:bacClassTemplateNurseEdit.regionSettingList
            });
            formSelects.data('partTue', 'local', {
                arr:bacClassTemplateNurseEdit.regionSettingList
            });
            formSelects.data('partWed', 'local', {
                arr:bacClassTemplateNurseEdit.regionSettingList
            });
            formSelects.data('partThur', 'local', {
                arr:bacClassTemplateNurseEdit.regionSettingList
            });
            formSelects.data('partFri', 'local', {
                arr:bacClassTemplateNurseEdit.regionSettingList
            });
            formSelects.data('partSat', 'local', {
                arr:bacClassTemplateNurseEdit.regionSettingList
            });
            formSelects.data('partSun', 'local', {
                arr:bacClassTemplateNurseEdit.regionSettingList
            });

            var val = classTemplateData.defaultPart.split(",");//要选中的值，
            formSelects.value('defaultPart', val);
            var val = classTemplateData.partMon.split(",");//要选中的值，
            formSelects.value('partMon', val);
            var val = classTemplateData.partTue.split(",");//要选中的值，
            formSelects.value('partTue', val);
            var val = classTemplateData.partWed.split(",");//要选中的值，
            formSelects.value('partWed', val);
            var val = classTemplateData.partThur.split(",");//要选中的值，
            formSelects.value('partThur', val);
            var val = classTemplateData.partFri.split(",");//要选中的值，
            formSelects.value('partFri', val);
            var val = classTemplateData.partSat.split(",");//要选中的值，
            formSelects.value('partSat', val);
            var val = classTemplateData.partSun.split(",");//要选中的值，
            formSelects.value('partSun', val);

            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            form.val('bacClassTemplateNurseEdit_form', classTemplateData);
            typeof $callback === 'function' && $callback(classTemplateData); //返回一个回调事件
        }
    });
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacClassTemplateNurseEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacClassTemplateNurseEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        field.userId = bacClassTemplateNurseEdit.userId;
        field.classTemplateId = bacClassTemplateNurseEdit.classTemplateId;
        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.schedule + "/bacClassTemplate/saveOrEditNurse.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



