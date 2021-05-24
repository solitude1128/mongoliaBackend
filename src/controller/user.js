/**
	 @Name： 用户管理 平台用户
	 @Author：郭宇
 */


layui.define(['table', 'form'], function(exports) {
    var $ = layui.$,
        admin = layui.admin,
        view = layui.view,
        table = layui.table,
        form = layui.form;
    form.render();
    //用户列表
    table.render({
        elem: '#LAY-user-manage',
        url: layui.setter.urll + '/api/admin/user/list',
        method: 'get',
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter', 'exports', 'print', {
            title: '提示',
            layEvent: 'LAYTABLE_TIPS',
            icon: 'layui-icon-tips'
        }],
        cols: [
            [
                { field: 'uid', title: 'ID', align: 'center', width: '110' }, { field: 'phone', title: '手机号', align: 'center', width: '120' }, { field: 'nickname', title: '昵称', align: 'center', width: '100' }, { field: 'sex', title: '性别', align: 'center', templet: '#sex' }, { field: 'city', title: '所在城市', align: 'center', templet: '#city', width: '100' }, { field: 'birthday', title: '出生日期', align: 'center', templet: '#birthday', width: '90' }, { field: 'createTime', title: '注册时间', align: 'center', width: '160' }, {
                    field: 'onLine',
                    title: '在线时长',
                    width: '90',
                    align: 'center',
                    templet: function(d) {
                        if (!d.onLine) {
                            return 0
                        } else {
                            if (d.onLine > 60) {
                                return parseInt(d.onLine / 60) + '分'
                            } else {
                                return d.onLine + '秒'
                            }
                        }
                    }
                }, {
                    field: 'listenIn',
                    title: '收听时长',
                    align: 'center',
                    width: '90',
                    templet: function(d) {
                        if (!d.listenIn) {
                            return 0
                        } else {
                            if (d.listenIn > 60) {
                                return parseInt(d.listenIn / 60) + '分'
                            } else {
                                return d.listenIn + '秒'
                            }
                        }
                    }
                }, { field: 'integral', title: '积分', align: 'center' }, { field: 'isVip', title: '是否会员', align: 'center', width: '90', templet: '#isVip' }, { field: 'isVTB', title: '是否主播', align: 'center', templet: '#isVTB', width: '90' }, { field: 'vipDueTime', title: '会员到期时间', align: 'center', templet: '#vipDueTime', width: '120' }, { fixed: 'right', title: '操作', align: 'center', width: 340, toolbar: '#table-useradmin-webuser' }
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


    //监听删除
    table.on('tool(LAY-user-manage)', function(obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('是否确认删除?', function(index) {
                $.ajax({
                    url: layui.setter.urll + "/api/admin/user/del",
                    method: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        'token': layui.data('data').token,
                        'uid': data.uid
                    }),
                    success: function(data) {
                        if (data.data == 1) {
                            layer.alert("已删除", { icon: 1 });
                            layui.table.reload('LAY-user-manage');
                        } else {
                            layer.alert("操作失败", { icon: 2 });
                        }
                    },
                    error: function(data) {
                        layer.alert("操作失败", { icon: 2 });
                    }
                });
                layer.close(index);
            });
        } else if (obj.event === 'frozenAccount') {
            layer.confirm('真的冻结用户账号吗?', function(index) {
                $.ajax({
                    url: layui.setter.urll + "/api/admin/user/freeze",
                    method: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        'token': layui.data('data').token,
                        'id': data.id
                    }),
                    success: function(data) {
                        if (data.data == 1) {
                            layer.alert("已冻结", { icon: 1 });
                            layui.table.reload('LAY-user-manage');
                        } else {
                            layer.alert("操作失败", { icon: 2 });
                        }
                    },
                    error: function(data) {
                        layer.alert("操作失败", { icon: 2 });
                    }
                });
                layer.close(index);
            });
        } else if (obj.event === 'frozenComment') {
            layer.confirm('真的冻结用户评论功能吗?', function(index) {
                $.ajax({
                    url: layui.setter.ajaxUrl + "/api/admin/user/freezeCom",
                    method: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        'token': layui.data('data').token,
                        'uid': data.uid
                    }),
                    success: function(data) {
                        if (data.data == 1) {
                            layer.alert("已冻结用户评论功能", { icon: 1 });
                            layui.table.reload('LAY-user-manage');
                        } else {
                            layer.alert("操作失败", { icon: 2 });
                        }
                    },
                    error: function(data) {
                        layer.alert("操作失败", { icon: 2 });
                    }
                });
                layer.close(index);
            });
        } else if (obj.event === 'thawAccount') {
            layer.confirm('真的解除用户冻结吗?', function(index) {
                $.ajax({
                    url: layui.setter.urll + "/api/admin/user/freeze",
                    method: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        'token': layui.data('data').token,
                        'id': data.id
                    }),
                    success: function(data) {
                        if (data.data == 1) {
                            layer.alert("已解冻", { icon: 1 });
                            layui.table.reload('LAY-user-manage');
                        } else {
                            layer.alert("操作失败", { icon: 2 });
                        }
                    },
                    error: function(data) {
                        layer.alert("操作失败", { icon: 2 });
                    }
                });
                layer.close(index);
            });
        } else if (obj.event === 'thawComment') {
            layer.confirm('真的解除冻结用户评论功能吗?', function(index) {
                $.ajax({
                    url: layui.setter.ajaxUrl + "/api/admin/user/freezeCom",
                    method: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        'token': layui.data('data').token,
                        'uid': data.uid
                    }),
                    success: function(data) {
                        if (data.data == 1) {
                            layer.alert("已解冻用户评论功能", { icon: 1 });
                            layui.table.reload('LAY-user-manage');
                        } else {
                            layer.alert("操作失败", { icon: 2 });
                        }
                    },
                    error: function(data) {
                        layer.alert("操作失败", { icon: 2 });
                    }
                });
                layer.close(index);
            });
        } else if (obj.event === 'allOptions') {
            admin.popup({
                title: '其他操作',
                area: ['600px', '450px'],
                id: 'LAY-popup-user-add',
                success: function(layero, index) {
                    view(this.id).render('user/user/allOptions', data).done(function(data) {
                        form.render();
                        form.on('submit(LAY-user-option-submit)', function(data) {
                            var field = data.field;
                            console.log(field)
                            layer.close(index);
                        });
                    });
                }
            });
        }
    });

    //用户评论列表
    table.render({
        elem: '#commentList',
        url: layui.setter.urll + '/api/admin/user/list',
        method: 'get',
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter', 'exports', 'print', {
            title: '提示',
            layEvent: 'LAYTABLE_TIPS',
            icon: 'layui-icon-tips'
        }],
        cols: [
            [
                { field: 'uid', title: 'ID', align: 'center' }, { field: 'phone', title: '评论内容', align: 'center' }, { field: 'sex', title: '点赞数', align: 'center', templet: '#sex' }, { field: 'city', title: '发布类型', align: 'center', templet: '#city' }, { field: 'birthday', title: '发布时间', align: 'center', templet: '#birthday' }
                //   ,{fixed: 'right',	   		title: '操作' 		,align:'center',	width: 250,toolbar:'#table-useradmin-webuser'}
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

    //历史播放记录
    table.render({
        elem: '#playHistory',
        url: layui.setter.urll + '/api/admin/user/list',
        method: 'get',
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter', 'exports', 'print', {
            title: '提示',
            layEvent: 'LAYTABLE_TIPS',
            icon: 'layui-icon-tips'
        }],
        cols: [
            [
                { field: 'uid', title: 'ID', align: 'center' }, { field: 'phone', title: '音频名称', align: 'center' }, { field: 'sex', title: '音频类型', align: 'center', templet: '#sex' }, { field: 'city', title: '播放时间', align: 'center', templet: '#city' }, { field: 'birthday', title: '进度', align: 'center', templet: '#birthday' }
                //   ,{fixed: 'right',	   		title: '操作' 		,align:'center',	width: 250,toolbar:'#table-useradmin-webuser'}
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

    //登陆时间列表
    table.render({
        elem: '#loginHistory',
        url: layui.setter.urll + '/api/admin/user/list',
        method: 'get',
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter', 'exports', 'print', {
            title: '提示',
            layEvent: 'LAYTABLE_TIPS',
            icon: 'layui-icon-tips'
        }],
        cols: [
            [
                { field: 'uid', title: 'ID', align: 'center' }, { field: 'phone', title: '登陆时间', align: 'center' }, { field: 'sex', title: '下线时间', align: 'center', templet: '#sex' }
                //   ,{fixed: 'right',	   		title: '操作' 		,align:'center',	width: 250,toolbar:'#table-useradmin-webuser'}
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

    //点赞列表
    table.render({
        elem: '#likeList',
        url: layui.setter.urll + '/api/admin/user/list',
        method: 'get',
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter', 'exports', 'print', {
            title: '提示',
            layEvent: 'LAYTABLE_TIPS',
            icon: 'layui-icon-tips'
        }],
        cols: [
            [
                { field: 'uid', title: 'ID', align: 'center' }, { field: 'phone', title: '点赞类型', align: 'center' }, { field: 'sex', title: '点赞内容', align: 'center', templet: '#sex' }, { field: 'city', title: '点赞时间', align: 'center', templet: '#city' }
                //   ,{fixed: 'right',	   		title: '操作' 		,align:'center',	width: 250,toolbar:'#table-useradmin-webuser'}
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
    //转发列表
    table.render({
        elem: '#shareList',
        url: layui.setter.urll + '/api/admin/user/list',
        method: 'get',
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter', 'exports', 'print', {
            title: '提示',
            layEvent: 'LAYTABLE_TIPS',
            icon: 'layui-icon-tips'
        }],
        cols: [
            [
                { field: 'uid', title: 'ID', align: 'center' }, { field: 'phone', title: '转发时间', align: 'center' }, { field: 'sex', title: '转发渠道', align: 'center', templet: '#sex' }, { field: 'city', title: '发布类型', align: 'center', templet: '#city' }, { field: 'birthday', title: '发布时间', align: 'center', templet: '#birthday' }
                //   ,{fixed: 'right',	   		title: '操作' 		,align:'center',	width: 250,toolbar:'#table-useradmin-webuser'}
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
    //购买列表
    table.render({
        elem: '#buyList',
        url: layui.setter.urll + '/api/admin/user/list',
        method: 'get',
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter', 'exports', 'print', {
            title: '提示',
            layEvent: 'LAYTABLE_TIPS',
            icon: 'layui-icon-tips'
        }],
        cols: [
            [
                { field: 'uid', title: 'ID', align: 'center' }, { field: 'phone', title: '购买类型', align: 'center' }, { field: 'sex', title: '购买链接', align: 'center', templet: '#sex' }, { field: 'city', title: '购买时间', align: 'center', templet: '#city' }, { field: 'birthday', title: '购买价格', align: 'center', templet: '#birthday' }
                //   ,{fixed: 'right',	   		title: '操作' 		,align:'center',	width: 250,toolbar:'#table-useradmin-webuser'}
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
    //下载列表
    table.render({
        elem: '#downLoadList',
        url: layui.setter.urll + '/api/admin/user/list',
        method: 'get',
        toolbar: '#toolbarDemo',
        defaultToolbar: ['filter', 'exports', 'print', {
            title: '提示',
            layEvent: 'LAYTABLE_TIPS',
            icon: 'layui-icon-tips'
        }],
        cols: [
            [
                { field: 'uid', title: 'ID', align: 'center' }, { field: 'phone', title: '下载内容', align: 'center' }, { field: 'sex', title: '下载时间', align: 'center', templet: '#sex' }
                //   ,{fixed: 'right',	   		title: '操作' 		,align:'center',	width: 250,toolbar:'#table-useradmin-webuser'}
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






    exports('user', {})
});