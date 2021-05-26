/**
	 @Name：vip管理   套餐管理
	 @Author：郭宇
 */

layui.define(["table", "form"], function (exports) {
	var $ = layui.$,
		admin = layui.admin,
		view = layui.view,
		table = layui.table,
		form = layui.form;

	var router = layui.router(); /*定义router,用于得到lay-href传递的id*/
	/*主播列表*/
	table.render({
		elem: "#vtbList",
		url: layui.setter.urll + "/api/admin/vip/list",
		method: "get",
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "avatar", title: "真实姓名", align: "center", templet: "#photo"},
				{field: "name", title: "身份证照片", align: "center"},
				{field: "price", title: "主播简介", align: "center"},
				{field: "explain", title: "音频数量", align: "center"},
				{field: "quota", title: "音频总时长", align: "center"},
				{field: "quota", title: "总容量", align: "center"},
				{field: "quota", title: "成为主播时间", align: "center"},
				{field: "quota", title: "信息修改时间", align: "center"},
				{title: "操作", align: "center", toolbar: "#table-vtb-web", width: 650, fixed: "right"},
			],
		],
		page: true,
		text: {none: "暂无数据", error: "对不起，加载出现异常！"},
		done: function (data) {
			if (data.code == 403) {
				layer.closeAll();
				admin.exit();
				setTimeout(function () {
					layer.alert("此账号已在别处登录,请重新登录！", {icon: 5});
				}, 666);
			}
		},
	});

	/*监听编辑操作*/
	table.on("tool(LAY-vip-manage)", function (obj) {
		var data = obj.data;
		if (obj.event === "edit") {
			admin.popup({
				title: "编辑",
				area: ["500px", "500px"],
				id: "LAY-popup-user-add",
				success: function (layero, index) {
					view(this.id)
						.render("vip/editVip", data)
						.done(function () {
							form.on("submit(LAY-vip-front-submit)", function (data) {
								var field = data.field;
								console.log(field);
								$.ajax({
									url: layui.setter.urll + "/api/admin/vip/edit",
									method: "post",
									contentType: "application/json;charset=UTF-8",
									data: JSON.stringify({
										token: layui.data("data").token,
										id: field.id,
										name: field.name /*套餐名称*/,
										price: field.price /*套餐价格*/,
										logoPath: field.photo /*套餐图片*/,
										explain: field.detail /*套餐说明*/,
										quota: field.integral /*积分额度*/,
									}),
									success: function (data) {
										if (data.data == 1) {
											layer.alert("已更新", {icon: 1});
											layui.table.reload("LAY-vip-manage");
										} else {
											layer.alert("编辑失败，请稍后重试", {icon: 2});
										}
									},
									error: function (data) {
										layer.alert("编辑失败，请稍后重试", {icon: 2});
									},
								});
								layer.close(index);
							});
						});
				},
			});
		} else if (obj.event === "del") {
			layer.confirm("是否确认删除?", function (index) {
				$.ajax({
					url: layui.setter.urll + "/api/admin/vip/delete",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已删除", {icon: 1});
							layui.table.reload("LAY-vip-manage"); //重载表格
						} else {
							layer.alert("删除失败，请稍后重试", {icon: 2});
						}
					},
					error: function (data) {
						layer.alert("操作失败", {icon: 2});
					},
				});
				layer.close(index);
			});
		}
	});

	/*主播列表*/
	table.render({
		elem: "#vtbFolowedList",
		url: layui.setter.urll + "/api/admin/vip/list",
		method: "get",
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "avatar", title: "真实姓名", align: "center", templet: "#photo"},
				{field: "name", title: "身份证照片", align: "center"},
				{field: "price", title: "主播简介", align: "center"},
				{field: "explain", title: "音频数量", align: "center"},
				{field: "quota", title: "音频总时长", align: "center"},
				{field: "quota", title: "总容量", align: "center"},
				{field: "quota", title: "成为主播时间", align: "center"},
				{field: "quota", title: "信息修改时间", align: "center"},
			],
		],
		page: true,
		text: {none: "暂无数据", error: "对不起，加载出现异常！"},
		done: function (data) {
			if (data.code == 403) {
				layer.closeAll();
				admin.exit();
				setTimeout(function () {
					layer.alert("此账号已在别处登录,请重新登录！", {icon: 5});
				}, 666);
			}
		},
	});
	/*音频列表*/
	table.render({
		elem: "#vtbAudioList",
		url: layui.setter.urll + "/api/admin/audio/list",
		method: "get",
		where: {
			token: layui.data("data").token,
			id: router.search.id,
		},
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "title", title: "音频标题", align: "center"},
				{field: "introduce", title: "音频简介", align: "center"},
				{field: "audioPath", title: "音频", align: "center", templet: "#audioPath", width: 400},
				{field: "audioImage", title: "音频图片", align: "center", templet: "#audioImage"},
				{field: "username", title: "播放数量", align: "center"},
				{field: "username", title: "评论数量", align: "center"},
				{field: "username", title: "点赞数量", align: "center"},
				{field: "username", title: "是否热门", align: "center", templet: "#isHot"},
				{field: "username", title: "是否上架", align: "center", templet: "#isGround"},
				{field: "username", title: "上传时间", align: "center"},
				{field: "username", title: "容量", align: "center"},
				{title: "操作", align: "center", toolbar: "#table-edit-operation", width: 100,fixed:"right"},
			],
		],
		page: true,
		text: {none: "暂无数据", error: "对不起，加载出现异常！"},
		done: function (data) {
			if (data.code == 403) {
				layer.closeAll();
				admin.exit();
				setTimeout(function () {
					layer.alert("此账号已在别处登录,请重新登录！", {icon: 5});
				}, 666);
			}
		},
	});

	/*主播列表*/
	table.render({
		elem: "#vtbCommentedList",
		url: layui.setter.urll + "/api/admin/vip/list",
		method: "get",
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "avatar", title: "真实姓名", align: "center", templet: "#photo"},
				{field: "name", title: "身份证照片", align: "center"},
				{field: "price", title: "主播简介", align: "center"},
				{field: "explain", title: "音频数量", align: "center"},
				{field: "quota", title: "音频总时长", align: "center"},
				{field: "quota", title: "总容量", align: "center"},
				{field: "quota", title: "成为主播时间", align: "center"},
				{field: "quota", title: "信息修改时间", align: "center"},
			],
		],
		page: true,
		text: {none: "暂无数据", error: "对不起，加载出现异常！"},
		done: function (data) {
			if (data.code == 403) {
				layer.closeAll();
				admin.exit();
				setTimeout(function () {
					layer.alert("此账号已在别处登录,请重新登录！", {icon: 5});
				}, 666);
			}
		},
	});
	/*主播列表*/
	table.render({
		elem: "#vtbLikedList",
		url: layui.setter.urll + "/api/admin/vip/list",
		method: "get",
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "avatar", title: "真实姓名", align: "center", templet: "#photo"},
				{field: "name", title: "身份证照片", align: "center"},
				{field: "price", title: "主播简介", align: "center"},
				{field: "explain", title: "音频数量", align: "center"},
				{field: "quota", title: "音频总时长", align: "center"},
				{field: "quota", title: "总容量", align: "center"},
				{field: "quota", title: "成为主播时间", align: "center"},
				{field: "quota", title: "信息修改时间", align: "center"},
			],
		],
		page: true,
		text: {none: "暂无数据", error: "对不起，加载出现异常！"},
		done: function (data) {
			if (data.code == 403) {
				layer.closeAll();
				admin.exit();
				setTimeout(function () {
					layer.alert("此账号已在别处登录,请重新登录！", {icon: 5});
				}, 666);
			}
		},
	});
	/*主播列表*/
	table.render({
		elem: "#vtbSharedList",
		url: layui.setter.urll + "/api/admin/vip/list",
		method: "get",
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "avatar", title: "真实姓名", align: "center", templet: "#photo"},
				{field: "name", title: "身份证照片", align: "center"},
				{field: "price", title: "主播简介", align: "center"},
				{field: "explain", title: "音频数量", align: "center"},
				{field: "quota", title: "音频总时长", align: "center"},
				{field: "quota", title: "总容量", align: "center"},
				{field: "quota", title: "成为主播时间", align: "center"},
				{field: "quota", title: "信息修改时间", align: "center"},
			],
		],
		page: true,
		text: {none: "暂无数据", error: "对不起，加载出现异常！"},
		done: function (data) {
			if (data.code == 403) {
				layer.closeAll();
				admin.exit();
				setTimeout(function () {
					layer.alert("此账号已在别处登录,请重新登录！", {icon: 5});
				}, 666);
			}
		},
	});

	
	/*音频列表*/
	table.render({
		elem: "#vtbAudioList",
		url: layui.setter.urll + "/api/admin/audio/list",
		method: "get",
		where: {
			token: layui.data("data").token,
			id: router.search.id,
		},
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "title", title: "音频标题", align: "center"},
				{field: "introduce", title: "音频简介", align: "center"},
				{field: "audioPath", title: "音频", align: "center", templet: "#audioPath", width: 400},
				{field: "audioImage", title: "音频图片", align: "center", templet: "#audioImage"},
				{field: "username", title: "播放数量", align: "center"},
				{field: "username", title: "评论数量", align: "center"},
				{field: "username", title: "点赞数量", align: "center"},
				{field: "username", title: "是否热门", align: "center", templet: "#isHot"},
				{field: "username", title: "是否上架", align: "center", templet: "#isGround"},
				{field: "username", title: "上传时间", align: "center"},
				{field: "username", title: "容量", align: "center"},
				{title: "操作", align: "center", toolbar: "#table-edit-operation", width: 100,fixed:"right"},
			],
		],
		page: true,
		text: {none: "暂无数据", error: "对不起，加载出现异常！"},
		done: function (data) {
			if (data.code == 403) {
				layer.closeAll();
				admin.exit();
				setTimeout(function () {
					layer.alert("此账号已在别处登录,请重新登录！", {icon: 5});
				}, 666);
			}
		},
	});


	
	exports("dynamic", {});
});
