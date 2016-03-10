Meteor.methods({
  checked: function(elemId, isChecked) {

    var userId = Meteor.userId();
    var checkedArray = Meteor.user().profile.isChecked;

    if(checkedArray.indexOf(elemId) == -1){
      Meteor.users.update({ _id: userId }, { $push: { "profile.isChecked": elemId }});
    } else {
      Meteor.users.update({ _id: userId }, { $pull: { "profile.isChecked": elemId } });
      return Meteor.user().profile;
    }
  },
  allUsers: function(){
    var data = Meteor.users.find({}, {fields:{profile:1}}).fetch();
    return data;
  }
});

// when new user logs in add the isChecked doc
Accounts.onCreateUser(function(options, user) {
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  // prepare profile object for checking
  user.profile = {};
  user.profile.isChecked = [];

/*
  Meteor.call('sendDailyEmail', 'hiya thanks for joining', function(err, res){
    if(err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });
*/
  return user;
});