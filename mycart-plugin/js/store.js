$(document).ready(function() {
	// hide the shipping info
	$(".mycart-plugin .mycart-plugin-toggle-hide").hide(0);

	var checkoutCheckbox = true;
	$(".mycart-plugin .mycart-plugin-toggle-checkbox").on('click', function(){
		if(checkoutCheckbox == true)
		{
			$(".mycart-plugin .mycart-plugin-toggle-show").fadeOut(100, function(){
				$(".mycart-plugin .mycart-plugin-toggle-hide").fadeIn(100);
			});
			$(".mycart-plugin .mycart-plugin-toggle-hide").append("<input class='mycart-plugin-testHidden' type='hidden' name='shipping' value='shipping'/>");
			checkoutCheckbox = false;
		}
		else
		{
			$(".mycart-plugin-testHidden").remove();
			$(".mycart-plugin .mycart-plugin-toggle-hide").fadeOut(100, function(){
				$(".mycart-plugin .mycart-plugin-toggle-show").fadeIn(100);
			});
			checkoutCheckbox = true;
		}
	});

	// hide the checkout now button
	$(".mycart-plugin-hide").hide(0);

	// Disable opening and closing animations, change title type
	$(".fancybox-effects-b").fancybox({
		openEffect  : 'fade',
		openSpeed	: 'fast',
		closeEffect	: 'none',
		helpers : {
			title : {
				type : 'inside'
			}
		}
	});
	
	// Navigation
	$(".mycart-plugin .mycart-plugin-nav > ul > li > a + ul").hide(0);
	var myThis;
	$(".mycart-plugin .mycart-plugin-nav > ul > li > a").click(function(){
		// test to see if mobile or desktop, slide for mobile, toggle hide for desktop
		var windowWidth = $(window).width();
		if(windowWidth > 700)
		{
			if($(this)[0] == myThis)
			{
				$(this).next("ul").stop().fadeOut(40);
				myThis = "matched";			
			}
			else
			{
				$(".mycart-plugin-nav > ul > li > a + ul").fadeOut(40);
				$(this).next("ul").stop().fadeIn(40);
				myThis = $(this)[0];
			}
		}
		else
		{
			if($(this)[0] == myThis)
			{
				$(this).next("ul").stop().slideUp(200);
				myThis = "matched";			
			}
			else
			{
				$(".mycart-plugin-nav > ul > li > a + ul").slideUp(200);
				$(this).next("ul").stop().slideDown(200);
				myThis = $(this)[0];
			}
		}
	});

	// go to corresponding link
	function goToLink() {
		window.location = $(this).find("a").attr("href");
	}

	// My Account -- when you click on the table row, take to the corresponding order page
	$(".mycart-plugin .mycart-plugin-row-link").click(goToLink);
});