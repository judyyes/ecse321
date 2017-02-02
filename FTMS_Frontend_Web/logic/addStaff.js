
function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$("#change").on("click",change);
	$("#cancel").on("click",goStaff);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
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

function change() {
	var newStaff = {};
	newStaff.ID = randomString(32);
	newStaff.NAME = $("#staffName").val();
	newStaff.GENDER = $("#gender").val().toLowerCase();
	newStaff.AGE = $("#age").val();
	newStaff.ROLE =capitalizeFirstLetter($("#position").val());
	newStaff.TEL = $("#number").val().replace(/-/g,"");
	newStaff.USERNAME = $("#username").val();
	newStaff.PASSWORD = $("#password").val();
	//check input validation
	if(!validate(newStaff.NAME, newStaff.GENDER, newStaff.AGE, newStaff.ROLE, newStaff.TEL, newStaff.USERNAME, newStaff.PASSWORD)){return false;}
	//post changes
	$.ajax({
		type:"post",
		url:"https://shawnluxy.ddns.net:80/add_staff",
		contentType:"application/x-www-form-urlencoded",
		data:newStaff,
		async:false,
		timeout:5000,
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization",localStorage.getItem("Authorization"));
		},
		success:function(data) {
			alert(data);
			if(data == "SUCCESS") {
				goStaff();
			}
		},
		error:function(type) {
			alert("timeout");
		},
	});
}
//validation check
function validate(name, gender, age, position, number, username, passwd) {
	var status = true;
	var regex1 = /^[0-9]+$/;
	var rolelist = ["Manager", "Cook", "Cashier", "Wholesaler"];
	// check name input
	if(name.trim().length == 0) {
		$("#nameError").text("Name cannot be Empty");status = false;
	} else if(name[0].match(regex1)) {
		$("#nameError").text("Name cannot start with Number");status = false;
	} else {
		$("#nameError").text("");
	}
	// check gender input
	if(gender.trim().length == 0) {
		$("#genderError").text("Gender cannot be Empty");status = false;
	} else if(gender != "male" && gender != "female") {
		$("#genderError").text("Gender must be male or female");status = false;
	} else {
		$("#genderError").text("")	;
	}
	// check age input
	if(age.trim().length == 0) {
		$("#ageError").text("Age cannot be Empty");status = false;
	} else if(!age.match(regex1) ||  parseInt(age)==0) {
		$("#ageError").text("Age must be a Positive Integer");status = false;
	} else {
		$("#ageError").text("");
	}
	// check position input
	if(position.trim().length == 0) {
		$("#positionError").text("Position cannot be Empty");status = false;
	} else if(rolelist.indexOf(position) == -1) {
		$("#positionError").text("Position not available");status = false;
	} else {
		$("#positionError").text("");
	}
	// check number input
	if(number.trim().length == 0) {
		$("#numberError").text("Number cannot be Empty");status = false;
	} else if(!number.match(regex1)) {
		$("#numberError").text("It must be Numbers");status = false;
	} else {
		$("#numberError").text("");
	}
	// check username input
	if(username.trim().length == 0) {
		$("#usernameError").text("Username cannot be Empty");status = false;
	} else if(username[0].match(regex1)) {
		$("#usernameError").text("Username cannot start with Number");status = false;
	} else {
		$("#usernameError").text("");
	}
	// check password input
	if(passwd.trim().length == 0) {
		$("#passwdError").text("Password cannot be Empty");status = false;
	} else if(passwd.length < 6) {
		$("#passwdError").text("Length cannot be smaller than six");status = false;
	} else {
		$("#passwdError").text("");
	}
	return status;
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}