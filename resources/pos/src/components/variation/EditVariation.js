import React from 'react';
import VariationForm from './VariationForm';
import { getFormattedMessage } from '../../shared/sharedMethod';

const EditVariation = (props) => {
    const {handleClose, show, variation} = props;

    return (
        <>
            {variation &&
            <VariationForm handleClose={handleClose} show={show} singleVariation={variation}
                                 title={getFormattedMessage('variation.edit.title')}/>
            }
        </>
    )
};

export default EditVariation;
