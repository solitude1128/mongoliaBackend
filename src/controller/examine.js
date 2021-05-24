/**
	 @Name：审核管理   信息认证审核列表    动态审核列表
	 @Author：郭宇
 */

layui.define(["table", "form"], function (exports) {
	var $ = layui.$,
		admin = layui.admin,
		view = layui.view,
		table = layui.table,
		form = layui.form;

	/*信息认证审核列表*/
	table.render({
		elem: "#LAY-examine-manage-information",
		url: layui.setter.urll + "/api/admin/user/audit",
		method: "get",
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "uid", title: "ID", align: "center"},
				{field: "nickname", title: "用户名", align: "center"},
				{field: "phone", title: "手机号", align: "center"},
				{
					field: "username",
					title: "认证内容",
					align: "center",
					event: "detail",
					templet: function (rec) {
						return '<button class="layui-btn layui-btn-warm layui-btn-xs">查看认证详情</button>';
					},
				},
				{field: "phone", title: "地区", align: "center"},
				{field: "username", title: "审核状态", align: "center", templet: "#examineStatus"},
				{field: "updateTime", title: "操作时间", align: "center", templet: "#updateTime"},
				{title: "操作", align: "center", toolbar: "#table-dynamic-operation", width: 150},
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

	/*动态审核列表*/
	table.render({
		elem: "#LAY-examine-manage-dynamic",
		url: layui.setter.urll + "/api/admin/dynamic/audit",
		method: "get",
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "id", title: "动态ID", align: "center"},
				{field: "tagName", title: "标签", align: "center"},
				{field: "title", title: "标题", align: "center"},
				{field: "nickName", title: "发布人", align: "center"},
				{field: "phone", title: "手机号", align: "center"},
				{field: "createTime", title: "发布时间", align: "center"},
				{field: "isPass", title: "审核状态", align: "center", templet: "#examineStatus"},
				{title: "操作", align: "center", toolbar: "#table-dynamic-operation", width: 180},
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

	/*动态评论审核列表*/
	table.render({
		elem: "#LAY-examine-manage-dynamicEvaluation",
		url: layui.setter.urll + "/api/admin/comment/dynamic",
		method: "get",
		cols: [
			[
				{field: "nickName", title: "用户名称", align: "center"},
				{field: "phone", title: "手机号", align: "center"},
				{field: "dynamicTitle", title: "标题名称", align: "center"},
				{field: "content", title: "评论内容", align: "center"},
				{field: "createTime", title: "发布时间", align: "center"},
				{field: "isPass", title: "审核状态", align: "center", templet: "#examineStatus"},
				{title: "操作", align: "center", toolbar: "#table-dynamic-operation", width: 180},
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

	/*监听信息认证审核列表通过、驳回、审核操作*/
	table.on("tool(LAY-examine-manage-information)", function (obj) {
		var data = obj.data;
		console.log(data);
		if (obj.event === "pass") {
			layer.confirm("确定通过?", function (index) {
				$.ajax({
					url: layui.setter.urll + "/api/admin/user/review",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
						flag: 1,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已通过", {icon: 1});
							layui.table.reload("LAY-examine-manage-information");
						} else {
							layer.alert("操作失败", {icon: 2});
						}
					},
					error: function (data) {
						layer.alert("操作失败", {icon: 2});
					},
				});
				layer.close(index);
			});
		} else if (obj.event === "reject") {
			admin.popup({
				title: "填写驳回原因",
				area: ["750px", "550px"],
				id: "LAY-popup-user-add",
				success: function (layero, index) {
					view(this.id)
						.render("examine/reject", data)
						.done(function () {
							form.render();
							//监听提交
							form.on("submit(LAY-reject-front-submit)", function (data) {
								var field = data.field;
								console.log(field.id);
								console.log(field.reject);
								$.ajax({
									url: layui.setter.urll + "/api/admin/user/review",
									method: "post",
									contentType: "application/json;charset=UTF-8",
									data: JSON.stringify({
										token: layui.data("data").token,
										id: field.id /*id*/,
										tmp: field.reject /*驳回原因*/,
										flag: -1,
									}),
									success: function (data) {
										if (data.data == 1) {
											layer.alert("已驳回", {icon: 1});
											layui.table.reload("LAY-examine-manage-information");
										} else {
											layer.alert("操作失败，请稍后重试", {icon: 2});
										}
									},
									error: function (data) {
										layer.alert("操作失败，请稍后重试", {icon: 2});
									},
								});
								layer.close(index);
							});
						});
				},
			});
		} else if (obj.event === "detail") {
			admin.popup({
				title: "身份认证",
				area: ["750px", "570px"],
				id: "LAY-popup-user-add",
				success: function (layero, index) {
					view(this.id)
						.render("examine/identity", data)
						.done(function () {
							form.render();
							//监听提交
							form.on("submit(LAY-detail-front-submit)", function (data) {
								layer.close(index);
							});
						});
				},
			});
		}
	});

	/*监听动态审核列表通过、拒绝操作*/
	table.on("tool(LAY-examine-manage-dynamic)", function (obj) {
		var data = obj.data;
		console.log(data);
		if (obj.event === "pass") {
			layer.confirm("确定通过?", function (index) {
				$.ajax({
					url: layui.setter.urll + "/api/admin/dynamic/review",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
						flag: 1,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已通过", {icon: 1});
							layui.table.reload("LAY-examine-manage-dynamic");
						} else {
							layer.alert("操作失败", {icon: 2});
						}
					},
					error: function (data) {
						layer.alert("操作失败", {icon: 2});
					},
				});
				layer.close(index);
			});
		} else if (obj.event === "reject") {
			admin.popup({
				title: "填写拒绝原因",
				area: ["750px", "550px"],
				id: "LAY-popup-user-add",
				success: function (layero, index) {
					view(this.id)
						.render("examine/refuse", data)
						.done(function () {
							form.render();
							form.on("submit(LAY-reject-front-submit)", function (data) {
								var field = data.field;
								console.log(field.id);
								console.log(field.reject);
								$.ajax({
									url: layui.setter.urll + "/api/admin/dynamic/review",
									method: "post",
									contentType: "application/json;charset=UTF-8",
									data: JSON.stringify({
										token: layui.data("data").token,
										id: field.id,
										tmp: field.reject,
										flag: -1,
									}),
									success: function (data) {
										if (data.data == 1) {
											layer.alert("已拒绝", {icon: 1});
											layui.table.reload("LAY-examine-manage-dynamic");
										} else {
											layer.alert("请稍后重试", {icon: 2});
										}
									},
									error: function (data) {
										layer.alert("请稍后重试", {icon: 2});
									},
								});
								layer.close(index);
							});
						});
				},
			});
		} else if (obj.event === "detail") {
			admin.popup({
				title: "详细信息",
				area: ["750px", "550px"],
				id: "LAY-popup-user-add",
				success: function (layero, index) {
					view(this.id)
						.render("examine/detail", data)
						.done(function () {
							form.render();
							form.on("submit(LAY-detail-front-submit)", function (data) {
								var field = data.field;
								layer.close(index);
							});
						});
				},
			});
		}
	});

	/*监听动态评论审核列表通过、拒绝操作*/
	table.on("tool(LAY-examine-manage-dynamicEvaluation)", function (obj) {
		var data = obj.data;
		console.log(data);
		if (obj.event === "pass") {
			layer.confirm("确定通过?", function (index) {
				$.ajax({
					url: layui.setter.urll + "/api/admin/comment/review",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
						flag: 1,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已通过", {icon: 1});
							layui.table.reload("LAY-examine-manage-dynamicEvaluation");
						} else {
							layer.alert("操作失败", {icon: 2});
						}
					},
					error: function (data) {
						layer.alert("操作失败", {icon: 2});
					},
				});
				layer.close(index);
			});
		} else if (obj.event === "reject") {
			layer.confirm("确定驳回?", function (index) {
				$.ajax({
					url: layui.setter.urll + "/api/admin/comment/review",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
						flag: -1,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已驳回", {icon: 1});
							layui.table.reload("LAY-examine-manage-dynamicEvaluation");
						} else {
							layer.alert("操作失败", {icon: 2});
						}
					},
					error: function (data) {
						layer.alert("操作失败", {icon: 2});
					},
				});
				layer.close(index);
			});
		} else if (obj.event === "del") {
			layer.confirm("确定删除评论吗?", function (index) {
				$.ajax({
					url: layui.setter.ajaxUrl + "/api/admin/comment/del",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已删除", {icon: 1});
							layui.table.reload("LAY-examine-manage-dynamicEvaluation");
						} else {
							layer.alert("操作失败", {icon: 2});
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

	/*艺人审核列表*/
	table.render({
		elem: "#LAY-examine-artist-information",
		url: layui.setter.urll + "/api/admin/user/artist",
		method: "get",
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "aname", title: "名称", align: "center"},
				{field: "artistPhotos", title: "头像", align: "center",templet: "#imgTpl"},
				{field: "artistProfile", title: "简介", align: "center"},
				{field: "createTime", title: "发布时间", align: "center"},
				{field: "artistState", title: "审核状态", align: "center", templet: "#examineStatus"},
				{title: "操作", align: "center", toolbar: "#table-dynamic-operation", width: 180},
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

	/*动态评论审核列表*/
	table.render({
		elem: "#LAY-examine-manage-dynamicEvaluation",
		url: layui.setter.urll + "/api/admin/comment/dynamic",
		method: "get",
		cols: [
			[
				{field: "nickName", title: "用户名称", align: "center"},
				{field: "phone", title: "手机号", align: "center"},
				{field: "dynamicTitle", title: "标题名称", align: "center"},
				{field: "content", title: "评论内容", align: "center"},
				{field: "createTime", title: "发布时间", align: "center"},
				{field: "isPass", title: "审核状态", align: "center", templet: "#examineStatus"},
				{title: "操作", align: "center", toolbar: "#table-dynamic-operation", width: 180},
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

	/*监听信息认证审核列表通过、驳回、审核操作*/
	table.on("tool(LAY-examine-artist-information)", function (obj) {
		var data = obj.data;
		if (obj.event === "pass") {
			layer.confirm("确定通过?", function (index) {
				$.ajax({
					url: layui.setter.urll + "/api/admin/user/artistReview",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
						flag: 1,
						temp:data.temp||"通过"
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已通过", {icon: 1});
							layui.table.reload("LAY-examine-artist-information");
						} else {
							layer.alert("操作失败", {icon: 2});
						}
					},
					error: function (data) {
						layer.alert("操作失败", {icon: 2});
					},
				});
				layer.close(index);
			});
		} else if (obj.event === "reject") {
			admin.popup({
				title: "填写驳回原因",
				area: ["750px", "550px"],
				id: "LAY-popup-user-add",
				success: function (layero, index) {
					view(this.id)
						.render("examine/reject", data)
						.done(function () {
							form.render();
							//监听提交
							form.on("submit(LAY-reject-front-submit)", function (data) {
								var field = data.field;
								console.log(field.id);
								console.log(field.reject);
								$.ajax({
									url: layui.setter.urll + "/api/admin/user/artistReview",
									method: "post",
									contentType: "application/json;charset=UTF-8",
									data: JSON.stringify({
										token: layui.data("data").token,
										id: field.id /*id*/,
										tmp: field.reject||"驳回" /*驳回原因*/,
										flag: -1,
										temp:data.temp
									}),
									success: function (data) {
										if (data.data == 1) {
											layer.alert("已驳回", {icon: 1});
											layui.table.reload("LAY-examine-artist-information");
										} else {
											layer.alert("操作失败，请稍后重试", {icon: 2});
										}
									},
									error: function (data) {
										layer.alert("操作失败，请稍后重试", {icon: 2});
									},
								});
								layer.close(index);
							});
						});
				},
			});
		} else if (obj.event === "detail") {
			admin.popup({
				title: "身份认证",
				area: ["750px", "570px"],
				id: "LAY-popup-user-add",
				success: function (layero, index) {
					view(this.id)
						.render("examine/identity", data)
						.done(function () {
							form.render();
							//监听提交
							form.on("submit(LAY-detail-front-submit)", function (data) {
								layer.close(index);
							});
						});
				},
			});
		}
	});
	exports("examine", {});
});
