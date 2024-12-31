import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchMainProduct } from '../../store/action/productAction';
import ProductForm from './ProductForm';
import HeaderTitle from '../header/HeaderTitle';
import MasterLayout from '../MasterLayout';
import { productUnitDropdown } from '../../store/action/productUnitAction';
import { fetchAllunits } from '../../store/action/unitsAction';
import { getFormattedMessage } from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { fetchAllBaseUnits } from "../../store/action/baseUnitsAction";

const EditProduct = (props) => {
    const { fetchMainProduct, products, fetchAllBaseUnits, base } = props;
    const { id } = useParams();
    const [singleProduct, setSingleProduct] = useState({});
    useEffect(() => {
        fetchAllBaseUnits();
        fetchMainProduct(id);
    }, []);

    useEffect(() => {
        if (products.length == 1) {
            setSingleProduct(products);
        }
    }, [products]);

    const subProduct = singleProduct.length >= 1 && singleProduct[0]?.attributes.products[0];
    const getSaleUnit = subProduct && subProduct.sale_unit_name ? { label: subProduct.sale_unit_name.name, value: subProduct.sale_unit_name.id } : ''
    const getPurchaseUnit = subProduct && subProduct.purchase_unit_name ? { label: subProduct.purchase_unit_name.name, value: subProduct.purchase_unit_name.id } : ''

    const mainProductItemsValue = singleProduct.length >= 1 && singleProduct.map(product => ({
        name: product?.attributes.name,
        code: product?.attributes.code,
        product_type: product?.attributes.product_type,
        product_category_id: {
            value: subProduct?.product_category_id,
            label: subProduct?.product_category_name
        },
        brand_id: {
            value: subProduct?.brand_id,
            label: subProduct?.brand_name
        },
        barcode_symbol: subProduct?.barcode_symbol,
        product_unit: Number(subProduct?.product_unit),
        sale_unit: getSaleUnit,
        purchase_unit: getPurchaseUnit,
        quantity_limit: subProduct?.quantity_limit,
        notes: subProduct?.notes,
        images: product?.attributes.images,
        status_id: {
            label: getFormattedMessage("status.filter.received.label"),
            value: 1,
        },
        isEdit: true,
        id: product.id,
    }));

    const getProductUnit = mainProductItemsValue && base.filter((fill) => Number(fill?.id) === Number(mainProductItemsValue[0]?.product_unit))

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage('product.edit.title')} to='/app/products' />
            {mainProductItemsValue.length >= 1 && <ProductForm singleProduct={mainProductItemsValue} productUnit={getProductUnit} baseUnits={base} id={id} />}
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const { products, base } = state;
    return { products, base }
};

export default connect(mapStateToProps, { fetchMainProduct, fetchAllBaseUnits, productUnitDropdown, fetchAllunits })(EditProduct);
