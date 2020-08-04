// JavaScript Document
jQuery(function() {
    //兼容placeholeder的
    if (!placeholderSupport()) {
        jQuery('[placeholder]').focus(function() {
            var input = jQuery(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function() {
            var input = jQuery(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
    };

    function placeholderSupport() {
        return 'placeholder' in document.createElement('input');
    }
    //首页导航二级菜单
    var win_width = jQuery(window).width();
    if (win_width > 640) { //pc端的样式
        /*jQuery('.nav ul li:first').addClass('on');*/
        jQuery('.nav ul li').mouseover(function() {
            jQuery('.nav ul li').removeClass('on');
            jQuery(this).addClass('on');
            jQuery('.nav_links').css('display', 'none');
            jQuery(this).find('.nav_links').css('display', 'block');
        })
        jQuery('.nav ul li').mouseout(function() {
            jQuery('.nav ul li').removeClass('on');
            jQuery('.nav_links').css('display', 'none');
        })
        jQuery('.nav_links').mouseout(function() {
            jQuery(this).css('display', 'none');
            jQuery(this).parents('li').removeClass('on');
        })
    }
    if (win_width < 640) { //移动端侧滑的样式
        jQuery('.nav ul li').click(function() {
            if (jQuery(this).hasClass('bottom')) {
                jQuery(this).removeClass('bottom');
                jQuery(this).find('.nav_links').css('display', 'none');
            } else {
                jQuery('.nav ul li').removeClass('bottom');
                jQuery('.nav_links').css('display', 'none');
                jQuery(this).addClass('bottom');
                jQuery(this).find('.nav_links').css('display', 'block');
            }

        })

    }
    //手机端侧滑效果
    var key = true;
    jQuery('.m_side_btn').click(function() {
        if (key) {
            jQuery('.m_slide').css('-webkit-transform', 'translateX(0)');
            jQuery('.m_slide').css('-moz-transform', 'translateX(0)');
            jQuery('.m_slide').css('-ms-transform', 'translateX(0)');
            jQuery('.m_slide').css('-o-transform', 'translateX(0)');
            jQuery('.m_slide').css('transform', 'translateX(0)');
            jQuery('.mask').css('visibility', 'visible');
            key = false;
        } else {
            jQuery('.m_slide').css('-webkit-transform', 'translateX(-100%)');
            jQuery('.m_slide').css('-moz-transform', 'translateX(-100%)');
            jQuery('.m_slide').css('-ms-transform', 'translateX(-100%)');
            jQuery('.m_slide').css('-o-transform', 'translateX(-100%)');
            jQuery('.m_slide').css('transform', 'translateX(-100%)');
            jQuery('.mask').css('visibility', 'hidden');
            key = true;
        }
    })
    jQuery('.mask').click(function() {
            jQuery('.m_slide').css('-webkit-transform', 'translateX(-100%)');
            jQuery('.m_slide').css('-moz-transform', 'translateX(-100%)');
            jQuery('.m_slide').css('-ms-transform', 'translateX(-100%)');
            jQuery('.m_slide').css('-o-transform', 'translateX(-100%)');
            jQuery('.m_slide').css('transform', 'translateX(-100%)');
            jQuery('.mask').css('visibility', 'hidden');
            key = true;
        })
        //首页第一块位置的选项卡切换
    jQuery('.con1_l_tab ul li:first').addClass('on');
    jQuery('.tab_main:first').css('display', 'block');
    jQuery('.con1_l_tab ul li').click(function() {
            var thisnum = jQuery(this).index();
            jQuery('.con1_l_tab ul li').removeClass('on');
            jQuery('.con1_l_tab ul li').eq(thisnum).addClass('on');
            jQuery('.tab_main').css('display', 'none');
            jQuery('.tab_main').eq(thisnum).css('display', 'block');

        })
        //首页第三块位置PC的选项卡切换
    jQuery('.icon1').click(function() {
        jQuery('.con3_tab_main').css('display', 'none');
        jQuery('.con3_tab_main').eq(0).css('display', 'block');
        jQuery('.con3_tab ul li').removeClass('icon_on');
        jQuery(this).addClass('icon_on');
    })
    jQuery('.icon2').click(function() {
        jQuery('.con3_tab_main').css('display', 'none');
        jQuery('.con3_tab_main').eq(1).css('display', 'block');
        jQuery('.con3_tab ul li').removeClass('icon_on');
        jQuery(this).addClass('icon_on');
    })
    jQuery('.icon3').click(function() {
            jQuery('.con3_tab_main').css('display', 'none');
            jQuery('.con3_tab_main').eq(2).css('display', 'block');
            jQuery('.con3_tab ul li').removeClass('icon_on');
            jQuery(this).addClass('icon_on');
        })
        //首页第三块位置手机的选项卡切换
    jQuery('.icon1').click(function() {
        jQuery('.m_con3_wrap').css('display', 'none');
        jQuery('.m_con3_wrap').eq(0).css('display', 'block');
        jQuery('.con3_tab ul li').removeClass('icon_on');
        jQuery(this).addClass('icon_on');
    })
    jQuery('.icon2').click(function() {
        jQuery('.m_con3_wrap').css('display', 'none');
        jQuery('.m_con3_wrap').eq(1).css('display', 'block');
        jQuery('.con3_tab ul li').removeClass('icon_on');
        jQuery(this).addClass('icon_on');
    })
    jQuery('.icon3').click(function() {
            jQuery('.m_con3_wrap').css('display', 'none');
            jQuery('.m_con3_wrap').eq(2).css('display', 'block');
            jQuery('.con3_tab ul li').removeClass('icon_on');
            jQuery(this).addClass('icon_on');
        })
        //公司简介----领导团队选项卡切换
    jQuery('.leader_tab ul li:first').addClass('lion');
    jQuery('.leader_main:first').css('display', 'block');
    jQuery('.leader_tab ul li').click(function() {
        var leadernum = jQuery(this).index();
        jQuery('.leader_tab ul li').removeClass('lion');
        jQuery(this).addClass('lion');
        jQuery('.leader_main').css('display', 'none');
        jQuery('.leader_main').eq(leadernum).css('display', 'block');


    })



})