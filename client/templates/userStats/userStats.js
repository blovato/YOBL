Meteor.subscribe('userList');

Template.userStats.onRendered(function(){
  var circleParams = {
    color: '#EE6E73',
    strokeWidth: 6,
    duration: 1500,
    easing: 'easeInOut',
    fill: '#fff',
    text: {
        value: '0'
    },
    step: function(state, bar) {
        bar.setText((bar.value() * 100).toFixed(0));
    }
  };

  var circleUser = new ProgressBar.Circle('#progressCircleUser', circleParams);
  var circleAll = new ProgressBar.Circle('#progressCircleAll', circleParams);

  var updateAllStats = function(res){

    var usersTotal = _.compact(_.map(res, function(val, i){
      if(val.profile.isChecked.length > 0){
        return val.profile.isChecked.length;
      }
    }));

    var total = _.reduce(usersTotal, function(accum, current){
      return accum + current;
    });

    var average = total/usersTotal.length;

    circleAll.animate(average/358);
  };

  var updateMyStats = function(){
    var completed = Meteor.user().profile.isChecked.length;
    circleUser.animate(completed/358);
  };

  // get live updating user progress data
  this.autorun(function(){
    var data = Meteor.users.find({}, {fields:{profile:1}}).fetch();
    Meteor.call('allUsers', function(err, res){
      if(err){
        console.log(err);
      } else {
        this.length = res.length;
        updateAllStats(res);
        updateMyStats();
      }
    });
  });
});

Template.userStats.helpers({
  'usersLength': function(){
    return Meteor.users.find({}).fetch().length;
  }
});



