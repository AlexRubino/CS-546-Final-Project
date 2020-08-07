const mongoCollections = require("./mongoCollections")
const items = mongoCollections.items

const get = async function get(id) {
    if (!id) {
        throw "You must provide an id!"
    }

    const recipeCollection = await recipes()
    const recipe = await recipeCollection.findOne({ _id: id })

    if (recipe !== null) {
        return recipe
    } else {
        throw "Unable to locate recipe with id: " + id
    }
}

const getAll = async function getAll() {
    const recipeCollection = await recipes()
    const all = await recipeCollection.find({}).toArray()

    return all
}

const create = async function create(title, ingredients, steps) {
    if (!title) {
        throw "You must provide non-empty recipe title!"
    }

    if (!Array.isArray(ingredients) || !Array.isArray(steps) || ingredients.length == 0 || steps.length == 0) {
        throw "You must provide a non-empty array of ingredients and steps!"
    }

    for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].name && ingredients[i].amount) {
            continue
        } else {
            throw "Ingredient must contain a name and an amount."
        }
    }

    for (let i = 0; i < steps.length; i++) {
        if (steps[i] && typeof steps[i] === "string") {
            continue
        } else {
            throw "Steps must be a list of non-empty string."
        }
    }

    let newrecipe = { title: title, ingredients: ingredients, steps: steps }

    const recipeCollection = await recipes()
    const insertInfo = await recipeCollection.insertOne(newrecipe)
    if (insertInfo.insertCount === 0) {
        throw "recipe insertion failed."
    }

    const recipe = await get(insertInfo.insertedId)
    return recipe
}

const remove = async function remove(id) {
    if (!id) {
        throw "You must provide an id!"
    }

    const recipeCollection = await recipes()
    const deleteInfo = await recipeCollection.removeOne({ _id: id })
    if (deleteInfo.deletedCount === 0) {
        throw "Failed to delete recipe with id: " + id
    }
}

const update = async function update(id, updatedRecipe) {
    if (!id) {
        throw "You must provide non-empty id and name!"
    }

    const title = updatedRecipe.title
    const ingredients = updatedRecipe.ingredients
    const steps = updatedRecipe.steps

    if (!title) {
        throw "You must provide non-empty recipe title!"
    }

    if (!Array.isArray(ingredients) || !Array.isArray(steps) || ingredients.length == 0 || steps.length == 0) {
        throw "You must provide a non-empty array of ingredients and steps!"
    }

    for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].name && ingredients[i].amount) {
            continue
        } else {
            throw "Ingredient must contain a name and an amount."
        }
    }

    for (let i = 0; i < steps.length; i++) {
        if (steps[i] && typeof steps[i] === "string") {
            continue
        } else {
            throw "Steps must be a list of non-empty string."
        }
    }

    const recipeCollection = await recipes()
    const updateInfo = await recipeCollection.updateOne({ _id: id }, { $set: updatedRecipe })
    if (updateInfo.updatedCount === 0) {
        throw "Could not update recipe with id: " + id
    }

    return await get(id)
}

const patch = async function patch(id, updatedRecipe) {
    if (!id) {
        throw "You must provide non-empty id and name!"
    }

    const title = updatedRecipe.title
    const ingredients = updatedRecipe.ingredients
    const steps = updatedRecipe.steps

    let updatedRecipeData = {}
    let emptyBody = true

    if (title && typeof title === "string") {
        updatedRecipeData.title = title
        emptyBody = false
    }

    if (Array.isArray(ingredients) && ingredients.length != 0) {
        for (let i = 0; i < ingredients.length; i++) {
            if (ingredients[i].name && ingredients[i].amount) {
                continue
            } else {
                throw "Ingredient must contain a name and an amount."
            }
        }

        updatedRecipeData.ingredients = ingredients
        emptyBody = false
    }

    if (Array.isArray(steps) && steps.length != 0) {
        for (let i = 0; i < steps.length; i++) {
            if (steps[i] && typeof steps[i] === "string") {
                continue
            } else {
                throw "Steps must be a list of non-empty string."
            }
        }

        updatedRecipeData.steps = steps
        emptyBody = false
    }

    if (emptyBody) {
        throw "You must provide at least one field to update!"
    }

    const recipeCollection = await recipes()
    const updateInfo = await recipeCollection.updateOne({ _id: id }, { $set: updatedRecipeData })
    if (updateInfo.updatedCount === 0) {
        throw "Could not update recipe with id: " + id
    }

    return await get(id)
}

module.exports = {
    get,
    getAll,
    create,
    remove,
    update,
    patch
}