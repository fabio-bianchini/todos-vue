<template>
  <main class="main-wrapper">
    <h1 class="page-title">todos</h1>
    <div class="task-input-wrapper">
      <div
        class="task-input-checkall-wrapper col-1"
        v-show="this.taskList.length > 0"
      >
        <div class="svgCheckAll" :style="svgRotationStyle(checkAll)">
          <font-awesome-icon icon="chevron-right" />
        </div>
        <input
          class="task-input-checkall"
          type="checkbox"
          v-model="checkAll"
          :checked="checkAll"
        />
      </div>
      <input
        class="task-input"
        type="text"
        placeholder="What are you planning today?"
        v-model="newTaskInput"
        @keyup.enter="addTask()"
        autofocus
      />
    </div>
    <ul class="task-list">
      <!-- <input class="task-item-checkbox col-1" type="checkbox" /> -->
      <li class="task-item container" v-for="task of tasksByView" :key="task">
        <div class="row align-items-center">
          <div class="task-item-checkbox-wrapper col-1">
            <IconRoundCheckbox v-show="!task.completed" />
            <IconRoundChecked v-show="task.completed" />
            <input
              class="task-item-checkbox"
              type="checkbox"
              v-model="task.completed"
              :checked="task.completed"
            />
          </div>
          <input
            class="task-item-text col"
            :class="{ taskItemTextDone: task.completed }"
            @dblclick="editTask($event, task)"
            v-model="task.label"
            readonly
            @keydown.enter="doneEdit($event, task)"
            @blur="doneEdit($event, task)"
            @keydown.esc="cancelEdit($event)"
          />
          <!-- v-todo-focus="todo == editedTodo"  -->
          <button class="task-item-delete col-1" @click="removeTask(task)">
            <IconDelete />
          </button>
        </div>
      </li>
    </ul>
    <div class="info-footer container" v-show="taskList.length > 0">
      <div class="row align-items-center">
        <p class="items-left col">
          <strong>{{ filters.active(taskList).length }}</strong
          >{{ pluralizeTasks }}
        </p>
        <div class="routers-div col-auto">
          <nav>
            <ul class="routers-wrapper">
              <li class="router-item">
                <router-link
                  class="router-link"
                  :to="'/'"
                  @click="currentView = 'all'"
                >
                  All
                </router-link>
              </li>
              <li class="router-item">
                <router-link
                  class="router-link"
                  :to="'/active'"
                  @click="currentView = 'active'"
                >
                  Active
                </router-link>
              </li>
              <li class="router-item">
                <router-link
                  class="router-link"
                  :to="'/completed'"
                  @click="currentView = 'completed'"
                >
                  Completed
                </router-link>
              </li>
            </ul>
          </nav>
        </div>
        <button class="clear-completed-button col" @click="removeCompleted()">
          Clear completed
        </button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { useTaskStore } from "./store/store";

import IconDelete from "./components/icons/IconDelete.vue";
import IconRoundCheckbox from "./components/icons/IconRoundCheckbox.vue";
import IconRoundChecked from "./components/icons/IconRoundChecked.vue";

export default {
  name: "app" as string,
  components: { IconDelete, IconRoundCheckbox, IconRoundChecked },
  setup() {
    const store = useTaskStore();
    return {
      ...storeToRefs(store),
    };
  },

  methods: {
    addTask() {
      if (this.newTaskInput === "") return;
      this.taskList.push({ label: this.newTaskInput, completed: false });
      this.newTaskInput = "";
    },
    editTask(event: Event, task: { label: string; completed: boolean }) {
      let editInputTask = event.target as HTMLInputElement;
      editInputTask.readOnly = false;
      editInputTask.focus();
      this.editingTask.cache = task.label;
      this.editingTask.task = task;
    },
    doneEdit(event: Event, task: { label: string; completed: boolean }) {
      let editInputTask = event.target as HTMLInputElement;
      editInputTask.readOnly = true;
      this.editingTask.task.label = task.label.trim();
      if (this.editingTask.task.label === "")
        this.removeTask(this.editingTask.task);
    },
    cancelEdit(event: Event) {
      let editInputTask = event.target as HTMLInputElement;
      editInputTask.readOnly = true;
      editInputTask.value = this.editingTask.cache;
    },
    removeTask(task: { label: string; completed: boolean }) {
      var index = this.taskList.indexOf(task);
      this.taskList.splice(index, 1);
    },
    removeCompleted() {
      this.taskList = this.taskList.filter((task) => {
        return !task.completed;
      });
    },
    svgRotationStyle(checkAllProp: boolean) {
      return (
        "transform: rotate(" +
        (checkAllProp ? 90 : 0) +
        "deg); " +
        "opacity:" +
        (checkAllProp ? 1 : 0.3)
      );
    },
  },
  computed: {
    pluralizeTasks(): string {
      return (
        " task" +
        (this.filters.active(this.taskList).length === 1 ? "" : "s") +
        " left"
      );
    },
    checkAll: {
      get: function (): boolean {
        if (this.taskList.length === 0) return false;
        return this.filters.active(this.taskList).length === 0;
      },
      set: function (value: boolean) {
        this.taskList.forEach((task: { label: string; completed: boolean }) => {
          task.completed = value;
        });
      },
    },
    tasksByView(): { label: string; completed: boolean }[] {
      // if (!["all", "active", "completed"].includes(view)) view = "all";
      return this.filters[this.currentView as keyof typeof this.filters](
        this.taskList
      );
    },
  },
};
</script>

