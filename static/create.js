function submit(){
      clearErrors()

      var newSong = {
                  "title": getField("#titleInput"),
                  "year": getField("#yearInput"),
                  "movie": getField("#movieInput"),
                  "poster": getField("#imageInput"),
                  "lyrics": getField("#lyricsInput")
            }
      console.log(newSong)

      error = false;

      if( newSong["lyrics"] == null || newSong["lyrics"].length ===0) {
            displayErrorInput($("#lyricsInput"), "Lyrics field cannot be left empty");
            error = true;
      }
      if( newSong["poster"] == null || newSong["poster"].length ===0 ) {
            displayErrorInput($("#imageInput"), "Image field cannot be left empty");
            error = true;
      }
      if( newSong["movie"] == null || newSong["movie"].length ===0 ) {
            displayErrorInput($("#movieInput"), "Movie field cannot be left empty");
            error = true;
      }
      if( newSong["year"] == null || newSong["year"].length ===0 ) {
            displayErrorInput($("#yearInput"), "Year field cannot be left empty");
            error = true;
      }
      else if( !$.isNumeric( newSong["year"] )) {
            displayErrorInput($("#yearInput"), "Not a valid number");
            error = true;
      }
      if( newSong["title"] == null || newSong["title"].length ===0 ) {
            displayErrorInput($("#titleInput"), "Title field cannot be left empty");
            error = true;
      }

      if(!error)
            saveSong(newSong)
}

function clearFields(){
      $("#titleInput").find(".in").val("")
      $("#yearInput").find(".in").val("")
      $("#movieInput").find(".in").val("")
      $("#imageInput").find(".in").val("")
      $("#lyricsInput").find(".in").val("")
}

function clearErrors(){
      $("#lyricsInput").find('.error').text("");
      $("#imageInput").find('.error').text("");
      $("#movieInput").find('.error').text("");
      $("#yearInput").find('.error').text("");
      $("#titleInput").find('.error').text("");
}

function displayErrorInput(input, error){
      input.find('.error').html(error+"<br>");

      input.find('.in').focus();
}

function displayLink(id){
      $("#message").removeClass("red").text("New Item Successfully Created: ");
      //window.location.origin + "/view/"+id
      var test = $("<button type='button' class='btn btn-info buttonSee'/>",
      {
            click: function () { 
                  window.location.href = "/view/"+JSON.stringify(id); 
            }
      });
      test.text("View it Here")

      $("#message").append(test);
      $("#titleInput").find('.in').focus();
      clearErrors()
      clearFields()
}

function displayError(error){
      $("#message").addClass("red").text("ERROR: "+ error)
      $("#message").focus();
}

var saveSong = function(newSong){
      $.ajax({
            type: "POST",
            url: "addSong",                
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(newSong),
            success: function(result){
                  console.log("SUCCESS")
                  displayLink(result["id"])
            },
            error: function(request, status, error){
                  console.log("Error");
                  console.log(request)
                  console.log(status)
                  console.log(error)
                  displayError(error)
            }
            });
}

function getField(id){
      var input = $.trim($(id).find(".in").val())
      //Check blank space
      if ( input == '' ){
            return null;
      }

      return input;
}

var search_server = function(searchKey){
      $.ajax({
            type: "POST",
            url: "search",                
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(searchKey),
            success: function(result){
                  console.log("SUCCESS")
                  songs = result["songs"]
                  displaySongs(songs, searchKey)
            },
            error: function(request, status, error){
                  console.log("Error");
                  console.log(request)
                  console.log(status)
                  console.log(error)
            }
            });
}

function getSearchField(){
      var input = $.trim($('#searchInput').val())
      //Check blank space
      if ( input == '' ){
            return "";
      }

      return input;
}

//User pushes the submit button
$(document).ready(function(){
      $("#submitButtonCreate").click(function(){
            submit()
      })

      $("#createItem").addClass("active")

      $("#titleInput").find('.in').focus()

      
      $("#imageInput").find('.in').keypress(function (e) {
            if (e.which == 13) {
                  submit()
            }
      });
      $("#movieInput").find('.in').keypress(function (e) {
            if (e.which == 13) {
                  submit()
            }
      });
      $("#yearInput").find('.in').keypress(function (e) {
            if (e.which == 13) {
                  submit()
            }
      });
      $("#titleInput").find('.in').keypress(function (e) {
            if (e.which == 13) {
                  submit()
            }
      });
})


function getSearchField(){
      var input = $.trim($('#searchInput').val())
      //Check blank space
      if ( input == '' ){
            return "";
      }
      return input;
}

function search(){
    var searchTerm = getSearchField()
    console.log(searchTerm)
    window.location.href = "/"+JSON.stringify(searchTerm); 
}

//User pushes the submit button
$(document).ready(function(){
      $("#submitButton").click(function(){
            search()
      })
})

//User presses enter
$(document).ready(function(){
      $("#searchInput").keypress(function(e){
            var key = e.which;
            if(key == 13){
                  search()
            }
      })
})

