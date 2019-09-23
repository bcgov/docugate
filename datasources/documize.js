const { RESTDataSource } = require('apollo-datasource-rest');
const _ = require('lodash');

class RocketChatAPI extends RESTDataSource {

    constructor({ baseURL, authToken, userId}) {
        super();

        this.baseURL = baseURL;
        this.authToken = authToken;
        this.userId = userId;
    }

    willSendRequest(request) {
        request.headers.set('X-Auth-Token', this.authToken);
        request.headers.set('X-User-Id', this.userId);
    }

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
            ? response.messages.map(message=> RocketChatAPI.messageSearchResultReducer(message, roomId))
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

module.exports = RocketChatAPI;