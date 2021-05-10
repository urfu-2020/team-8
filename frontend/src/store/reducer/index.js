import getConfig from "../../config"
const config = getConfig()
export const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  tokenСreationTime: getTokenСreationTime(),
  client_id: config.client_id,
  redirect_uri: config.redirect_uri,
  proxy_url: config.proxy_url
};
  
function getTokenСreationTime() {
  let tokenСreationTime = JSON.parse(localStorage.getItem("tokenСreationTime"))  || null
  if (tokenСreationTime === null)
    return null
  return new Date(tokenСreationTime)
}

  export const reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN": {
        localStorage.setItem("user", JSON.stringify(action.payload.user))
        localStorage.setItem("tokenСreationTime", JSON.stringify(action.payload.tokenСreationTime))
        return {
          ...state,
          user: action.payload.user,
          tokenСreationTime: action.payload.tokenСreationTime
        };
      }
      case "LOGOUT": {
        localStorage.clear()
        return {
          ...state,
          user: null,
          tokenСreationTime: 0
        };
      }
      default:
        return state;
    }
  };
  