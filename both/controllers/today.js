TodayController = AppController.extend({
  waitOn: function() {
    return this.subscribe('plans');
  },
  data: {
    plans: Plans.find({})
  },
  onAfterAction: function () {
    Meta.setTitle('Today');
  }
});

TodayController.events({
  'click #main-card': function (event, template) {

  }
});
