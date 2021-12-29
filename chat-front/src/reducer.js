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
    
        default:
            return state;
    }
}