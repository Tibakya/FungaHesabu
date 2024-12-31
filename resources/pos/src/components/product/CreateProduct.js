import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import {addMainProduct} from '../../store/action/productAction';
import ProductForm from './ProductForm';
import HeaderTitle from '../header/HeaderTitle';
import {getFormattedMessage} from '../../shared/sharedMethod';
import {fetchAllBaseUnits} from "../../store/action/baseUnitsAction";

const CreateProduct = (props) => {
    const {addMainProduct,fetchAllBaseUnits,base} = props;
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllBaseUnits();
    }, []);

    const addProductData = (formValue) => {
        addMainProduct(formValue, navigate);
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage('product.create.title')} to='/app/products'/>
            <ProductForm addProductData={addProductData} baseUnits={base}/>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {base} = state;
    return {base}
};

export default connect(mapStateToProps, {addMainProduct,fetchAllBaseUnits})(CreateProduct);
