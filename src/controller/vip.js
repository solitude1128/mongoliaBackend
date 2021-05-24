/**
	 @Name：vip管理   套餐管理
	 @Author：郭宇
 */


layui.define(['table', 'form'], function (exports) {
  var $ = layui.$
    , admin = layui.admin
    , view = layui.view
    , table = layui.table
    , form = layui.form;

  /*套餐列表*/
  table.render({
    elem: '#LAY-vip-manage'
    , url: layui.setter.urll + '/api/admin/vip/list'
    , method: 'get'
    , cols: [[
      { type: 'numbers', title: '序号', align: 'center' }
      , { field: 'avatar', title: '套餐Logo', align: 'center', templet: '#photo' }
      , { field: 'name', title: '名称', align: 'center' }
      , { field: 'price', title: '价格', align: 'center' }
      , { field: 'explain', title: '套餐说明', align: 'center' }
      , { field: 'quota', title: '可用积分额度', align: 'center' }
      , { title: '操作', align: 'center', toolbar: '#table-vip-operation' }
    ]]
    , page: true
    , text: { none: '暂无数据', error: '对不起，加载出现异常！' }
    , done: function (data) {
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
  table.on('tool(LAY-vip-manage)', function (obj) {
    var data = obj.data;
    if (obj.event === 'edit') {
      admin.popup({
        title: '编辑'
        , area: ['500px', '500px']
        , id: 'LAY-popup-user-add'
        , success: function (layero, index) {
          view(this.id).render('vip/editVip', data).done(function () {
            form.on('submit(LAY-vip-front-submit)', function (data) {
              var field = data.field;
              console.log(field);
              $.ajax({
                url: layui.setter.urll + '/api/admin/vip/edit'
                , method: "post"
                , contentType: 'application/json;charset=UTF-8'
                , data: JSON.stringify({
                  'token': layui.data('data').token
                  , 'id': field.id
                  , 'name': field.name				/*套餐名称*/
                  , 'price': field.price			/*套餐价格*/
                  , 'logoPath': field.photo			/*套餐图片*/
                  , 'explain': field.detail			/*套餐说明*/
                  , 'quota': field.integral			/*积分额度*/
                }),
                success: function (data) {
                  if (data.data == 1) {
                    layer.alert('已更新', { icon: 1 });
                    layui.table.reload('LAY-vip-manage');
                  } else {
                    layer.alert('编辑失败，请稍后重试', { icon: 2 });
                  }
                },
                error: function (data) {
                  layer.alert('编辑失败，请稍后重试', { icon: 2 });
                }
              });
              layer.close(index);
            });
          });
        }
      });
    } else if (obj.event === 'del') {
      layer.confirm('是否确认删除?', function (index) {
        $.ajax({
          url: layui.setter.urll + "/api/admin/vip/delete"
          , method: "post"
          , contentType: 'application/json;charset=UTF-8'
          , data: JSON.stringify({
            'token': layui.data('data').token
            , 'id': data.id
          }),
          success: function (data) {
            if (data.data == 1) {
              layer.alert('已删除', { icon: 1 });
              layui.table.reload('LAY-vip-manage'); //重载表格
            }else{
              layer.alert('删除失败，请稍后重试', { icon: 2 });
            }
          },
          error: function (data) {
            layer.alert('操作失败', { icon: 2 });
          }
        });
        layer.close(index);
      });
    }
  });

  exports('vip', {})
});