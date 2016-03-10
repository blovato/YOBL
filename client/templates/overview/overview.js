Meteor.subscribe('plans');

Template.overview.rendered = function() {

};

// today
var currentYear = new Date().getFullYear();
var today = new Date();
var day = today.getDate();
var month = today.getMonth();
var todayObj = new Date(currentYear, month, day);
var todayNum = todayObj.getTime();

Template.overview.helpers({
  'plan': function() {
    return Plans.find({}).fetch();
  },
  'setPastStyle': function() {
    var currentYear = new Date().getFullYear();

    // this date
    var thisDate = this.date.split('/');
    var thisDateObj = new Date(currentYear, thisDate[0] - 1, thisDate[1]);
    var thisDateNum = thisDateObj.getTime();

    if (thisDateNum == todayNum) {
      return "red lighten-2 todayActive z-depth-1";
    } else if (thisDateNum < todayNum) {
      return "grey lighten-2";
    } else {
      return "red lighten-3 z-depth-1";
    }
  },
  'checked': function() {
    var checkedArray = Meteor.user().profile.isChecked;
    if(checkedArray.indexOf(this._id) >= 0){
      return true;
    }
  }
});

Template.overview.events({
  'click input[type=checkbox]': function(event) {
    var isChecked = event.target.checked;
    var self = this;
    Meteor.call('checked', this._id, function(err, res) {
      if (err) {
        alert("Error: " + err.reason);
      } else {
        if(isChecked){
          Materialize.toast("Completed: "+ self.readingShort+" & Psalm "+ self.psalm, 3000);
        }
      }
    });
  },
  'click #scrollToToday': function(){
    var todayHeight = ($(".todayActive").offset().top - 10) + "px";
    $("html, body").animate({
      scrollTop: todayHeight
    }, 1500, 'swing');
  }
});



