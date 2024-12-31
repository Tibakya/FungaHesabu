import React from 'react';
import { useDispatch} from 'react-redux';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';
import { deleteVariation } from '../../store/action/variationAction';

const DeleteVariation = (props) => {
    const {onDelete, deleteModel, onClickDeleteModel} = props;
    const dispatch = useDispatch();
    const onClickDelete = () => {
        dispatch(deleteVariation(onDelete.id));
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={onClickDelete} name={getFormattedMessage('variation.title')}/>
            }
        </div>
    )
};

export default DeleteVariation;
