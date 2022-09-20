import { defineStore } from "pinia";
export const useTaskStore = defineStore("store", {
  state: () => ({
    newTaskInput: "" as string,
    taskList: [] as { label: string; completed: boolean }[],
    currentView: "all",
    editingTask: {
      task: { label: "", completed: false },
      cache: "",
    },
    filters: {
      all: (taskList: { label: string; completed: boolean }[]) => {
        return taskList;
      },
      active: (taskList: { label: string; completed: boolean }[]) => {
        return taskList.filter((task) => {
          return !task.completed;
        });
      },
      completed: (taskList: { label: string; completed: boolean }[]) => {
        return taskList.filter((task) => {
          return task.completed;
        });
      },
    },
  }),
  getters: {},
  actions: {},
});
