/**
	 @Name：财务管理    支付记录
	 @Author：郭宇
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form;

  /*支付记录列表*/
  table.render({
    elem: '#LAY-finance-manage'
    ,url:layui.setter.urll+'/api/admin/order/list'
    ,method:'get'
  	, toolbar: '#toolbarDemo'
    , defaultToolbar: ['filter', 'exports', 'print', {
        title: '提示'
        , layEvent: 'LAYTABLE_TIPS'
        , icon: 'layui-icon-tips'
    }]
    ,cols: [[
       {field: 'id', 			title: 'ID',			align:'center'}
  	  ,{field: 'orderId', 		title: '交易号', 		align:'center'}
      ,{field: 'payTime', 		title: '交易时间',		align:'center'}
      ,{field: 'state',  		title: '交易状态',		align:'center',		templet: '#type'}
      ,{field: 'price', 		title: '交易额度',		align:'center'}
      ,{field: 'setMealName', 	title: '购买套餐',		align:'center'}
      ,{field: 'integral', 		title: '积分抵扣',		align:'center'}
      ,{field: 'payType',		title: '支付方式',		align:'center',		templet: '#payType'}
      ,{field: 'nickName', 		title: '支付用户',		align:'center'}
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
  exports('finance', {})
});