const axios = require('axios');
const graphql = require ('graphql');

const {GraphQLObjectType, GraphQLInt, GraphQLString,
     GraphQLBoolean, GraphQLID
     , GraphQLList, GraphQLSchema}= require('graphql');

const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        flight_number: {type: GraphQLInt},
        name: {type: GraphQLString},
        date_local: {type: GraphQLString},
        success: {type: GraphQLBoolean},
        details:{type: GraphQLString},
        links: {type:LinksType},
        id: {type: GraphQLString},
    })
});
const LinksType = new GraphQLObjectType({
    name: 'Links',
    fields: () => ({
        article: {type: GraphQLString},
        webcast: {type: GraphQLString},
    })
});

const RootQuery= new GraphQLObjectType({
   name:'RootQueryType',
   fields:{
    launches:{
        type:new GraphQLList(LaunchType),
        resolve(parent, args){
            //this gets the data from the database
            return axios.get('https://api.spacexdata.com/v5/launches')
            .then(res => res.data);
        }
    },

    // this displays only the data from a single launch identifing it by id
    launch:{
        type: LaunchType,
        args:{
            id: {type: GraphQLString},
        },
        resolve(parent, args){
            return axios.get(`https://api.spacexdata.com/v5/launches/${args.id}`)
            .then(res => res.data)
        }
    }
   },
});

module.exports = new GraphQLSchema({
    query: RootQuery
});

