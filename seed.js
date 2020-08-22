const userData = require("./data/users")
const itemData = require("./data/items")
const commentData = require("./data/comments")
const connection = require("./data/config/mongoConnection")
const bcrypt = require('bcryptjs');

// async function hash() {
//     let luotianyiPass = await bcrypt.hash("66ccff", 5)
//     let yuezhenglingPass = await bcrypt.hash("ee0000", 5)
//     console.log(luotianyiPass)
//     console.log(yuezhenglingPass)
//     console.log(await bcrypt.compare("66ccff", "$2a$05$54mIY9mYgKksc.hq0N/gOuVrtyQlCYLY7W/QHhLH6gg80X/LPgZeq"))
//     console.log(await bcrypt.compare("ee0000", "$2a$05$AosPY7QIUIwL4OslVfuQy.RpLWz/yX6YqKb1l8ZKSiPDwdG6pgAy6"))
//     process.exit()
// }

// hash()

async function run() {
    let luotianyi = {
        firstName: "Luo",
        lastName: "Tianyi",
        username: "ILYZL",
        email: "test2@gmail.com",
        city: "internet",
        state: "internet",
        hashedPassword: "$2a$05$AosPY7QIUIwL4OslVfuQy.RpLWz/yX6YqKb1l8ZKSiPDwdG6pgAy6",
        listedItems: [],
        purchasedItems: []
    }
    luotianyi = await userData.createUser(luotianyi)
    // console.log(luotianyi)

    let yuezhengling = {
        firstName: "Yuezheng",
        lastName: "Ling",
        username: "ILLTY",
        email: "test@gmail.com",
        city: "internet",
        state: "internet",
        hashedPassword: "$2a$05$AosPY7QIUIwL4OslVfuQy.RpLWz/yX6YqKb1l8ZKSiPDwdG6pgAy6",
        listedItems: [],
        purchasedItems: []
    }
    yuezhengling = await userData.createUser(yuezhengling)
    // console.log(yuezhengling)

    let comment1 = {
        "commenterId": yuezhengling._id,
        "comment": "Oops wrong universe.",
        "dateCommented": "2019-07-10"
    }
    comment1 = await commentData.createComment(comment1)

    let comment2 = {
        "commenterId": luotianyi._id,
        "comment": "Is this food?",
        "dateCommented": "2019-07-10"
    }
    // commet2 = await commentData.createComment(comment2)
    comment2 = await commentData.createComment(comment2)

    let comment3 = {
        "commenterId": yuezhengling._id,
        "comment": "Is this really Baby Yoda?",
        "dateCommented": "2020-08-12"
    }
    comment3 = await commentData.createComment(comment3)

    let gauntlet = {
        'itemDescription': 'Whoever buys this will have way too much power',
        'itemName': 'The Infinity Gauntlet',
        'itemImage': 'gauntlet.jpg',
        'askingPrice': 3,
        'sellerId': luotianyi._id,
        'startDate': '2020-07-10',
        'endDate': '2020-07-17',
        'currentBid': 75,
        'currentBidderId': yuezhengling._id,
        'tags': ['power', 'space', 'reality', 'soul', 'time', 'mind'],
        'commentIds': [comment1._id, comment2._id],
        'sold': true
    }
    gauntlet = await itemData.createItem(gauntlet)

    let the_child = {
        'itemDescription': 'Baby Yoda is here!',
        'itemName': 'Baby Yoda',
        'itemImage': 'The Child.jpg',
        'askingPrice': 5000000,
        'sellerId': yuezhengling._id,
        'startDate': '2020-08-13',
        'endDate': '2020-08-25',
        'currentBid': 6000000,
        'currentBidderId': luotianyi._id,
        'tags': ['star wars', 'mandalorian'],
        'commentIds': [comment3._id],
        'sold': false
    }
    the_child = await itemData.createItem(the_child)

    luotianyi = await userData.patchUser(luotianyi._id, { listedItems: [gauntlet._id] })

    yuezhengling = await userData.patchUser(yuezhengling._id, { listedItems: [the_child._id] })

    const db = await connection();
    await db.serverConfig.close();
}
try {
    run()
} catch (e) {
    console.log(e)
}