/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var http = require('http');
var config = require('../../config/environment/production');
var Promise = require('bluebird');
var request = require('request');
var neo4j = require('neo4j');
var neo4jUrl = 'http://neo4yokel.cloudapp.net';
var db = new neo4j.GraphDatabase(neo4jUrl);

var createUniqueBusiness = function(data){
  return new Promise(function(resolve, reject){
    var query = [
      'MERGE (place:Place {place_id: {place_id}})',
      'SET place.name = {name}, place.score= 80',
      'RETURN place'
    ].join('\n');
    var params = {
      place_id: data.place_id,
      name: data.name
    };
    console.log(config);
    db.query(query, params, function(err, results){
      if(err){
        reject(err);
      } else {
        resolve(function(){
          //then send that data back
          res.json([
            {
              name: data.name,
              score: results.score,
              address: data.formatted_address,
              lattitude: data.geometry.location.lat,
              longitude: data.geometry.location.lng
            }
          ]);
        });
      }
    });
  });
};

var find = function(data){
  return new Promise(function(resolve, reject){
    var query = [
      'MATCH (place:Place {place_id: {place_id}})',
      'RETURN place'
    ].join('\n');
    var params = {
      place_id: data.place_id
    };
    db.query(query, params, function(err, results){
      if(err){
        reject(err);
      } else if(results && results[0] && results[0].business._data.data.place_id){
        resolve(function(){
          res.json([
            {
              name: data.name,
              score: results[0].business._data.data.score,
              address: data.formatted_address,
              lattitude: data.geometry.location.lat,
              longitude: data.geometry.location.lng
            }
          ]);
        });
      } else {
        createUniqueBusiness(data);
      }
    });
  });
};

//google places api call here!!
var apiRequest = function(req, res){
  request('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.param("businesseId") + '&key='+ config.googleAPIKey, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var places = JSON.parse(body).result
      find(places);
    }
  })
};

// Get list of things
exports.index = function(req, res){
  if(config.googleAPIKey){
    //we expect in a google places_id in req data
    if(req.param("businesseId")){
      apiRequest(req, res);
    } else {
      res.send(400);
    }
  } else {
    res.send(500);
    throw("No googleAPIKey found on your system, "+
          "please set an enviroment variable using, "+
          "export GOOGLE_API_KEY=yourAPIKeyHere "+
          "in the terminal that you are running the server in "+
          "or set in in your bash_profial for persistance.");
  }
};