import { users } from './users'
import { collection } from './collection'
import { Account, Client, Databases, Storage, Query } from 'appwrite'

export const client = {
  instance: () =>
    new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject(import.meta.env.VITE_APP_WRITE_ID),
  account: () => new Account(client.instance()),
  database: () => new Databases(client.instance()),
  collectionId: (type) => {
    const collections = {
      tasks: import.meta.env.VITE_APP_WRITE_TASKS_COLLECTION,
      comments: import.meta.env.VITE_APP_WRITE_COMMENTS_COLLECTION,
    }
    return collections[type]
  },
  buildQuery: (params) => {
    const queries = []

    const buildNestedQuery = (condition) => {
      return client.buildQuery(condition)
    }

    if (params.select) {
      queries.push(Query.select(params.select))
    }

    if (params.and && Array.isArray(params.and)) {
      queries.push(Query.and(params.and.map(buildNestedQuery)))
    }

    if (params.or && Array.isArray(params.or)) {
      queries.push(Query.or(params.or.map(buildNestedQuery)))
    }

    if (params.equal && typeof params.equal === 'object') {
      const [key, value] = Object.entries(params.equal)[0]
      queries.push(Query.equal(key, Array.isArray(value) ? value : [value]))
    }

    if (params.notEqual && typeof params.notEqual === 'object') {
      const [key, value] = Object.entries(params.notEqual)[0]
      queries.push(Query.notEqual(key, Array.isArray(value) ? value : [value]))
    }

    if (params.lessThan && typeof params.lessThan === 'object') {
      const [key, value] = Object.entries(params.lessThan)[0]
      queries.push(Query.lessThan(key, value))
    }

    if (params.lessThanEqual && typeof params.lessThanEqual === 'object') {
      const [key, value] = Object.entries(params.lessThanEqual)[0]
      queries.push(Query.lessThanEqual(key, value))
    }

    if (params.greaterThan && typeof params.greaterThan === 'object') {
      const [key, value] = Object.entries(params.greaterThan)[0]
      queries.push(Query.greaterThan(key, value))
    }

    if (params.greaterThanEqual && typeof params.greaterThanEqual === 'object') {
      const [key, value] = Object.entries(params.greaterThanEqual)[0]
      queries.push(Query.greaterThanEqual(key, value))
    }

    if (params.between && typeof params.between === 'object') {
      const [key, values] = Object.entries(params.between)[0]
      if (Array.isArray(values) && values.length === 2) {
        queries.push(Query.between(key, values[0], values[1]))
      }
    }

    if (params.isNull) {
      queries.push(Query.isNull(params.isNull))
    }

    if (params.isNotNull) {
      queries.push(Query.isNotNull(params.isNotNull))
    }

    if (params.startsWith && typeof params.startsWith === 'object') {
      const [key, value] = Object.entries(params.startsWith)[0]
      queries.push(Query.startsWith(key, value))
    }

    if (params.endsWith && typeof params.endsWith === 'object') {
      const [key, value] = Object.entries(params.endsWith)[0]
      queries.push(Query.endsWith(key, value))
    }

    if (params.contains && typeof params.contains === 'object') {
      const [key, value] = Object.entries(params.contains)[0]
      if (Array.isArray(value)) {
        queries.push(Query.contains(key, value))
      }
    }

    if (params.search && typeof params.search === 'object') {
      const [key, value] = Object.entries(params.search)[0]
      queries.push(Query.search(key, value))
    }

    if (params.orderDesc) {
      if (Array.isArray(params.orderDesc)) {
        params.orderDesc.forEach((field) => queries.push(Query.orderDesc(field)))
      } else {
        queries.push(Query.orderDesc(params.orderDesc))
      }
    }

    if (params.orderAsc) {
      if (Array.isArray(params.orderAsc)) {
        params.orderAsc.forEach((field) => queries.push(Query.orderAsc(field)))
      } else {
        queries.push(Query.orderAsc(params.orderAsc))
      }
    }

    if (params.limit) {
      queries.push(Query.limit(params.limit))
    }

    if (params.offset) {
      queries.push(Query.offset(params.offset))
    }

    return queries
  },
}
export const api = {
  users,
  collection,
}

export default api
