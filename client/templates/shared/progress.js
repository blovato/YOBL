Template.progress.onRendered(function() {
  $(window).scroll(function() {
    var scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());
    $('#progressFiller').css('width', scrollPercent +"%"  );
  });
});

Template.progress.events({
  'click #progressBar': function(){
    $("html, body").animate({scrollTop: 0}, 1500, "swing");
  }
});