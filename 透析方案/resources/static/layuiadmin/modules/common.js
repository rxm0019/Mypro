/**

 @Name：layuiAdmin 封装
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */

layui.define(['form', 'table','formSelects','FileSaver','wordexport'],function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,laytpl = layui.laytpl
  ,setter = layui.setter
  ,view = layui.view
  ,admin = layui.admin
  ,formSelects = layui.formSelects
  ,FileSaver = layui.FileSaver
  ,wordexport = layui.wordexport;
  //公共业务的逻辑处理可以写在此处，切换任何页面都会执行
  //……
    formSelects.btns(['select', 'remove']); //下拉多选框设置
    var form=layui.form;
    //自定义验证
    form.verify({
        nickname: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
        }
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ]
        //确认密码
        ,repass: function(value){
            if(value !== $('#LAY_password').val()){
                return '两次密码输入不一致';
            }
        }
        ,checkbox:function (value,item) {
            var xname = $(item).attr("name");
            var msg = $(item).attr("lay-verify-msg");
            var ischeck=false;
            $("input[name='"+xname+"']").each(function(){
                if ($(this).is(":checked")) {
                    ischeck=true;
                }
            });
            if(isEmpty(msg)){
                msg='至少选择一项';
            }
            if (!ischeck) {
                item.focus();//自动聚焦到验证不通过的输入框或字段
                return msg;
            }
        }
        ,radio:function (value,item) {
            var xname = $(item).attr("name");
            var msg = $(item).attr("lay-verify-msg");
            var ischeck=false;
            $("input[name='"+xname+"']").each(function(){
                if ($(this).is(":checked")) {
                    ischeck=true;
                }
            });
            if(isEmpty(msg)){
                msg='至少选择一项';
            }
            if (!ischeck) {
                item.focus();//自动聚焦到验证不通过的输入框或字段
                return msg;
            }
        }
        ,integer: [ /^[1-9]\d*$/, '只能输入正整数' ]
    });
  //退出
  admin.events.logout = function(){
    //清空本地记录的 token，并跳转到登入页
    admin.exit(function(){
        location.href = layui.setter.base+'/logout.do';
    });
  };

  //对外暴露的接口
  exports('common', {});
});
