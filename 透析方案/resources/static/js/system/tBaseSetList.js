/**
 * tBaseSetList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var tBaseSetList = avalon.define({
    $id: "tBaseSetList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getData();//获取数据
        avalon.scan();
    });
});





/**
 * 加载数据
 *
 */
function getData(){
    var param={
        // "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/tBaseSet/getLists.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            //console.log(data);
           var form=layui.form;
           form.val('tBaseSetlist_form',data[0]);
           // if (isNotEmpty(data[0])){
           //     form.val('tBaseSetlist_form',data[0]);
           //     //不更新复选框
           //     form.val('tBaseSetlist_form',{
           //         "combDoor":false
           //     });
           //     var arr=data[0].combDoor.split("、");
           //     $.each(arr, function (i) {
           //         $("input:checkbox[name='combDoor']").each(function () {
           //             //$(this).prop("checked", false);
           //             var val=$(this).val();
           //             //console.log(val);
           //             if (val ===arr[i]){
           //                 $(this).prop("checked", true);
           //                // console.log("选中");
           //             }
           //         });
           //     });
           //     //跟新复选框
           //     form.render('checkbox');
           // }

        }
    });
}
/*
* 保存
* */
$("#tBaseSetlist_submit").click(function () {
    var form=layui.form;
    var arr=[];
    form.on('submit(tBaseSetlist_submit)',function (data) {
        // $("input:checkbox[name='combDoor']:checked").each(function () {
        //     arr.push($(this).val());
        // });
        // data.field.combDoor=arr.join("、");
        var field = data.field; //获取提交的字段
        //console.log(field);
        var param=field;
        _ajax({
            type: "POST",
            url: $.config.services.system + "/tBaseSet/saveOrEdit.do",
            data:param,  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function(data){
                getData();
                successToast("保存成功",500);
            }
        });
    });
});


