import { variationActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case variationActionType.FETCH_VARIATIONS:
            return action.payload;
        case variationActionType.FETCH_ALL_VARIATIONS:
            return action.payload;
        case variationActionType.FETCH_VARIATION:
            return action.payload;
        case variationActionType.ADD_VARIATION:
            return [...state, action.payload];
        case variationActionType.EDIT_VARIATION:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case variationActionType.DELETE_VARIATION:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
}
