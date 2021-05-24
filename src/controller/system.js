/**
	 @Name： 系统管理
	 @Author：张佳乐
 */
console.log(layui.data('data'))
layui.define(['table', 'form', 'upload'], function(exports) {
    var $ = layui.$,
        layer = layui.layer,
        admin = layui.admin,
        view = layui.view,
        table = layui.table,
        form = layui.form,
        laytpl = layui.laytpl,
        setter = layui.setter,
        upload = layui.upload;
    // 支付记录列表
    table.render({
        elem: '#LAY-system-payHistory',
        url: layui.setter.urll + '/api/admin/user/vipRecordAlls',
        method: 'get',
        params: JSON.stringify({
            "token": layui.data('data').token,
        }),
        cols: [
            [
                { type: 'number', field: 'id', title: '序号', align: 'center' },
                { field: 'nickName', title: '用户名', align: 'center' },
                { field: 'phone', title: '手机号', align: 'center' }, //没有手机号
                { field: 'orderId', title: '订单编号', align: 'center' },
                { field: 'setMealName', title: '会员套餐类型', align: 'center' },
                { field: 'price', title: '交易金额', align: 'center' },
                { field: 'payTime', title: '交易时间', align: 'center' },
                { field: 'state', title: '订单状态', align: 'center', templet: '#payHistoryStatus' },
                { field: 'orderType', title: '操作', align: 'center', toolbar: '#table-system-payHistory' }
            ]
        ],
        page: true,
        text: { none: '暂无数据', error: '对不起，加载出现异常！' },
        done: function(data) {
            console.log(data)
            data.count = data.data.length
            if (data.code == 403) {
                layer.closeAll();
                admin.exit();
                setTimeout(function() {
                    layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
                }, 666);
            }
        },
    });

    /*监听支付记录删除操作*/
    table.on('tool(LAY-system-payHistory)', function(obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('是否确认删除?', function(index) {
                $.ajax({
                    url: layui.setter.urll + '/api/admin/user/delVipRecordById?token=' + layui.data('data').token + "&id=" + data.id,
                    method: "delete",
                    success: function(data) {
                        if (data.data == 1) {
                            layer.alert('已删除', { icon: 1 });
                            layui.table.reload('LAY-system-payHistory');
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
        } else if (obj.event === 'tips') {
            console.log(data.uid)
            $.ajax({
                url: layui.setter.urll + '/api/admin/message/add',
                method: "post",
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({
                    'token': layui.data('data').token,
                    'msgTitle': "订单消息" /*标题*/ ,
                    'msgBriefly': "您有一个订单未支付,请尽快支付" /*内容简要*/ ,
                    'msgContent': "您有一个订单未支付,请尽快支付" /*消息内容*/ ,
                    'receiver': data.uid /*接收用户*/ ,
                    "msgType": 0,
                }),
                success: function(data) {
                    if (data.code == 200) {
                        layer.alert('发送提醒成功', { icon: 1 });
                        layui.table.reload('LAY-system-payHistory');
                    } else {
                        layer.alert('操作失败', { icon: 2 });
                    }
                },
                error: function(data) {
                    layer.alert('操作失败', { icon: 2 });
                }
            });
        }
    });

    /*套餐列表*/
    table.render({
        elem: '#LAY-vip-manage',
        url: layui.setter.urll + '/api/admin/vip/list',
        method: 'get',
        cols: [
            [
                { type: 'numbers', title: '序号', align: 'center' }, { field: 'logoPath', title: '套餐Logo', align: 'center', templet: '#photo' }, { field: 'name', title: '名称', align: 'center' }, { field: 'price', title: '价格', align: 'center' }, { field: 'explain', title: '套餐说明', align: 'center' }, { field: 'quota', title: '可用积分额度', align: 'center' }, { field: 'ifSale', title: '状态', align: 'center', templet: '#comboStatus' }, { title: '操作', align: 'center', toolbar: '#table-vip-operation' }
            ]
        ],
        page: true,
        text: { none: '暂无数据', error: '对不起，加载出现异常！' },
        done: function(data) {
            console.log(data)
            if (data.code == 403) {
                layer.closeAll();
                admin.exit();
                setTimeout(function() {
                    layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
                }, 666);
            }
        }
    });

    /*监听编辑,删除操作*/
    table.on('tool(LAY-vip-manage)', function(obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            admin.popup({
                title: '编辑',
                area: ['500px', '500px'],
                id: 'LAY-popup-user-add',
                success: function(layero, index) {
                    view(this.id).render('vip/editVip', data).done(function() {
                        form.on('submit(LAY-vip-front-submit)', function(data) {
                            var field = data.field;
                            console.log(field);
                            $.ajax({
                                url: layui.setter.urll + '/api/admin/vip/edit',
                                method: "post",
                                contentType: 'application/json;charset=UTF-8',
                                data: JSON.stringify({
                                    'token': layui.data('data').token,
                                    'id': field.id,
                                    'name': field.name /*套餐名称*/ ,
                                    'price': field.price /*套餐价格*/ ,
                                    'logoPath': field.photo /*套餐图片*/ ,
                                    'explain': field.detail /*套餐说明*/ ,
                                    'quota': field.integral /*积分额度*/ ,
                                    'ifSale': field.ifSale /*是否上架*/
                                }),
                                success: function(data) {
                                    if (data.data == 1) {
                                        layer.alert('已更新', { icon: 1 });
                                        layui.table.reload('LAY-vip-manage');
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
        } else if (obj.event === 'del') {
            layer.confirm('是否确认删除?', function(index) {
                $.ajax({
                    url: layui.setter.urll + "/api/admin/vip/delete",
                    method: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        'token': layui.data('data').token,
                        'id': data.id
                    }),
                    success: function(data) {
                        if (data.data == 1) {
                            layer.alert('已删除', { icon: 1 });
                            layui.table.reload('LAY-vip-manage'); //重载表格
                        } else {
                            layer.alert('删除失败，请稍后重试', { icon: 2 });
                        }
                    },
                    error: function(data) {
                        layer.alert('操作失败', { icon: 2 });
                    }
                });
                layer.close(index);
            });
        }
    });

    /*监听套餐上下架开关*/
    form.on('switch(switchCombo)', function(data) {
        var flag = this.checked;
        var id = data.elem.attributes['switch_id'].nodeValue;
        $.ajax({
            url: layui.setter.urll + '/api/admin/vip/updateIfSale',
            dataType: 'JSON',
            contentType: 'application/json;charset=UTF-8',
            type: 'POST',
            data: JSON.stringify({
                'token': layui.data('data').token,
                'id': id,
                'flag': flag * 1
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

    // 固定IP会员列表
    table.render({
        elem: '#LAY-system-secureIP',
        url: layui.setter.urll + '/api/admin/user/getUserIpVipAll',
        method: 'get',
        params: JSON.stringify({
            "token": layui.data('data').token,
            "page": 1,
            "limit": 10
        }),
        cols: [
            [
                { type: 'number', field: 'id', title: '序号', align: 'center', width: '5%' },
                { field: 'ip', title: '授权固定IP地址', align: 'center', width: '20%' },
                { field: 'licenseUnits', title: '授权单位', align: 'center', width: '12%' },
                { field: 'startTime', title: '起止时间', align: 'center', templet: '#seTime', width: '18%' },
                { field: 'classify', title: '授权分类', align: 'center', templet: '#classify', width: '6%' },
                { field: 'price', title: '金额', align: 'center', width: '8%' },
                { field: 'uname', title: '联系人', align: 'center', width: '15%' },
                { field: 'phone', title: '联系电话', align: 'center', width: '10%' },
                { field: 'options', title: '操作', align: 'center', toolbar: '#table-system-secure' }
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

    /*任务列表*/
    table.render({
        elem: '#LAY-system-mession',
        // url: layui.setter.urll + '/api/admin/task/list',
        // method: 'get',
        cols: [
            [
                { type: 'numbers', title: '序号', align: 'center' }, { field: 'taskName', title: '任务名称', align: 'center' }, { field: 'taskStatus', title: '任务类型', align: 'center', templet: '#taskStatus' }, { field: 'sort', title: '排序', align: 'center' }, { field: 'retrievable', title: '可获积分', align: 'center' }, { field: 'dayMost', title: '每天最多可获积分', align: 'center' }, { field: 'details', title: '任务详情', align: 'center' }, { field: 'shotVip', title: '短期会员', align: 'center' }, { title: '编辑', align: 'center', toolbar: "#table-task-operation" }
            ]
        ],
        data: [
            { taskName: '啊啊啊', taskStatus: 1, sort: 1, retrievable: 12, dayMost: 100, details: "任务详情啊啊啊啊啊啊啊啊啊aaaaaaaaaaaaaaaaaaaaaaaaaaaaa", shotVip: 2 },
            { taskName: '啊啊啊', taskStatus: 2, sort: 2, retrievable: 12, dayMost: 100, details: "任务详情啊啊啊啊啊啊啊啊啊", shotVip: 7 },
            { taskName: '啊啊啊', taskStatus: 3, sort: 3, retrievable: 12, dayMost: 100, details: "任务详情啊啊啊啊啊啊啊啊啊", shotVip: 0 },
        ],
        page: true,
        text: { none: '暂无数据', error: '对不起，加载出现异常！' },
        // done: function(data) {
        //     if (data.code == 403) {
        //         layer.closeAll();
        //         admin.exit();
        //         setTimeout(function() {
        //             layer.alert('此账号已在别处登录,请重新登录！', { icon: 5 });
        //         }, 666);
        //     }
        // }
    });

    /*监听编辑操作*/
    table.on('tool(LAY-system-mession)', function(obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            admin.popup({
                title: '编辑',
                area: ['600px', '350px'],
                id: 'LAY-popup-user-add',
                success: function(layero, index) {
                    view(this.id).render('system/editTask', data).done(function() {
                        //监听提交
                        form.on('submit(LAY-task-front-submit)', function(data) {
                            var field = data.field;
                            console.log(field);
                            alert("等接口ing...")
                                // $.ajax({
                                //     url: layui.setter.urll + '/api/admin/task/edit',
                                //     method: "post",
                                //     contentType: 'application/json;charset=UTF-8',
                                //     data: JSON.stringify({
                                //         'token': layui.data('data').token,
                                //         'integral': field.integral /*可获积分*/ ,
                                //         'integralOfDay': field.maxIntegral /*每天最多获取积分*/ ,
                                //         'detail': field.taskDetail /*任务详情*/ ,
                                //         'id': field.id
                                //     }),
                                //     success: function(data) {
                                //         if (data.data == 1) {
                                //             layer.alert('已更新', { icon: 1 });
                                //             layui.table.reload('LAY-task-manage');
                                //         } else {
                                //             layer.alert('编辑失败，请稍后重试', { icon: 2 });
                                //         }
                                //     },
                                //     error: function(data) {
                                //         layer.alert('编辑失败，请稍后重试', { icon: 2 });
                                //     }
                                // });
                            layer.close(index);
                        });
                    });
                }
            });
        }
    });

    //反馈列表
    table.render({
        elem: '#LAY-system-manage',
        url: layui.setter.ajaxUrl + '/api/admin/feedback/list',
        method: 'get',
        cols: [
            [
                { field: 'uid', title: '用户ID', align: 'center' }, { field: 'username', title: '用户昵称', align: 'center' }, { field: 'phone', title: '手机号', align: 'center' }, { field: 'content', title: '反馈内容', align: 'center' }, { field: 'createTime', title: '反馈时间', align: 'center' }, { field: 'status', title: '状态', align: 'center', templet: '#Status' }, { title: '操作', width: 150, align: 'center', align: 'center', fixed: 'right', toolbar: '#table-system-webuser' }
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

    /*监听意见反馈回复、删除操作*/
    table.on('tool(LAY-system-manage)', function(obj) {
        var data = obj.data;
        console.log(data);
        if (obj.event === 'del') {
            layer.confirm('是否确认删除?', function(index) {
                $.ajax({
                    url: layui.setter.urll + "/api/admin/feedback/del",
                    method: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        'token': layui.data('data').token,
                        'id': data.id
                    }),
                    success: function(data) {
                        if (data.data == 1) {
                            layer.alert("已删除", { icon: 1 });
                            layui.table.reload('LAY-system-manage');
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
        } else if (obj.event === 'reply') {
            admin.popup({
                title: '回复',
                area: ['900px', '550px'],
                id: 'LAY-popup-user-add',
                success: function(layero, index) {
                    view(this.id).render('system/reply', data).done(function() {
                        //监听提交
                        form.on('submit(LAY-reply-front-submit)', function(data) {
                            var field = data.field;
                            $.ajax({
                                url: layui.setter.urll + "/api/admin/feedback/reply",
                                method: "post",
                                contentType: 'application/json;charset=UTF-8',
                                data: JSON.stringify({
                                    'token': layui.data('data').token,
                                    'reply': field.content /*回复内容*/ ,
                                    'id': field.uid /*回复给谁*/
                                }),
                                success: function(data) {
                                    if (data.data == 1) {
                                        layer.alert('已回复', { icon: 1 });
                                        layui.table.reload('LAY-system-manage');
                                    } else {
                                        layer.alert('请稍后重试', { icon: 2 });
                                    }
                                },
                                error: function(data) {
                                    layer.alert('请稍后重试', { icon: 2 });
                                }
                            });
                            layer.close(index);
                        });
                    });
                }
            });
        }
    });

    //常见问题列表
    table.render({
        elem: '#LAY-system-problem',
        url: layui.setter.urll + '/api/admin/problem/list',
        method: 'get',
        cols: [
            [
                { field: 'problem', title: '问题名称', align: 'center' }, { field: 'answer', title: '回复描述', align: 'center' }, { field: 'createTime', title: '创建时间', align: 'center' }, { title: '操作', align: 'center', align: 'center', fixed: 'right', toolbar: '#table-system-webuser' }
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

    /*监听常见问题编辑、删除操作*/
    table.on('tool(LAY-system-problem)', function(obj) {
        var data = obj.data;
        console.log(data);
        if (obj.event === 'del') {
            layer.confirm('是否确认删除?', function(index) {
                $.ajax({
                    url: layui.setter.urll + '/api/admin/problem/del',
                    method: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        'token': layui.data('data').token,
                        'id': data.id
                    }),
                    success: function(data) {
                        layer.alert("已删除", { icon: 1 });
                        layui.table.reload('LAY-system-problem');
                    },
                    error: function(data) {
                        layer.alert("操作失败", { icon: 2 });
                    }
                });
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            admin.popup({
                title: '编辑',
                area: ['900px', '600px'],
                id: 'LAY-popup-user-add',
                success: function(layero, index) {
                    view(this.id).render('system/editProblem', data).done(function() {
                        //监听提交
                        form.on('submit(LAY-problem-front-submit)', function(data) {
                            var field = data.field;
                            $.ajax({
                                url: layui.setter.urll + "/api/admin/problem/edit",
                                method: "post",
                                contentType: 'application/json;charset=UTF-8',
                                data: JSON.stringify({
                                    'token': layui.data('data').token,
                                    'answer': field.content /*回复描述*/ ,
                                    'problem': field.name /*问题名称*/ ,
                                    'id': field.id
                                }),
                                success: function(data) {
                                    if (data.data == 1) {
                                        layer.alert('已更新', { icon: 1 });
                                        layui.table.reload('LAY-system-problem');
                                    } else {
                                        layer.alert('请稍后重试', { icon: 2 });
                                    }
                                },
                                error: function(data) {
                                    layer.alert('请稍后重试', { icon: 2 });
                                }
                            });
                            layer.close(index);
                        });
                    });
                }
            });
        }
    });


    layui.use(['layer', 'form', 'table', 'layedit', 'laydate', 'jquery'], function() {
        var form = layui.form,
            laydate = layui.laydate,
            layer = layui.layer,
            $ = layui.jquery;

        form.on('submit(LAY-contactUs-front-submit)', function(data) {
            var field = data.field; //获取提交的字段
            console.log(field.tel);
            console.log(field.url);
            console.log(field.email);
            $.ajax({
                url: layui.setter.urll + '/api/admin/about/edit',
                method: 'post',
                contentType: "application/json",
                data: JSON.stringify({
                    'token': layui.data('data').token,
                    'phone': field.tel /*电话*/ ,
                    'url': field.url /*网址*/ ,
                    'email': field.email /*邮箱*/
                }),
                success: function(data) {
                    if (data.data == 1) {
                        layer.alert("已更新", { icon: 1 });
                        location.reload();
                    } else {
                        layer.alert('操作失败', { icon: 2 });
                    }
                },
                error: function(data) {
                    layer.alert('操作失败', { icon: 2 });
                }
            });
        });

        /*关于我们--确认*/
        form.on('submit(LAY-aboutUs-submit)', function(data) {
            var field = data.field; //获取提交的字段
            console.log(field.introduction);
            console.log(field.law);
            console.log(field.platform);
            $.ajax({
                url: layui.setter.urll + '/api/admin/about/edit',
                method: 'post',
                contentType: "application/json",
                data: JSON.stringify({
                    'token': layui.data('data').token,
                    'function': field.introduction /*功能介绍*/ ,
                    'legalStatement': field.law /*法律声明*/ ,
                    'agreement': field.platform /*平台协议*/
                }),
                success: function(data) {
                    if (data.data == 1) {
                        layer.alert('已更新', { icon: 1 });
                        location.reload();
                    } else {
                        layer.alert('操作失败', { icon: 2 });
                    }
                },
                error: function(data) {
                    layer.alert('操作失败', { icon: 2 });
                }
            });
        });

        /*用户协议--确认*/
        form.on('submit(LAY-system-front-submit)', function(data) {
            var field = data.field; //获取提交的字段
            $.ajax({
                url: layui.setter.urll + '/api/admin/about/edit',
                method: 'post',
                contentType: "application/json",
                data: JSON.stringify({
                    'token': layui.data('data').token,
                    'agreement': field.userText /*用户协议*/
                }),
                success: function(data) {
                    if (data.data == 1) {
                        layer.alert('已更新', { icon: 1 });
                        location.reload();
                    } else {
                        layer.alert('操作失败', { icon: 2 });
                    }
                },
                error: function(data) {
                    layer.alert('操作失败', { icon: 2 });
                }
            });
        });
        exports('system', {});
    });
});