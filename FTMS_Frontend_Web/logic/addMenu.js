var newitem;
var recipeList = [];

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$(".glyphicon-plus").on("click",addRecipe);
	$("#change").on("click",submit);
	$("#cancel").on("click",goMenu);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	newitem = true;
	showFoodSelector();
	showPicked();
	resize_sidebar();
	deleteRecipe();
	
}

function logout() {
	window.location.href = "../index.html";
}

function goProfile() {
	window.location.href = "../page/viewProfile.html";
	localStorage.removeItem("viewPicked");
}
function goStaff() {
	window.location.href = "../page/listStaff.html";
}
function goFood() {
	window.location.href = "../page/listFood.html";
}
function goEquipment() {
	window.location.href = "../page/listEquipment.html";
}
function goMenu() {
	window.location.href = "../page/listMenu.html";
}
function goOrder() {
	window.location.href = "../page/listOrder.html";
}

function showFoodSelector() {
	var selector = $("#foodName");
	$.ajax({
		type:"get",
		url:"https://shawnluxy.ddns.net:80/food",
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				for(var i=0; i<data.length; i++) {
					var name = data[i].NAME;
					selector.append("<option>"+name+"</option>");
				}	
			}
		},
		error:function(type) {
			alert("timeout");
		},
	});
}

function showPicked() {
	if(localStorage.getItem("Picked") != null) {
		newitem = false;
		var menu = JSON.parse(localStorage.getItem("Picked"));
		var menuID = menu.ID;
		//get all the recipe for the menu
		$.ajax({
			type:"get",
			url:"https://shawnluxy.ddns.net:80/menu/" + menuID,
			async:false,
			timeout:10000,
			success:function(data) {
				if(data != "empty") {
					recipeList = JSON.parse(data);
				}
			},
			error:function(type) {
				alert("timeout");
			},
		});
		//display menu info
		$("#menuName").val(menu.NAME);
		$("#menuPrice").val(menu.PRICE);
		var table = $(".w3-table-all");
		for(var i=0; i<recipeList.length; i++) {
			var row = $('<tr></tr>').appendTo(table);
			$('<td></td>').text(recipeList[i].FOOD_NAME).appendTo(row);
			$('<td></td>').text(recipeList[i].AMOUNT).appendTo(row);
			var lastcol = $('<td></td>').appendTo(row);
			$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
		}
	}
}

function addRecipe() {
	var newRecipe = {};
	newRecipe.FOOD = $("#foodName option:selected").text();
	newRecipe.QUANTITY = $("#ingredientsQuan").val();
	//check input validation
	if(newRecipe.FOOD == "Choose food") {
		$("#foodError").text("Please choose a food"); return false;
	} else {$("#foodError").text("");}
	if(!validate("name", newRecipe.QUANTITY, "1")){return false;}
	//add to the table
	var table = $(".w3-table-all");
	var row = $('<tr></tr>').appendTo(table);
	$('<td></td>').text(newRecipe.FOOD).appendTo(row);
	$('<td></td>').text(newRecipe.QUANTITY).appendTo(row);
	var lastcol = $('<td></td>').appendTo(row);
	$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
	deleteRecipe();
}
function deleteRecipe() {
	var trash = $(".glyphicon-trash");
	for(var i=0; i<trash.length; i++) {
		trash[i].addEventListener("click",function(index){
			return function (){
				var row = $(trash[index]).parent().parent();
				row.remove();
			};
		}(i), true);
	}
}

