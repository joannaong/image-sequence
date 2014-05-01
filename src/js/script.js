$(function() {
  var nImg = 0;
  var imgNum = $('.frame').length;

  $('.frames').mousewheel(function(event, delta, deltaX, deltaY) {

    // if (!$("h1").hasClass("hide")) {
    //   $("h1").addClass("hide");
    // }
    

    if(deltaY>0){
    	nImg++;   
    } else{
    	nImg--;   
    }
    if(nImg>=imgNum){ nImg = 0; }
    if(nImg<0){ nImg = imgNum-1; }

    $(".frame").each(function(){ 
			$(this).removeClass("show");
    });
    $(".frame").eq(nImg).addClass("show");
  });

});