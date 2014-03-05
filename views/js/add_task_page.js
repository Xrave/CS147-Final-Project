'use strict';



// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
    initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
     //$("input").jqBootstrapValidation();
    
    console.log("Javascript connected!");
    $('#submitTaskBtn').click(function(e) {
        e.preventDefault();
        $.notify.defaults({elementPosition: "top center"});
        var taskNameobj = $('#newTaskName').val();
        if(taskNameobj.length == 0){
            $('#newTaskName').notify("Please enter a task");
            return;
        }
        var taskAssignedTo = $('input[type=radio]:checked').val()
        if (taskAssignedTo == undefined){
            $('#radiobuttons').notify("Please select a child to assign the task to!", "warning");
            return;
        }
        var rewardPtNum = parseInt($('#rewardVal').val());
        if( rewardPtNum<0){
            $('#rewardVal').notify("Can't assign a negative reward", "warning");
            return;
        }
        if( rewardPtNum==NaN | rewardPtNum == undefined){
            $('#rewardVal').notify("Please enter a numerical reward value.", "warning");
            return;
        }
        
        var newdata = {		
            "assignee": taskAssignedTo,
            "taskText": taskNameobj,
            "taskReward": parseInt(rewardPtNum),
            "taskCompletion": 0
        };
        //make it into a JSON object. push it to data by calling a routes, then allow the default action to go through.
        $.post('/callback?action=addTask', newdata, function(e){
            $.notify("Task Created!", "success");
            window.location = '/';

        });
    });
}
