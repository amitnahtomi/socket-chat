export const getMassage = (newMessage) => {
    return {
        type: 'GET_MESSAGE',
        data: newMessage
    }
}

export const setUser = (username) => {
    return {
        type: 'SET_USER',
        data: username
    }
}