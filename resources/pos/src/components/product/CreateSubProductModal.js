import React, { useEffect, useState } from "react";
import { InputGroup, Modal } from "react-bootstrap-v5";
import { decimalValidate, getFormattedMessage, getFormattedOptions, placeholderText } from "../../shared/sharedMethod";
import { useDispatch, useSelector } from "react-redux";
import { taxMethodOptions } from "../../constants";
import Form from "react-bootstrap/Form";
import ReactSelect from "../../shared/select/reactSelect";
import { addProduct } from "../../store/action/productAction";
import { useNavigate } from "react-router";
import { upperCase } from "lodash";

const CreateSubProductModal = (props) => {

    const { show, setShow, commonData } = props;
    const { frontSetting } = useSelector((state) => state);
    const [product, setProduct] = useState({});
    const [formInput, setFormInput] = useState({
        product_price: "",
        product_cost: "",
        order_tax: "",
        stock_alert: "",
        tax_type: "",
    });
    const [errors, setErrors] = useState({});
    const taxTypeFilterOptions = getFormattedOptions(taxMethodOptions);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (show) {
            setProduct({
                ...commonData,
                variationTypes: commonData.variationTypes.map((variationType) => {
                    return {
                        value: variationType.id,
                        label: variationType.name,
                    };
                }
                ),
            });
        } else {
            setProduct({});
            setFormInput({
                product_price: "",
                product_cost: "",
                order_tax: "",
                stock_alert: "",
                tax_type: "",
            });
            setErrors({});
        }
    }, [show]);

    const onProductDataChange = (e) => {
        setFormInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setErrors({});
    };

    const onTaxTypeChange = (obj) => {

        setFormInput((prev) => ({
            ...prev,
            tax_type: obj,
        }));
        setErrors({});
    };

    const onVariationTypeChange = (obj) => {

        setFormInput((prev) => ({
            ...prev,
            variation_type: obj,
        }));
        setErrors({});
    };

    const handleValidation = () => {
        let validationErrors = {};
        let isValid = false;
        if (!formInput["variation_type"]) {
            validationErrors["variation_type"] = getFormattedMessage(
                "variation.type.select.validate.error.message"
            );
        } else if (!formInput['product_cost'].trim()) {
            validationErrors['product_cost'] = getFormattedMessage('product.input.product-cost.validate.label');
        } else if (!formInput['product_price'].trim()) {
            validationErrors['product_price'] = getFormattedMessage('product.input.product-price.validate.label');
        } else if (formInput['order_tax'] > 100) {
            validationErrors["order_tax"] = getFormattedMessage('product.input.order-tax.valid.validate.label');
        } else if (!formInput['tax_type']) {
            validationErrors["tax_type"] = getFormattedMessage('product.input.tax-type.validate.label');
        }
        else {
            isValid = true;
        }
        setErrors(validationErrors);
        return isValid;
    };


    const onSubmit = (e) => {
        e.preventDefault();
        const valid = handleValidation();
        if (valid) {
            dispatch(addProduct(prepareFormData(commonData, formInput), navigate));
            setShow(false);
        }
    }


    const prepareFormData = (commonData, formInput) => {
        const formData = new FormData();

        formData.append('name', commonData.name);
        formData.append('product_code', commonData.product_code);
        formData.append('product_category_id', commonData.product_category_id);
        formData.append('brand_id', commonData.brand_id);
        formData.append('barcode_symbol', commonData.barcode_symbol);
        formData.append('product_unit', commonData.product_unit);
        formData.append('sale_unit', commonData.sale_unit);
        formData.append('purchase_unit', commonData.purchase_unit);
        formData.append('quantity_limit', commonData.quantity_limit);
        formData.append('notes', commonData.notes);
        formData.append('variation_id', commonData.variation.id);
        formData.append('main_product_id', commonData.main_product_id);


        formData.append('code', commonData.product_code + '-' + upperCase(formInput.variation_type.label));
        formData.append('product_price', formInput.product_price);
        formData.append('product_cost', formInput.product_cost);
        formData.append('order_tax', formInput.order_tax);
        formData.append('stock_alert', formInput.stock_alert);
        formData.append('variation_type', formInput.variation_type.value);
        formData.append('tax_type', formInput.tax_type.value ? formInput.tax_type.value : 1);

        return formData;
    };

    const defaultTaxType = {
        value: 1,
        label: getFormattedMessage("tax-type.filter.exclusive.label"),
    };

    const clearField = () => {
        setShow(false);
    }

    return <Modal show={show} size="xl"
        onHide={clearField}
        keyboard={true}
    >
        <Modal.Header closeButton>
            <Modal.Title>{getFormattedMessage('product.create.title')}</Modal.Title>
        </Modal.Header>
        <Form>
            <Modal.Body>
                <div className="mt-2">
                    <div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    {getFormattedMessage(
                                        "variations.title"
                                    )}
                                    :{" "}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={
                                        product?.variation?.name
                                    }
                                    disabled />
                            </div>
                            <div className="col-md-6 mb-3">
                                <ReactSelect
                                    title={getFormattedMessage(
                                        "variation.variation_types"
                                    )}
                                    data={product.variationTypes}
                                    onChange={(data) =>
                                        onVariationTypeChange(data)
                                    }
                                    errors={errors["variation_type"]}
                                    placeholder={placeholderText(
                                        "variation.type.input.name.placeholder.label"
                                    )}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    {getFormattedMessage(
                                        "product.input.product-cost.label"
                                    )}
                                    :{" "}
                                </label>
                                <span className="required" />
                                <InputGroup>
                                    <input
                                        type="text"
                                        name="product_cost"
                                        min={0}
                                        className="form-control"
                                        placeholder={placeholderText(
                                            "product.input.product-cost.placeholder.label"
                                        )}
                                        onKeyPress={(event) =>
                                            decimalValidate(event)
                                        }
                                        onChange={(e) =>
                                            onProductDataChange(e)
                                        }
                                        value={
                                            formInput.product_cost
                                        }
                                    />
                                    <InputGroup.Text>
                                        {frontSetting.value &&
                                            frontSetting.value
                                                .currency_symbol}
                                    </InputGroup.Text>
                                </InputGroup>
                                <span className="text-danger d-block fw-400 fs-small mt-2">
                                    {errors["product_cost"]
                                        ? errors["product_cost"]
                                        : null}
                                </span>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    {getFormattedMessage(
                                        "product.input.product-price.label"
                                    )}
                                    :{" "}
                                </label>
                                <span className="required" />
                                <InputGroup>
                                    <input
                                        type="text"
                                        name="product_price"
                                        min={0}
                                        className="form-control"
                                        placeholder={placeholderText(
                                            "product.input.product-price.placeholder.label"
                                        )}
                                        onKeyPress={(event) =>
                                            decimalValidate(event)
                                        }
                                        onChange={(e) =>
                                            onProductDataChange(e)
                                        }
                                        value={
                                            formInput.product_price
                                        }
                                    />
                                    <InputGroup.Text>
                                        {frontSetting.value &&
                                            frontSetting.value
                                                .currency_symbol}
                                    </InputGroup.Text>
                                </InputGroup>
                                <span className="text-danger d-block fw-400 fs-small mt-2">
                                    {errors["product_price"]
                                        ? errors["product_price"]
                                        : null}
                                </span>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    {getFormattedMessage(
                                        "product.input.stock-alert.label"
                                    )}
                                    :{" "}
                                </label>
                                <input
                                    type="number"
                                    name="stock_alert"
                                    className="form-control"
                                    placeholder={placeholderText(
                                        "product.input.stock-alert.placeholder.label"
                                    )}
                                    onKeyPress={(event) =>
                                        decimalValidate(event)
                                    }
                                    onChange={(e) =>
                                        onProductDataChange(e)
                                    }
                                    value={
                                        formInput.stock_alert
                                    }
                                    min={0}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">
                                    {getFormattedMessage(
                                        "product.input.order-tax.label"
                                    )}
                                    :{" "}
                                </label>
                                <InputGroup>
                                    <input
                                        type="text"
                                        name="order_tax"
                                        className="form-control"
                                        placeholder={placeholderText(
                                            "product.input.order-tax.placeholder.label"
                                        )}
                                        onKeyPress={(event) =>
                                            decimalValidate(event)
                                        }
                                        onChange={(e) =>
                                            onProductDataChange(e)
                                        }
                                        min={0}
                                        pattern="[0-9]*"
                                        value={
                                            formInput.order_tax
                                        }
                                    />
                                    <InputGroup.Text>%</InputGroup.Text>
                                </InputGroup>
                                <span className="text-danger d-block fw-400 fs-small mt-2">
                                    {errors["order_tax"]
                                        ? errors["order_tax"]
                                        : null}
                                </span>
                            </div>
                            <div className="col-md-3 mb-3">
                                <ReactSelect
                                    title={getFormattedMessage(
                                        "product.input.tax-type.label"
                                    )}
                                    multiLanguageOption={
                                        taxTypeFilterOptions
                                    }
                                    onChange={(data) =>
                                        onTaxTypeChange(data)
                                    }
                                    errors={errors["tax_type"]}
                                    placeholder={placeholderText(
                                        "product.input.tax-type.placeholder.label"
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer children='justify-content-start' className='pt-0'>
                <button type="button" className="btn btn-primary m-0"
                    onClick={(event) => onSubmit(event)}>
                    {placeholderText('globally.save-btn')}</button>
                <button type="button" className="btn btn-secondary my-0 ms-5 me-0" data-bs-dismiss="modal"
                    onClick={clearField}>{getFormattedMessage('globally.cancel-btn')}
                </button>
            </Modal.Footer>
        </Form>
    </Modal >;
};

export default CreateSubProductModal;
