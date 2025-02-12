import {Todo} from "./type";
import {v1} from "uuid";
import {combineReducers, createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import {composeWithDevTools} from 'redux-devtools-extension'


//constants
const CREATE_TODO = 'CREATE_TODO'
const EDIT_TODO = 'EDIT_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const DELETE_TODO = 'DELETE_TODO'
const SELECT_TODO = 'SELECT_TODO'

//Actions and Actions Type

interface CreateTodoActionType {
    type: typeof CREATE_TODO
    payload: Todo
}

export const createTodoActionCreator = ({desc}: { desc: string }): CreateTodoActionType => {

    return {
        type: CREATE_TODO,
        payload: {
            id: v1(),
            desc,
            isComplete: false
        }
    }
}

interface EditTodoActionType {
    type: typeof EDIT_TODO
    payload: { id: string, desc: string }
}

export const editTodoActionCreator = ({id, desc}: { id: string, desc: string }): EditTodoActionType => {
    return {
        type: EDIT_TODO,
        payload: {id, desc}
    }
}

interface ToggleTodoActionType {
    type: typeof TOGGLE_TODO
    payload: { id: string, isComplete: boolean }
}

export const toggleTodoActionCreator = ({id, isComplete}: { id: string, isComplete: boolean }): ToggleTodoActionType => {
    return {
        type: TOGGLE_TODO,
        payload: {id, isComplete}
    }
}

interface DeleteTodoActionType {
    type: typeof DELETE_TODO
    payload: { id: string }
}

export const deleteTodoActionCreator = ({id}: { id: string }): DeleteTodoActionType => {
    return {
        type: DELETE_TODO,
        payload: {id}
    }
}

interface SelectTodoActionType {
    type: typeof SELECT_TODO
    payload: { id: string }
}

export const selectTodoActionCreator = ({id}: { id: string }): SelectTodoActionType => {
    return {
        type: SELECT_TODO,
        payload: {id}
    }
}

//Reducers
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

type TodoActionsTypes = DeleteTodoActionType | ToggleTodoActionType | EditTodoActionType | CreateTodoActionType
const todosReducers = (state: Todo[] = initialState, action: TodoActionsTypes) => {
    switch (action.type) {
        case "CREATE_TODO": {
            return [...state, action.payload]
        }
        case "EDIT_TODO": {
            return state.map(todo => todo.id === action.payload.id ? {...todo, desc: action.payload.desc} : todo)
        }
        case "TOGGLE_TODO": {
            return state.map(todo => todo.id === action.payload.id ? {
                ...todo,
                isComplete: action.payload.isComplete
            } : todo)
        }
        case "DELETE_TODO": {
            return state.filter(todo => todo.id !== action.payload.id)
        }
        default: {
            return state
        }
    }
}
type SelectedTodoActionsTypes = SelectTodoActionType
const selectedTodoReducer = (state: string | null = null, action: SelectedTodoActionsTypes) => {
    switch (action.type) {
        case "SELECT_TODO": {
            return action.payload.id
        }
        default: {
            return state
        }
    }
}
const counterReducer = (state: number = 0, action: TodoActionsTypes) => {
    switch (action.type) {
        case "DELETE_TODO":
        case "TOGGLE_TODO":
        case "EDIT_TODO":
        case "CREATE_TODO": {
            return state + 1
        }
        default: {
            return state
        }
    }
}

const reducers = combineReducers({
    todos: todosReducers,
    selectedTodo: selectedTodoReducer,
    counter: counterReducer
})

//store
export default createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunk, logger))
)