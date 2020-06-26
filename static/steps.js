$(document).ready(function(){
	if(currStep == 1)
    	shuffleNoAnimation();
	resumeInteraction();
})


$(document).ready(function(){
	$("#continue").click(function(){
		if(currStep == 3)
			window.location.href = "/"

		else
			sendCurrCube()

		// $("#buttonDiv").hide();
	})
})

function sendCurrCube(){
	var cubeOrientation = myCube.getCubeOrientation()

	console.log(cubeOrientation)

	$.ajax({
            type: "POST",
            url: "updateCubeOrientation",                
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(cubeOrientation),
            success: function(result){
				window.location.href = "/learn/step/"+JSON.stringify(currStep+1)
                  // songs = result["songs"]
                  // displaySongs(songs, "")
            },
            error: function(request, status, error){
                  console.log("Error");
                  console.log(request)
                  console.log(status)
                  console.log(error)
            }
        });
}

var showPopup = false;
$(document).ready(function(){
	$("#popupInfo").hide();
	$("#help").hover(function(){
		$("#popupInfo").show();
		isInteractive = false;
		showPopup = true;
		$("#help").addClass("helpShadow");
		$("#help").removeClass("helpShadowSmall");
	},function(){
		$("#popupInfo").hide();
		isInteractive = true;
		showPopup = false;
		$("#help").removeClass("helpShadow");
		$("#help").addClass("helpShadowSmall");
	})
})

//moveNotationsHelp
$(document).ready(function(){
	$("#popUpMoveNotation").hide();
	$("#popUpMoveNotation").removeClass("hidden");

	$("#moveHelpButton").hover(function(){
		$("#popUpMoveNotation").show();
		$("#moveHelpButton").addClass("helpShadow");
		$("#moveHelpButton").removeClass("helpShadowSmall");
	},function(){
		$("#popUpMoveNotation").hide();
		$("#moveHelpButton").removeClass("helpShadow");
		$("#moveHelpButton").addClass("helpShadowSmall");
	})
})

function initSolvedSequence(){
	//Do something celebratory when solved
	console.log("SOLVED")

	$("#buttonDiv").show();
	pauseInteraction();

	if(currStep == 3)
		$("#description").text("Congrats you solved the Rubik's Cube! Click to return to home");
	else
		$("#description").text("Great Job! Click the button to continue.");
}


$(document).ready(function(){
	loadPage();
	$("#popUpCase").removeClass("hidden");
	$("#popUpCase").hide();
})

function loadCaseButtons(){
	var row = $("<div class='row'>");

	var buttonDiv = $("<div class='col-"+(12-currStepData["caseCaptionList"].length)+"'>");
		row.append(buttonDiv);

	$.each(currStepData["caseCaptionList"], function(index, value){
		var buttonDiv = $("<div class='col-1'>");
		var button = $("<button class='casesButton btn btn-default helpShadowSmall'>")
		button.text((index+1)+"");

		button.hover(function(){
			$("#popUpCase").show();
			button.addClass("helpShadow");
			button.removeClass("helpShadowSmall");
			createPopUpCase(index+1)
		},function(){
			$("#popUpCase").hide();
			button.removeClass("helpShadow");
			button.addClass("helpShadowSmall"); 

		})

		buttonDiv.append(button);
		row.append(buttonDiv);
	})

	$("#cases").append(row);
}

// <img class = "goalImg" src="{{url_for('static', filename='imgs/firstLayerGoal.png')}}">
//       <div class="caption">
//         Notice that all edge pieces also have the same color
//       </div>

function loadPage(){
	//load the title
	var titleDiv = $("#title");
	var title = $("<span>");
	title.text("Step " + currStepData["step"] +": ");
	var span = $("<span class='smallerTitle'>");
	span.text(currStepData["title"])
	titleDiv.append(title)
	titleDiv.append(span)

	//load the description
	$("#description").text(currStepData["description"])

	//load goal image
	var goalImg = $("<img class='goalImg'>");
	goalImg.attr("src",currStepData["goalImage"])
	var goalDescription = $("<div class='caption'>")
	goalDescription.text(currStepData["goalDescription"])
	$("#goalImageDiv").append(goalImg)
	$("#goalImageDiv").append(goalDescription)

	loadCaseButtons();
}

function createPopUpCase(caseNum){
	var titleDiv = $("<div class='caption'>");
	titleDiv.append(currStepData["caseTitleList"][caseNum-1]);

	var thumbnailDiv = $("<div class='thumbnail'>");
	var img = $("<img class='goalImg'>");
	var str = currStepData["caseImgList"][caseNum-1];
	img.attr("src",str)

	var captionDiv = $("<div class='caption'>");
	captionDiv.append(currStepData["caseCaptionList"][caseNum-1]);

	thumbnailDiv.append(titleDiv)
	thumbnailDiv.append(img);
	thumbnailDiv.append(captionDiv);

	$("#popUpCase").empty()
	$("#popUpCase").append(thumbnailDiv);
}

