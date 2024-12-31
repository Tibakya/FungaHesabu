import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { InputGroup, Button } from "react-bootstrap-v5";
import MultipleImage from "./MultipleImage";
import { fetchUnits } from "../../store/action/unitsAction";
import { fetchAllProductCategories } from "../../store/action/productCategoryAction";
import { fetchAllBrands } from "../../store/action/brandsAction";
import { editMainProduct, fetchProduct } from "../../store/action/productAction";
import { productUnitDropdown } from "../../store/action/productUnitAction";
import {
    decimalValidate,
    getFormattedMessage,
    getFormattedOptions,
    placeholderText,
} from "../../shared/sharedMethod";
import taxes from "../../shared/option-lists/taxType.json";
import barcodes from "../../shared/option-lists/barcode.json";
import ModelFooter from "../../shared/components/modelFooter";
import ReactSelect from "../../shared/select/reactSelect";
import {
    productTypesOptions,
    taxMethodOptions,
    saleStatusOptions,
} from "../../constants";
import { fetchAllWarehouses } from "../../store/action/warehouseAction";
import { fetchAllSuppliers } from "../../store/action/supplierAction";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UnitsForm from "../units/UnitsForm";
import { addUnit } from "../../store/action/unitsAction";
import { fetchAllVariations } from "../../store/action/variationAction";
import ReactMultiSelect from "../../shared/select/ReactMultiSelect";
import { toUpper } from "lodash";

