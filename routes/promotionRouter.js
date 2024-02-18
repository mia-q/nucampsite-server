const express = require('express');
const Promotion = require('../models/promotion');
const promotionRouter = express.Router();
const authenticate = require('../autheticate')

promotionRouter.route('/')
.get((req, res, next) => {
    Promotion.find()
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.create(req.body)
    .then(promotion => {
        console.log('partner created', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT opertain not supported on /promotions')
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

promotionRouter.route(':promotionsId')
.get((req, res, next) => {
    Promotion.findById(req.params.promotionsId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res)=> {
    res.statusCode = 403;
    res.end(`POST operation is not supported on /promoitons/${req.params.promotionsId}`);
})
.put(authenticate,verifyUser, authenticate.verifyAdmin, (req, res, next)=> {
    Promotion.findByIdAndUpdate((req.params.promotionsId), {
        $set: req.body
    }, { new: true })
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err))
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Promotion.findByIdAndDelete(req.params.promotionsId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = promotionRouter;