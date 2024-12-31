import React from 'react';
import { connect } from 'react-redux';
import { deleteMainProduct } from '../../store/action/productAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import { getFormattedMessage } from '../../shared/sharedMethod';

const DeleteMainProduct = (props) => {
    const { deleteMainProduct, onDelete, deleteModel, onClickDeleteModel } = props;


    const deleteUserClick = () => {
        deleteMainProduct(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                deleteUserClick={deleteUserClick} name={getFormattedMessage('product.title')} />}
        </div>
    )
};

export default connect(null, { deleteMainProduct })(DeleteMainProduct);
