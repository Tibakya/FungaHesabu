import { setLoading } from "./loadingAction";
import { apiBaseURL, toastType, variationActionType } from "../../constants";
import apiConfig from "../../config/apiConfig";
import { addToast } from "./toastAction";
import { addInToTotalRecord, removeFromTotalRecord, setTotalRecord } from "./totalRecordAction";
import requestParam from "../../shared/requestParam";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchVariations =
    (filter = {}, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            let url = apiBaseURL.VARIATIONS;
            if (
                !_.isEmpty(filter) &&
                (filter.page ||
                    filter.pageSize ||
                    filter.search ||
                    filter.order_By ||
                    filter.created_at)
            ) {
                url += requestParam(filter, null, null, null, url);
            }
            apiConfig
                .get(url)
                .then((response) => {
                    dispatch({
                        type: variationActionType.FETCH_VARIATIONS,
                        payload: response.data.data,
                    });
                    dispatch(setTotalRecord(response.data.meta.total));
                    if (isLoading) {
                        dispatch(setLoading(false));
                    }
                })
                .catch((response) => {
                    dispatch(
                        addToast({
                            text: response.response.data.message,
                            type: toastType.ERROR,
                        })
                    );
                });
        };

export const fetchVariation = (variationId) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.VARIATIONS + "/" + variationId)
        .then((response) => {
            dispatch({
                type: variationActionType.FETCH_VARIATION,
                payload: response.data.data,
            });
        })
        .catch((response) => {
            dispatch(
                addToast({
                    text: response.response.data.message,
                    type: toastType.ERROR,
                })
            );
        });
};

export const createVariation = (variation, clearField) => async (dispatch) => {
    apiConfig
        .post(apiBaseURL.VARIATIONS, variation)
        .then((response) => {
            dispatch({
                type: variationActionType.ADD_VARIATION,
                payload: response.data.data,
            });
            dispatch(addInToTotalRecord(1));
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "variation.success.create.message"
                    ),
                    type: toastType.SUCCESS,
                })
            );
            clearField();
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response.data.message,
                    type: toastType.ERROR,
                })
            );
        });
};

export const updateVariation =
    (variationId, variation, clearField) => async (dispatch) => {
        apiConfig
            .put(apiBaseURL.VARIATIONS + "/" + variationId, variation)
            .then((response) => {
                dispatch({
                    type: variationActionType.EDIT_VARIATION,
                    payload: response.data.data,
                });
                clearField();
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "variation.success.edit.message"
                        ),
                        type: toastType.SUCCESS,
                    })
                );
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const deleteVariation = (variationId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.VARIATIONS + "/" + variationId)
        .then((response) => {
            dispatch({
                type: variationActionType.DELETE_VARIATION,
                payload: variationId,
            });
            dispatch(removeFromTotalRecord(1));
            dispatch(
                addToast({
                    text: response.data.message,
                    type: toastType.SUCCESS,
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response.data.message,
                    type: toastType.ERROR,
                })
            );
        });
};


export const fetchAllVariations = () => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.VARIATIONS + `?page[size]=0`)
        .then((response) => {
            dispatch({
                type: variationActionType.FETCH_ALL_VARIATIONS,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message,
                    type: toastType.ERROR,
                })
            );
        });
};
