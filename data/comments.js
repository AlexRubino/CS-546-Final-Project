const mongoCollections = require("./config/mongoCollections")
const comments = mongoCollections.comments
const ObjectId = require("mongodb").ObjectID

function verifyComment(comment) {
    if (!comment.commenterId) {
        throw "You must provide non-empty commenterId!"
    }

    if (!comment.comment) {
        throw "You must provide a non-empty comment!"
    }

    if (!comment.dateCommented instanceof Date || !comment.dateCommented) {
        throw "dateCommented must a non-empty date!"
    }
}

const getComment = async function getComment(id) {
    if (!id) {
        throw "You must provide an id!"
    }

    if (typeof id === "string") {
        id = ObjectId(id)
    }

    const commentCollection = await comments()
    const comment = await commentCollection.findOne({ _id: id })

    if (comment !== null) {
        return comment
    } else {
        throw "Unable to locate comment with id: " + id
    }
}

const getAllComments = async function getAll() {
    const commentCollection = await comments()
    const all = await commentCollection.find({}).toArray()

    return all
}

const createComment = async function create(newcomment) {
    console.log(newcomment)
    verifyComment(newcomment)

    if (typeof newcomment.commenterId === "string") {
        newcomment.commenterId = ObjectId(newcomment.commenterId)
    }

    const commentCollection = await comments()
    const insertInfo = await commentCollection.insertOne(newcomment)
    if (insertInfo.insertCount === 0) {
        throw "comment insertion failed."
    }

    const createdComment = await getComment(insertInfo.insertedId)
    return createdComment
}

const removeComment = async function remove(id) {
    if (!id) {
        throw "You must provide an id!"
    }

    if (typeof id === "string") {
        id = ObjectId(id)
    }

    const commentCollection = await comments()
    const deleteInfo = await commentCollection.removeOne({ _id: id })
    if (deleteInfo.deletedCount === 0) {
        throw "Failed to delete comment with id: " + id
    }
    return true
}

// const updateComment = async function update(id, updatedcomment) {
//     if (!id) {
//         throw "You must provide non-empty id and name!"
//     }

//     const commenterId = updatedcomment.commenterId
//     const comment = updatedcomment.comment
//     const dateCommented = updatedcomment.dateCommented

//     verifyComment(commenterId, comment, dateCommented)

//     const commentCollection = await comments()
//     const updateInfo = await commentCollection.updateOne({ _id: id }, { $set: updatedcomment })
//     if (updateInfo.updatedCount === 0) {
//         throw "Could not update comment with id: " + id
//     }

//     return await get(id)
// }

const patchComment = async function patch(id, updatedcomment) {
    if (!id) {
        throw "You must provide non-empty id and name!"
    }

    if (typeof id === "string") {
        id = ObjectId(id)
    }

    const commenterId = updatedcomment.commenterId
    const comment = updatedcomment.comment
    const dateCommented = updatedcomment.dateCommented

    let updatedcommentData = {}
    let emptyBody = true

    if (commenterId) {
        if (typeof commenterId === "string") {
            commenterId = ObjectId(commenterId)
        }
        updatedcommentData.commenterId = commenterId
        emptyBody = false
    }

    if (comment) {
        updatedcommentData.comment = comment
        emptyBody = false
    }

    if (dateCommented) {
        updatedcommentData.dateCommented = dateCommented
        emptyBody = false
    }

    if (emptyBody) {
        throw "You must provide at least one field to update!"
    }

    const commentCollection = await comments()
    const updateInfo = await commentCollection.updateOne({ _id: id }, { $set: updatedcommentData })
    if (updateInfo.updatedCount === 0) {
        throw "Could not update comment with id: " + id
    }

    return await getComment(id)
}

module.exports = {
    getComment,
    getAllComments,
    createComment,
    removeComment,
    //updateComment,
    patchComment
}