function submit() {
	var newMenu = {};
	//error messages
	var message = "";
	newMenu.NAME = $("#menuName").val();
	newMenu.PRICE = $("#menuPrice").val();
	//check input validation
	if(!validate(newMenu.NAME, "1", newMenu.PRICE)){return false;}
	//update menu
	if(newitem) {
		newMenu.ID = randomString(32);
		newMenu.POPULARITY = 0;
		$.ajax({
			type:"post",
			url:"https://shawnluxy.ddns.net:80/add_menu",
			contentType:"application/x-www-form-urlencoded",
			data:newMenu,
			async:false,
			timeout:5000,
			beforeSend:function(xhr){
				xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
			},
			success:function(data) {
				message = data;
			},
			error:function(type) {
				alert("timeout");
			},
		});
	} else {
		newMenu.ID = JSON.parse(localStorage.getItem("Picked")).ID;
		newMenu.POPULARITY = JSON.parse(localStorage.getItem("Picked")).POPULARITY;
		$.ajax({
			type:"put",
			url:"https://shawnluxy.ddns.net:80/update_menu",
			contentType:"application/x-www-form-urlencoded",
			data:newMenu,
			async:false,
			timeout:5000,
			beforeSend:function(xhr){
				xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
			},
			success:function(data) {
				message = data;
			},
			error:function(type) {
				alert("timeout");
			},
		});
		for(var i=0; i<recipeList.length; i++) {
			$.ajax({
				type:"delete",
				url:"https://shawnluxy.ddns.net:80/delete_recipe/" + recipeList[i].ID,
				async:false,
				timeout:5000,
				beforeSend:function(xhr){
					xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
				},
				success:function(data) {
					message = data;
				},
				error:function() {
					alert("timeout");
				},
			});
		}
	}
	if(message !== "SUCCESS") {alert(message);return false;}
	
	var newRecipe = {};
	newRecipe.MID = newMenu.ID;
	//update each recipe in the table
	var rows = $($(".w3-table-all").children()[1]).children();
	for(var i=0; i<rows.length; i++) {
		var food_name = $($(rows[i]).children()[0]).text();
		var amount = $($(rows[i]).children()[1]).text();
		newRecipe.FOOD_NAME = food_name;
		newRecipe.AMOUNT = amount;
		$.ajax({
			type:"post",
			url:"https://shawnluxy.ddns.net:80/add_recipe",
			contentType:"application/x-www-form-urlencoded",
			data:newRecipe,
			async:false,
			timeout:5000,
			beforeSend:function(xhr){
				xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
			},
			success:function(data) {
				message = data;
			},
			error:function(type) {
				alert("timeout");
			},
		});
	}
	alert(message);
	if(message == "SUCCESS") {goMenu();}
}
//validation check
function validate(name, quantity, price) {
	var status = true;
	var regex1 = /^[0-9]+$/;
	var regex2 = /^[0-9.]+$/;
	// check name input
	if(name.trim().length == 0) {
		$("#nameError").text("Name cannot be Empty");status = false;
	} else if(name[0].match(regex1)) {
		$("#nameError").text("Name cannot start with Number");status = false;
	} else {
		$("#nameError").text("");
	}
	// check quantity input
	if(quantity.trim().length == 0) {
		$("#quantityError").text("Quantity cannot be Empty");status = false;
	} else if(!quantity.match(regex1) ||  parseInt(quantity)==0) {
		$("#quantityError").text("Quantity must be a Positive Integer");status = false;
	} else {
		$("#quantityError").text("");
	}
	// check price input
	if(price.trim().length == 0) {
		$("#priceError").text("Price cannot be Empty");status = false;
	} else if(!price.match(regex2) || parseFloat(price)==0) {
		$("#priceError").text("Price must be a Positive Number");status = false;
	} else {
		$("#priceError").text("");
	}
	return status;
}
//fit the height of sidebar to window size
function resize_sidebar() {
	if($("#datalist").height() <= $(window).innerHeight()) {
		$("#side-bar").height($(window).innerHeight());
	} else {
		h = $("#datalist").height() + 180;
		$("#side-bar").height(h);
	}
}

function randomString(len) {
	var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
	var max = chars.length;
	var str = "";
	for (i=0; i<len; i++) {
		str += chars.charAt(Math.floor(Math.random() * max));
	}
	return str;
}