/**
	 @Name：音频管理
	 @Author：邢
 */

layui.define(["table", "form"], function (exports) {
	var $ = layui.$,
		admin = layui.admin,
		view = layui.view,
		table = layui.table,
		form = layui.form;

	var router = layui.router(); /*定义router,用于得到lay-href传递的id*/

	/*编辑列表*/
	table.render({
		elem: "#viewAudioCommentList",
		url: layui.setter.urll + "/api/admin/audio/list",
		method: "get",
		where: {
			token: layui.data("data").token,
			id: router.search.id,
		},
		cols: [
			[
				{type: "numbers", title: "序号", align: "center"},
				{field: "title", title: "用户名称", align: "center"},
				{field: "introduce", title: "手机号", align: "center"},
				{field: "audioPath", title: "评论类型", align: "center", templet: "#type", width: 400},
				{field: "audioImage", title: "评论内容", align: "center",},
				{field: "username", title: "发布时间", align: "center",},
				{title: "操作", align: "center", toolbar: "#table-edit-operation", width: 200},
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

	exports("viewAudioCommentList", {});
});
