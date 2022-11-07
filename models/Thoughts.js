const { Schema, Types } = require('mongoose');
const moment = require('moment');

// reaction schema
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            deafult: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // using moment to format date
            get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a'),
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

// thought schema
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // using moment to format date
            get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a'),
        },
        username: {
            type: String,
            required: true,
        },
        // nested documents from reactionSchema
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

// get total reactions count
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return  this.reactions.length;
    });

const Thoughts = model('thoughts', thoughtSchema);

module.exports = Thoughts;