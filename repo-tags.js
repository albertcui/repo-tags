Repos = new Mongo.Collection("repos");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    repos: function () {
      return Session.get("repos");
    }
  });

  Template.hello.events({
    'click button': function () {
      Meteor.call('getUserStars', 'albertcui', function (error, result) { 
        if (result.statusCode == 200) {
          Session.set("repos", result.data)    
        }
      
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
        repos =  Meteor.http.get(
          "https://api.github.com/users/" + user + "/starred",
          {
            headers: {
              "User-Agent": "albertcui" 
            }
          }
        );
        
        repos.data.forEach(function(r){
          Repos.insert(r);
        })
        
        return repos;
      }
  });
}
