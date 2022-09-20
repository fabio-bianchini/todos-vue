// import { mount } from "@vue/test-utils";
// import App from "../../src/App.vue";
import { setActivePinia, createPinia } from "pinia";
import { useTaskStore } from "../../src/store/store";

describe("Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  test("Expect values from store to be the typeof intended", () => {
    const str = useTaskStore();
    expect(typeof str.newTaskInput).toBe("string");
    expect(Array.isArray(str.taskList)).toBe(true);
    expect(typeof str.currentView).toBe("string");
    expect(str.editingTask && typeof str.editingTask === "object").toBe(true);
    expect(str.filters && typeof str.filters === "object").toBe(true);
  });
  test("Expect filters object to filter correctly", () => {
    const str = useTaskStore();
    str.taskList = [
      { label: "task1", completed: false },
      { label: "task2", completed: true },
      { label: "task3", completed: false },
    ];
    expect(str.filters["all"](str.taskList)).toBe(str.taskList);
    expect(str.filters["active"](str.taskList)).toStrictEqual([
      { label: "task1", completed: false },
      { label: "task3", completed: false },
    ]);
    expect(str.filters["completed"](str.taskList)).toStrictEqual([
      { label: "task2", completed: true },
    ]);
  });
});
