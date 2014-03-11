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
    $("#loginPopup").hide();
    $.get("/childList", function(res){
        console.log(res);
        for(var i in res){
            console.log(i);
            $("#childList").append("<p id="+res[i].email+">"+res[i].name+"<img id='removeChild' src='images/remove.png' style='float:right'></p>");
        }
    });

    $.get("/parentList", function(res){
        console.log(res);
        for(var i in res){
            console.log(i);
            $("#parentList").append("<p id="+res[i].email+">"+res[i].name+"<img id='removeParent' src='images/remove.png' style='float:right'></p>");
        }
    });


    $("#addNewChild").click(function(){
        $("#addNewChildPopup").show();
    });
    $("#addChildCancel").click(function(){$(this).parent().hide();});
    $("#addChildSubmit").click(function(){
        var obj = {
            "name": $("#addNewChildPopup #nameField").val(),
            "email": $("#addNewChildPopup #emailField").val().toLowerCase(),
            "password": $("#addNewChildPopup #passwordField").val(),
            "points": 0
        };
        if(!checkEmail(obj["email"])) return;
        //else if valid:
        $.post("/callback?action=addNewChild", obj)
        .done(function(){
            $.notify("Child added!", "success");            
            setTimeout(function(){
                location.reload(true);
            },1000);
        })
        .fail(function(){$.notify("Child not added! Email already exists", "error");});
    });

    $("#addNewParent").click(function(){
        $("#addNewParentPopup").show();
    });
    $("#addParentCancel").click(function(){$(this).parent().hide();});
    $("#addParentSubmit").click(function(){
        var obj = {
            "name": $("#addNewParentPopup #nameField").val(),
            "email": $("#addNewParentPopup #emailField").val().toLowerCase(),
            "password": $("#addNewParentPopup #passwordField").val(),
            "points": -1
        };
        if(!checkEmail(obj["email"])) return;
        //else if valid:
        $.post("/callback?action=addNewParent", obj)
        .done(function(){
            $.notify("Parent added!", "success");            
            setTimeout(function(){
                location.reload(true);
            },1000);
        })
        .fail(function(){$.notify("Parent not added! Email already exists", "error");});
    });
	$(document).on("click", "#removeChild", function(){
        var r = confirm("Are you sure you want to remove this child?");
            if (r == true) {
                var person = {"email":$(this).parent().attr("id"), "isParent":false};
                $.post("/callback?action=removePerson", person).done(function(e){
                $(this).parent().remove();
                });   
            }  else {
                //do nothing, and kill the confirm box
            }
    });
	$(document).on("click", "#removeParent", function(){
         var r = confirm("Are you sure you want to remove this parent?");
            if (r == true) {
                var person = {"email":$(this).parent().attr("id"), "isParent":true};
                $.post("/callback?action=removePerson", person).done(function(e){
                $(this).parent().remove();
                });
            } else {
                //do nothing, and kill the confirm box
            }
    });


    $("#logoutBtn").click(function(){
        $.post("/callback?action=logout", {})
        .done(function(){
            $.notify("You've been logged out! Redirecting...", "success");
            setTimeout(function(){
                location.reload(true);
            },1000);
        });
    });
}

