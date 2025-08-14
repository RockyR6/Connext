import { configureStore } from '@reduxjs/toolkit'
import  useReducer  from '../features/user/userSlice.js'
import  connectionsReducer  from '../features/connections/connectionSlice.js'
import  messagesReducer  from '../features/messages/messageSlice.js'

export const store = configureStore({
    reducer:{
        user: useReducer,
        connections: connectionsReducer,
        messages: messagesReducer
    }
})