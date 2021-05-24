/**
	 @Name：任务管理
	 @Author：郭宇
 */

layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form;

  /*任务列表*/
  table.render({
    elem: '#LAY-task-manage'
    ,url:layui.setter.urll+'/api/admin/task/list'
    ,method:'get'
    ,cols: [[
       {type:'numbers',     		title:'序号',				width:100,			align:'center'}
      ,{field: 'name', 				title: '任务名称',			align:'center', width: 300}
      ,{field: 'sort', 				title: '排序', 			align:'center',		templet: '#labelType', width:100}
      ,{field: 'integral', 			title: '可获积分',			align:'center', width:100}
      ,{field: 'integralOfDay', 	title: '每天最多获取积分',	align:'center',	width:100}
//      ,{field: 'gender', 			title: '跳转页面', 		align:'center',		templet: '#labelType'}
      ,{field: 'detail', 			title: '任务详情',			align:'center'}
      ,{title: '操作', 				align:'center', 		toolbar: '#table-task-operation', width:270}
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
  
  /*监听编辑操作*/
  table.on('tool(LAY-task-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'edit'){
      admin.popup({
        title: '编辑'
        ,area: ['500px', '350px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('task/editTask', data).done(function(){
            //监听提交
            form.on('submit(LAY-task-front-submit)', function(data){
	            var field = data.field;
	            console.log(field);
				$.ajax({
	              	url:layui.setter.urll+'/api/admin/task/edit'
	                ,method:"post"
	              	,contentType:'application/json;charset=UTF-8'
	              	,data: JSON.stringify({
              			 'token': layui.data('data').token
              			,'integral':field.integral			/*可获积分*/
              			,'integralOfDay':field.maxIntegral	/*每天最多获取积分*/
              			,'detail':field.taskDetail			/*任务详情*/
              			,'id':field.id
	              	}),
	                success:function(data){
	                	if(data.data==1){
	                		layer.alert('已更新',{icon:1});
	                    	layui.table.reload('LAY-task-manage');
	                	}else{
	                		layer.alert('编辑失败，请稍后重试',{icon:2});
	                	}
	                },
	                error:function(data){
                        layer.alert('编辑失败，请稍后重试',{icon:2});
	                }
	            });
	            layer.close(index);
            });
          });
        }
      });
    }
  });

  exports('task', {})
});
