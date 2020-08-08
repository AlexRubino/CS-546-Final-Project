const mongoCollections = require("./mongoCollections")
const ObjectId = require("mongodb").ObjectID
const items = mongoCollections.items

function verifyItem(item, strict) {
    var itemData = {}
    var empty = true

    //Mandatory
    if (!item.itemName) {
        if (strict) {
            throw "You must provide a non-empty itemName!"
        }
    } else {
        itemData.itemName = item.itemName
        empty = false
    }

    if (!item.itemDescription) {
        if (strict) {
            throw "You must provide an non-empty itemDescription!"
        }
    } else {
        itemData.itemDescription = item.itemDescription
        empty = false
    }

    if (!item.itemImage) {
        if (strict) {
            throw "You must provide an itemImage!"
        }
    } else {
        itemData.itemImage = item.itemImage
        empty = false
    }

    if (!item.askingPrice || typeof item.askingPrice !== "number" || item.askingPrice < 0) {
        if (strict) {
            throw "You must provide a positive number as the askingPrice!"
        }
    } else {
        itemData.askingPrice = item.askingPrice
        empty = false
    }

    if (!item.sellerId) {
        if (strict) {
            throw "You must provide a non-empty sellerId!"
        }
    } else {
        if (typeof item.sellerId === "string") {
            itemData.sellerId = ObjectId(item.sellerId)
        } else {
            itemData.sellerId = item.sellerId
        }
        empty = false
    }

    if (!item.startDate || !item.startDate instanceof Date) {
        if (strict) {
            throw "You must provide a non-empty date as the startDate!"
        }
    } else {
        itemData.startDate = item.startDate
        empty = false
    }

    if (!item.endDate || !item.endDate instanceof Date) {
        if (strict) {
            throw "You must provide a non-empty date as the startDate!"
        }
    } else {
        itemData.endDate = item.endDate
        empty = false
    }

    //Non-mandatory
    if (item.currentBid) {
        itemData.currentBid = item.currentBid
        empty = false
    }

    if (item.currentBidderId) {
        if (typeof item.currentBidderId === "string") {
            itemData.currentBidderId = ObjectId(item.currentBidderId)
        } else {
            itemData.currentBidderId = item.currentBidderId
        }
        empty = false
    }

    if (item.tags) {
        if (Array.isArray(item.tags)) {
            itemData.tags = item.tags
            empty = false
        } else if (strict) {
            throw "tags must be an Array!"
        }
    }

    if (item.commentIds) {
        if (Array.isArray(item.commentIds)) {
            itemData.commentIds = item.commentIds
            empty = false
        } else if (strict) {
            throw "commentIds must be an Array!"
        }
    }

    if (!strict && !empty) {
        return itemData
    } else if (!strict && empty) {
        throw "You must provide at least one non-empty item field to update!"
    }
}

const getItem = async function get(id) {
    if (!id) {
        throw "You must provide an id!"
    }

    if (typeof id === "string") {
        id = ObjectId(id)
    }

    const itemCollection = await items()
    const item = await itemCollection.findOne({ _id: id })

    if (item !== null) {
        return item
    } else {
        throw "Unable to locate item with id: " + id
    }
}

const getAllItems = async function getAll() {
    const itemCollection = await items()
    const all = await itemCollection.find({}).toArray()

    return all
}

//itemName, itemDescription, askingPrice, sellerId, startDate, endDate, tags
const createItem = async function create(newitem) {
    verifyItem(newitem, true)

    const itemCollection = await items()
    const insertInfo = await itemCollection.insertOne(newitem)
    if (insertInfo.insertCount === 0) {
        throw "item insertion failed."
    }

    const item = await get(insertInfo.insertedId)
    return item
}

const removeItem = async function remove(id) {
    if (!id) {
        throw "You must provide an id!"
    }

    if (typeof id === "string") {
        id = ObjectId(id)
    }

    const itemCollection = await items()
    const deleteInfo = await itemCollection.removeOne({ _id: id })
    if (deleteInfo.deletedCount === 0) {
        throw "Failed to delete item with id: " + id
    }
    return true
}

// const update = async function update(id, updateditem) {
//     if (!id) {
//         throw "You must provide non-empty id and name!"
//     }

//     const title = updateditem.title
//     const ingredients = updateditem.ingredients
//     const steps = updateditem.steps

//     if (!title) {
//         throw "You must provide non-empty item title!"
//     }

//     if (!Array.isArray(ingredients) || !Array.isArray(steps) || ingredients.length == 0 || steps.length == 0) {
//         throw "You must provide a non-empty array of ingredients and steps!"
//     }

//     for (let i = 0; i < ingredients.length; i++) {
//         if (ingredients[i].name && ingredients[i].amount) {
//             continue
//         } else {
//             throw "Ingredient must contain a name and an amount."
//         }
//     }

//     for (let i = 0; i < steps.length; i++) {
//         if (steps[i] && typeof steps[i] === "string") {
//             continue
//         } else {
//             throw "Steps must be a list of non-empty string."
//         }
//     }

//     const itemCollection = await items()
//     const updateInfo = await itemCollection.updateOne({ _id: id }, { $set: updateditem })
//     if (updateInfo.updatedCount === 0) {
//         throw "Could not update item with id: " + id
//     }

//     return await get(id)
// }

const patchItem = async function patch(id, updateditem) {
    if (!id) {
        throw "You must provide non-empty id and name!"
    }

    if (typeof id === "string") {
        id = ObjectId(id)
    }

    let updateditemData = verifyItem(updateditem, false)

    const itemCollection = await items()
    const updateInfo = await itemCollection.updateOne({ _id: id }, { $set: updateditemData })
    if (updateInfo.updatedCount === 0) {
        throw "Could not update item with id: " + id
    }

    return await getItem(id)
}

module.exports = {
    getItem,
    getAllItems,
    createItem,
    removeItem,
    //update,
    patchItem
}