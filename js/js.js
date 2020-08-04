/* 首页导航二级菜单 */
var win_width = $(window).width();
if (win_width > 640) { //pc端的样式
    /*$('.nav ul li:first').addClass('on');*/
    $('.nav ul li').mouseover(function() {
        $('.nav ul li').removeClass('on');
        $(this).addClass('on');
        $('.nav_links').css('display', 'none');
        $(this).find('.nav_links').css('display', 'block');
    })
    $('.nav ul li').mouseout(function() {
        $('.nav ul li').removeClass('on');
        $('.nav_links').css('display', 'none');
    })
    $('.nav_links').mouseout(function() {
        $(this).css('display', 'none');
        $(this).parents('li').removeClass('on');
    })
}







/* 首页第一块位置的选项卡切换 */
$('.con1_l_tab ul li:first').addClass('on');
$('.tab_main:first').css('display', 'block');
$('.con1_l_tab ul li').click(function() {
        let linet = $(this).index();
        $('.con1_l_tab ul li').removeClass('on');
        $('.con1_l_tab ul li').eq(linet).addClass('on');
        $('.tab_main').css('display', 'none');
        $('.tab_main').eq(linet).css('display', 'block');
    })
    //首页第三块位置PC的 选项卡切换
$('.icon1').click(function() {
    $('.con3_tab_main').css('display', 'none');
    $('.con3_tab_main').eq(0).css('display', 'block');
    $('.con3_tab ul li').removeClass('icon_on');
    $('this').addClass('icon_on');
})
$('.icon2').click(function() {
    $('.con3_tab_main').css('display', 'none');
    $('.con3_tab_main').eq(1).css('display', 'block');
    $('.con3_tab ul li').removeClass('icon_on');
    $(this).addClass('icon_on');
})
$('.icon3').click(function() {
    $('.con3_tab_main').css('display', 'none');
    $('.con3_tab_main').eq(2).css('display', 'block');
    $('.con3_tab ul li').removeClass('icon_on');
    $(this).addClass('icon_on');
})

/* 公司简介---领导团队选项卡切换 */
$('.leader_tab ul li:first').addClass('lion');
$('.leader_main:first').addClass('display', 'block');
$('.leader_tab ul li').click(function() {
    let leadernum = $(this).index();
    $('.leader_tab ul li').removeClass('lion');
    $(this).addClass('lion');
    $('.leader_main').css('display', 'none');
    $('.leader_main').eq(leadernum).css('display', 'block');
})