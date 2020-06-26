var showPopup = false;
currStep = -1;
canRotate = false;

$(document).ready(function(){
	$("#popupInfo").hide();
	$("#resultsPopUp").hide()
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

$(document).ready(function(){
	resumeInteraction();
})

$(document).ready(function(){
	disableStart()
	$("#time").text(formatTime(timePassed))

  $("#shuffle").click(function(){
  	stopTimer()
  	
  	disableStart()
    shuffle()
	timePassed = 0
    canRotate = false;

    //enable start button after shuffle
    rotateSpeed = 7;
    x = 30;
	setTimeout(enableStart, x*rotateSpeed*20+1)
  })
})

$(document).ready(function(){
  $("#reset").click(function(){
			window.location.href = "/solve"
  })
})

$(document).ready(function(){
  $("#start").click(function(){
  	startTimer()
  	canRotate = true;
  	disableStart()
  })
})

$(document).ready(function(){
  $("#playAgain").click(function(){
  	playAgain()
  })
})

$(document).ready(function(){
  $("#home").click(function(){
      window.location.href = "/"; 
  })
})

function enableStart(){
	$("#start").show()
}

function disableStart(){
	$("#start").hide()
}

let timePassed = 0
let timerInterval
function startTimer() {
  timerInterval = setInterval(() => {
    
    // The amount of time passed increments by one
    timePassed = timePassed += 1;
    
    // The time left label is updated
	$("#time").text(formatTime(timePassed))

	if (Math.floor(timePassed / 6000) >= 10){
		endGame();
	}
    // document.getElementById("base-timer-label").innerHTML = formatTime(timePassed);
  }, 10);
}

function stopTimer() {
	clearInterval(timerInterval)
}

//https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/
function formatTime(time) {

  let time1 = Math.floor(time / 100);

  let minutes = Math.floor(time1 / 60);

  // set max for the time
  if (minutes > 10){
  	return "10:00.00";
  }
  
  let seconds = time1 % 60;
  
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  let milli = time % 100;

  if (milli < 10) {
  	milli = `0${milli}`;
  }

  // The output in MM:SS format
  return `${minutes}:${seconds}.${milli}`;
}

function initSolvedSequence(){
	stopTimer()

	displayCongratsPage(timePassed)
	console.log("CONGRATS! YOU FINISHED WITH ", formatTime(timePassed));
	timePassed = 0

  	canRotate = false;
}

function displayCongratsPage(time){
	isInteractive = false;

	$("#resultsPopUp").show()

	$("#resultsTitle").text("Congrats!")

	$("#resultsInfo").empty()

	$("#resultsInfo").append("You solved the 2x2 Rubik's Cube in ");
	timeTaken = $("<span class='color2'>")
	timeTaken.text(formatTime(time));
	$("#resultsInfo").append(timeTaken);
	$("#resultsInfo").append("!");
	$("#resultsInfo").append($("<br>"))
	$("#resultsInfo").append("Way to Go!");
}

function endGame(){
	stopTimer()

	displayEndPage()
	timePassed = 0

	canRotate = false;
}

function displayEndPage(){
	isInteractive = false;

	$("#resultsPopUp").show()

	$("#resultsTitle").text("Time's Up!")

	$("#resultsInfo").empty()

	$("#resultsInfo").append("It took over 10 minutes to solve the cube...");
	$("#resultsInfo").append($("<br>"))
	$("#resultsInfo").append("Try again or learn the steps again.");
}

function playAgain(){
	isInteractive = true;

	$("#resultsPopUp").hide()

	$("#time").text(formatTime(timePassed))

}

// https://www.w3schools.com/howto/howto_js_countdown.asp