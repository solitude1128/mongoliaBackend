/**
	 @Name：举报管理
	 @Author：郭宇
 */

layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form;

  /*举报列表*/
  table.render({
    elem: '#LAY-report-manage'
    ,url:layui.setter.urll+'/api/admin/report/list'
    ,method:'get'
    ,cols: [[
       {type:'numbers',     		title:'序号',			align:'center'}
      ,{field: 'whistleName', 		title: '举报人昵称',		align:'center'}
      ,{field: 'phone', 			title: '举报人手机号', 	align:'center'}
      ,{field: 'type', 				title: '举报类型',		align:'center'}
      ,{field: 'receiveName',  		title: '被举报人昵称',	align:'center'}
      ,{field: 'dynamicName', 		title: '被举报动态',		align:'center'}
      ,{title: '操作', 				align:'center', 		toolbar: '#table-report-operation',width:150}
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
  
  /*监听详情*/
  table.on('tool(LAY-report-manage)', function(obj){
    var data = obj.data;
    console.log(data);
    if(obj.event === 'detail'){
      admin.popup({
        title: '详情'
        ,area: ['550px', '400px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('content/detail', data).done(function(){
          	form.render();
            form.on('submit(LAY-report-front-submit)', function(data){
	            layer.close(index);
            });
          });
        }
      });
    }
  });

  exports('report', {})
});