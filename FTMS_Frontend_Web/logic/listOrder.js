var OrderList = [];

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$(".glyphicon-plus").on("click",addOrder);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	showList();
	resize_sidebar();
	deleteOrder();
	editOrder();
	viewOrder();
}

function logout() {
	window.location.href = "../index.html";
}
function addOrder() {
	window.location.href = "../page/addOrder.html";
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

//show all items in the Order table
function showList() {
	var table = $(".w3-table");
	$.ajax({
		type:"get",
		url:"https://shawnluxy.ddns.net:80/order",
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				OrderList = data;
				for(var i=0; i<data.length; i++) {
					var id = data[i].ID.slice(0,10) + " ... " + data[i].ID.slice(21,31);
					var time = data[i].TIME;
					if(data[i].STATUS === "1") {
						var status = "Completed";	
					} else {
						var status = "In process";
					}
					var row = $('<tr></tr>').appendTo(table);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center", "underline"].join(' ')}).text(id).appendTo(row);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(time).appendTo(row);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(status).appendTo(row);
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
		url:"https://shawnluxy.ddns.net:80/delete_order/" + item.ID,
		async:false,
		timeout:5000,
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
		},
		success:function(data) {
			alert(data);
			goOrder();
		},
		error:function() {
			alert("timeout");
		},
	});
}
//add event to each icon
function deleteOrder() {
	var trash = $(".glyphicon-trash");
	for(var i=0; i<trash.length; i++) {
		trash[i].addEventListener("click",function(index){
			return function (){
				var order = OrderList[index];
				deleteItem(order);
			};
		}(i), true);
	}
}
function editOrder() {
	var pencil = $(".glyphicon-pencil");
	for(var i=0; i<pencil.length; i++) {
		pencil[i].addEventListener("click",function(index){
			return function (){
				var order = OrderList[index];
				localStorage.setItem("Picked", JSON.stringify(order));
				window.location.href = "addOrder.html";
			};
		}(i), true);
	}
}
//add event to each order's id
function viewOrder() {
	var view = $(".underline");
	for(var i=0; i<view.length; i++) {
		view[i].addEventListener("click",function(index){
			return function (){
				var order = OrderList[index];
				localStorage.setItem("Picked", JSON.stringify(order));
				window.location.href = "listSingleOrder.html";
			};
		}(i), true);
	}
}
//Search Site filter
function searchOrder() {
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
