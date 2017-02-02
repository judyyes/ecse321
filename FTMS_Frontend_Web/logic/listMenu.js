var MenuList = [];

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$(".glyphicon-plus").on("click",addMenu);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	showList();
	resize_sidebar();
	deleteMenu();
	editMenu();
	viewMenu();
}

function logout() {
	window.location.href = "../index.html";
}
function addMenu() {
	window.location.href = "../page/addMenu.html";
	localStorage.removeItem("Picked");
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

//show all items in the Menu table
function showList() {
	var table = $(".w3-table");
	$.ajax({
		type:"get",
		url:"https://shawnluxy.ddns.net:80/menu",
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				MenuList = data;
				for(var i=0; i<data.length; i++) {
					var name = data[i].NAME;
					var price = data[i].PRICE;
					var popularity = data[i].POPULARITY;
					var row = $('<tr></tr>').appendTo(table);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center", "underline"].join(' ')}).text(name).appendTo(row);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(price).appendTo(row);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(popularity).appendTo(row);
					var lastcol = $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).appendTo(row);
					$('<i></i>').attr({class: ["glyphicon", "glyphicon-pencil", "w3-hover-black"].join(' ')}).attr('style', 'margin-right: 2%').appendTo(lastcol);
					$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
				}	
			}
		},
		error:function(type) {
			alert("timeout");
		},
	});
}
//delete chosen item
function deleteItem(item) {
	var message = "";
	var recipeList = [];
	$.ajax({
		type:"delete",
		url:"https://shawnluxy.ddns.net:80/delete_menu/" + item.ID,
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
	if(message !== "SUCCESS") {alert(message);return false;}
	$.ajax({
		type:"get",
		url:"https://shawnluxy.ddns.net:80/menu/" + item.ID,
		async:false,
		timeout:5000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				recipeList = data;
			}
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
	alert(message);
	if(message == "SUCCESS") {goMenu();}
}
//add event to each icon
function deleteMenu() {
	var trash = $(".glyphicon-trash");
	for(var i=0; i<trash.length; i++) {
		trash[i].addEventListener("click",function(index){
			return function (){
				var menu = MenuList[index];
				deleteItem(menu);
			};
		}(i), true);
	}
}
function editMenu() {
	var pencil = $(".glyphicon-pencil");
	for(var i=0; i<pencil.length; i++) {
		pencil[i].addEventListener("click",function(index){
			return function (){
				var menu = MenuList[index];
				localStorage.setItem("Picked", JSON.stringify(menu));
				window.location.href = "addMenu.html";
			};
		}(i), true);
	}
}
//add event to each menu's name
function viewMenu() {
	var view = $(".underline");
	for(var i=0; i<view.length; i++) {
		view[i].addEventListener("click",function(index){
			return function (){
				var menu = MenuList[index];
				localStorage.setItem("Picked", JSON.stringify(menu));
				window.location.href = "listRecipe.html";
			};
		}(i), true);
	}
}
//Search Site filter
function searchMenu() {
	var inputs = $("#search").val().toLowerCase();
	var target = $(".underline");
	for(var i=0; i<target.length; i++) {
		var row = $(target[i]).parent();
		if($(target[i]).text().toLowerCase().indexOf(inputs) > -1) {
			row.removeAttr("style");
		} else {
			row.attr("style", "display:none");
		}
	}
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
