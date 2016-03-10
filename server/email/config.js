Meteor.startup(function() {
  Meteor.Mailgun.config({
    username: Meteor.settings.username,
    password: Meteor.settings.password
  });

  Meteor.methods({
    'sendDailyEmail': function(userEmails, message) {
      this.unblock();
      console.log('called sendDailyEmail');

      Meteor.Mailgun.send({
        to: 'brentengust@gmail.com',
        from: 'Brenten Lovato <brentengust@gmail.com>',
        subject: 'Welcome to the Year Of Biblical Literacy',
        text: message,
        html: Handlebars.templates['dailyEmail']({siteURL: Meteor.absoluteUrl(), fromName: name, fromEmail: email, message: message})
      });
    }
  });
});
