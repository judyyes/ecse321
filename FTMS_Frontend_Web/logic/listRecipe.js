
function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$("#cancel").on("click",goMenu);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	showList();
	resize_sidebar();
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

//show all items 
function showList() {
	if(localStorage.getItem("Picked") != null) {
		var menu = JSON.parse(localStorage.getItem("Picked"));
		//display name and price
		$("#menuName").text(menu.NAME);
		$("#menuPrice").text("$"+menu.PRICE);
		//display table
		var table = $(".w3-table");
		$.ajax({
			type:"get",
			url:"https://shawnluxy.ddns.net:80/menu/" + menu.ID,
			async:false,
			timeout:10000,
			success:function(data) {
				if(data != "empty") {
					data = JSON.parse(data);
					for(var i=0; i<data.length; i++) {
						var row = $('<tr></tr>').appendTo(table);
						$('<td></td>').text(data[i].FOOD_NAME).appendTo(row);
						$('<td></td>').text(data[i].AMOUNT).appendTo(row);
					}	
				}
			},
			error:function(type) {
				alert("timeout");
			},
		});	
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
