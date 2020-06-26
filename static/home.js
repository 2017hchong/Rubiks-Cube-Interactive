var showPopup = false;
canRotate = true;
$(document).ready(function(){
	$("#popupInfo").removeClass("hidden");
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

// $(document).ready(function(){
//   $("#learn").click(function(){
//       window.location.href = "/learn/step1"; 
//   })
//   $("#learn").hover(function(){
// 		$("#learn").addClass("learnHover");
// 		$("#learn").removeClass("learnNoHover");
// 	},function(){
// 		$("#learn").removeClass("learnHover");
// 		$("#learn").addClass("learnNoHover");
// 	})
// })

function resumeInteraction(){
	isInteractive = true;
	$("#bottomOverlay").show();
	$("#help").show();
}
function pauseInteraction(){
	isInteractive = false;
	$("#bottomOverlay").hide();
	$("#help").hide();
}



