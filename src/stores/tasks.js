import { defineStore } from 'pinia'
export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    total: 0,
  }),
  getters: {},
  actions: {
    setTasks(tasks) {
      if (!tasks) {
        this.tasks = []
        return
      }
      this.tasks = tasks
    },
    addTask(task) {
      if (!task) {
        return
      }
      this.tasks.push(task)
      this.total++
    },
  },
})
