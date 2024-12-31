import React, {useState} from 'react';
import { Button } from 'react-bootstrap-v5';
import { useDispatch } from 'react-redux';
import { createVariation } from '../../store/action/variationAction';
import VariationForm from './VariationForm';
import { getFormattedMessage } from '../../shared/sharedMethod';

const CreateVariation = (props) => {

    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    const addVariationData = (variation) => {
        dispatch(createVariation(variation));
    }

    return (
        <div className='text-end w-sm-auto w-100'>
            <Button variant='primary mb-lg-0 mb-md-0 mb-4' onClick={handleClose}>
                {getFormattedMessage('variation.create.title')}
            </Button>
            <VariationForm addVariationData={addVariationData} handleClose={handleClose} show={show}
                                 title={getFormattedMessage('variation.create.title')}/>
        </div>
    )
}

export default CreateVariation;
