/**
	 @Name：评论管理
	 @Author：郭宇
 */

layui.define(["table", "form"], function (exports) {
	var $ = layui.$,
		admin = layui.admin,
		view = layui.view,
		table = layui.table,
		form = layui.form;
	var router = layui.router();
	var elem = "#LAY-comment-manage";
	var url = layui.setter.urll + "/api/admin/comment/list";
	if (document.querySelector("#viewAudioCommentList")) {
		elem = "#viewAudioCommentList";
		url=layui.setter.urll + "api/admin/audio/dir/comment/"+router.search.id;
		console.log(router)
	}
	/*评论列表*/
	table.render({
		elem: elem,
		url: url,
		method: "get",
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "nickName", title: "用户名称", align: "center"},
				{field: "phone", title: "手机号", align: "center"},
				{field: "flag", title: "评论类型", align: "center", templet: "#type"},
				{field: "content", title: "评论内容", align: "center"},
				{field: "createTime", title: "发布时间", align: "center"},
				{title: "操作", align: "center", toolbar: "#table-comment-operation", width: 300},
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

	/*监听评论列表删除、删除并封存用户id、全部回复操作*/
	table.on("tool(LAY-comment-manage)", function (obj) {
		var data = obj.data;
		if (obj.event === "del") {
			layer.confirm("是否删除并封ID?", function (index) {
				/*删除评论ajax*/
				$.ajax({
					url: layui.setter.ajaxUrl + "/api/admin/comment/del",
					type: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已删除", {icon: 1});
							layui.table.reload("LAY-comment-manage");
						} else {
							layer.alert("操作失败", {icon: 2});
						}
					},
					error: function (data) {
						layer.alert("操作失败", {icon: 2});
					},
				});
				/*封评论功能的ajax*/
				$.ajax({
					url: layui.setter.ajaxUrl + "/api/admin/user/freezeCom",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						uid: data.uid,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已删除", {icon: 1});
							layui.table.reload("LAY-comment-manage");
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
		} else if (obj.event === "delComment") {
			layer.confirm("真的删除评论吗?", function (index) {
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
							layui.table.reload("LAY-comment-manage");
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
		} else if (obj.event === "replyALL") {
			admin.popup({
				title: "全部回复",
				area: ["1000px", "400px"],
				success: function (layero, index) {
					view(this.id)
						.render("comment/replyAll", data)
						.done(function () {
							table.render({
								url: layui.setter.urll + "/api/admin/comment/reply/" + data.id,
								elem: "#LAY-reply-manage",
								method: "get",
								cols: [
									[
										{type: "numbers", title: "序号", align: "center"},
										{field: "nickName", title: "用户名称", align: "center"},
										{field: "phone", title: "手机号", align: "center"},
										{field: "content", title: "评论内容", align: "center"},
										{field: "createTime", title: "发布时间", align: "center"},
										{title: "操作", align: "center", toolbar: "#table-comment", width: 250},
									],
								],
								page: true,
								text: {none: "暂无数据", error: "对不起，加载出现异常！"},
							});
						});
				},
			});
		}
	});

	/*监听全部回复删除操作*/
	table.on("tool(LAY-reply-manage)", function (obj) {
		var data = obj.data;
		if (obj.event === "del") {
			layer.confirm("真的删除并封ID吗?", function (index) {
				/*删除评论ajax*/
				$.ajax({
					url: layui.setter.urll + "/api/admin/comment/del",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已删除", {icon: 1});
							layui.table.reload("LAY-comment-manage");
						} else {
							layer.alert("操作失败", {icon: 2});
						}
					},
					error: function (data) {
						layer.alert("操作失败", {icon: 2});
					},
				});
				/*封评论功能的ajax*/
				$.ajax({
					url: layui.setter.urll + "/api/admin/user/freezeCom",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已删除", {icon: 1});
							layui.table.reload("LAY-comment-manage");
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
		} else if (obj.event === "delComment") {
			layer.confirm("真的删除评论吗?", function (index) {
				$.ajax({
					url: layui.setter.urll + "/api/admin/comment/del",
					method: "post",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify({
						token: layui.data("data").token,
						id: data.id,
					}),
					success: function (data) {
						if (data.data == 1) {
							layer.alert("已删除", {icon: 1});
							layui.table.reload("LAY-reply-manage");
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

	exports("comment", {});
});
