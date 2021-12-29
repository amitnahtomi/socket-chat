export const getMassage = (newMessage) => {
    return {
        type: 'GET_MESSAGE',
        data: newMessage
    }
}