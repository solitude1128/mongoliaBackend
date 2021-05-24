/**
	 @Name：分类管理
	 @Author：郭宇
 */


layui.define(['table', 'form'], function(exports) {
    var $ = layui.$,
        admin = layui.admin,
        view = layui.view,
        table = layui.table,
        form = layui.form;

    /*分类列表*/
    table.render({
        elem: '#LAY-classification-manage',
        url: layui.setter.urll + '/api/admin/class/audio/list',
        method: 'get',
        cols: [
            [{
                type: 'numbers',
                title: '序号',
                align: 'center',
                width: 50
            }, {
                field: 'className',
                title: '名称',
                align: 'center'
            }, {
                field: 'sort',
                title: '排序',
                align: 'center',
                sort: true,
            }, {
                title: '操作',
                align: 'center',
                toolbar: '#table-classification-operation'
            }]
        ],
        page: true,
        text: {
            none: '暂无数据',
            error: '对不起，加载出现异常！'
        },
        done: function(data) {
            if (data.code == 403) {
                layer.closeAll();
                admin.exit();
                setTimeout(function() {
                    layer.alert('此账号已在别处登录,请重新登录！', {
                        icon: 5
                    });
                }, 666);
            }
        }
    });

    /*监听编辑、删除操作*/
    table.on('tool(LAY-classification-manage)', function(obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('是否确认删除?', function(index) {
                $.ajax({
                    url: layui.setter.urll + "/api/admin/class/audio/del",
                    method: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        'token': layui.data('data').token,
                        'id': data.id
                    }),
                    success: function(data) {
                        if (data.code == 402) {
                            layer.alert('该分类不可删除,试试别的吧', {
                                icon: 5
                            });
                        } else {
                            layer.alert('已删除', {
                                icon: 1
                            });
                            layui.table.reload('LAY-classification-manage'); //重载表格
                        }
                    },
                    error: function(data) {
                        layer.alert('操作失败', {
                            icon: 2
                        });
                    }
                });
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑',
                area: ['500px', '300px'],
                id: 'LAY-popup-user-add',
                success: function(layero, index) {
                    view(this.id).render('classification/editClassification', data).done(function() {
                        //监听提交
                        form.on('submit(LAY-classification-front-submit)', function(data) {
                            var field = data.field;
                            console.log(field);
                            $.ajax({
                                url: layui.setter.urll + "/api/admin/class/audio/edit",
                                method: "post",
                                contentType: 'application/json;charset=UTF-8',
                                data: JSON.stringify({
                                    'token': layui.data('data').token,
                                    'className': field.name /*分类名称*/ ,
                                    'sort': field.sort /*排序*/ ,
                                    'id': field.id
                                }),
                                success: function(data) {
                                    layer.alert('已更新', {
                                        icon: 1
                                    });
                                    layui.table.reload('LAY-classification-manage');
                                },
                                error: function(data) {
                                    layer.alert('编辑失败，请稍后重试', {
                                        icon: 2
                                    });
                                }
                            });
                            layer.close(index);
                        });
                    });
                }
            });
        } else if (obj.event === 'detail') {
            admin.popup({
                title: '查看详情',
                area: ['500px', '300px'],
                id: 'LAY-popup-user-add',
                success: function(layero, index) {
                    view(this.id).render('classification/lookClassification', data).done(function() {
                        //监听提交
                        form.on('submit(LAY-classification-front-submit)', function(data) {
                            var field = data.field;
                            layer.close(index);
                        });
                    });
                }
            });
        }
    });

    exports('classification', {})
});