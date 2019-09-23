const { RESTDataSource } = require('apollo-datasource-rest');
const _ = require('lodash');
const base64
class DocumizeRestAPI extends RESTDataSource {

    constructor({ baseURL, email, password}) {
        super();

        this.baseURL = baseURL;
        this.email = email;
        this.password = password;
    }

    willSendRequest(request) {
        request.headers.set('X-Auth-Token', this.authToken);
        request.headers.set('X-User-Id', this.userId);
    }
    static retrieveTokenForRequest(baseURL, email, password)
    static messageSearchResultReducer(message, roomId) {
        return {
            id: message._id,
            message: message.msg,
            author: message.u.name,
            time: message.ts,
            roomId: roomId
        };
    }

    async searchRoom({ roomId, searchString }) {

        const response = await this.get('chat.search', { searchText: searchString, roomId: roomId });

        return Array.isArray(response.messages)
            ? response.messages.map(message=> DocumizeRestAPI.messageSearchResultReducer(message, roomId))
            : [];
    }

    async searchRooms({ roomIds, searchString }) {

        const allSearchResultsArrays = await Promise.all(
            roomIds.map(roomId => this.searchRoom({ roomId, searchString }))
        );

        return _.flatten(allSearchResultsArrays);
    }

    async getRoomInfo({ roomId}) {
        const response = await this.get('rooms.info', { roomId: roomId });

        return response.room
    }
}

module.exports = DocumizeRestAPI;