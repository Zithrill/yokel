/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var businesses = require('./api/businesses/businesses.controller');
var nearby = require('./api/nearby/nearby.controller');
module.exports = function(app, passport){

  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/activity', require('./api/activity'));
  app.use('/api/followers', require('./api/followers'));
  app.use('/api/following', require('./api/following'));
  app.use('/api/signin', require('./api/signin'));
  app.use('/api/signup', require('./api/signup'));
    
  //this will catch all requests to bueinesses and attempt to locate them
  //from google places
  app.get('/api/businesses/:businesseId', function(req, res) {
    businesses.index(req, res);
  });

  //this will catch all requests to nearby and attempt to locate places near them
  //from google places
  app.get('/api/nearby/:lat/:lon', function(req, res) {
    nearby.index(req, res);
  });

    // =====================================
	  //   FACEBOOK ROUTES =====================
	  // =====================================
	  // route for facebook authentication and login
	  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	  // handle the callback after facebook has authenticated the user
	  app.get('/auth/facebook/callback',
		  passport.authenticate('facebook', {
			  successRedirect : '/',
			  failureRedirect : '/'
		  }));

	  // route for logging out
	  app.get('/logout', function(req, res) {
		  req.logout();
		  res.redirect('/home');
	  });


  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
  });
  
  };
  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {

	  // if user is authenticated in the session, carry on
	  if (req.isAuthenticated())
		  return next();

	  // if they aren't redirect them to the home page
	  res.redirect('/');
  }

