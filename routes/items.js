const express = require('express');
const router = express.Router();
const items = require('../fakeDb');
const ExpressError = require('../expressError');

// GET /items - Get all items
router.get('/', (req, res, next) => {
    try {
        return res.json(items);
      } catch (err) {
        return next(err);
      }
});

// POST /items - Add an item
router.post('/', (req, res, next) => {
    try {
        const newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        return res.status(201).json({ added: newItem });
      } catch (err) {
        return next(err);
      }
});

// GET /items/:name - Get a single item by name
router.get('/:name', (req, res, next) => {
    try {
        const foundItem = items.find(item => item.name === req.params.name);
        if (!foundItem) {
          throw new ExpressError("Item not found", 404);
        }
        return res.json(foundItem);
      } catch (err) {
        return next(err);
      }
});

// PATCH /items/:name - Update a single item
router.patch('/:name', (req, res, next) => {
    try {
        const foundItem = items.find(item => item.name === req.params.name);
        if (!foundItem) {
          throw new ExpressError("Item not found", 404);
        }
        foundItem.name = req.body.name || foundItem.name;
        foundItem.price = req.body.price || foundItem.price;
        return res.json({ updated: foundItem });
      } catch (err) {
        return next(err);
      }
});

// DELETE /items/:name - Delete a single item
router.delete('/:name', (req, res, next) => {
    try {
        const itemIndex = items.findIndex(item => item.name === req.params.name);
        if (itemIndex === -1) {
          throw new ExpressError("Item not found", 404);
        }
        items.splice(itemIndex, 1);
        return res.json({ message: "Deleted" });
      } catch (err) {
        return next(err);
      }
});

module.exports = router;