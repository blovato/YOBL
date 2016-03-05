Router.route('/', {
  name: 'home'
});

Router.route('/today', {
  name: 'today',
  template: 'today',
  data: function(){
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    return Plans.findOne({'date': month + '/'+ (day-1)});
  }
});

Router.route('/overview', {
  name: 'overview',
  template: 'overview'
});

Router.route('/:id', {
  name: "daily",
  template: 'daily',
  data: function(){
    return Plans.findOne({_id: this.params.id});
  }
});

Router.plugin('ensureSignedIn', {
  only: ['today', 'overview']
});