<style lang="sass">
.task-list
  list-style: none
  margin: 0 auto
  padding-inline-start: 0
  padding-top: 10px

.task-list .task-item-checkbox-wrapper
  position: relative

$size-svg: 24px
.task-list .task-item-checkbox-wrapper .task-item-checkbox,
.task-item .task-item-checkbox-wrapper svg
  position: absolute
  left: calc(100% - ($size-svg * 1.2))
  top: 0
  margin: 0 auto
  margin-top: (-$size-svg / 2)
  height: $size-svg
  width: $size-svg
  opacity: 0.5

.task-list .task-item-checkbox-wrapper .task-item-checkbox
  opacity: 0

.task-list .task-item .row
  // border: 1px solid #000
  box-shadow: 0px 2px 10px #cfcfcf
  height: 50px

.task-list .task-item-text
  margin: 0 auto
  text-align: left
  width: 100%
  background-color: transparent
  border: 0
  outline: none

.task-list .task-item-text[value]
  border: 2px solid red


.taskItemTextDone
  text-decoration: line-through
  color: #a5a5a5

.task-list .task-item-delete
  padding: 0
  opacity: 0
  border: 0
  background-color: transparent

.task-list .task-item-delete svg
  // height: 100%
  width: 50%

.task-list .task-item:hover .task-item-delete
  opacity: 0.5



.info-footer
  padding-top: 10px



.info-footer,
.info-footer .routers-wrapper .router-link,
.info-footer .clear-completed-button
  font-size: 16px
  color: #5e5e5e

.info-footer .items-left
  margin: 0 auto

.info-footer .router-link
  padding-left: 5px
  padding-right: 5px

.info-footer .router-link, .clear-completed-button
  border-style: none

.info-footer .router-link:hover
  background-color: #ababab

.info-footer .clear-completed-button:hover
  text-decoration: underline

.info-footer .routers-wrapper
  display: flex
  list-style: none
  margin: 0
  padding: 0

.task-input-wrapper
  padding: 0.5em
  // padding-left: 3em
  width: 100%
  font-size: 24px
  border-width: 0px
  background-color: #FFFFFF
  color: #000000
  box-shadow: 0px 2px 10px rgba(155,155,155,.55)
  display: flex

.task-input
  position: relative
  font-size: 24px
  width: 100%
  border-style: none
  outline: none
  flex: 1

.task-input-checkall-wrapper
  position: relative

$size-svg: 24px
.task-input-checkall-wrapper .task-input-checkall
  position: absolute
  left: calc(60% - ($size-svg))
  top: 0
  margin: 0 auto
  height: 100%
  width: 100%
  opacity: 0

.task-input-checkall:checked
  transform: rotate(45deg)

.svgCheckAll
  margin-left: -0.5em
  transition: all 0.3s

.svgNormal
  transform: rotate(-90deg)

.svgRotate
  transform: rotate(90deg)

.main-wrapper
  max-width: 500px
  margin: 0 auto
  text-align: center

.page-title
  color: #efd4da
  font-size: 100px
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

// html
body
  background-color: #f1f1f1

@import "~bootstrap/dist/css/bootstrap-grid.min.css"
</style>
