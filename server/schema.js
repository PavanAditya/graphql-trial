const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// friend Type
const FriendType = new GraphQLObjectType({ 
    name:'Friend', 
    fields:() => ({
        id: {type:GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
        goodAt: {type: GraphQLString}
    })
});

// Root Query
const RootQuery= new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        friend:{
            type:FriendType, 
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/friends/'+ args.id)
                    .then(res => res.data);

            }
        },
        friends:{
            type: new GraphQLList(FriendType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/friends')
                    .then(res => res.data);
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addFriend:{
            type:FriendType,
            args:{
                goodAt: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                id : {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/friends', {
                    name:args.name,
                    email: args.email,
                    age:args.age,
                    id : args.id,
                    goodAt: args.goodAt
                })
                .then(res => res.data);
            }   
        },
        deleteFriend:{
            type:FriendType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/friends/'+args.id)
                .then(res => res.data);
            }
        },
        editFriend:{
            type:FriendType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt},
                goodAt: {type: GraphQLString}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/friends/'+args.id, args)
                .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});