const kafka = require('./kafka/client')

const resolvers = {
    Query: {

        login: async (parent, args, context, info) => {
            return new Promise(async (resolve, reject) => {
                await kafka.make_request("user_topic", { "path": "login", body: args }, function (err, results) {
                    resolve(results)
                })
            })
        },
        Create_group: async (parent, args, context, info) => {
            return new Promise(async (resolve, reject) => {
                await kafka.make_request("user_topic", { "path": "create_group", body: args }, function (err, results) {
                    resolve(results)
                })
            })
        },
        group_page_invite: async (parent, args, context, info) => {
            return new Promise(async (resolve, reject) => {
               // console.log("-------------------------------------------inside")
                await kafka.make_request("user_topic", { "path": "group_page_invite", body: args }, function (err, results) {
                   console.log("---------------------",results.invite_from_groups)
                    resolve(results)
                })
            })
        },

        group_invite_accept_req: async (parent, args, context, info) => {
        
            return new Promise(async (resolve, reject) => {
                await kafka.make_request("user_topic", { "path": "group_invite_accept_req", body: args }, function (err, result) {
                    resolve(result)
                })
            })
        },
       
    },

    Mutation: {
        signup: async (parent, args, context, info) => {
        
            return new Promise(async (resolve, reject) => {
                await kafka.make_request("user_topic", { "path": "signup", body: args }, function (err, result) {
                   
                    resolve(result)
                })
            })
        },

   

    }
   
}

module.exports = resolvers