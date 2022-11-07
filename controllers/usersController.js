const { Thoughts, Users } = require('../models');

const usersController = {

    // get all users
    getUsers(req, res) {
        Users.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },

    // get a single user by ID
    getSingleUser(req, res) {
        Users.findOne({ _id: req.params.usersId })
            .populate(
                {
                    path: 'thoughts',
                    select: '-__v',
                }
            )
            .populate(
                {
                    path: 'friends',
                    select: '-__v',
                }
            )
            .select('-__v')
            .then((users) => 
                !users
                    ? res.status(404).json({ message: 'No user with that ID'})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    // create a new user
    createUser(req, res) {
        Users.create(req.body)
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },

    // update a single user by ID
    updateUsers(req, res) {
        Users.findOneAndUpdate(
            { _id: req.params.usersId },
            body,
            {
                new: true,
                runValidators: true,
            }
        )
        .then((users) =>
            !users
                ? res.status(404).json({ message: 'No user with this ID!' })
                : res.json(users)
        )
        .catch((err) => res.status(500).json(err));
    },

    // delete a single user by ID
    deleteUsers(req, res) {
        Users.findOneAndDelete(
            { _id: req.params.usersID }
        )
        .then((users) =>
            !users
                ? res.status(404).json({ message: 'No user with this ID!' })
                // delete the user's thoughts
                : Thoughts.deleteMany(
                    { _id: { $in: users.thoughts } }
                )
        )
        .then(() => res.json({ message: 'User and thoughts deleted!' }))
        .catch((err) => res.status(500).json(err));
    },

    // add a new friend
    addFriend(req, res) {
        Users.findOneAndUpdate(
        { _id: req.params.usersId },
        { $addToSet: { friends: req.params.friendID } },
        { runValidators: true, new: true }
        )
        .then((users) =>
            !users
                ? res.status(404).json({ message: 'No user with this ID!' })
                : res.json(users)
        )
        .catch((err) => res.status(500).json(err));
    },

    // remove a friend
    removeFriend(req, res) {
        Users.findOneAndUpdate(
            { _id: req.params.usersId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((users) =>
            !users
                ? res.status(404).json({ message: 'No user with this ID!' })
                : res.json(users)
        )
        .catch((err) => res.status(500).json(err));
    },
};

module.exports = usersController;