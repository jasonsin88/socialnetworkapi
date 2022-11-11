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
        Users.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'No user with that ID'})
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // create a new user
    createUser(req, res) {
        Users.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    // update a single user by ID
    updateUser(req, res) {
        Users.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            {
                new: true,
                runValidators: true,
            }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with this ID!' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    // delete a single user by ID
    deleteUser(req, res) {
        Users.findOneAndDelete(
            { _id: req.params.userId }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with this ID!' })
                // delete the user's thoughts
                : Thoughts.deleteMany(
                    { _id: { $in: user.thoughts } }
                )
        )
        .then(() => res.json({ message: 'User and thoughts deleted!' }))
        .catch((err) => res.status(500).json(err));
    },

    // add a new friend
    addFriend(req, res) {
        Users.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with this ID!' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    // remove a friend
    removeFriend(req, res) {
        Users.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with this ID!' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
};

module.exports = usersController;