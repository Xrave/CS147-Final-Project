// JavaScript Document

$(document).ready(function() {
	initializePage();
})

function isValidEmail(email) {
    // the regex works in IE but should be a string (see nnnnn's answer) 
    // var em= new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
    var em=/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i; // simpler
    return em.test(email);
}

function checkEmail(email){
	if(isValidEmail(email)){
		return true;
	}else{
		$.notify("Email not valid!", "error");
		return false;
	}
}

function initializePage() {
	console.log("javascript connected!");
	
	$.get("/childList", function(res){
		console.log(res);
		for(var i in res){
			console.log(i);
			$("#childList").append("<p>"+res[i].name+"</p>");
		}
	});
	
	$.get("/parentList", function(res){
		console.log(res);
		for(var i in res){
			console.log(i);
			$("#parentList").append("<p>"+res[i].name+"</p>");
		}
	});
	
	
	$("#addNewChild").click(function(){
		$("#addNewChildPopup").show();
	});
		$("#addChildCancel").click(function(){$(this).parent().hide();});
		$("#addChildSubmit").click(function(){
			var obj = {
			"name": $("#nameField").val(),
			"email": $("#emailField").val(),
			"password": $("#passwordField").val(),
			"points": 0
			};
			if(!checkEmail(obj["email"])) return;
			//else if valid:
			$.post("/callback?action=addNewChild", obj)
				.done(function(){$.notify("Child added!", "success");})
				.fail(function(){$.notify("Child not added! Email already exists", "error");});
		});
	$("#addNewParent").click(function(){
		$("#addNewParentPopup").show();
	});
		$("#addParentCancel").click(function(){$(this).parent().hide();});
		$("#addParentSubmit").click(function(){
			var obj = {
			"name": $("#nameField").val(),
			"email": $("#emailField").val(),
			"password": $("#passwordField").val(),
			"points": -1
			};
			if(!checkEmail(obj["email"])) return;
			//else if valid:
			$.post("/callback?action=addNewParent", obj)
				.done(function(){$.notify("Parent added!", "success");})
				.fail(function(){$.notify("Parent not added! Email already exists", "error");});
		});

	$("#logout").click(function(){
		$.post("/callback?action=logout").done(function(){$("#logoutPopup").show();});
	});
}

