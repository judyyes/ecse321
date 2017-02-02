var newitem;
var raw_name = "";

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$("#change").on("click",change);
	$("#cancel").on("click",goFood);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	newitem = true;
	showPicked();
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
//show the info of chosen item in list pages
function showPicked() {
	if(localStorage.getItem("Picked") != null) {
		var food = JSON.parse(localStorage.getItem("Picked"));
		$("#foodName").val(food.NAME);
		$("#foodQuantity").val(food.QUANTITY);
		$("#foodPrice").val(food.PRICE);
		newitem = false;
		raw_name = food.NAME.toString();
	}
}
//event handler - post changed info to backend
function change() {
	var newFood = {};
	newFood.NAME = $("#foodName").val();
	newFood.QUANTITY = $("#foodQuantity").val();
	newFood.PRICE = $("#foodPrice").val();
	newFood.RAW_NAME = raw_name;
	// check input validation
	if(!validate(newFood.NAME, newFood.QUANTITY, newFood.PRICE)){return false;}

	if(newitem) {
		$.ajax({
			type:"post",
			url:"https://shawnluxy.ddns.net:80/add_food",
			contentType:"application/x-www-form-urlencoded",
			data:newFood,
			async:false,
			timeout:5000,
			beforeSend:function(xhr){
				xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
			},
			success:function(data) {
				alert(data);
				if(data == "SUCCESS") {
					goFood();
				}
			},
			error:function(type) {
				alert("timeout");
			},
		});			
	} else {
		$.ajax({
			type:"put",
			url:"https://shawnluxy.ddns.net:80/update_food",
			contentType:"application/x-www-form-urlencoded",
			data:newFood,
			async:false,
			timeout:5000,
			beforeSend:function(xhr){
				xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
			},
			success:function(data) {
				alert(data);
				if(data == "SUCCESS") {
					goFood();
				}
			},
			error:function(type) {
				alert("timeout");
			},
		});	
	}
}
//valudation check
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
