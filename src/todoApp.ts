import Vue from 'vue';

import { createApp } from 'vue';

createApp({
    data(): { newTask: string; tasks: Array<{ text: string; completed: boolean }> } {
        return {
            newTask: '',
            tasks: [],
        };
    },
    methods: {
        addTask(): void {
            if (this.newTask.trim() !== '') {
                this.tasks.push({ text: this.newTask, completed: false });
                this.newTask = '';
            }
        },
        toggleTaskCompletion(task: { text: string; completed: boolean }): void {
            task.completed = !task.completed;
        },
        deleteTask(index: number): void {
            this.tasks.splice(index, 1);
        }
    }
}).mount('#app');
