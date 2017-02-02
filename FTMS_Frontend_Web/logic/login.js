
function initial() {
	$("#login").on("click", login);
}
//event handler
function login() {
	var user = {};
	user.USERNAME = $("#username").val();
	user.PASSWORD = $("#password").val();
	$("#usererror").text("");
	$("#passerror").text("");
	//post user inputs and compare with backend
	$.ajax({
		type:"post",
		url:"https://shawnluxy.ddns.net:80/login",
		contentType:"application/x-www-form-urlencoded",
		data:user,
		timeout:5000,
		async:false,
		success:function(data){
			if(data == "NO SUCH USER") {
				$("#usererror").text("USERNAME NOT EXIST");}
			else if(data == "WRONG PASSWORD") {
				$("#passerror").text("WRONG PASSWORD");}
			else {
				localStorage.setItem("userID", data.toString());
				window.location.href = "page/viewProfile.html";
				localStorage.removeItem("viewPicked");
			}
		},
		error:function(type){
			alert("timeout");
		},
	});
}