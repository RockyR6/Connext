import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    messages: []
}

const messagesSlice = createSlice({
    name: 'messges',
    initialState,
    reducers:{

    }
})

export default messagesSlice.reducer