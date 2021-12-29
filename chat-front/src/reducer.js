const initialState = {
    user: '',
    messages: []
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_MESSAGE':
            return {
                user: state.user,
                messages: [...state.messages, action.data]
            }
        case 'SET_USER':
            return {
                user: action.data,
                messages: state.messages
            }
        default:
            return state;
    }
}