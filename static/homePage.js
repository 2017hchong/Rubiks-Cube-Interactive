$(document).ready(function(){
	pauseInteraction();
	isHomePage = true;
	$("#navMenu").hide();
})

$(document).ready(function(){
  $("#learn").click(function(){
      window.location.href = "/learn"; 
  })
  $("#solve").click(function(){
      window.location.href = "/solve"; 
  })
})