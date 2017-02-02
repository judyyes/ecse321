
var FoodList = [];

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$(".glyphicon-plus").on("click",addFood);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	showList();
	resize_sidebar();
	deleteFood();
	editFood();
}

function logout() {
	window.location.href = "../index.html";
}
function addFood() {
	window.location.href = "../page/addFood.html";
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

//show all items in the Food table
function showList() {
	var table = $(".w3-table");
	$.ajax({
		type:"get",
		url:"https://shawnluxy.ddns.net:80/food",
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				FoodList = data;
				for(var i=0; i<data.length; i++) {
					var name = data[i].NAME;
					var quantity = data[i].QUANTITY;
					var price = data[i].PRICE;
					var row = $('<tr></tr>').appendTo(table);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center", "sname"].join(' ')}).text(name).appendTo(row);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(quantity).appendTo(row);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(price).appendTo(row);
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
	$.ajax({
		type:"delete",
		url:"https://shawnluxy.ddns.net:80/delete_food/" + item.NAME,
		async:false,
		timeout:5000,
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
		},
		success:function(data) {
			alert(data);
			goFood();
		},
		error:function() {
			alert("timeout");
		},
	});
}
//add event to each icon
function deleteFood() {
	var trash = $(".glyphicon-trash");
	for(var i=0; i<trash.length; i++) {
		trash[i].addEventListener("click",function(index){
			return function (){
				var food = FoodList[index];
				deleteItem(food);
			};
		}(i), true);
	}
}
function editFood() {
	var pencil = $(".glyphicon-pencil");
	for(var i=0; i<pencil.length; i++) {
		pencil[i].addEventListener("click",function(index){
			return function (){
				var food = FoodList[index];
				localStorage.setItem("Picked", JSON.stringify(food));
				window.location.href = "../page/addFood.html";
			};
		}(i), true);
	}
}
//Search Site filter
function searchFood() {
	var inputs = $("#search").val().toLowerCase();
	var target = $(".sname");
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