
var staffList = [];

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$(".glyphicon-plus").on("click",addStaff);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	showList();
	resize_sidebar();
	viewStaff();
	deleteStaff();
}

function logout() {
	window.location.href = "../index.html";
}
function addStaff() {
	window.location.href = "../page/addStaff.html";
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

//show all items in the Equipment table
function showList() {
	var table = $(".w3-table");
	$.ajax({
		type:"get",
		url:"https://shawnluxy.ddns.net:80/staff",
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				staffList = data;
				for(var i=0; i<data.length; i++) {
					var name = data[i].NAME;
					var position = data[i].ROLE;
					var row = $('<tr></tr>').appendTo(table);
					var firstcol = $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).appendTo(row);
					firstcol.append('<img src="../resource/user.jpg" class="w3-round-jumbo" style="width: 20%;">');
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center", "sname"].join(' ')}).text(name).appendTo(row);
					$('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).text(position).appendTo(row);
					var lastcol = $('<td></td>').attr({class: ["w3-col", "l3", "w3-center"].join(' ')}).appendTo(row);
					$('<button></button>').addClass("w3-hover-blue-grey w3-text-black w3-border").attr('style', 'padding-left: 5%; padding-right: 5%; margin-right: 2%').text("View").appendTo(lastcol);
					if(position != "Manager"){
						$('<button></button>').addClass("w3-hover-blue-grey w3-text-black w3-border").attr('style', 'padding-left: 5%; padding-right: 5%;').text("Delete").appendTo(lastcol);	
					}
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
		url:"https://shawnluxy.ddns.net:80/delete_staff/" + item.ID,
		async:false,
		timeout:5000,
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
		},
		success:function(data) {
			alert(data);
			goStaff();
		},
		error:function() {
			alert("timeout");
		},
	});
}
//add event to each icon
function deleteStaff() {
	var trash = $('button').filter(function(i){ return $(this).text() === "Delete"; });
	for(var i=0; i<trash.length; i++) {
		trash[i].addEventListener("click",function(index){
			return function (){
				var staff = staffList[index];
				deleteItem(staff);
			};
		}(i), true);
	}
}
//add event to each staff's name
function viewStaff() {
	var view = $('button').filter(function(i){ return $(this).text() === "View"; });
	for(var i=0; i<view.length; i++) {
		view[i].addEventListener("click",function(index){
			return function (){
				var staff = staffList[index];
				localStorage.setItem("viewPicked", JSON.stringify(staff));
				window.location.href = "viewProfile.html";
			};
		}(i), true);
	}
}
//Search Site filter
function searchStaff() {
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
