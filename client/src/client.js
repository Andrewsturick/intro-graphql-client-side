import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'



const typeDefs = gql`
    extend type User {
        age: Int
    }
    extend type Pet {
        lastVaccineType: String
        lastVaccineDays: String
    }`;

const resolvers = {
    User:{
        age(user) {
            return 21;
        }
    },
    Pet: {
        lastVaccineType(pet) {
            return Math.random > 0.5 ? 'rabies' : 'flu'
        },
        lastVaccineDays() {
            return Math.random() * 4;
        }
    }
}

const link = new HttpLink({uri: "http://localhost:4000/graphql"});
const cache = new InMemoryCache();
const client = new ApolloClient({link, cache, typeDefs, resolvers});

export default client;
