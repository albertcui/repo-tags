if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click button': function () {
      Meteor.call('getUserStars', 'albertcui', function (error, result) { 
        console.log(result) 
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  
  Meteor.methods({
      getUserStars: function (user) {
        check(user, String);
        Meteor.http.call("GET", "https://api.github.com/users/" + user + "/starred");
      }
  });
}
