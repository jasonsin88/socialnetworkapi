const { Thoughts, Users } = require('../models');

const thoughtsController = {

    // get all thoughts
    getThoughts(req, res) {
        Thoughts.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    // get a single thought by id
    getSingleThought(req, res) {
        Thoughts.findOne({ _id: req.params.thoughtsId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID!' })
                    : res.json(thought)
            )
    },

    // create a new thought
    createThought(req, res) {
        Thoughts.create(req.body)
            .then((thought) => {
                return Users.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then((thought) =>
                !thought
                    ? res.status(404).json({
                        message: 'Thought created, but found no user with that ID!',
                    })
                    : res.json('Created the new thought! 🤩')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // update a thought by ID
    updateThoughts(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId },
            { $set: req.body },
            {
                runValidators: true,
                new: true,
            }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this ID!'})
                    : res.json(thought)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // delete a thought by ID
    deleteThought(req, res) {
        Thoughts.findOneAndRemove({ _id: req.params.thoughtsId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this ID!'})
                    : Users.findOneAndUpdate(
                        { thoughts: req.params.thoughtsId },
                        { $pull: { thoughts: req.params.thoughtsId } },
                        { new: true }
                    )
            )
            .then((user) =>
                !user
                    ? res.status(404).json({
                        message: 'Thought deleted but no user with this ID!',
                    })
                    : res.json({ message: 'Thought successfully deleted! 🤐'})
            )
            .catch((err) => res.status(500).json(err));
    },

    // create a reaction to a thought
    addReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId },
            { $addToSet: { reactions: req.body } },
            {
                runValidators: true,
                new: true
            }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this ID!'})
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // remove a reaction from a thought
    removeReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            {
                runValidators: true,
                new: true
            }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this ID!'})
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};

module.exports = thoughtsController;