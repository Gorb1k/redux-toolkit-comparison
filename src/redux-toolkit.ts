import { configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {v1} from "uuid";

import {Todo} from "./type";

const initialState: Todo[] = [
    {
        id: v1(),
        desc: "Learn React",
        isComplete: true
    },
    {
        id: v1(),
        desc: "Learn Redux",
        isComplete: true
    },
    {
        id: v1(),
        desc: "Learn Redux-ToolKit",
        isComplete: false
    }
];

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        create: {
            reducer: (state: Todo[], {payload}: PayloadAction<{ id: string, desc: string, isComplete: boolean }>) => {
                state.push(payload)
            },
            prepare: ({desc}: { desc: string }) => ({
                payload: {
                    id: v1(),
                    desc,
                    isComplete: false
                }
            })
        },
        edit: (state: Todo[], {payload}: PayloadAction<{ id: string, decs: string }>) => {
            const todoToEdit = state.find(todo => todo.id === payload.id)
            if (todoToEdit) {
                todoToEdit.desc = payload.desc
            }
        },
        toggle: (state: Todo[], {payload}: PayloadAction<{ id: string, isComplete: boolean }>) => {
            const todoToToggle = state.find(todo => todo.id === payload.id)
            if (todoToToggle) {
                todoToToggle.isComplete = payload.isComplete
            }
        },
        remove: (state: Todo[], {payload}: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(todo => todo.id === payload.id)
            if (index !== -1) {
                state.splice(index, 1)
            }
        }
    }
})

const selectedTodoSlice = createSlice({
        name: 'selectedTodo',
        initialState: null as string | null,
        reducers: {
            select: (state: string | null, {payload}: PayloadAction<{ id: string }>) => payload.id
        }
    }
)
const counterSlice = createSlice({
    name: 'counter',
    initialState: 0,
    reducers: {},
    extraReducers: {
        [todosSlice.actions.create.type]: (state: number) => state + 1,
        [todosSlice.actions.edit.type]: (state: number) => state + 1,
        [todosSlice.actions.toggle.type]: (state: number) => state + 1,
        [todosSlice.actions.remove.type]: (state: number) => state + 1
    }
})
export const {
    create: createTodoActionCreator,
    remove: deleteTodoActionCreator,
    toggle: toggleTodoActionCreator,
    edit : editTodoActionCreator
} = todosSlice.actions
export const {select: selectTodoActionCreator} = selectedTodoSlice.actions

const reducer = {
    todos: todosSlice.reducer,
    selectedTodo: selectedTodoSlice.reducer,
    counter: counterSlice.reducer
}

export default configureStore({
    reducer
})