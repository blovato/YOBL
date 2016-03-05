OverviewController = AppController.extend({
  waitOn: function() {
    return this.subscribe('plans');
  },
  data: {
    plans: Plans.find({})
  },
  onAfterAction: function () {
    Meta.setTitle('Overview');
  }
});

OverviewController.events({
  'click [data-action=doSomething]': function (event, template) {
    event.preventDefault();
  }
});