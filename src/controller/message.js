/**
	 @Name： 消息管理
	 @Author：郭宇
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form;
   form.render();
  /*消息列表*/
  table.render({
    elem: '#LAY-message-manage'
    ,url:layui.setter.urll+'/api/admin/message/list'
    ,method:'get'
    ,cols: [[
       {field: 'msgTitle', 		title: '标题',			align:'center'}
      ,{field: 'msgBriefly', 	title: '内容简要', 		align:'center'}
      ,{field: 'msgContent', 	title: '发送内容',		align:'center'}
      ,{field: 'receiver', 		title: '接收用户',		align:'center'		,templet: '#receiver'}
      ,{field: 'createTime', 	title: '发布时间',		align:'center'}
    ]]
    ,page: true
    ,text:{none: '暂无数据', error:'对不起，加载出现异常！'}
    ,done: function (data) {
	    if (data.code == 403) {
	      layer.closeAll();
	      admin.exit();
	      setTimeout(function () {
	        layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
	      }, 666);
	    }
  	}
  });
  
  /*新增消息-用户列表*/
  table.render({
    elem: '#LAY-message-add'
    ,url:layui.setter.urll+'/api/admin/user/list'
    ,method:'get'
    ,cols: [[
       {type : 'checkbox',	 	fixed: 'left'}
      ,{field: 'nickname', 		title: '用户名称', 	align:'center'}
      ,{field: 'phone', 		title: '手机号',		align:'center'}
      ,{field: 'sex', 			title: '性别',		align:'center',		templet: '#sex'}
      ,{field: 'createTime', 	title: '创建时间',		align:'center'}
    ]]
    ,page: true
    ,text:{none: '暂无数据', error:'对不起，加载出现异常！'}
    ,done: function (data) {
	    if (data.code == 403) {
	      layer.closeAll();
	      admin.exit();
	      setTimeout(function () {
	        layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
	      }, 666);
	    }
  	}
  });
  
  exports('message', {})
});