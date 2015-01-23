
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
  var github = Meteor.npmRequire('octonode');
      
  var client = github.client();
  
  Meteor.methods({
      getUserStars: function (user) {
        check(user, String);
        
        var ghUser = client.user(user);
        
        
        var starred = Async.runSync(function(done){
          ghUser.starred(function(err, status, body, headers){
            done(null, body);
          })
        })
        
        
        
        console.log(starred.result)
        // repos.data.forEach(function(r){
        //   Repos.upsert(
        //     {
        //       'id': r.id
        //     },
        //     {
        //       $set: r
        //     }
        //   );
        // })
        
        // return repos;
      }
  });
}
