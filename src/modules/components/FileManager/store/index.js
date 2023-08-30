import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: {
        reloading: false,
        removing: false,
        uploading: false,
        changingname: false,
        creatingdir: false,
    },
    uploader: {
        percent: 0,
    },
    thumbendpoint: "",
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading[action.payload[0]] = action.payload[1];
        },
        setUploaderPercent: (state, action) => {
            state.uploader.percent = action.payload;
        },
        setThumbEndpoint: (state, action) => {
            state.thumbendpoint = action.payload;
        },
    },
});

export const { setLoading, setUploaderPercent, setThumbEndpoint } = dataSlice.actions;

export const store = configureStore({
    reducer: {
        data: dataSlice.reducer,
    },
});
