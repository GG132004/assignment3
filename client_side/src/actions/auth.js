import api from '../utils/api';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';

export const loadUser = () => async dispatch => {
  try {
    const res = await api.get('/user');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const register = (data, image) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("bio", data.bio)
    formData.append("password", data.password)
    formData.append("image", image)
    console.log(formData)
    const res = await api.post("signup", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    console.log(res)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
  }
};


export const login = (email, password) => async dispatch => {
  const body = { email, password };

  try {
    const res = await api.post('/login', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const logout = () => ({ type: LOGOUT });


export const update = (data, image) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("bio", data.bio)
    formData.append("image", image)
    const res = await api.post("update", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    console.log(res)

    dispatch(setAlert("Info Updated successfully!", "success"))
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
  }
};