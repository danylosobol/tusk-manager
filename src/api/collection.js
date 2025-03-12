import { client } from '.'

const dbId = import.meta.env.VITE_APP_WRITE_DB

export const collection = {
  async create(collectionType, id, data) {
    return client
      .database()
      .createDocument(dbId, client.collectionId(collectionType), id, data)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  async getById(collectionType, id) {
    return client
      .database()
      .getDocument(dbId, client.collectionId(collectionType), id)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  async update(collectionType, id, data) {
    return client
      .database()
      .updateDocument(dbId, client.collectionId(collectionType), id, data)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  async delete(collectionType, id) {
    return client
      .database()
      .deleteDocument(dbId, client.collectionId(collectionType), id, { project: 'tusk-manager' })
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  async getAll(collectionType, params = {}) {
    return client
      .database()
      .listDocuments(dbId, client.collectionId(collectionType), client.buildQuery(params))
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
}
