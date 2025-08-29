import * as type from "../types/notesTypes";
import axios from "axios";

import { tokenConfig } from "./usersActions";

const apiUrl = import.meta.env.VITE_API_URL;

// Get notes from the database
export const getNotes = () => async (dispatch) => {
  try {
    const res = await axios.get(apiUrl + "notes");
    dispatch({
      type: type.GET_NOTES,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: type.NOTES_ERROR,
      payload: console.log(e),
    });
  }
};

// View a specific note
export const viewNote = (id) => async (dispatch) => {
  try {
    const res = await axios.get(apiUrl + `notes/id/${id}`);
    dispatch({
      type: type.VIEW_NOTE,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: type.VIEW_NOTE_ERROR,
      payload: console.log(e),
    });
  }
};

// Create a new note and post it into the database
export const postNote = (note) => async (dispatch, getState) => {
  try {
    const res = await axios.post(apiUrl + "notes", note, tokenConfig(getState));
    dispatch({
      type: type.POST_NOTE,
      payload: res.data,
    });
    dispatch(getNotes());
  } catch (e) {
    dispatch({
      type: type.POST_NOTE_ERROR,
      payload: console.log(e),
    });
  }
};

// Delete note
export const deleteNote = (id) => async (dispatch, getState) => {
  try {
    await axios.delete(apiUrl + `notes/id/${id}`, tokenConfig(getState));
    dispatch({
      type: type.DELETE_NOTE,
    });
    dispatch(getNotes());
  } catch (e) {
    dispatch({
      type: type.POST_NOTE_ERROR,
      payload: console.log(e),
    });
  }
};
