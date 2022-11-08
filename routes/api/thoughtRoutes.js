const router = require('express').Router();

const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,
} = require('../../controllers/thoughtsController');

//  /api/thoughts
router.route('/').get(getThoughts).post(createThought);

//  /api/thoughts/:id
router
    .route('/:thoughtsId')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought);

// /api/thoughts/:thoughtsId/reactions
router.route('/:thoughtsId/reactions').post(addReaction);

//  /api/thoughts/:thoughtsId/reactions/:reactionId
router.route('/:thoughtsId/reactions/:reactionId').delete(removeReaction);

module.exports = router;