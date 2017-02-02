var staffInfo = {};
var scheduleList = []; 

function initial() {
	//navigate buttons
	$("#logout").on("click",logout);
	$("#Edit").on("click",editInfo);
	//navigate side bar 
	$("#goProfile").on("click",goProfile);
	$("#goStaff").on("click",goStaff);
	$("#goFood").on("click",goFood);
	$("#goEquipment").on("click",goEquipment);
	$("#goMenu").on("click",goMenu);
	$("#goOrder").on("click",goOrder);
	
	resize_sidebar();
	showInfo();
	
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

function showInfo() {
	//hide buttons and input boxes
	$("#change").hide();
	$("#cancel").hide();
	var inputs = $("input[type=text]");
	for(var i=1; i<inputs.length; i++) {
		$(inputs[i]).attr("disabled", true).removeClass("w3-border w3-text-black").attr("style", "background-color: #616161; border-style: hidden; margin-bottom: 10px; height: 20px");
	}
	//get staff information
	if(localStorage.getItem("viewPicked") != null) {
		staffInfo = JSON.parse(localStorage.getItem("viewPicked"));
	} else {
		var userid = localStorage.getItem("userID");
		$.ajax({
			type:"get",
			url:"https://shawnluxy.ddns.net:80/staff/" + userid,
			async:false,
			timeout:10000,
			success:function(data) {
				if(data != "empty") {
					staffInfo = JSON.parse(data)[0];
					localStorage.setItem("Authorization",staffInfo.ROLE);
				}
			},
			error:function(type) {
				alert("timeout");
			},
		});	
	}
	//display personal information
	$('#ID').val(staffInfo.ID);
	$("#Name").val(staffInfo.NAME);
	$("#Gender").val(staffInfo.GENDER);
	$("#Age").val(staffInfo.AGE);
	$("#Position").val(staffInfo.ROLE);
	$("#Number").val(staffInfo.TEL);
	//display schedule
	showSchedule(staffInfo.ID);
}

function editInfo() {
	//check permission
	if(localStorage.getItem("Authorization") != "Manager") {
		alert("Permission Deny");
		return;
	}
	// display buttons and input boxes
	$("#change").show();
	$("#cancel").show();
	var inputs = $("input[type=text]");
	for(var i=2; i<inputs.length; i++) {
		$(inputs[i]).attr("disabled", false).addClass("w3-border w3-text-black").attr("style", "margin-bottom: 8px; height: 22px");
	}
	//edit schedule
	$(".timebox").on("click",editSchedule);
	$("#change").on("click",change);
	$("#cancel").on("click",showInfo);
}
function change() {
	var message = "";
	var newStaff = {};
	newStaff.ID = $("#ID").val();
	newStaff.NAME = $("#Name").val();
	newStaff.GENDER = $("#Gender").val().toLowerCase();
	newStaff.AGE = $("#Age").val();
	newStaff.ROLE =capitalizeFirstLetter($("#Position").val());
	newStaff.TEL = $("#Number").val().replace(/-/g,"");
	//check input validation
	if(!validate(newStaff.NAME, newStaff.GENDER, newStaff.AGE, newStaff.ROLE, newStaff.TEL)){return false;}
	//post changes of staff
	$.ajax({
		type:"put",
		url:"https://shawnluxy.ddns.net:80/update_staff",
		contentType:"application/x-www-form-urlencoded",
		data:newStaff,
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
	if(message !== "SUCCESS") {alert(message);return false;}
	//post changes of schedule
	submitSchedule(newStaff.ID);	
}
//display personal schedule table
function showSchedule(id) {
	var timebox = $(".timebox");
	for(var t=0; t<timebox.length; t++) {timebox[t].style.backgroundColor = 'rgb(107, 186, 185)';}
	$.ajax({
		type:"get",
		url:"https://shawnluxy.ddns.net:80/schedule/" + id,
		async:false,
		timeout:10000,
		success:function(data) {
			if(data != "empty") {
				data = JSON.parse(data);
				scheduleList = data;
				for(var i =0; i<data.length; i++) {
					var d = new Date();
					var start_time = (data[i].START_TIME.split(" "))[1].split(":");
					var end_time = (data[i].END_TIME.split(" "))[1].split(":");
					var start_date = (data[i].START_TIME.split(" "))[0].split("-");
					var diff = new Date(start_date[0]+'/'+start_date[1]+'/'+start_date[2]) - new Date(currentDate());
					diff = diff/1000/3600/24;
					d.setDate(d.getDate()+diff);
					var week_index = d.getDay()-1;
					var start_index = start_time[0]-9;
					var end_index = end_time[0]-9;
					for(var j = start_index; j<end_index; j++) {
						timebox[week_index+j*5].style.backgroundColor = 'rgb(121, 215, 97)';	
					}	
				}
			}
		},
		error:function(type) {
			alert("timeout");
		},
	});
}
//enable change color of the box in table
function editSchedule(e) {
	var sender = (window.event && window.event.srcElement) || e.target;
	if (sender.style.backgroundColor == 'rgb(107, 186, 185)'){ //lightblue
		sender.style.backgroundColor = 'rgb(121, 215, 97)'; //green
	}
	else if(sender.style.backgroundColor == 'rgb(121, 215, 97)'){
		sender.style.backgroundColor = 'rgb(107, 186, 185)'; //green
	}
}
//post new Schedule
function submitSchedule(id) {
	var message = "";
	//delete old schedule
	if(scheduleList.length > 0) {
		for(var i=0; i<scheduleList.length; i++) {
			$.ajax({
				type:"delete",
				url:"https://shawnluxy.ddns.net:80/delete_schedule/" + scheduleList[i].ID,
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
		if(message !== "SUCCESS") {alert(message);return false;}	
	}
	//add new schedule
	var timebox = $(".timebox");
	for(var w=0; w<5; w++) {
		var blocks = [];
		var selected = [];
		// collect choosen boxes (green)
		for(var j=0; j<13; j++) {
			if(timebox[5*j+w].style.backgroundColor == 'rgb(121, 215, 97)') {selected.push(j);}
		}
		if(selected.length > 0) {
			var block = [];
			// divide time periods
			while(selected.length > 0) {
				block.push(selected[0]);
				if((selected[1]-selected[0]) > 1 || selected.length == 1) {
					blocks.push(block);
					block = [];
				}
				selected.shift();
			}
			for (k=0; k<blocks.length; k++) {
				var start = blocks[k][0];
				var end = blocks[k][blocks[k].length-1];
				var start_time = getDate(w)+" "+(start+9).toString()+":00";
				var end_time = getDate(w)+" "+(end+10).toString()+":00";
				//post time of schedule
				var newSchedule = {};
				newSchedule.UID = id;
				newSchedule.START_TIME = start_time;
				newSchedule.END_TIME = end_time;
				$.ajax({
					type:"post",
					url:"https://shawnluxy.ddns.net:80/add_schedule",
					contentType:"application/x-www-form-urlencoded",
					data:newSchedule,
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
				if(message !== "SUCCESS") {alert(message);return false;}
			}
		}	
	}
	if(message == "SUCCESS") {alert(message);goStaff();}
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

//validation check
function validate(name, gender, age, position, number) {
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
	return status;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//show selected date in ideal format
function getDate(index) {
	var Time = new Date();
	var today = Time.getDate();
	var diff = index+1 - Time.getDay();
	Time.setDate(today+diff);
	return Time.toISOString().slice(0,10);
}
//show current data in yyyy/mm/dd
function currentDate() {
	var Time = new Date();
	var dd = Time.getDate();
	var mm = Time.getMonth()+1;
	var yyyy = Time.getFullYear();
	if(dd<10){
	    dd='0'+dd} 
	if(mm<10){
	    mm='0'+mm} 
	var today = yyyy+'/'+mm+'/'+dd;
	return today;
}
