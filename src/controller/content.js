/**
	 @Name：内容管理    动态管理
	 @Author：郭宇
 */

layui.define(['table', 'form'], function(exports) {
    var $ = layui.$,
        admin = layui.admin,
        view = layui.view,
        table = layui.table,
        form = layui.form;

    /*动态列表*/
    table.render({
        elem: '#LAY-dynamic-manage',
        url: layui.setter.urll + '/api/admin/dynamic/list',
        method: 'get',
        cols: [
            [
                { type: 'numbers', title: '序号', align: 'center' }, { field: 'title', title: '标题', align: 'center', width: '160' }, { field: 'content', title: '动态音频', align: 'center', width: '340', templet: '#content' }, { field: 'playNum', title: '播放数量', align: 'center', width: 100 }, { field: 'commentNum', title: '评论数量', align: 'center', width: 100 }, { field: 'likeNum', title: '点赞数量', align: 'center', width: 100 }, { field: 'isRel', title: '是否上架', align: 'center', templet: '#isUpperShelf', width: 100 }, { field: 'isHeat', title: '是否热门', align: 'center', templet: '#isPopular', width: 100 }, { field: 'createTime', title: '上传时间', align: 'center', width: 160 }, { field: 'shareCount', title: '动态内容', align: 'center', width: 220 }, { toolbar: '#table-dynamic-operation', title: '操作', align: 'center', width: 150 }
            ]
        ],
        page: true,
        text: { none: '暂无数据', error: '对不起，加载出现异常！' },
        done: function(data) {
            if (data.code == 403) {
                layer.closeAll();
                admin.exit();
                setTimeout(function() {
                    layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
                }, 666);
            }
        }
    });

    /*监听动态编辑、删除操作*/
    table.on('tool(LAY-dynamic-manage)', function(obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('是否确认删除?', function(index) {
                $.ajax({
                    url: layui.setter.urll + '/api/admin/dynamic/del',
                    method: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        'token': layui.data('data').token,
                        'id': data.id
                    }),
                    success: function(data) {
                        if (data.data == 1) {
                            layer.alert('已删除', { icon: 1 });
                            layui.table.reload('LAY-dynamic-manage');
                        } else {
                            layer.alert('操作失败', { icon: 2 });
                        }
                    },
                    error: function(data) {
                        layer.alert('操作失败', { icon: 2 });
                    }
                });
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑',
                area: ['600px', '450px'],
                id: 'LAY-popup-user-add',
                success: function(layero, index) {
                    view(this.id).render('content/edit', data).done(function() {
                        form.render();
                        form.on('submit(LAY-dynamic-front-submit)', function(data) {
                            var field = data.field;
                            console.log(field);
                            $.ajax({
                                url: layui.setter.urll + '/api/admin/dynamic/edit',
                                method: "post",
                                contentType: 'application/json;charset=UTF-8',
                                data: JSON.stringify({
                                    'token': layui.data('data').token,
                                    'id': field.id,
                                    'tagId': field.label /*标签id*/ ,
                                    'name': field.name /*标签*/ ,
                                    'title': field.title /*标题*/ ,
                                    'author': field.author /*作者简介*/ ,
                                    'artist': field.artist /*艺人简介*/ ,
                                    'image': field.demo2 /*图片base64编码*/ ,
                                    'content': field.audioPath /*音频路径*/ ,
                                    'audioTime': field.audioLength /*音频时长*/
                                }),
                                success: function(data) {
                                    if (data.data == 1) {
                                        layer.alert('已更新', { icon: 1 });
                                        layui.table.reload('LAY-dynamic-manage');
                                    } else {
                                        layer.alert('编辑失败，请稍后重试', { icon: 2 });
                                    }

                                },
                                error: function(data) {
                                    layer.alert('编辑失败，请稍后重试', { icon: 2 });
                                }
                            });
                            layer.close(index);
                        });
                    });
                }
            });
        }
    });

    /*监听上下架开关*/
    form.on('switch(switchUpper)', function(data) {
        var flag = this.checked;
        var id = data.elem.attributes['switch_id'].nodeValue;
        console.log(flag);
        console.log(id);
        $.ajax({
            url: layui.setter.urll + '/api/admin/dynamic/shelves',
            dataType: 'JSON',
            contentType: 'application/json;charset=UTF-8',
            type: 'POST',
            data: JSON.stringify({
                'token': layui.data('data').token,
                'id': id
            }),
            success: function(data) {
                if (data.data == 1) {
                    layer.msg('操作成功');
                    $('checkbox').prop('checked', false);
                    layui.table.reload('LAY-dynamic-manage');
                } else {
                    layer.alert("操作失败", { icon: 2 });
                }
            },
            error: function(err) {
                layer.alert("操作失败", { icon: 2 });
            }
        });
    });
    //isHeat    是否热门
    //isRec		是否推荐
    //isRel		是否上架

    /*监听是否热门开关*/
    form.on('switch(switchPopular)', function(data) {
        var flag = this.checked;
        var id = data.elem.attributes['switch_id'].nodeValue;
        console.log(flag);
        console.log(id);
        $.ajax({
            url: layui.setter.urll + '/api/admin/dynamic/heat',
            dataType: 'JSON',
            contentType: 'application/json;charset=UTF-8',
            type: 'POST',
            data: JSON.stringify({
                'token': layui.data('data').token,
                'id': id
            }),
            success: function(data) {
                if (data.data == 1) {
                    layer.msg('操作成功');
                    $('checkbox').prop('checked', false);
                    layui.table.reload('LAY-dynamic-manage');
                } else {
                    layer.alert("操作失败", { icon: 2 });
                }
            },
            error: function(err) {
                layer.alert("操作失败", { icon: 2 });
            }
        });
    });

    /*监听是否推荐开关*/
    form.on('switch(switchRecommend)', function(data) {
        var flag = this.checked;
        var id = data.elem.attributes['switch_id'].nodeValue;
        console.log(flag);
        console.log(id);
        $.ajax({
            url: layui.setter.urll + '/api/admin/dynamic/rec',
            dataType: 'JSON',
            contentType: 'application/json;charset=UTF-8',
            type: 'POST',
            data: JSON.stringify({
                'token': layui.data('data').token,
                'id': id
            }),
            success: function(data) {
                if (data.data == 1) {
                    layer.msg('操作成功');
                    $('checkbox').prop('checked', false);
                    layui.table.reload('LAY-dynamic-manage');
                } else {
                    layer.alert("操作失败", { icon: 2 });
                }
            },
            error: function(err) {
                layer.alert("操作失败", { icon: 2 });
            }
        });
    });

    exports('content', {})
});