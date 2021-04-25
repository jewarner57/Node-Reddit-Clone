import app from '../src/server'
import chai from "chai"
import chaiHttp from "chai-http"
import 'chai/register-expect'
import User from "../src/models/user"

// Import the Post model from our models folder so we
// we can use it in our tests.
import Post from '../src/models/post'
import server from '../src/server'

chai.should();
chai.use(chaiHttp);

describe('Posts', function () {
  const agent = chai.request.agent(server);

  const newUser = {
    username: 'temp-user',
    password: 'test'
  };
  agent.post('/sign-up')
    .set("content-type", "application/x-www-form-urlencoded")
    .send(newUser).then()

  // Post that we'll use for testing purposes
  const newPost = {
    title: 'post title',
    url: 'https://www.google.com',
    summary: 'post summary',
    subreddit: 'test',
    author: User.findOne({ 'useername': 'temp-user' })._id
  };



  it('Should create with valid attributes at POST /posts/new', function (done) {
    // Checks how many posts there are now
    Post.estimatedDocumentCount()
      .then(function (initialDocCount) {
        agent
          .post("/posts/new")
          // This line fakes a form post,
          // since we're not actually filling out a form
          .set("content-type", "application/x-www-form-urlencoded")
          // Make a request to create another
          .send(newPost)
          .then(function (res) {
            Post.estimatedDocumentCount()
              .then(function (newDocCount) {
                // Check that the database has one more post in it
                expect(res).to.have.status(200);
                // Check that the database has one more post in it
                expect(newDocCount).to.be.equal(initialDocCount + 1)
                done();
              })
              .catch(function (err) {
                done(err);
              });
          })
          .catch(function (err) {
            done(err);
          });
      })
      .catch(function (err) {
        done(err);
      });
  });

  after(function () {
    Post.findOneAndDelete(newPost, function (err, docs) {
      if (err) {
        console.log(err)
      }
    });

    User.findOneAndDelete(newUser, function (err, docs) {
      if (err) {
        console.log(err)
      }
    });

    agent.close()
  });
});
