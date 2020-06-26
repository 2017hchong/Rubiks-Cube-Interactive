$(document).ready(function(){
	pauseInteraction();
	// $("#navMenu").show();
})

$(document).ready(function(){
  $("#step1").click(function(){
		window.location.href = "/learn/step/"+JSON.stringify(1)
  })
  $("#step2").click(function(){
		window.location.href = "/learn/step/"+JSON.stringify(2)
  })
  $("#step3").click(function(){
		window.location.href = "/learn/step/"+JSON.stringify(3)
  })
  
})