const ProductForm = (props) => {
    const {
        addProductData,
        warehouses,
        suppliers,
        id,
        editMainProduct,
        singleProduct,
        brands,
        fetchAllBrands,
        fetchAllProductCategories,
        productCategories,
        fetchUnits,
        productUnits,
        productUnitDropdown,
        frontSetting,
        fetchAllWarehouses,
        fetchAllSuppliers,
        addUnit,
        baseUnits,
        productUnit,
    } = props;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const variations = useSelector((state) => state.variations);
    const [productValue, setProductValue] = useState({
        date: new Date(),
        name: "",
        code: "",
        product_category_id: "",
        brand_id: "",
        barcode_symbol: "",
        product_unit: "",
        sale_unit: "",
        purchase_unit: "",
        sale_quantity_limit: "",
        notes: "",
        images: [],
        warehouse_id: "",
        supplier_id: "",
        product_type: "",
        variation: "",
        variation_type: [],
        status_id: {
            label: getFormattedMessage("status.filter.received.label"),
            value: 1,
        },
        isEdit: false,
    });
    const [variationTypesData, setVariationTypesData] = useState([]);
    const [singleProductTypeData, setSingleProductTypeData] = useState({
        product_cost: "",
        product_price: "",
        stock_alert: "",
        order_tax: "",
        tax_type: "",
        add_stock: "",
    });

    const [unitModel, setUnitModel] = useState(false);
    const [removedImage, setRemovedImage] = useState([]);
    const [isClearDropdown, setIsClearDropdown] = useState(true);
    const [isDropdown, setIsDropdown] = useState(true);
    const [multipleFiles, setMultipleFiles] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchAllBrands();
        fetchAllProductCategories();
        fetchUnits();
        fetchAllWarehouses();
        fetchAllSuppliers();
    }, []);

    useEffect(() => {
        if (singleProduct && productUnit) {
            productUnitDropdown(productUnit[0]?.id);
        }
    }, []);

    useEffect(() => {
        if (productValue.variation !== "" && productValue.isEdit === false) {
            setProductValue((prev) => ({
                ...prev,
                variation_type: "",
            }));
            setVariationTypesData([]);
        }
    }, [productValue.variation]);

    const variationsOptions =
        variations?.length > 0
            ? variations?.map((variation) => ({
                id: variation.id,
                name: variation.attributes.name,
            }))
            : [];

    const variationTypesOptions = variations
        ?.filter(
            (variation) => variation?.id === productValue.variation?.value
        )[0]
        ?.attributes?.variation_types?.map((variationType) => ({
            value: variationType.id,
            label: variationType.name,
        }));

    const newTax =
        singleProduct &&
        taxes.filter((tax) => singleProduct[0].tax_type === tax.value);

    const newBarcode =
        singleProduct &&
        barcodes.filter(
            (barcode) =>
                singleProduct[0].barcode_symbol.toString() === barcode.value
        );
    const disabled =
        multipleFiles.length !== 0
            ? false
            : singleProduct &&
            productValue.product_unit[0] &&
            productValue.product_unit[0].value ===
            singleProduct[0].product_unit &&
            productValue.barcode_symbol[0] &&
            productValue.barcode_symbol[0].value ===
            singleProduct[0].barcode_symbol.toString() &&
            singleProduct[0].name === productValue.name &&
            singleProduct[0].notes === productValue.notes &&
            singleProduct[0].product_price === productValue.product_price &&
            singleProduct[0]?.stock_alert?.toString() ===
            productValue.stock_alert &&
            singleProduct[0].product_cost === productValue.product_cost &&
            singleProduct[0].code === productValue.code &&
            JSON.stringify(singleProduct[0].order_tax) ===
            productValue.order_tax &&
            singleProduct[0].quantity_limit ===
            productValue.sale_quantity_limit &&
            singleProduct[0].brand_id.value === productValue.brand_id.value &&
            newTax.length === productValue.tax_type.length &&
            singleProduct[0].product_category_id.value ===
            productValue.product_category_id.value &&
            JSON.stringify(singleProduct[0].images.imageUrls) ===
            JSON.stringify(removedImage);

    const [selectedBrand] = useState(
        singleProduct && singleProduct[0]
            ? [
                {
                    label: singleProduct[0].brand_id.label,
                    value: singleProduct[0].brand_id.value,
                },
            ]
            : null
    );

    const [selectedBarcode] = useState(
        newBarcode && newBarcode[0]
            ? [
                {
                    label: newBarcode[0].label,
                    value: newBarcode[0].value,
                },
            ]
            : null
    );

    const [selectedProductCategory] = useState(
        singleProduct && singleProduct[0]
            ? [
                {
                    label: singleProduct[0].product_category_id.label,
                    value: singleProduct[0].product_category_id.value,
                },
            ]
            : null
    );

    const saleUnitOption =
        productUnits &&
        productUnits.length &&
        productUnits.map((productUnit) => {
            return {
                value: productUnit?.id,
                label: productUnit.attributes.name,
            };
        });

    useEffect(() => {
        if (singleProduct) {
            setProductValue({
                name: singleProduct ? singleProduct[0].name : "",
                code: singleProduct ? singleProduct[0].code : "",
                product_category_id: singleProduct
                    ? singleProduct[0].product_category_id
                    : "",
                brand_id: singleProduct ? singleProduct[0].brand_id : "",
                barcode_symbol: selectedBarcode,
                product_unit: singleProduct
                    ? {
                        value: productUnit[0]?.id,
                        label: productUnit[0]?.attributes.name,
                    }
                    : "",
                sale_unit: singleProduct ? singleProduct[0].sale_unit : "",
                purchase_unit: singleProduct
                    ? singleProduct[0].purchase_unit &&
                    singleProduct[0].purchase_unit
                    : "",
                stock_alert: singleProduct
                    ? singleProduct[0].stock_alert
                        ? singleProduct[0].stock_alert
                        : 0
                    : 0,
                sale_quantity_limit: singleProduct
                    ? singleProduct[0].quantity_limit
                        ? singleProduct[0].quantity_limit
                        : ""
                    : "",
                notes: singleProduct ? singleProduct[0].notes : "",
                images: singleProduct ? singleProduct[0].images : "",
                isEdit: singleProduct ? singleProduct[0].is_Edit : false,
            });
        }
    }, []);

    const onChangeFiles = (file) => {
        setMultipleFiles(file);
    };

    const transferImage = (item) => {
        setRemovedImage(item);
        setMultipleFiles([]);
    };

    const handleProductUnitChange = (obj) => {
        productUnitDropdown(obj.value);
        setIsClearDropdown(false);
        setIsDropdown(false);
        setProductValue({ ...productValue, product_unit: obj });
        setErrors({});
    };

    const handleSaleUnitChange = (obj) => {
        setIsClearDropdown(true);
        setProductValue({ ...productValue, sale_unit: obj });
        setErrors({});
    };

    const handlePurchaseUnitChange = (obj) => {
        setIsDropdown(true);
        setProductValue({ ...productValue, purchase_unit: obj });
        setErrors({});
    };

    const onBrandChange = (obj) => {
        setProductValue((productValue) => ({ ...productValue, brand_id: obj }));
        setErrors({});
    };

    const onBarcodeChange = (obj) => {
        setProductValue((productValue) => ({
            ...productValue,
            barcode_symbol: obj,
        }));
        setErrors({});
    };

    const onProductCategoryChange = (obj) => {
        setProductValue((productValue) => ({
            ...productValue,
            product_category_id: obj,
        }));
        setErrors({});
    };

    const productTypesOptionsObj = getFormattedOptions(productTypesOptions);

    // tax type dropdown functionality
    const taxTypeFilterOptions = getFormattedOptions(taxMethodOptions);

    const defaultTaxType = singleProduct
        ? singleProduct[0].tax_type === "1"
            ? {
                value: 1,
                label: getFormattedMessage("tax-type.filter.exclusive.label"),
            }
            : {
                value: 2,
                label: getFormattedMessage("tax-type.filter.inclusive.label"),
            } || singleProduct[0].tax_type === "2"
                ? {
                    value: 2,
                    label: getFormattedMessage("tax-type.filter.inclusive.label"),
                }
                : {
                    value: 1,
                    label: getFormattedMessage("tax-type.filter.exclusive.label"),
                }
        : {
            value: 1,
            label: getFormattedMessage("tax-type.filter.exclusive.label"),
        };

    const onTaxTypeChange = (obj, variation_type_id) => {
        if (variation_type_id) {
            setVariationTypesData((prev) =>
                prev.map((variationTypeData) => {
                    if (
                        variationTypeData.variation_type_id ===
                        variation_type_id
                    ) {
                        return {
                            ...variationTypeData,
                            tax_type: obj,
                        };
                    } else {
                        return variationTypeData;
                    }
                })
            );
        } else {
            setSingleProductTypeData((prev) => ({
                ...prev,
                tax_type: obj,
            }));
        }
        setErrors({});
    };

    const onProductTypeChange = (obj) => {
        setProductValue((productValue) => ({
            ...productValue,
            product_type: obj,
        }));
        if (obj.value === 2) {
            dispatch(fetchAllVariations());
        }
        setErrors({});
    };

    const onVariationChange = (obj) => {
        setProductValue((productValue) => ({
            ...productValue,
            variation: obj,
        }));
        setErrors({});
    };

    const onVariationTypesChange = (array) => {
        setProductValue((productValue) => ({
            ...productValue,
            variation_type: array,
        }));
        if (variationTypesData.length <= 0) {
            setVariationTypesData(
                array?.map((variationType) => ({
                    variation_id: productValue.variation?.value,
                    variation_type_id: variationType?.value,
                    variation_type: variationType?.label,
                    product_cost: "",
                    product_price: "",
                    stock_alert: 0,
                    order_tax: 0,
                    tax_type: "",
                    add_stock: "",
                }))
            );
        } else {
            const foundVariationTypeId = array.map((item) => item.value);
            const commonVariationTypes = variationTypesData.filter((item) =>
                foundVariationTypeId.includes(item.variation_type_id)
            );
            const commonVariationTypesIds = commonVariationTypes.map(
                (item) => item.variation_type_id
            );
            const newVariationType = array.filter(
                (variationType) =>
                    !commonVariationTypesIds.includes(variationType.value)
            );
            if (newVariationType.length > 0) {
                setVariationTypesData([
                    ...commonVariationTypes,
                    {
                        variation_id: productValue.variation?.value,
                        variation_type_id: newVariationType[0]?.value,
                        variation_type: newVariationType[0]?.label,
                        product_cost: "",
                        product_price: "",
                        stock_alert: 0,
                        order_tax: 0,
                        tax_type: "",
                        add_stock: "",
                    },
                ]);
            } else {
                setVariationTypesData(commonVariationTypes);
            }
        }

        setErrors({});
    };

    const onWarehouseChange = (obj) => {
        setProductValue((inputs) => ({ ...inputs, warehouse_id: obj }));
        setErrors({});
    };

    const onSupplierChange = (obj) => {
        setProductValue((inputs) => ({ ...inputs, supplier_id: obj }));
        setErrors({});
    };

    const onStatusChange = (obj) => {
        setProductValue((inputs) => ({ ...inputs, status_id: obj }));
    };

    const statusFilterOptions = getFormattedOptions(saleStatusOptions);
    const statusDefaultValue = statusFilterOptions.map((option) => {
        return {
            value: option.id,
            label: option.name,
        };
    });

    const validateVariationTypesData = () => {
        let invalid = true;
        let error = {};
        variationTypesData.map((variationType) => {
            if (
                Object.keys(error).length <= 0 &&
                (!variationType.product_cost ||
                    variationType.product_cost === "")
            ) {
                error[`${variationType.variation_type_id}_product_cost`] =
                    getFormattedMessage(
                        "product.input.product-cost.validate.label"
                    );
            } else if (
                Object.keys(error).length <= 0 &&
                (!variationType.product_price ||
                    variationType.product_price === "")
            ) {
                error[`${variationType.variation_type_id}_product_price`] =
                    getFormattedMessage(
                        "product.input.product-price.validate.label"
                    );
            } else if (
                Object.keys(error).length <= 0 &&
                (!variationType.tax_type || variationType.tax_type === "")
            ) {
                error[`${variationType.variation_type_id}_tax_type`] =
                    getFormattedMessage(
                        "product.input.tax-type.validate.label"
                    );
            } else if (
                Object.keys(error).length <= 0 &&
                (!variationType.add_stock || variationType.add_stock === "")
            ) {
                error[`${variationType.variation_type_id}_add_stock`] =
                    getFormattedMessage(
                        "purchase.product.quantity.validate.label"
                    );
            } else if (Object.keys(error).length <= 0 && variationType.order_tax > 100) {
                error[`${variationType.variation_type_id}_order_tax`] = getFormattedMessage('product.input.order-tax.valid.validate.label');
            }
        });

        if (Object.keys(error).length <= 0) {
            invalid = false;
        }

        // Don't Remove thi setTimeout. !!! SetTimeout is placed here because js uses synchronously and so the set function cannot wait until the map loop on the array, so by putting setTimeout the set method is made a bit slower than the loop.
        setTimeout(() => {
            setErrors(error);
        }, 0);

        return invalid;
    };

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        const codeRegex = /^[A-Z0-9]+$/;
        if (!productValue["name"] || productValue["name"].trim() === "") {
            errorss["name"] = getFormattedMessage(
                "globally.input.name.validate.label"
            );
        } else if (!productValue["code"]) {
            errorss["code"] = getFormattedMessage(
                "product.input.code.validate.label"
            );
        } else if (!productValue["product_category_id"]) {
            errorss["product_category_id"] = getFormattedMessage(
                "product.input.product-category.validate.label"
            );
        } else if (!productValue["brand_id"]) {
            errorss["brand_id"] = getFormattedMessage(
                "product.input.brand.validate.label"
            );
        } else if (!productValue["barcode_symbol"]) {
            errorss["barcode_symbol"] = getFormattedMessage(
                "product.input.barcode-symbology.validate.label"
            );
        } else if (productValue && productValue["code"] && productValue.barcode_symbol?.value == 2 && !codeRegex.test(productValue["code"])) {
            errorss["code"] = getFormattedMessage("barcode-symbol-uppercase-validation-message");
        } else if (!productValue["product_unit"]) {
            errorss["product_unit"] = getFormattedMessage(
                "product.input.product-unit.validate.label"
            );
        } else if (!productValue["sale_unit"]) {
            errorss["sale_unit"] = getFormattedMessage(
                "product.input.sale-unit.validate.label"
            );
        } else if (isClearDropdown === false) {
            errorss["sale_unit"] = getFormattedMessage(
                "product.input.sale-unit.validate.label"
            );
        } else if (!productValue["purchase_unit"]) {
            errorss["purchase_unit"] = getFormattedMessage(
                "product.input.purchase-unit.validate.label"
            );
        } else if (isDropdown === false) {
            errorss["purchase_unit"] = getFormattedMessage(
                "product.input.purchase-unit.validate.label"
            );
        } else if (
            productValue["notes"] &&
            productValue["notes"].length > 100
        ) {
            errorss["notes"] = getFormattedMessage(
                "globally.input.notes.validate.label"
            );
        } else if (productValue["isEdit"] === false) {
            if (
                productValue.product_type === "" &&
                !productValue.product_type.label
            ) {
                errorss["product_type"] = getFormattedMessage(
                    "product.type.input.validation.error"
                );
            } else if (
                productValue.product_type.value === 2 &&
                productValue.variation === "" &&
                !productValue.variation.label
            ) {
                errorss["variation"] = getFormattedMessage(
                    "variation.select.validation.error.message"
                );
            } else if (
                productValue.product_type.value === 2 &&
                productValue.variation_type === "" &&
                !productValue.variation_type.label
            ) {
                errorss["variation_type"] = getFormattedMessage(
                    "variation.type.select.validate.error.message"
                );
            } else if (
                productValue.product_type.value === 2 &&
                validateVariationTypesData()
            ) {
            } else if (
                productValue.product_type.value === 1 &&
                (!singleProductTypeData.product_cost ||
                    singleProductTypeData.product_cost === "")
            ) {
                errorss["product_cost"] = getFormattedMessage(
                    "product.input.product-cost.validate.label"
                );
            } else if (
                productValue.product_type.value === 1 &&
                (!singleProductTypeData.product_price ||
                    singleProductTypeData.product_price === "")
            ) {
                errorss["product_price"] = getFormattedMessage(
                    "product.input.product-price.validate.label"
                );
            } else if (
                productValue.product_type.value === 1 &&
                (!singleProductTypeData.tax_type ||
                    singleProductTypeData.tax_type === "")
            ) {
                errorss["tax_type"] = getFormattedMessage(
                    "product.input.tax-type.validate.label"
                );
            } else if (
                productValue.product_type.value === 1 &&
                (singleProductTypeData.order_tax &&
                    singleProductTypeData.order_tax > 100)
            ) {
                errorss["order_tax"] = getFormattedMessage('product.input.order-tax.valid.validate.label');
            } else if (!productValue["warehouse_id"]) {
                errorss["warehouse_id"] = getFormattedMessage(
                    "purchase.select.warehouse.validate.label"
                );
            } else if (
                productValue.product_type.value === 1 &&
                (!singleProductTypeData.add_stock ||
                    singleProductTypeData.add_stock === "")
            ) {
                errorss["add_stock"] = getFormattedMessage(
                    "purchase.product.quantity.validate.label"
                );
            } else if (!productValue["supplier_id"]) {
                errorss["supplier_id"] = getFormattedMessage(
                    "purchase.select.supplier.validate.label"
                );
            } else if (!productValue["status_id"]) {
                errorss["status_id"] = getFormattedMessage(
                    "globally.status.validate.label"
                );
            } else {
                isValid = true;
            }
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        const { value } = e.target;
        if (value.match(/\./g)) {
            const [, decimal] = value.split(".");
            if (decimal?.length > 2) {
                return;
            }
        }
        setProductValue((inputs) => ({ ...inputs, [e.target.name]: value }));
        setErrors({});
    };

    const onChangeVariationTypesData = (e, variation_type_id) => {
        setErrors({});
        setVariationTypesData((prev) =>
            prev.map((variationTypeData) => {
                if (variationTypeData.variation_type_id === variation_type_id) {
                    return {
                        ...variationTypeData,
                        [e.target.name]: e.target.value,
                    };
                } else {
                    return variationTypeData;
                }
            })
        );
    };

    const onSingleProductDataChange = (e) => {
        setSingleProductTypeData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setErrors({});
    };

    const showUnitModel = (val) => {
        setUnitModel(val);
    };

    const addUnitsData = (productValue) => {
        addUnit(productValue);
    };

    const prepareFormData = () => {
        const formData = new FormData();
        formData.append("name", productValue.name);
        formData.append("product_code", productValue.code);
        formData.append("product_type", productValue.product_type?.value);
        formData.append(
            "product_category_id",
            productValue.product_category_id.value
        );
        formData.append("brand_id", productValue.brand_id.value);
        if (productValue.barcode_symbol[0]) {
            formData.append(
                "barcode_symbol",
                productValue.barcode_symbol[0].value
            );
        } else {
            formData.append(
                "barcode_symbol",
                productValue.barcode_symbol.value
            );
        }
        formData.append(
            "product_unit",
            productValue.product_unit && productValue.product_unit[0]
                ? productValue.product_unit[0].value
                : productValue.product_unit.value
        );
        formData.append(
            "sale_unit",
            productValue.sale_unit && productValue.sale_unit[0]
                ? productValue.sale_unit[0].value
                : productValue.sale_unit.value
        );
        formData.append(
            "purchase_unit",
            productValue.purchase_unit && productValue.purchase_unit[0]
                ? productValue.purchase_unit[0].value
                : productValue.purchase_unit.value
        );
        formData.append(
            "quantity_limit",
            productValue.sale_quantity_limit
                ? productValue.sale_quantity_limit
                : ""
        );

        formData.append("notes", productValue.notes);
        if (productValue.isEdit === false) {
            formData.append(
                "purchase_supplier_id",
                productValue.supplier_id.value
            );
            formData.append(
                "purchase_warehouse_id",
                productValue.warehouse_id.value
            );
            formData.append(
                "purchase_date",
                moment(productValue.date).format("YYYY-MM-DD")
            );

            formData.append("purchase_status", productValue.status_id.value);

            if (productValue.product_type.value === 1) {
                formData.append("code", productValue.code);
                formData.append("product_cost", singleProductTypeData.product_cost);
                formData.append(
                    "product_price",
                    singleProductTypeData.product_price
                );
                formData.append(
                    "stock_alert",
                    singleProductTypeData.stock_alert
                        ? singleProductTypeData.stock_alert
                        : ""
                );
                formData.append(
                    "order_tax",
                    singleProductTypeData.order_tax
                        ? singleProductTypeData.order_tax
                        : ""
                );
                formData.append(
                    "tax_type",
                    singleProductTypeData.tax_type.value
                        ? singleProductTypeData.tax_type.value
                        : 1
                );
                formData.append(
                    "purchase_quantity",
                    singleProductTypeData.add_stock
                );
            } else {
                formData.append(
                    "variation_data",
                    JSON.stringify(variationTypesData.map((variationType) => ({
                        ...variationType,
                        tax_type: variationType.tax_type.value,
                        purchase_quantity: variationType.add_stock,
                        code: `${productValue.code}-${toUpper(variations
                            .filter(
                                (variation) =>
                                    variation.id ===
                                    variationType.variation_id
                            )[0]
                            ?.attributes?.variation_types.filter(
                                (vType) =>
                                    vType.id ===
                                    variationType.variation_type_id
                            )[0].name)
                            }`
                    })))
                );
            }

        }
        if (multipleFiles) {
            multipleFiles.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });
        }

        return formData;
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        productValue.images = multipleFiles;
        if (
            singleProduct &&
            valid &&
            isClearDropdown === true &&
            isDropdown === true
        ) {
            if (!disabled) {
                editMainProduct(id, prepareFormData(), navigate);
            }
        } else {
            if (valid) {
                productValue.images = multipleFiles;
                setProductValue(productValue);
                addProductData(prepareFormData());
            }
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <Form>
                    <div className="row">
                        <div className="col-xl-8">
                            <div className="card">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            {getFormattedMessage(
                                                "globally.input.name.label"
                                            )}
                                            :{" "}
                                        </label>
                                        <span className="required" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={productValue.name}
                                            placeholder={placeholderText(
                                                "globally.input.name.placeholder.label"
                                            )}
                                            className="form-control"
                                            autoFocus={true}
                                            onChange={(e) => onChangeInput(e)}
                                        />
                                        <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors["name"]
                                                ? errors["name"]
                                                : null}
                                        </span>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            {getFormattedMessage(
                                                "product.input.code.label"
                                            )}
                                            :{" "}
                                        </label>
                                        <span className="required" />
                                        <input
                                            type="text"
                                            name="code"
                                            className=" form-control"
                                            placeholder={placeholderText(
                                                "product.input.code.placeholder.label"
                                            )}
                                            onChange={(e) => onChangeInput(e)}
                                            value={productValue.code}
                                        />
                                        <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors["code"]
                                                ? errors["code"]
                                                : null}
                                        </span>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <ReactSelect
                                            title={getFormattedMessage(
                                                "product.input.product-category.label"
                                            )}
                                            placeholder={placeholderText(
                                                "product.input.product-category.placeholder.label"
                                            )}
                                            defaultValue={
                                                selectedProductCategory
                                            }
                                            value={
                                                productValue.product_category_id
                                            }
                                            data={productCategories}
                                            onChange={onProductCategoryChange}
                                            errors={
                                                errors["product_category_id"]
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <ReactSelect
                                            title={getFormattedMessage(
                                                "product.input.brand.label"
                                            )}
                                            placeholder={placeholderText(
                                                "product.input.brand.placeholder.label"
                                            )}
                                            defaultValue={selectedBrand}
                                            errors={errors["brand_id"]}
                                            data={brands}
                                            onChange={onBrandChange}
                                            value={productValue.brand_id}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <ReactSelect
                                            title={getFormattedMessage(
                                                "product.input.barcode-symbology.label"
                                            )}
                                            placeholder={placeholderText(
                                                "product.input.barcode-symbology.placeholder.label"
                                            )}
                                            defaultValue={selectedBarcode}
                                            errors={errors["barcode_symbol"]}
                                            data={barcodes}
                                            onChange={onBarcodeChange}
                                            value={productValue.barcode_symbol}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <InputGroup className="flex-nowrap dropdown-side-btn">
                                            <ReactSelect
                                                className="position-relative"
                                                title={getFormattedMessage(
                                                    "product.input.product-unit.label"
                                                )}
                                                placeholder={placeholderText(
                                                    "product.input.product-unit.placeholder.label"
                                                )}
                                                defaultValue={
                                                    productValue.product_unit
                                                }
                                                value={
                                                    productValue.product_unit
                                                }
                                                data={baseUnits}
                                                errors={errors["product_unit"]}
                                                onChange={
                                                    handleProductUnitChange
                                                }
                                            />
                                            <Button
                                                onClick={() =>
                                                    showUnitModel(true)
                                                }
                                                className="position-absolute model-dtn"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                />
                                            </Button>
                                        </InputGroup>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <ReactSelect
                                            className="position-relative"
                                            title={getFormattedMessage(
                                                "product.input.sale-unit.label"
                                            )}
                                            placeholder={placeholderText(
                                                "product.input.sale-unit.placeholder.label"
                                            )}
                                            value={
                                                isClearDropdown === false
                                                    ? ""
                                                    : productValue.sale_unit
                                            }
                                            data={saleUnitOption}
                                            errors={errors["sale_unit"]}
                                            onChange={handleSaleUnitChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <ReactSelect
                                            className="position-relative"
                                            title={getFormattedMessage(
                                                "product.input.purchase-unit.label"
                                            )}
                                            placeholder={placeholderText(
                                                "product.input.purchase-unit.placeholder.label"
                                            )}
                                            value={
                                                isDropdown === false
                                                    ? ""
                                                    : productValue.purchase_unit
                                            }
                                            data={saleUnitOption}
                                            errors={errors["purchase_unit"]}
                                            onChange={handlePurchaseUnitChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            {getFormattedMessage(
                                                "product.input.quantity-limitation.label"
                                            )}
                                            :{" "}
                                        </label>
                                        <input
                                            type="number"
                                            name="sale_quantity_limit"
                                            className="form-control"
                                            placeholder={placeholderText(
                                                "product.input.quantity-limitation.placeholder"
                                            )}
                                            onKeyPress={(event) =>
                                                decimalValidate(event)
                                            }
                                            onChange={(e) => onChangeInput(e)}
                                            value={
                                                productValue.sale_quantity_limit
                                            }
                                            min={1}
                                        />
                                        <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors["stock_alert"]
                                                ? errors["stock_alert"]
                                                : null}
                                        </span>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            {getFormattedMessage(
                                                "globally.input.notes.label"
                                            )}
                                            :{" "}
                                        </label>
                                        <textarea
                                            className="form-control"
                                            name="notes"
                                            rows={3}
                                            placeholder={placeholderText(
                                                "globally.input.notes.placeholder.label"
                                            )}
                                            onChange={(e) => onChangeInput(e)}
                                            value={
                                                productValue.notes
                                                    ? productValue.notes ===
                                                        "null"
                                                        ? ""
                                                        : productValue.notes
                                                    : ""
                                            }
                                        />
                                        <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors["notes"]
                                                ? errors["notes"]
                                                : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="card">
                                <label className="form-label">
                                    {getFormattedMessage(
                                        "product.input.multiple-image.label"
                                    )}
                                    :{" "}
                                </label>
                                <MultipleImage
                                    product={singleProduct}
                                    fetchFiles={onChangeFiles}
                                    transferImage={transferImage}
                                />
                            </div>
                            {singleProduct ? (
                                ""
                            ) : (
                                <div>
                                    <div className="col-md-12 mb-3">
                                        <h1 className={"text-center"}>
                                            {getFormattedMessage(
                                                "add-stock.title"
                                            )}{" "}
                                            :{" "}
                                        </h1>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <ReactSelect
                                            data={warehouses}
                                            onChange={onWarehouseChange}
                                            defaultValue={
                                                productValue.warehouse_id
                                            }
                                            isWarehouseDisable={true}
                                            title={getFormattedMessage(
                                                "warehouse.title"
                                            )}
                                            errors={errors["warehouse_id"]}
                                            placeholder={placeholderText(
                                                "purchase.select.warehouse.placeholder.label"
                                            )}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <ReactSelect
                                            data={suppliers}
                                            onChange={onSupplierChange}
                                            defaultValue={
                                                productValue.supplier_id
                                            }
                                            title={getFormattedMessage(
                                                "supplier.title"
                                            )}
                                            errors={errors["supplier_id"]}
                                            placeholder={placeholderText(
                                                "purchase.select.supplier.placeholder.label"
                                            )}
                                        />
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <ReactSelect
                                            multiLanguageOption={
                                                statusFilterOptions
                                            }
                                            onChange={onStatusChange}
                                            name="status"
                                            title={getFormattedMessage(
                                                "purchase.select.status.label"
                                            )}
                                            value={productValue.status_id}
                                            errors={errors["status_id"]}
                                            defaultValue={statusDefaultValue[0]}
                                            placeholder={getFormattedMessage(
                                                "purchase.select.status.label"
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        {!singleProduct && (
                            <div className="row border-top pt-4">
                                <div className="col-md-4 mb-3">
                                    {!singleProduct ?
                                        <ReactSelect
                                            title={getFormattedMessage(
                                                "product.type.label"
                                            )}
                                            multiLanguageOption={productTypesOptionsObj}
                                            onChange={onProductTypeChange}
                                            value={
                                                productValue.product_type
                                            }
                                            errors={errors["product_type"]}
                                            placeholder={placeholderText(
                                                "product.type.placeholder.label"
                                            )}
                                        />
                                        : (
                                            <>
                                                <label className="form-label">
                                                    {getFormattedMessage(
                                                        "product.type.label"
                                                    )}
                                                </label>
                                                <input type="text" className="form-control" value={productValue.product_type.label} disabled />
                                            </>
                                        )
                                    }
                                </div>
                                {typeof productValue.product_type !== "string" &&
                                    productValue.product_type?.value === 2 && (!singleProduct ?
                                        (
                                            <div className="col-md-4 mb-3">
                                                <ReactSelect
                                                    title={getFormattedMessage(
                                                        "variations.title"
                                                    )}
                                                    value={productValue.variation}
                                                    multiLanguageOption={
                                                        variationsOptions
                                                    }
                                                    onChange={onVariationChange}
                                                    errors={errors["variation"]}
                                                />
                                            </div>
                                        ) : (
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label">
                                                    {getFormattedMessage(
                                                        "variations.title"
                                                    )}
                                                </label>
                                                <input type="text" className="form-control" value={productValue.variation.label} disabled />
                                            </div>
                                        ))}
                                {typeof productValue.product_type !== "string" &&
                                    productValue.product_type?.value === 2 &&
                                    typeof productValue.variation !== "string" && (
                                        <div className="col-md-4 mb-3">
                                            <ReactMultiSelect
                                                title={getFormattedMessage(
                                                    "variation.variation_types"
                                                )}
                                                value={productValue.variation_type}
                                                option={variationTypesOptions}
                                                onChange={onVariationTypesChange}
                                                errors={errors["variation_type"]}
                                            />
                                        </div>
                                    )}
                            </div>
                        )}
                        {typeof productValue.product_type !== "string" && !singleProduct &&
                            productValue.product_type?.value === 1 ? (
                            <div className="row border-top pt-3">
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
                                                onSingleProductDataChange(e)
                                            }
                                            value={
                                                singleProductTypeData.product_cost
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
                                                onSingleProductDataChange(e)
                                            }
                                            value={
                                                singleProductTypeData.product_price
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
                                            onSingleProductDataChange(e)
                                        }
                                        value={
                                            singleProductTypeData.stock_alert
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
                                                onSingleProductDataChange(e)
                                            }
                                            min={0}
                                            pattern="[0-9]*"
                                            value={
                                                singleProductTypeData.order_tax
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
                                        value={singleProductTypeData.tax_type}
                                        onChange={(data) =>
                                            onTaxTypeChange(data)
                                        }
                                        errors={errors["tax_type"]}
                                        defaultValue={defaultTaxType}
                                        placeholder={placeholderText(
                                            "product.input.tax-type.placeholder.label"
                                        )}
                                    />
                                </div>
                                {!singleProduct &&
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">
                                            {getFormattedMessage(
                                                "product-quantity.add.title"
                                            )}
                                            :
                                        </label>
                                        <span className="required" />
                                        <input
                                            type="number"
                                            name="add_stock"
                                            className="form-control"
                                            placeholder={placeholderText(
                                                "product-quantity.add.title"
                                            )}
                                            onKeyPress={(event) =>
                                                decimalValidate(event)
                                            }
                                            onChange={(e) =>
                                                onSingleProductDataChange(e)
                                            }
                                            value={singleProductTypeData.add_stock}
                                            min={1}
                                        />
                                        <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors["add_stock"]
                                                ? errors["add_stock"]
                                                : null}
                                        </span>
                                    </div>
                                }
                            </div>
                        ) : (
                            productValue.product_type?.value === 2 &&
                            typeof productValue.variation !== "string" &&
                            typeof productValue.variation_type !== "string" &&
                            variationTypesData?.map((variation) => (
                                <div
                                    className="row border-top pt-3"
                                    key={variation.variation_type_id}
                                >
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">
                                            {getFormattedMessage(
                                                "variation.type.title"
                                            )}
                                            :
                                        </label>
                                        <input
                                            type="text"
                                            name="variation_type"
                                            className="form-control"
                                            value={variation.variation_type}
                                            disabled
                                            readOnly
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
                                                    onChangeVariationTypesData(
                                                        e,
                                                        variation.variation_type_id
                                                    )
                                                }
                                                value={variation.product_cost}
                                            />
                                            <InputGroup.Text>
                                                {frontSetting.value &&
                                                    frontSetting.value
                                                        .currency_symbol}
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors[
                                                `${variation.variation_type_id}_product_cost`
                                            ]
                                                ? errors[
                                                `${variation.variation_type_id}_product_cost`
                                                ]
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
                                                    onChangeVariationTypesData(
                                                        e,
                                                        variation.variation_type_id
                                                    )
                                                }
                                                value={variation.product_price}
                                            />
                                            <InputGroup.Text>
                                                {frontSetting.value &&
                                                    frontSetting.value
                                                        .currency_symbol}
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors[
                                                `${variation.variation_type_id}_product_price`
                                            ]
                                                ? errors[
                                                `${variation.variation_type_id}_product_price`
                                                ]
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
                                                onChangeVariationTypesData(
                                                    e,
                                                    variation.variation_type_id
                                                )
                                            }
                                            value={variation.stock_alert}
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
                                                    onChangeVariationTypesData(
                                                        e,
                                                        variation.variation_type_id
                                                    )
                                                }
                                                min={0}
                                                pattern="[0-9]*"
                                                value={variation.order_tax}
                                            />
                                            <InputGroup.Text>%</InputGroup.Text>
                                        </InputGroup>
                                        <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors[
                                                `${variation.variation_type_id}_order_tax`
                                            ]
                                                ? errors[
                                                `${variation.variation_type_id}_order_tax`
                                                ]
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
                                            value={variation.tax_type}
                                            onChange={(data) =>
                                                onTaxTypeChange(
                                                    data,
                                                    variation.variation_type_id
                                                )
                                            }
                                            errors={
                                                errors[
                                                `${variation.variation_type_id}_tax_type`
                                                ]
                                            }
                                            defaultValue={defaultTaxType}
                                            placeholder={placeholderText(
                                                "product.input.tax-type.placeholder.label"
                                            )}
                                        />
                                    </div>
                                    {!singleProduct &&
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">
                                                {getFormattedMessage(
                                                    "product-quantity.add.title"
                                                )}
                                                :
                                            </label>
                                            <span className="required" />
                                            <input
                                                type="number"
                                                name="add_stock"
                                                className="form-control"
                                                placeholder={placeholderText(
                                                    "product-quantity.add.title"
                                                )}
                                                onKeyPress={(event) =>
                                                    decimalValidate(event)
                                                }
                                                onChange={(e) =>
                                                    onChangeVariationTypesData(
                                                        e,
                                                        variation.variation_type_id
                                                    )
                                                }
                                                value={variation.add_stock}
                                                min={1}
                                            />
                                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                                {errors[
                                                    `${variation.variation_type_id}_add_stock`
                                                ]
                                                    ? errors[
                                                    `${variation.variation_type_id}_add_stock`
                                                    ]
                                                    : null}
                                            </span>
                                        </div>
                                    }
                                </div>
                            ))
                        )}

                        <ModelFooter
                            onEditRecord={singleProduct}
                            onSubmit={onSubmit}
                            editDisabled={disabled}
                            link="/app/products"
                            addDisabled={!productValue.name}
                        />
                    </div>
                </Form>
            </div>
            {unitModel && (
                <UnitsForm
                    addProductData={addUnitsData}
                    product_unit={productValue.product_unit}
                    title={getFormattedMessage("unit.create.title")}
                    show={unitModel}
                    hide={setUnitModel}
                />
            )}
        </div>
    );
};
const mapStateToProps = (state) => {
    const {
        brands,
        productCategories,
        units,
        totalRecord,
        suppliers,
        warehouses,
        productUnits,
        frontSetting,
    } = state;
    return {
        brands,
        productCategories,
        units,
        totalRecord,
        suppliers,
        warehouses,
        productUnits,
        frontSetting,
    };
};

export default connect(mapStateToProps, {
    fetchProduct,
    editMainProduct,
    fetchAllBrands,
    fetchAllProductCategories,
    fetchUnits,
    productUnitDropdown,
    fetchAllWarehouses,
    fetchAllSuppliers,
    addUnit,
})(ProductForm);
