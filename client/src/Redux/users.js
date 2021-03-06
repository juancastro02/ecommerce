import axios from 'axios'

// --- CONSTANTES ---
const GET_USERS = 'GET_USERS'
const GET_USER = 'GET_USER'
const LOGOUT_USER = 'LOGOUT_USER'
const SET_USER = 'SET_USER'
const ERROR_LOGIN = 'ERROR_LOGIN'
const SIGN_UP = 'SIGN_UP'
const RESET_USER = "RESET_USER"
const CLEAN_MESSAGES_LOGIN = 'CLEAN_MESSAGES_LOGIN'
const CLEAN_MESSAGE_USER_CREATE = 'CLEAN_MESSAGE_USER_CREATE'
const MESSAGE_RECOVER_PASSWORD = 'MESSAGE_RECOVER_PASSWORD'
const CLEAN_MESSAGE_FORGOT_PASSWORD = 'CLEAN_MESSAGE_FORGOT_PASSWORD'
const MESSAGE_RESET_PASSWORD = 'MESSAGE_RESET_PASSWORD'
const CLEAN_MESSAGE_RESET_PASSWORD = 'CLEAN_MESSAGE_RESET_PASSWORD'

// --- STATE ---

const initialState = {
  users: [],
  user: {
    id: "",
    email: "",
    password: "",
    isAdmin: false
  },
  userSelected: {}
};

// --- REDUCER ---
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload
      }

    case GET_USER:
      return {
        ...state,
        userSelected: action.payload
      }

    case SET_USER:
      return {
        ...state,
        user: action.payload
      }

    case SIGN_UP:
      return {
        ...state,
        message: 'Usuario creado.'
      }

    case ERROR_LOGIN:
      return {
        ...state,
        error: 'Usuario o contraseña incorrectos.'
      }

    case CLEAN_MESSAGES_LOGIN:
      state.error = '';
      return {
        ...state
      }

    case CLEAN_MESSAGE_USER_CREATE:
      state.message = '';
      return {
        ...state
      }

    case LOGOUT_USER:
      return {
        ...state,
        user: {
          username: '',
          email: "",
          password: "",
        }
      }

    case RESET_USER:
      return {
        ...state,
        userSelected: {},
      }

    case MESSAGE_RECOVER_PASSWORD:
      return {
        ...state,
        'forgot_password': action.payload
      }

    case CLEAN_MESSAGE_FORGOT_PASSWORD:
      delete state.forgot_password;
      return {
        ...state
      }

    case MESSAGE_RESET_PASSWORD:
      return {
        ...state,
        reset_password: action.payload
      }

    case CLEAN_MESSAGE_RESET_PASSWORD:
      delete state.reset_password;
      return {
        ...state
      }

    default:
      return {
        ...state,
      };
  }
}

// --- ACTIONS ---
export const getUsers = () => async (dispatch, getState) => {
  try {
    const { data } = await axios.get('http://localhost:3001/user')
    dispatch({
      type: GET_USERS,
      payload: data
    })
  }
  catch (error) {
    console.log(error)
  }
}

export const getUser = (email) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`http://localhost:3001/user/${email}`)
    dispatch({
      type: GET_USER,
      payload: data
    })
  }
  catch (error) {
    console.log(error)
  }
}

export const loginUser = (user) => (dispatch, getState) => {
  try {

    axios.post('http://localhost:3001/auth/login', user)
      .then(user => {
        localStorage.setItem("token", user.data.token);
        dispatch({
          type: SET_USER,
          payload: user.data
        })
      })
      .catch(() => {
        dispatch({
          type: ERROR_LOGIN,
        })
      })

  }
  catch (error) {
    console.log(error)
  }
}

export const authGoogle = (googleUser) => (dispatch) => {

  // Obtener token
  const token = googleUser.uc.id_token;
  // Mandar token al backend 
  axios.post('http://localhost:3001/auth/google', { token })
    .then(user => {
      localStorage.setItem("token", user.data.token);
      dispatch({
        type: SET_USER,
        payload: user.data
      })
    })
    .catch(error => {
      console.log(error.message)
    })

}

export const signUp = (datos) => async (dispatch) => {
  try {
    const { data } = await axios.post('http://localhost:3001/user', datos)
    dispatch({
      type: SIGN_UP,
      payload: data
    })
  } catch (error) {
    console.log(error)
  }
}

export const validation = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {

      const config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      };

      const { data } = await axios.get('http://localhost:3001/auth/me', config);

      dispatch({
        type: SET_USER,
        payload: data.user
      });
    }

  } catch (error) {
    console.log(error);
  };
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT_USER })
}

export const resetUser = () => (dispatch) => {
  try {
    dispatch({ type: RESET_USER })
  } catch (error) {
    console.log(error.message);
  }
}

export const cleanError = () => (dispatch) => {
  dispatch({ type: CLEAN_MESSAGES_LOGIN })
}

export const cleanMessage = () => (dispatch) => {
  dispatch({ type: CLEAN_MESSAGE_USER_CREATE })
}

export const recoverPassword = (email) => (dispatch) => {

  axios.put('http://localhost:3001/auth/forgot-password', email)
    .then(response => {
      dispatch({
        type: MESSAGE_RECOVER_PASSWORD,
        payload: {
          ok: true,
          message: response.data.message
        }
      })
    })
    .catch(error => {
      dispatch({
        type: MESSAGE_RECOVER_PASSWORD,
        payload: {
          ok: false,
          message: 'Your email not registered.'
        }
      })
    })

}

export const cleanMessageForgotPassword = () => (dispatch) => {
  dispatch({ type: CLEAN_MESSAGE_FORGOT_PASSWORD })
}

export const resetPassword = (password, token) => (dispatch) => {
  const data = {
    newPassword: password,
    resetLink: token
  }

  axios.put('http://localhost:3001/auth/reset-password', data)
    .then(response => {
      dispatch({
        type: MESSAGE_RESET_PASSWORD,
        payload: {
          ok: true,
          message: response.data.message
        }
      })
    })
    .catch(error => {
      dispatch({
        type: MESSAGE_RESET_PASSWORD,
        payload: {
          ok: false,
          message: 'Error changing your password.'
        }
      })
    })

}

export const cleanMessageResetPassword = () => (dispatch) => {
  dispatch({ type: CLEAN_MESSAGE_RESET_PASSWORD })
}

// export const loginGoogle = () => async (dispatch) => {
//   try {
//     let user = JSON.parse(localStorage.getItem('userGoogle'));
//     localStorage.removeItem('userGoogle')
//     console.log(user);
//     dispatch({
//       type: SET_USER,
//       payload: user.user
//     })
//   } catch (error) {
//     console.log(error);
//   }
// }
