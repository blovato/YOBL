Meteor.subscribe('plans');

Template.daily.onRendered(function() {
  $("html, body").animate({scrollTop: 0}, 1);

  // place audio btn on load & init audio
  $("#audioControlBtn").css('top', ($('#main-card').offset().top - 30) + "px")
                       .css('position', 'absolute');
  var audio = $('#audio').get(0);
  var audioProgress = (audio.currentTime/audio.duration) *100;
  $('#audioFiller').css('width', audioProgress + "%");

  $(window).scroll(function() {
    var scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());
    $('#progressFiller').css('width', scrollPercent +"%"  );
  });

  $('#progressFiller').on('click', function(){
    $("html, body").animate({scrollTop: 0}, 1500, "swing");
  });

  $('.changeDate').on('click', function(){
    Session.set("bibleAPIresp", false);
    Session.set("biblePsalmResp", false);
  });
  
  // make api calls (3 total)
  this.autorun(function(){
    var plans = Template.currentData();
    var bibleAPIurl = "http://www.esvapi.org/v2/rest/passageQuery?key=IP&passage="+encodeURI(plans.readingShort)
    +"&include-headings=false&include-verse-numbers=false&include-footnotes=false&include-footnote-links=false&include-subheadings=false&include-audio-link=false&include-passage-references=false";
    
    Meteor.call("bibleAPI", bibleAPIurl, function(err, res){
      if(err) {
        console.log("Error: " + err.reason);
      } else {
        Session.set("bibleAPIresp", res.content);
      }
    });

    var psalmAPIurl = "http://www.esvapi.org/v2/rest/passageQuery?key=IP&passage="+encodeURI("Psalm"+plans.psalm)
    +"&include-headings=false&include-verse-numbers=false&include-footnotes=false&include-footnote-links=false&include-subheadings=false&include-audio-link=false&include-passage-references=false";
    
    Meteor.call("bibleAPI", psalmAPIurl, function(err, res){
      if(err) {
        console.log("Error: " + err.reason);
      } else {
        Session.set("biblePsalmResp", res.content);
      }
    });
  });
});

Template.daily.destroyed = function(){
  Session.set("bibleAPIresp", false);
  Session.set("biblePsalmResp", false);
}

var changeDate = function(strDate, cb){
  var currentYear = new Date().getFullYear();
  var x = strDate.split('/');
  var today = new Date(currentYear, x[0]-1, x[1]);
  today.setDate(cb(today.getDate()));

  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var tomorrowObj = Plans.find({'date': mm + '/'+ dd}).fetch();

  return '/' + tomorrowObj[0]._id;
};

Template.daily.helpers({
  'bibleTextResp': function(){
    var text = Session.get("bibleAPIresp");
    return text;
  },
  'psalmTextResp': function(){
    var text = Session.get("biblePsalmResp");
    return text;
  },
  'tomorrowUrl': function(){
    return changeDate(this.date, function(date){
      return date + 1;
    });
  },
  'yesterdayUrl': function(){
    return changeDate(this.date, function(date){
      return date - 1;
    });
  },
  'checked': function() {
    var checkedArray = Meteor.user().profile.isChecked;
    if(checkedArray.indexOf(this._id) >= 0){
      return true;
    }
  }
});

Template.daily.events({
  'click #audioControlBtn': function(){
    var audio = $('#audio').get(0);

    var updateProgress = function(){
      var audioProgress = (audio.currentTime/audio.duration) *100;
      $('#audioFiller').css('width', audioProgress + "%");
    };

    var btnIcon = $('#audioBtnIcon');
    var btn = $('#audioControlBtn');

    if(audio.paused){
      audio.play();
      var intervalProgress = setInterval(updateProgress, 500);
      btnIcon.html('pause');
      btn.css('position', 'fixed')
         .css('top', ($(window).height() - 65) + "px");
    } else {
      audio.pause();
      clearInterval(intervalProgress);
      btnIcon.html('play_arrow');
    }
  },
  'click .changeDate':function(){
    $('#audioControlBtn').css('position', 'absolute')
                         .css('top', ($('#main-card').offset().top - 30) + "px");
    $('#audioBtnIcon').html('play_arrow');
  },
  'click input[type=checkbox]': function(event) {
    var isChecked = event.target.checked;
    if(isChecked){
      Materialize.toast("Completed: "+ this.readingShort+" & Psalm "+ this.psalm, 3000);
    }
    Meteor.call('checked', this._id, function(err, res) {
      if (err) {
        alert("Error: " + err.reason);
      } else {
        //console.log(res);
      }
    });
  }
});
