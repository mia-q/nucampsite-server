const express = require("express");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorite = require("../models/favorite");
const favorite = require("../models/favorite");
const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (Favorite.findOne({ user: req.user._id })) {
      req.body.campsites.forEach((campsite) => {
        if (Favorite.campsites.indexOf(campsite) === -1) {
          Favorite.campsites.push(campsite);
        } else {
          res.send("You have already added this campsite");
        }
      });
    } else {
      Favorite.create(req.body)
        .then((favorite) => {
          console.log("Favorite created", favorite);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        })
        .catch((err) => next(err));
    }
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (Favorite.findOne({ user: req.user._id })) {
      Favorite.findOneAndDelete({ user: req.user._id })
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    } else {
      res.setHeader("Content-Type", "text/plain");
      res.end("No favorites to delete");
    }
  });

favoriteRouter
  .route(":/campsiteId")
  .options(cors.corsWithOptions, (req, res, next) => res.sendStatus(200))
  .get(cors.cors, authentice.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /favorites/:campsiteId");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (Favorite.findOne({ user: req.user._id })) {
      if (Favorite.campsites.indexOf(req.params.campsiteId) === -1) {
        Favorite.campsites.push(req.params.campsiteId);
      } else if (Favorite.campsites.includes(req.params.campsiteId) && Favorite.campsites.indexOf(req.params.campsiteId) !== -1) {
        res.send("You have already added this campsite to favorites!");
      } else {
        Favorite.create(req.body)
        .then((favorite) => {
          console.log("Favorite created", favorite);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        })
        .catch((err) => next(err));
      }
    }
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites/:campsiteId");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (Favorite.findOne({ user: req.user._id })) {
        Favorite.campsites.splice(Favorite.campsites.indexOf(req.params.campsiteId), 1)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    } else {
      res.setHeader("Content-Type", "text/plain");
      res.end("No favorites to delete");
    }
  });

module.exports = favoriteRouter;
