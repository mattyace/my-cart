$(function () {
	/* ========================================= CATEGORIES PAGE functions ================ */
	// initiate the Nested Sortables plug-in
	$(".sortable").nestedSortable({
		handle: "div",
		items: "li",
		toleranceElement: "> div",
		maxLevels: "2",
		listType: "ol",
		tabSize: "10",
		placeholder: "sortable-highlight"
	});

	// when first loads swap the sub-categories with the right name
	$(".sortable").find("ol").find("span").html("Sub-category");

	// when a sort is finished moving, swap the sub-category and category names
	$(".sortable").on("sortdeactivate", function(e){
		addData();
		console.log("there's a CHANGE!");
		$(".sortable > li > ol > li > div > span").html("Sub-category");
		$(".sortable > li > div > span").html("Category");
	});

	// New category panel
	function addCategory(){
		// find out how many categories already exist
		var numItems = $(".sortable li").length;
		
		// create a 'new' option pre-filled with last option and increment id's
		var htmlFormGroup = '<li id="category_' + (numItems + 1) + '"><div class="input-group"><span class="input-group-addon">Category</span><input type="text" class="form-control inputCategory category-input" id="inputCategory' + (numItems + 1) + '" name="inputCategory' + (numItems + 1) + '" placeholder="Enter a category"/></div><div class="input-group-side remove-category"><i class="fa fa-times"></i></div></li>';

		$(".sortable > li:last-child").after(htmlFormGroup);
		$(".sortable > li:last-child > div > input").focus();		
	}

	// Add new category button
	$("#addCategory").on("click", addCategory);

	// Remove a category
	$(document).on("click", ".remove-category", function(){
		$(this).parent().remove();
		addData();
		// var parentCategory = $(this).parent().parent().parent();
		// if(parentCategory.attr("role") == "category")
		// {
		// }
		// else
		// {
		// 	$(this).parent().remove();

		// }
	});

	addData();
	//Update when things change
	$(document).on('change', ".inputCategory", function(e){
		addData();
	});

	// on ENTER create a new category
	$(document).on('keypress', '.inputCategory', function(e){
		if(e.keyCode == 13 || e.keyCode == 9)
		{
			addCategory();
		}
		return e.keyCode != 13;
	});

	// $('.form-selecting').on("keypress", function(e) {
	// 	if(e.keyCode == 13 || e.keyCode == 9)
	// 	{
	// 		addOption();
	// 		var numItems = $(".form-selecting .form-group").length;
	// 		var lastOption = $(".form-selecting > div:nth-child("+numItems+") > div > input[id^='inputOption']").focus();
	// 	}
	// 	return e.keyCode != 13;
	// });	
	
	function addData() {		
		//creates a json feed and stores it in a hidden field.
		var test = $(".sortable").nestedSortable("toHierarchy");
		console.log(test);
		
		var content = "";
		
		var catjson = '{ "categories" : [';
		
		for(var i = 0; i < test.length; i++)
		{
			catjson += '{';
			
			catjson += '"parentID" : "1", "catDesc" : "' + $("#inputCategory" + test[i]["id"]).val() + '" ';
			
			console.log("PARENT: " + test[i].id + ", set parent to NULL in DB");
			console.log($("#inputCategory" + test[i]["id"]).val());
			
			if(test[i].children)
			{
				catjson += ', "children": [';
				
				for(var j = 0; j < test[i].children.length; j++)
				{
					console.log("CHILD: " + test[i].children[j].id + ", set parent to " + test[i].id + " in DB");
					console.log($("#inputCategory" + test[i].children[j].id).val());
					
					catjson += '{"parentID":"' + test[i].id + '", "catDesc":"' + $("#inputCategory" + test[i].children[j].id).val() + '"}';
					
					if((j + 1) != test[i].children.length)
					{
						catjson += ', ';
					}
				}
				
				catjson += ']';
			}	
			
			catjson += '}';
			
			if((i + 1) != test.length)
			{
				catjson += ', ';
			}
		}

		catjson += ']}';	
		
		console.log(catjson);
		
		content += "<input type='hidden' name='categories' value='" + catjson + "'/>";

		$(".content").html(content);
	}

	/* ========================================= PRODUCT PAGE functions ================ */
	// initiate remove Product Modal
	$(".products .remove").click(function(){
		$("#removeProductModal").modal("show");
		
		var pname = $(this).attr('productName');
		var pid = $(this).attr('productId');
		$("#prodremName").html(pname);
		$('#btn-remove').attr('prodremId', pid);

		return false;
	});

	// remove the product
	$("#btn-remove").click(function(){
		$("#removeProductModal").modal("hide");

		var remurl = "../functions/delete.function.php?id=" + $(this).attr('prodremId');
		console.log(remurl);
		window.location = remurl;
	});

	// initiate remove Option modal
	$(".remove-option").click(function(){
		$("#removeOptionModal").modal("show");

		var oname = $(this).attr("optionName");
		var oid = $(this).attr("optionId");
		var pid = $(this).attr("productId");
		$("#optremName").html(oname);
		$("#btn-remove-option").attr("optremId", oid);
		$("#btn-remove-option").attr("productId", pid);
	});

	// remove the option
	$("#btn-remove-option").click(function(){
		$("#removeOptionModal").modal("hide");
		
		var remurl = "../functions/delopt.function.php?id=" + $(this).attr('optremId') + "&pid=" + $(this).attr('productId');
		console.log(remurl);
		window.location = remurl;
		
		//alert("Write function to remove option! The Option ID is " + $(this).attr("optremId"));
	});

	// New Product - add new option panel
	function addOption(){
		// find out how many options already exist
		var numItems = $(".form-selecting .form-group").length;
		// find the text value of the last option
		var lastOption = $(".form-selecting > div:nth-child("+numItems+") > div > input").val();
		if(lastOption == null) {
			lastOption = '';
		}
		// create a 'new' option pre-filled with last option and increment id's
		var htmlFormGroup = '<div class="form-group"><label for="inputOption' + (numItems) + '" class="col-lg-2 control-label">Option</label><div class="col-lg-10"><input type="text" class="form-control" id="inputOption' + (numItems) + '" placeholder="Color, size, type etc" value="' + lastOption + '" name="inputOption[]"/><input type="text" class="form-control" id="inputQuantity' + (numItems) + '" placeholder="Quantity" name="inputQuantity[]"/><a class="remove-cancel">Cancel</a></div></div>';

		$(".form-selecting > div:nth-child("+numItems+")").after(htmlFormGroup);
		var numItems = $(".form-selecting .form-group").length;
		var lastOption = $(".form-selecting > div:nth-child("+numItems+") > div > input[id^='inputOption']").focus();
	}

	// New Product -- add new option button
	$("#addOption").on("click", addOption);

	// New Product -- cancelling a new option
    $(document).on("click", ".remove-cancel", function(){
        // disable the inputs
        $(this).parent().parent().find("input").attr('disabled', 'disabled');
        // hide the div
        $(this).parent().parent().hide(200);
    });

	// New Product -- add a new option when the user hits 'enter'
	$('.form-selecting').on("keypress", function(e) {
		if(e.keyCode == 13 || e.keyCode == 9)
		{
			addOption();
			var numItems = $(".form-selecting .form-group").length;
			var lastOption = $(".form-selecting > div:nth-child("+numItems+") > div > input[id^='inputOption']").focus();
		}
		return e.keyCode != 13;
	});	
	
	/* ========================================= ORDER PAGE functions ================ */
	// Dispatch notice
	$("#btn-dispatch").click(function(){
		$(".dispatch-notice").removeClass("panel-danger");
		$(".dispatch-notice").addClass("panel-success");
		$(".dispatch-notice a").removeClass("btn-danger");
		$(".dispatch-notice a").addClass("btn-success disabled");
		$(".dispatch-notice a").html("<i class='icon-check'></i> Dispatched");
		$(".dispatch-notice").addClass("panel-success");
		$(".dispatch-notice i").addClass("icon-check");
		$(".dispatch-notice .panel-heading").html("Order Dispatched");
		$("#dispatchOrderModal").modal("hide");

		$(".orders .text-danger").removeClass("text-danger").addClass("text-success").html("Dispatched");
	});

	/* ========================================= GENERAL functions ================ */
	// go to corresponding link
	function goToLink(e) {
		window.location = $(this).find("a").attr("href");
	}

	// When you click on the table row, take the corresponding page
	$(".orders .row-link").click(goToLink);
	$(".products .row-link").click(goToLink);
	$(".shipping .row-link").click(goToLink);

	// decimal place format when finished typing	
	$(".decimal").on("change", function(){
		if(isNaN(parseFloat(this.value)))
		{
			// alert("not a number");
		}
		else
		{
			$(this).val(parseFloat($(this).val()).toFixed(2));
		}
	});

	// initiate tinyMCE
    tinymce.init({
        selector: 'textarea',
        content_css: '../css/tinymce.css' 
    });

	/* ========================================= CUSTOMIZATION PAGE functions ================ */

	// hide the mycart nav 
	$(".mycart-nav > ul > li > a + ul").hide(0);
	var myThis;
	$(".mycart-nav > ul > li > a").click(function(){
		if($(this)[0] == myThis)
		{
			$(this).next("ul").stop().fadeOut(40);
			myThis = "matched";			
		}
		else
		{
			$(".mycart-nav > ul > li > a + ul").fadeOut(40);
			$(this).next("ul").stop().fadeIn(40);
			myThis = $(this)[0];
		}
	});

	// =================== Live preview -- populate with primary/secondary
	// var primaryColor;
	// $(".mask-color-1").css("background-color", $(".primary-color").val() );
	// $('.primary-color').colorpicker().on('changeColor', function(e){
	// 	primaryColor = e.color.toHex();
	// 	$(".mask-color-1").css("background-color", primaryColor);
	// });

	// var secondaryColor;
	// $(".mask-color-2").css("background-color", $(".secondary-color").val() );
	// $('.secondary-color').colorpicker().on('changeColor', function(e){
	// 	secondaryColor = e.color.toHex();
	// 	$(".mask-color-2").css("background-color", secondaryColor);
	// });

	// ================== Live preview -- heading, body and links
	$('.heading-font').on("change", function(){
		var headingFont = $(this).val();
		$('.mycart-heading').css('font-family', headingFont);
	});
	
	var headingColor = $('.heading-color').val();
	$(".mycart-heading").css("color", headingColor);
	$(".mycart-thc").css("background-color", headingColor);
	$('.heading-color').colorpicker().on('changeColor', function(e){
		headingColor = e.color.toHex();
		$(".mycart-heading").css("color", headingColor);
		$(".mycart-thc").css("background-color", headingColor);
	});
	$('.heading-color').bind('keyup', function(){
		$(this).ColorPickerSetColor(this.value);
	});

	var headingSize = $('.heading-size').val();
	$('.mycart-heading').css('font-size', headingSize);
	$('.heading-size').on("change", function(){
		headingSize = $(this).val();
		$('.mycart-heading').css('font-size', headingSize);
	});


	$('.body-font').on("change", function(){
		var bodyFont = $(this).val();
		$('.mycart-body').css('font-family', bodyFont);
	});

	var bodyColor = $('.body-color').val();
	$(".mycart-body").css("color", bodyColor);
	$(".mycart-tbc").css("background-color", bodyColor);
	$('.body-color').colorpicker().on('changeColor', function(e){
		bodyColor = e.color.toHex();
		$(".mycart-body").css("color", bodyColor);
		$(".mycart-tbc").css("background-color", bodyColor);
	});

	var bodySize = $('.body-size').val();
	$('.mycart-body').css('font-size', bodySize);
	$('.body-size').on("change", function(){
		bodySize = $(this).val();
		$('.mycart-body').css('font-size', bodySize);
	});



	var linkColor = $('.link-color').val();
	$(".mycart-link").css("color", linkColor);
	$(".mycart-lc").css("background-color", linkColor);
	$('.link-color').colorpicker().on('changeColor', function(e){
		linkColor = e.color.toHex();
		$(".mycart-link").css("color", linkColor);
		$(".mycart-lc").css("background-color", linkColor);
	});

	var linkHoverColor = $('.link-hover-color').val();
	$(".mycart-lhc").css("background-color", linkHoverColor);
	$(".mycart-link").on("mouseover", function(){
			$(this).css("color", linkHoverColor);
		}).mouseout(function(){
			$(this).css("color", linkColor);
		});
	$('.link-hover-color').colorpicker().on('changeColor', function(e){
		linkHoverColor = e.color.toHex();
		$(".mycart-lhc").css("background-color", linkHoverColor);
		$(".mycart-link").on("mouseover", function(){
			$(this).css("color", linkHoverColor);
		}).mouseout(function(){
			$(this).css("color", linkColor);
		});
	});

	var linkActiveColor = $('.link-active-color').val();
	$(".mycart-lac").css("background-color", linkActiveColor);
	$(".mycart-link").on("mousedown", function(){
		$(this).css("color", linkActiveColor);
	}).mouseup(function(){
		$(this).css("color", linkHoverColor);
	});
	$('.link-active-color').colorpicker().on('changeColor', function(e){
		linkActiveColor = e.color.toHex();
		$(".mycart-lac").css("background-color", linkActiveColor);
	});


	// ================== Live preview -- menu
	var menuColor = $(".menu-color").val();
	$(".mycart-mc").css("background-color", menuColor);
	$(".mycart-nav").css("background-color", menuColor);
	$('.menu-color').colorpicker().on('changeColor', function(e){
		menuColor = e.color.toHex();
		$(".mycart-nav").css("background-color", menuColor);
		$(".mycart-mc").css("background-color", menuColor);
	});

	var subMenuColor = $(".sub-menu-color").val();
	$(".mycart-smc").css("background-color", subMenuColor);
	$(".mycart-nav > ul > li > ul > li > a").css("background-color", subMenuColor);
	$('.sub-menu-color').colorpicker().on('changeColor', function(e){
		subMenuColor = e.color.toHex();
		$(".mycart-nav > ul > li > ul > li > a").css("background-color", subMenuColor);
		$(".mycart-smc").css("background-color", subMenuColor);
	});

	var subMenuHoverColor = $('.sub-menu-hover-color').val();
	$(".mycart-smhc").css("background-color", subMenuHoverColor);
	$(".mycart-nav > ul > li > ul > li > a").on("mouseover", function(){
			$(this).css("background-color", subMenuHoverColor);
		}).mouseout(function(){
			$(this).css("background-color", subMenuColor);
		});
	$('.sub-menu-hover-color').colorpicker().on('changeColor', function(e){
		subMenuHoverColor = e.color.toHex();
		$(".mycart-smhc").css("background-color", subMenuHoverColor);
		$(".mycart-nav > ul > li > ul > li > a").on("mouseover", function(){
			$(this).css("background-color", subMenuHoverColor);
		}).mouseout(function(){
			$(this).css("background-color", subMenuColor);
		});
	});

	var menuFontColor = $(".menu-font-color").val();
	$(".mycart-mfc").css("background-color", menuFontColor);
	$(".mycart-nav > ul > li > a").css("color", menuFontColor);
	$('.menu-font-color').colorpicker().on('changeColor', function(e){
		menuFontColor = e.color.toHex();
		$(".mycart-nav > ul > li > a").css("color", menuFontColor);
		$(".mycart-mfc").css("background-color", menuFontColor);
	});

	var subMenuFontColor = $(".sub-menu-font-color").val();
	$(".mycart-smfc").css("background-color", subMenuFontColor);
	$(".mycart-nav > ul > li > ul > li > a").css("color", subMenuFontColor);
	$('.sub-menu-font-color').colorpicker().on('changeColor', function(e){
		subMenuFontColor = e.color.toHex();
		$(".mycart-nav > ul > li > ul > li > a").css("color", subMenuFontColor);
		$(".mycart-smfc").css("background-color", subMenuFontColor);
	});

	var subMenuFontHoverColor = $('.sub-menu-font-hover-color').val();
	$(".mycart-smfhc").css("background-color", subMenuFontHoverColor);
	$(".mycart-nav > ul > li > ul > li > a").on("mouseover", function(){
			$(this).css("color", subMenuFontHoverColor);
		}).mouseout(function(){
			$(this).css("color", subMenuFontColor);
		});
	$('.sub-menu-font-hover-color').colorpicker().on('changeColor', function(e){
		subMenuFontHoverColor = e.color.toHex();
		$(".mycart-smfhc").css("background-color", subMenuFontHoverColor);
		$(".mycart-nav > ul > li > ul > li > a").on("mouseover", function(){
			$(this).css("color", subMenuFontHoverColor);
		}).mouseout(function(){
			$(this).css("color", subMenuFontColor);
		});
	});

	// =================== Live preview -- buttons
	var buttonColor = $('.button-color').val();
	$(".mycart-button").css("background-color", $(".button-color").val() );
	$(".mycart-bc").css("background-color", $(".button-color").val() );
	$('.button-color').colorpicker().on('changeColor', function(e){
		buttonColor = e.color.toHex();
		$(".mycart-button").css("background-color", buttonColor);
		$(".mycart-bc").css("background-color", buttonColor);
	});

	var buttonHoverColor = $('.button-hover-color').val();
	$(".mycart-bhc").css("background-color", buttonHoverColor);
	$(".mycart-button").on("mouseover", function(){
			$(this).css("background-color", buttonHoverColor);
		}).mouseout(function(){
			$(this).css("background-color", buttonColor);
		});
	$('.button-hover-color').colorpicker().on('changeColor', function(e){
		buttonHoverColor = e.color.toHex();
		$(".mycart-bhc").css("background-color", buttonHoverColor);
		$(".mycart-button").on("mouseover", function(){
			$(this).css("background-color", buttonHoverColor);
		}).mouseout(function(){
			$(this).css("background-color", buttonColor);
		});
	});

	var buttonActiveColor = $('.button-active-color').val();
	$(".mycart-bac").css("background-color", buttonActiveColor);
	$(".mycart-button").on("mousedown", function(){
		$(this).css("background-color", buttonActiveColor);
	}).mouseup(function(){
		$(this).css("background-color", buttonColor);
	});
	$('.button-active-color').colorpicker().on('changeColor', function(e){
		buttonActiveColor = e.color.toHex();
		$(".mycart-bac").css("background-color", buttonActiveColor);
		$(".mycart-button").on("mousedown", function(){
			$(this).css("background-color", buttonActiveColor);
		}).mouseup(function(){
			$(this).css("background-color", buttonColor);
		});
	});

	var buttonFontColor = $('.button-font-color').val();
	$(".mycart-button").css("color", buttonFontColor);
	$(".mycart-bfc").css("background-color", buttonFontColor);
	$('.button-font-color').colorpicker().on('changeColor', function(e){
		buttonFontColor = e.color.toHex();
		$(".mycart-button").css("color", buttonFontColor);
		$(".mycart-bfc").css("background-color", buttonFontColor);
	});

	var buttonFontHoverColor = $('.button-font-hover-color').val();
	$(".mycart-bfhc").css("background-color", buttonFontHoverColor);
	$(".mycart-button").on("mouseover", function(){
			$(this).css("color", buttonFontHoverColor);
		}).mouseout(function(){
			$(this).css("color", buttonFontColor);
		});
	$('.button-font-hover-color').colorpicker().on('changeColor', function(e){
		buttonFontHoverColor = e.color.toHex();
		$(".mycart-bfhc").css("background-color", buttonFontHoverColor);
		$(".mycart-button").on("mouseover", function(){
			$(this).css("color", buttonFontHoverColor);
		}).mouseout(function(){
			$(this).css("color", buttonFontColor);
		});
	});

	var buttonFontActiveColor = $('.button-font-active-color').val();
	$(".mycart-bfac").css("background-color", buttonFontActiveColor);
	$(".mycart-button").on("mousedown", function(e){
			$(this).css("color", buttonFontActiveColor);
		}).mouseup(function(){
			$(this).css("color", buttonFontColor);
		});
	$('.button-font-active-color').colorpicker().on('changeColor', function(e){
		buttonFontActiveColor = e.color.toHex();
		$(".mycart-bfac").css("background-color", buttonFontActiveColor);
		$(".mycart-button").on("mousedown", function(){
			$(this).css("color", buttonFontActiveColor);
		}).mouseup(function(){
			$(this).css("color", buttonFontColor);
		});
	});

}); // end of On Ready