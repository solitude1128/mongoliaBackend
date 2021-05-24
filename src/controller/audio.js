/**
	 @Name：音频管理
	 @Author：郭宇
 */

layui.define(["table", "form"], function(exports) {
    var $ = layui.$,
        admin = layui.admin,
        view = layui.view,
        table = layui.table,
        form = layui.form;

    var router = layui.router(); /*定义router,用于得到lay-href传递的id*/

    /*编辑列表*/
    table.render({
        elem: "#LAY-edit-manage",
        url: layui.setter.urll + "/api/admin/audio/list",
        method: "get",
        where: {
            token: layui.data("data").token,
            id: router.search.id,
        },
        cols: [
            [
                { type: "numbers", title: "序号", align: "center" },
                { field: "title", title: "音频标题", align: "center" },
                { field: "introduce", title: "音频简介", align: "center" },
                { field: "audioPath", title: "音频", align: "center", templet: "#audioPath", width: 400 },
                { field: "audioImage", title: "音频图片", align: "center", templet: "#audioImage" },
                // { field: "username", title: "是否付费", align: "center", templet: "#isPay" },
                { title: "操作", align: "center", toolbar: "#table-edit-operation", width: 200 },
            ],
        ],
        page: true,
        text: { none: "暂无数据", error: "对不起，加载出现异常！" },
        done: function(data) {
            if (data.code == 403) {
                layer.closeAll();
                admin.exit();
                setTimeout(function() {
                    layer.alert("此账号已在别处登录,请重新登录！", { icon: 5 });
                }, 666);
            }
        },
    });

    /*目录列表*/
    table.render({
        elem: "#LAY-catalog-manage",
        url: layui.setter.urll + "/api/admin/audio/dir/list",
        method: "get",
        cols: [
            [
                { type: "numbers", title: "序号", align: "center" },
                { field: "id", title: "音频ID", width: 80, align: "center" },
                { field: "title", title: "目录标题", width: 90, align: "center" },
                { field: "clazzName", title: "目录分类", align: "center", width: 90, templet: "#labelType" },
                { field: "tagList", title: "目录标签", align: "center", width: 90, templet: "#tagList" },
                { field: "imagePath", title: "封面图片", align: "center", width: 90, templet: "#imgTpl" },
                { field: "nickname", title: "上传者", width: 120, align: "center" },
                { field: "totalTime", title: " 总时长", align: "center", width: 150, templet: "#totalTime" },
                { field: "price", title: "价格", align: "center" },
                { field: "number", title: "章节数", width: 80, align: "center" },
                { field: "username", title: "播放次数", width: 90, align: "center" },
                { field: "username", title: "购买次数", width: 90, align: "center" },
                { field: "name", title: "购买总额", width: 90, align: "center" },
                { field: "username", title: "评论次数", width: 90, align: "center" },
                { field: "username", title: "点赞次数", width: 90, align: "center" },
                { title: "操作", align: "center", toolbar: "#table-catalog-operation", width: 200, fixed: "right" },
            ],
        ],
        page: true,
        text: { none: "暂无数据", error: "对不起，加载出现异常！" },
        done: function(data) {
            if (data.code == 403) {
                layer.closeAll();
                admin.exit();
                setTimeout(function() {
                    layer.alert("此账号已在别处登录,请重新登录！", { icon: 5 });
                }, 666);
            }
        },
    });

    /*监听音频目录编辑、删除操作*/
    table.on("tool(LAY-catalog-manage)", function(obj) {
        var data = obj.data;
        var deal = {
            del() {
                layer.confirm("是否确认删除?", function(index) {
                    $.ajax({
                        url: layui.setter.urll + "/api/admin/audio/dir/del",
                        method: "post",
                        contentType: "application/json;charset=UTF-8",
                        data: JSON.stringify({
                            token: layui.data("data").token,
                            id: data.id,
                        }),
                        success: function(data) {
                            if (data.data == 1) {
                                layer.alert("已删除", { icon: 1 });
                                layui.table.reload("LAY-catalog-manage");
                            } else {
                                layer.alert("操作失败", { icon: 2 });
                            }
                        },
                        error: function(data) {
                            layer.alert("操作失败", { icon: 2 });
                        },
                    });
                    layer.close(index);
                });
            },
            edit() {
                admin.popup({
                    title: "编辑",
                    area: ["550px", "610px"],
                    id: "LAY-popup-user-add",
                    success: function(layero, index) {
                        view(this.id)
                            .render("audio/editCatalog", data)
                            .done(function() {
                                form.on("submit(LAY-audio-front-submit)", function(data) {
                                    var field = data.field;
                                    console.log(field);
                                    var id = "";
                                    $("input:checkbox[name='checkbox']:checked").each(function(i) {
                                        id += $(this).attr("id") + ",";
                                    });
                                    id = id.slice(0, -1);
                                    console.log(id);
                                    $.ajax({
                                        url: layui.setter.urll + "/api/admin/audio/dir/edit",
                                        method: "post",
                                        contentType: "application/json;charset=UTF-8",
                                        data: JSON.stringify({
                                            token: layui.data("data").token,
                                            id: field.id /*目录id*/ ,
                                            title: field.catalogTitle /*目录标题*/ ,
                                            introduce: field.catalogIntroduce /*目录介绍*/ ,
                                            classId: field.catalogType /*目录分类id*/ ,
                                            tag: id /*目录标签id*/ ,
                                            flag: 1,
                                            imagePath: field.demo2 /*封面图片*/ ,
                                            price: field.price /*价格*/ ,
                                            ifRel: field.isUpperShelf /*是否上架*/ ,
                                        }),
                                        success: function(data) {
                                            if (data.data == 1) {
                                                layer.alert("已更新", { icon: 1 });
                                                layui.table.reload("LAY-catalog-manage");
                                            } else {
                                                layer.alert("编辑失败，请稍后重试", { icon: 2 });
                                            }
                                        },
                                        error: function(data) {
                                            layer.alert("编辑失败，请稍后重试", { icon: 2 });
                                        },
                                    });
                                    layer.close(index);
                                });
                            });
                    },
                });
            },
            viewAudioCommentList() {
                admin.popup({
                    title: "评论列表",
                    area: ["550px", "610px"],
                    id: "viewAudioCommentList",
                    success: function(layero, index) {
                        view(this.id)
                            .render("components/list", data)
                            .done(function() {});
                    },
                });
            },
            viewAudioPlayList() {
                admin.popup({
                    title: "播放列表",
                    area: ["550px", "610px"],
                    id: "viewAudioPlayList",
                    success: function(layero, index) {
                        view(this.id)
                            .render("components/list", data)
                            .done(function() {});
                    },
                });
            },
            viewAudioDownLoadList() {
                admin.popup({
                    title: "编辑列表",
                    area: ["550px", "610px"],
                    id: "viewAudioDownLoadList",
                    success: function(layero, index) {
                        view(this.id)
                            .render("components/list", data)
                            .done(function() {});
                    },
                });
            },
            viewAudioLikeList() {
                admin.popup({
                    title: "点赞列表",
                    area: ["550px", "610px"],
                    id: "viewAudioLikeList",
                    success: function(layero, index) {
                        view(this.id)
                            .render("components/list", data)
                            .done(function() {});
                    },
                });
            },
        };
        deal[obj.event]();
    });

    /*监听音频章节编辑、删除操作*/
    table.on("tool(LAY-edit-manage)", function(obj) {
        var data = obj.data;
        console.log(data);
        if (obj.event === "del") {
            layer.confirm("是否确认删除?", function(index) {
                $.ajax({
                    url: layui.setter.urll + "/api/admin/audio/del",
                    method: "post",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify({
                        token: layui.data("data").token,
                        id: data.id,
                    }),
                    success: function(data) {
                        if (data.data == 1) {
                            layer.alert("已删除", { icon: 1 });
                            layui.table.reload("LAY-edit-manage");
                        } else {
                            layer.alert("操作失败", { icon: 2 });
                        }
                    },
                    error: function(data) {
                        layer.alert("操作失败", { icon: 2 });
                    },
                });
                layer.close(index);
            });
        } else if (obj.event === "edit") {
            admin.popup({
                title: "编辑",
                area: ["550px", "500px"],
                id: "LAY-popup-user-add",
                success: function(layero, index) {
                    view(this.id)
                        .render("audio/editSection", data)
                        .done(function() {
                            form.render();
                            form.on("submit(LAY-audio-front-submit)", function(data) {
                                var field = data.field;
                                console.log(field);
                                $.ajax({
                                    url: layui.setter.urll + "/api/admin/audio/edit",
                                    method: "post",
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify({
                                        token: layui.data("data").token,
                                        title: field.title /*音频标题*/ ,
                                        introduce: field.introduce /*音频简介*/ ,
                                        image: field.photo /*图片路径*/ ,
                                        audioPath: field.audioPath /*音频路径*/ ,
                                        lrcPath: field.lrc /*音歌词路径*/ ,
                                        audioTime: field.audioLength /*音频时间*/ ,
                                        dirId: router.search.id /*目录id*/ ,
                                        id: field.id /*音频id*/ ,
                                    }),
                                    success: function(data) {
                                        if (data.data == 1) {
                                            layer.alert("已更新", { icon: 1 });
                                            layui.table.reload("LAY-edit-manage");
                                        } else {
                                            layer.alert("编辑失败，请稍后重试", { icon: 2 });
                                        }
                                    },
                                    error: function(data) {
                                        layer.alert("编辑失败，请稍后重试", { icon: 2 });
                                    },
                                });
                                layer.close(index);
                            });
                        });
                },
            });
        }
    });

    /*监听音频章节是否付费开关*/
    form.on("switch(switchPay)", function(data) {
        var flag = this.checked;
        var id = data.elem.attributes["switch_id"].nodeValue;
        console.log(flag);
        console.log(id);
        $.ajax({
            url: layui.setter.urll + "/api/admin/audio/pay",
            dataType: "JSON",
            contentType: "application/json;charset=UTF-8",
            type: "POST",
            data: JSON.stringify({
                token: layui.data("data").token,
                id: id,
            }),
            success: function(data) {
                if (data.data == 1) {
                    layer.msg("操作成功");
                    $("checkbox").prop("checked", false);
                    layui.table.reload("LAY-edit-manage");
                } else {
                    layer.msg("操作失败");
                }
            },
            error: function(err) {
                layer.alert("操作失败", { icon: 2 });
            },
        });
    });

    exports("audio", {});
});