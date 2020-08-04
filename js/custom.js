// JavaScript custom code

$(function() {
	var screenWidth = document.body.scrollWidth;
	var screenHeight = document.body.scrollHeight;
	var lay_background_img = $(".lay_background_img");
	var login_iframe = $(".login_iframe");
	var iframe_height = login_iframe.height();

	//随机背景图
	var bg = Com_Parameter.ContextPath + 'resource/style/default/login_single_random/login_bg/' + get_random_bg();
	$(".login-background-img > img").attr("src", bg);

	//二维码
	$(".login-dropbox").hover(function() {
		iframe_height = login_iframe.height();
		$(this).find(".login-dropbox-toggle > .iconbox").stop().animate({
			left: "-45px"
		}, 300).end().find(".login-dropbox-menu").css("height", iframe_height).stop(true, true).show(300);
	}, function() {
		$(this).find(".login-dropbox-toggle > .iconbox").stop().animate({
			left: "0"
		}, 300).end().find(".login-dropbox-menu").stop(true, true).hide(300);
	});

	//错误信息是否为空的判断
	var lui_login_message_div = $(".lui_login_message_div");
	var txt = lui_login_message_div.html();
	txt = $.trim(txt);
	if(txt == null || txt == "") {} else {
		lui_login_message_div.addClass("tip_message");
	}

	/*** 浏览器兼容性处理 ***/
	var ie = document.documentMode; /*** 文档模式 ***/
	if(/msie/.test(navigator.userAgent.toLowerCase()) && ie <= 8) {
		// $("").attr("placeholder")
		$('body').addClass('ltie8');
	}

	//增加删除小图标
	initFunction();

	$("body").on("click", ".icon_del", function(e) {
		$(this).siblings("input").val("").focus().parent(".lui_login_input_div").removeClass('show');
	});

	mulit_lang();
});

function initFunction() {
	//添加删除按钮
	var input_txt;
	$("<i class='icon_del'></i>").insertAfter($(".lui_login_input_username")[0]);
	$("<i class='icon_del'></i>").insertAfter($(".lui_login_input_password")[0]);
	$("<i class='icon_user'></i>").insertBefore('.lui_login_input_username')[0];
	$("<i class='icon_pwd'></i>").insertBefore('.lui_login_input_password')[0];

	$(".lui_login_input_div input").each(function() {
		input_txt = $(this).val();
		input_txt = $.trim(input_txt);
		if(input_txt != "") {
			$(this).parent(".lui_login_input_div").addClass('show');
		}
	});

	$(".lui_login_input_div input").keyup(function() {
		input_txt = $(this).val();
		input_txt = $.trim(input_txt);
		if(input_txt != "") {
			$(this).parent(".lui_login_input_div").addClass('show');
		}
	});

	$(".lui_login_input_div input").change(function() {
		input_txt = $(this).val();
		input_txt = $.trim(input_txt);
		if(input_txt != "") {
			$(this).parent(".lui_login_input_div").addClass('show');
		}
	});

	$(".lui_login_input_div input").focus(function() {
		input_txt = $(this).val();
		input_txt = $.trim(input_txt);

		$(this).parent(".lui_login_input_div").addClass('input_focus');

		if(input_txt != "") {
			$(this).parent(".lui_login_input_div").addClass('show');
		}
	});

	$(".lui_login_input_div input").blur(function() {
		input_txt = $(this).val();
		input_txt = $.trim(input_txt);

		$(this).parent(".lui_login_input_div").removeClass('input_focus');
		if(input_txt == "") {
			$(this).parent(".lui_login_input_div").removeClass('show');
		}
	});

}

//多语言
function mulit_lang() {
	var select = $(".lui_login_input_div select");
	var radio = $(".lui_login_input_div input[type='radio']");
	if(select!=null && select.length > 0) {
		mulit_select();
	}
	if(radio!=null && radio.length > 0) {
		mulit_radio();
	}
}

//多语言 为下拉框时
function mulit_select() {
	var select = $(".lui_login_input_div select");
	$(".login_header .login_top_bar").css("display", "block");
	var options = select.find("option");
	var uli = "",
		val = "";
	var ul = $("<ul class='header_lan'>");
	options.each(function(i) {
		val = $(this).val();
		txt = $(this).text();
		uli += "<li><a onclick=changeLang('" + val + "') data-value='" + val + "' href='javascript:void(0);'>" + txt + "</a></li>";
	});
	ul.html(uli);
	$(".login_header .login_top_bar").append(ul);
}

//多语言 为单选框时
function mulit_radio() {
	var radio = [];
	radio = $(".lui_login_input_div input[type='radio']");
	$(".login_header .login_top_bar").css("display", "block");
	var uli = "",
		val = "";
	var ul = $("<ul class='header_lan'>");
	radio.each(function(i) {
		val = $(this).val();
		txt = $(this).next("label").text();
		uli += "<li><a onclick=changeLang('" + val + "') data-value='" + val + "' href='javascript:void(0);'>" + txt + "</a></li>";
	});
	ul.html(uli);
	$(".login_header .login_top_bar").append(ul);
}

//美化的下拉框
function dropdown(obj) {
	var top = obj.offset().top;
	var left = obj.offset().left;
	var height = obj.height();
	var width = obj.width();
	var select = $(".lui_login_input_div select");

	var options = select.find("option");
	var nheight = options.height();
	var className = select.attr("class");

	var uli = "",
		val = "",
		txt = "";
	var ul = $("#dropdownOptionsFor" + className);
	if(ul.length > 0) {
		ul.remove();
		obj.removeClass("current");
	} else {
		$(".dropdown-options").remove();
		ul = document.createElement("ul");
		$(ul).attr("id", "dropdownOptionsFor" + className).addClass("dropdown-options").css({
			position: "absolute",
			left: left,
			top: top + height
		});

		options.each(function(i) {
			val = $(this).val();
			txt = $(this).text();

			if($(".lui_login_input_div select option:selected").val() != val)
				uli += "<li><a data-value='" + val + "' href='javascript:void(0);'>" + txt + "</a></li>";
		});
		obj.addClass("current");
		$(ul).html(uli);
		$("body").append(ul);
	}

	$(document).click(function() {
		$(ul).remove();
		obj.removeClass("current");
	});
}
