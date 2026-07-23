import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null };
    case 'AUTH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, user: null, token: null, loading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: true };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
    // eslint-disable-next-line
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get('/api/v1/auth/me');
      dispatch({ type: 'USER_LOADED', payload: res.data.user });
    } catch (err) {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('/api/v1/auth/login', formData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: err.response?.data?.error || 'Login failed' });
    }
  };

  const register = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('/api/v1/auth/register', formData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: err.response?.data?.error || 'Registration failed' });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      token: state.token,
      loading: state.loading,
      error: state.error,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};
