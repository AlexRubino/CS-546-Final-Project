const userData = require("./data/users")
const itemData = require("./data/items")
const commentData = require("./data/comments")
const connection = require("./data/config/mongoConnection")
const bcrypt = require('bcryptjs');

async function run() {
    let luotianyi = {
        firstName: "Luo",
        lastName: "Tianyi",
        username: "ILYZL",
        email: "test2@gmail.com",
        city: "internet",
        state: "internet",
        hashedPassword: "$2a$05$fCUHE6nufuo4mGKG8kuineNkUgl7dTuQMy/pOx6Dw4OfKmlKlE1hq",
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
        "dateCommented": "2020-7-10"
    }
    comment1 = await commentData.createComment(comment1)

    let comment2 = {
        "commenterId": luotianyi._id,
        "comment": "Is this food?",
        "dateCommented": "2020-7-10"
    }
    // commet2 = await commentData.createComment(comment2)
    comment2 = await commentData.createComment(comment2)

    let comment3 = {
        "commenterId": yuezhengling._id,
        "comment": "Is this really Baby Yoda?",
        "dateCommented": "2020-8-12"
    }
    comment3 = await commentData.createComment(comment3)

    let gauntlet = {
        'itemDescription': 'Whoever buys this will have way too much power',
        'itemName': 'The Infinity Gauntlet',
        'itemImage': 'gauntlet.jpg',
        'askingPrice': 3,
        'sellerId': luotianyi._id,
        'startDate': '2020-7-10 12:00',
        'endDate': '2020-7-17 12:00',
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
        'itemImage': 'TheChild.jpg',
        'askingPrice': 5000000,
        'sellerId': yuezhengling._id,
        'startDate': '2020-8-13 12:00',
        'endDate': '2020-8-25 12:00',
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