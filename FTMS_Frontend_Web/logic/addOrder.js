var newitem;
var menuList = [];

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$(".glyphicon-plus").on("click",addOrder);
	$("#change").on("click",submit);
	$("#cancel").on("click",goOrder);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	newitem = true;
	showMenuSelector();
	showPicked();
	resize_sidebar();
	deleteOrder();
	
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

function showMenuSelector() {
	var selector = $("#dishes");
	$.ajax({
		type:"get",
		url:"https://shawnluxy.ddns.net:80/menu",
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				for(var i=0; i<data.length; i++) {
					var id = data[i].ID;
					var name = data[i].NAME;
					selector.append("<option value="+id+">"+name+"</option>");
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
		var order = JSON.parse(localStorage.getItem("Picked"));
		var orderID = order.ID;
		//get all the order's menu
		$.ajax({
			type:"get",
			url:"https://shawnluxy.ddns.net:80/order/" + orderID,
			async:false,
			timeout:10000,
			success:function(data) {
				if(data != "empty") {
					menuList = JSON.parse(data);
				}
			},
			error:function(type) {
				alert("timeout");
			},
		});
		//display order info
		$("#orderID").text(order.ID.slice(0,7) + " ... " + order.ID.slice(24,31));
		var table = $(".w3-table-all");
		for(var i=0; i<menuList.length; i++) {
			var row = $('<tr></tr>').appendTo(table);
			$('<td></td>').text(menuList[i].MENU_NAME).attr("id",menuList[i].MID).appendTo(row);
			$('<td></td>').text(menuList[i].AMOUNT).appendTo(row);
			var lastcol = $('<td></td>').appendTo(row);
			$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
		}
	} else {
		$("#orderID").text("Auto Generated");
	}
}

function addOrder() {
	var newOrder = {};
	newOrder.MID = $("#dishes option:selected").val();
	newOrder.DISHES = $("#dishes option:selected").text();
	newOrder.QUANTITY = $("#dishesQuan").val();
	//check input validation
	if(newOrder.DISHES == "Choose dishes") {
		$("#dishesError").text("Please choose dishes"); return false;
	} else {$("#dishesError").text("");}
	if(!validate(newOrder.QUANTITY)){return false;}
	//add to the table
	var table = $(".w3-table-all");
	var row = $('<tr></tr>').appendTo(table);
	$('<td></td>').text(newOrder.DISHES).attr("id",newOrder.MID).appendTo(row);
	$('<td></td>').text(newOrder.QUANTITY).appendTo(row);
	var lastcol = $('<td></td>').appendTo(row);
	$('<i></i>').attr({class: ["glyphicon", "glyphicon-trash", "w3-hover-black"].join(' ')}).appendTo(lastcol);
	deleteOrder();
}
function deleteOrder() {
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
	var newOrder = {};
	//error messages
	var message = "";
	newOrder.TIME = getTime();
	newOrder.STATUS = $("#status option:selected").val();
	//check input validation
	if($("#status option:selected").text() == "Choose status") {
		$("#statusError").text("Please choose status"); return false;
	} else {$("#statusError").text("");}
	//update menu
	if(newitem) {
		newOrder.ID = randomString(32);
		$.ajax({
			type:"post",
			url:"https://shawnluxy.ddns.net:80/add_order",
			contentType:"application/x-www-form-urlencoded",
			data:newOrder,
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
		newOrder.ID = JSON.parse(localStorage.getItem("Picked")).ID;
		$.ajax({
			type:"put",
			url:"https://shawnluxy.ddns.net:80/update_order",
			contentType:"application/x-www-form-urlencoded",
			data:newOrder,
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
		for(var i=0; i<menuList.length; i++) {
			console.log(menuList[i].ID);
			$.ajax({
				type:"delete",
				url:"https://shawnluxy.ddns.net:80/delete_orderlist/" + menuList[i].ID,
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
	
	var newMenu = {};
	newMenu.OID = newOrder.ID;
	//update each recipe in the table
	var rows = $($(".w3-table-all").children()[1]).children();
	for(var i=0; i<rows.length; i++) {
		var mid = $($(rows[i]).children()[0]).attr("id");
		var menu_name = $($(rows[i]).children()[0]).text();
		var amount = $($(rows[i]).children()[1]).text();
		newMenu.MID = mid;
		newMenu.MENU_NAME = menu_name;
		newMenu.AMOUNT = amount;
		$.ajax({
			type:"post",
			url:"https://shawnluxy.ddns.net:80/add_orderlist",
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
	}
	alert(message);
	if(message == "SUCCESS") {goOrder();}
}
//validation check
function validate(quantity) {
	var status = true;
	var regex1 = /^[0-9]+$/;
	// check quantity input
	if(quantity.trim().length == 0) {
		$("#quantityError").text("Quantity cannot be Empty");status = false;
	} else if(!quantity.match(regex1) ||  parseInt(quantity)==0) {
		$("#quantityError").text("Quantity must be a Positive Integer");status = false;
	} else {
		$("#quantityError").text("");
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
//show current time in ideal format
function getTime() {
	var Time = new Date();
	return Time.toISOString().slice(0,10) + " " + Time.getHours() + ":" + Time.getMinutes() + ":" + Time.getSeconds();
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