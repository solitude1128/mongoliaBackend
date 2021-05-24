/**
	 @Name：标签管理
	 @Author：郭宇
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form;

  /*标签列表*/
  table.render({
    elem: '#LAY-label-manage'
    ,url:layui.setter.urll+"/api/admin/tag/list"
    ,method:'get'
    ,cols: [[
       {type:'numbers',     title:'序号',				align:'center'}
      ,{field: 'content', 	title: '标签名称',			align:'center'}
      ,{field: 'flag', 		title: '标签类型',			align:'center',		templet: '#labelType'}
      ,{field: 'number', 	title: '标签下内容数量',		align:'center'}
      ,{title: '操作', 		align:'center', 			toolbar: '#table-label-operation'}
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
  
  /*监听编辑、删除操作*/
  table.on('tool(LAY-label-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
        layer.confirm('是否确认删除?', function(index){
          	$.ajax({
		      	url:layui.setter.urll+'/api/admin/tag/del'
		      	,method:"post"
              	,contentType:'application/json;charset=UTF-8'
              	,data: JSON.stringify({
              		 'token': layui.data('data').token
              		,'id':data.id
              	}),
		          	success:function(data){
			            if(data.data==1){
			          		layer.alert('删除成功',{icon:1});
			          		layui.table.reload('LAY-label-manage');
			          	}else{
			          		layer.alert('操作失败,请稍后重试',{icon:2});
			          	}
		        },
		         	error:function(data){
		            layer.alert('操作失败',{icon:2});
		        }
		    });
          	layer.close(index);
         
        });
    } else if(obj.event === 'edit'){
    	console.log(data);
      admin.popup({
        title: '编辑'
        ,area: ['500px', '300px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('label/editLabel', data).done(function(){
            form.on('submit(LAY-label-front-submit)', function(data){
	            var field = data.field;
	            console.log(field);
				$.ajax({
	              	url:layui.setter.urll+'/api/admin/tag/edit'
	                ,method:"post"
	              	,contentType:'application/json;charset=UTF-8'
	              	,data: JSON.stringify({
	              		 'token': layui.data('data').token
	              		,'tmp':field.name		/*标签名称*/
	              		,'id':field.id			/*标签id*/
	              	}),
	                success:function(data){
	                	if(data.data==1){
	                		layer.alert('已更新',{icon:1});
	                    	layui.table.reload('LAY-label-manage');
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

  exports('label', {})
});