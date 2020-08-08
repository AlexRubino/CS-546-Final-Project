const mongoCollections = require("./config/mongoCollections")
const users = mongoCollections.users
const ObjectId = require("mongodb").ObjectID

function verifyUser(user, strict) {
    var userData = {}
    var empty = true

    //Mandatory
    if (!user.firstName) {
        if (strict) {
            throw "You must provide a non-empty firstName!"
        }
    } else {
        userData.firstName = user.firstName
        empty = false
    }

    if (!user.lastName) {
        if (strict) {
            throw "You must provide a non-empty lastName!"
        }
    } else {
        userData.lastName = user.lastName
        empty = false
    }
    if (!user.username) {
        if (strict) {
            throw "You must provide a non-empty firstName!"
        }
    } else {
        userData.username = user.username;
        empty = false
    }

    if (!user.city) {
        if (strict) {
            throw "You must provide a non-empty city!"
        }
    } else {
        userData.city = user.city
        empty = false
    }

    if (!user.state) {
        if (strict) {
            throw "You must provide a non-empty state!"
        }
    } else {
        userData.state = user.state
        empty = false
    }

    if (!user.hashedPassword) {
        if (strict) {
            throw "You must provide a non-empty hashedPassword!"
        }
    } else {
        userData.hashedPassword = user.hashedPassword
        empty = false
    }
    if (!user.listedItems) {
        if (strict) {
            throw "You must provide a non-empty firstName!"
        }
    } else {
        userData.listedItems = user.listedItems;
        empty = false
    }
    if (!user.purchasedItems) {
        if (strict) {
            throw "You must provide a non-empty firstName!"
        }
    } else {
        userData.purchasedItems = user.purchasedItems;
        empty = false
    }
    //Non-mandatory
    if (user.userItems && Array.isArray(user.userItems)) {
        userData.userItems = user.userItems
        empty = false
    }

    if (user.userPurchases && Array.isArray(user.userPurchases)) {
        userData.userPurchases = user.userPurchases
        empty = false
    }

    if (!strict && !empty) {
        return userData
    } else if (!strict && empty) {
        throw "You must provide at least one non-empty user field to update!"
    }
}

const getUser = async function get(id) {
    if (!id) {
        throw "You must provide an id!"
    }

    if (typeof id === "string") {
        id = ObjectId(id)
    }

    const userCollection = await users()
    const user = await userCollection.findOne({ _id: id })

    if (user !== null) {
        return user
    } else {
        throw "Unable to locate user with id: " + id
    }
}

const getAllUsers = async function getAll() {
    const userCollection = await users()
    const all = await userCollection.find({}).toArray()

    return all
}

const createUser = async function create(newuser) {
    verifyUser(newuser, true)

    const userCollection = await users()
    const insertInfo = await userCollection.insertOne(newuser)
    if (insertInfo.insertCount === 0) {
        throw "user insertion failed."
    }

    const user = await getUser(insertInfo.insertedId)
    return user
}

const removeUser = async function remove(id) {
    if (!id) {
        throw "You must provide an id!"
    }

    if (typeof id === "string") {
        id = ObjectId(id)
    }

    const userCollection = await users()
    const deleteInfo = await userCollection.removeOne({ _id: id })
    if (deleteInfo.deletedCount === 0) {
        throw "Failed to delete user with id: " + id
    }
    return true
}

// const update = async function update(id, updateduser) {
//     if (!id) {
//         throw "You must provide non-empty id and name!"
//     }

//     const title = updateduser.title
//     const ingredients = updateduser.ingredients
//     const steps = updateduser.steps

//     if (!title) {
//         throw "You must provide non-empty user title!"
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

//     const userCollection = await users()
//     const updateInfo = await userCollection.updateOne({ _id: id }, { $set: updateduser })
//     if (updateInfo.updatedCount === 0) {
//         throw "Could not update user with id: " + id
//     }

//     return await get(id)
// }

const patchUser = async function patch(id, updateduser) {
    if (!id) {
        throw "You must provide non-empty id and name!"
    }
    console.log(id);
    console.log(updateduser);

    if (typeof id === "string") {
        id = ObjectId(id)
    }

    updateduserData = verifyUser(updateduser, false)
    console.log(updateduserData);

    const userCollection = await users()
    const updateInfo = await userCollection.updateOne({ _id: id }, { $set: updateduserData })
    if (updateInfo.updatedCount === 0) {
        throw "Could not update user with id: " + id
    }

    return await getUser(id)
}
const checkUserName = async function checkUserName(username){
    //This function is for searching if a username or email already exists in the collection. 
        const lcUsername = username.toLowerCase();
        const usersCollection = await users();
       const checkUser= await usersCollection.findOne({username: lcUsername});
       if(checkUser === null){
         return true;
       }
       else{
         return false;
       }
    }
    
    
   const checkEmail = async function checkEmail(email){
      //This function is for searching if a username or email already exists in the collection. 
          const lcEmail = email.toLowerCase();
          const usersCollection = await users();
         const checkUser = await usersCollection.findOne({email: lcEmail});
    
         if(checkUser == null){
           return true;
         }
         else{
           return false;
         }
      }


module.exports = {
    getUser,
    getAllUsers,
    createUser,
    removeUser,
    //updateduser,
    patchUser, 
    checkUserName, 
    checkEmail
}

