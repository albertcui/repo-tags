
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
  var GitHubApi = Meteor.npmRequire('github');
      
  var gh = new GitHubApi({version: "3.0.0"});
  
  Meteor.methods({
      getUserStars: function (user) {
        check(user, String);
        
        var starred = Async.runSync(function(done){
          gh.repos.getStarredFromUser(
            {
              user: user,
              per_page: 100
            }, function(err, res) {
              if (err) data(err, null)
              getMore(res, res);
              
              function getMore(data, response) {
                var link = response.meta.link;
                if (gh.hasNextPage(link)) {
                  gh.getNextPage(link, function(err, res){
                    if (err) done(err, data);
                    getMore(data.concat(res), res);
                  })
                } else {
                  done(err, data)      
                }
              }
          })
        })
        
        console.log(starred.result.length)
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
