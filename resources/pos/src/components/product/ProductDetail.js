import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Image, Table } from "react-bootstrap-v5";
import { useParams } from "react-router-dom";
import Carousel from "react-elastic-carousel";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import { fetchMainProduct } from "../../store/action/productAction";
import HeaderTitle from "../header/HeaderTitle";
import user from "../../assets/images/brand_logo.png";
import {
    getFormattedMessage,
    placeholderText,
    currencySymbolHandling,
} from "../../shared/sharedMethod";
import Spinner from "../../shared/components/loaders/Spinner";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import WareHouseDetailsModal from "./WareHouseDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import EditSubProductModal from "./EditSubProductModal";
import DeleteProduct from "./DeleteProduct";
import CreateSubProductModal from "./CreateSubProductModal";

const ProductDetail = (props) => {
    const { products, fetchMainProduct, isLoading, frontSetting, allConfigData } =
        props;
    const { id } = useParams();
    const result =
        products &&
        products.reduce((obj, cur) => ({ ...obj, [cur.type]: cur }), {});
    const product = result.products;

    const [showWarehouseModal, setShowWarehouseModal] = useState(false);
    const [showEditSubProductModal, setShowEditSubProductModal] = useState(false);
    const [showCreateSubProductModal, setShowCreateSubProductModal] = useState(false);
    const [productData, setProductData] = useState({});
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);

    useEffect(() => {
        fetchMainProduct(id);
    }, []);

    const sliderImage =
        product &&
        product.attributes &&
        product.attributes.images.imageUrls &&
        product.attributes.images.imageUrls.map((img) => img);
    const allProducts = product && product.attributes && product.attributes.products && product.attributes.products.map((item) => item);

    const commonDataForNewProduct = {
        name: allProducts && allProducts[0].name,
        product_code: allProducts && allProducts[0].product_code,
        product_type: allProducts && product.attributes.product_type,
        barcode_symbol: allProducts && allProducts[0].barcode_symbol,
        product_category_id: allProducts && allProducts[0].product_category_id,
        brand_id: allProducts && allProducts[0].brand_id,
        product_unit: allProducts && allProducts[0].product_unit,
        sale_unit: allProducts && allProducts[0].sale_unit,
        purchase_unit: allProducts && allProducts[0].purchase_unit,
        quantity_limit: allProducts && allProducts[0].quantity_limit,
        notes: allProducts && allProducts[0].notes,
        main_product_id: product && product.id,
        variation: product && product?.attributes?.variation,
        variationTypes: product && product?.attributes?.variation?.variation_types.filter(variationType => !product?.attributes?.variation_types.some(productVariationType => variationType.id === productVariationType.id && variationType.name === productVariationType.name)),
    }

    const openWareHouseDetailModal = (data) => {
        setShowWarehouseModal(true);
        setProductData(data);
    }

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const openEditSubProductModal = (data) => {
        setProductData(data);
        setShowEditSubProductModal(true);
    }

    const openCreateSubProductModal = () => {
        setProductData(commonDataForNewProduct);
        setShowCreateSubProductModal(true);
    }

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle
                title={getFormattedMessage("product.product-details.title")}
                to="/app/products"
            />
            <TabTitle
                title={placeholderText("product.product-details.title")}
            />
            <div className="card card-body">
                <div className="row">
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <>

                            <div className="col-xxl-7">
                                <table className="table table-responsive gy-7 main-product-details">
                                    <tbody>
                                        <tr>
                                            <th className="py-4" scope="row">
                                                {getFormattedMessage(
                                                    "product.product-details.code-product.label"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {product &&
                                                    product.attributes &&
                                                    product.attributes.code}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="py-4" scope="row">
                                                {getFormattedMessage(
                                                    "product.title"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {product &&
                                                    product.attributes &&
                                                    product.attributes.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="py-4" scope="row">
                                                {getFormattedMessage(
                                                    "product.type.label"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {product &&
                                                    product.attributes &&
                                                    product.attributes.product_type == 1 ? getFormattedMessage('products.type.single-type.label') : getFormattedMessage('variation.title')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                {getFormattedMessage(
                                                    "product.product-details.category.label"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {allProducts && allProducts[0].product_category_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                {getFormattedMessage(
                                                    "product.input.brand.label"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {allProducts && allProducts[0].brand_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                {getFormattedMessage(
                                                    "product.product-details.unit.label"
                                                )}
                                            </th>
                                            <td className="py-4">
                                                {allProducts && allProducts[0].product_unit_name && (
                                                    <span className="badge bg-light-success">
                                                        <span>
                                                            {
                                                                allProducts && allProducts[0].product_unit_name
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </span>
                                                )}
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <div className="col-xxl-5 d-flex justify-content-center m-auto">
                                {sliderImage && sliderImage.length !== 0 ? (
                                    <Carousel>
                                        {sliderImage.length !== 0 &&
                                            sliderImage.map((img, i) => {
                                                return (
                                                    <div key={i}>
                                                        <Image
                                                            src={img}
                                                            width="413px"
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </Carousel>
                                ) : (
                                    <div>
                                        <Image src={user} width="413px" />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {allProducts && allProducts.length !== 0 && <div className="card card-body mt-2">
                {product.attributes.product_type == 2 && commonDataForNewProduct.variationTypes.length !== 0 &&
                    <div className="text-end mb-2 ">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={openCreateSubProductModal}
                            className="btn-light-primary"
                        >
                            {getFormattedMessage("product.create.title")}
                        </Button>
                    </div>
                }
                <div>
                    <Table responsive="md">
                        <thead>
                            <tr>
                                {product.attributes.product_type == 2 &&
                                    <th>
                                        {getFormattedMessage(
                                            "variations.title"
                                        )}
                                    </th>
                                }
                                <th>
                                    {getFormattedMessage(
                                        "product.product-details.cost.label"
                                    )}
                                </th>
                                <th>
                                    {getFormattedMessage(
                                        "product.table.price.column.label"
                                    )}
                                </th>

                                <th>
                                    {getFormattedMessage(
                                        "product.product-details.tax.label"
                                    )}
                                </th>
                                <th>
                                    {getFormattedMessage(
                                        "product.input.stock-alert.label"
                                    )}
                                </th>
                                <th className="text-center">
                                    {getFormattedMessage(
                                        "react-data-table.action.column.label"
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProducts && allProducts.map((data, index) =>

                                <tr key={index}>
                                    {product.attributes.product_type == 2 &&
                                        <td className="py-4">
                                            {`${data.variation_product.variation_name}(${data.variation_product.variation_type_name})`}
                                        </td>
                                    }
                                    <td className="py-4">
                                        {currencySymbolHandling(
                                            allConfigData,
                                            frontSetting.value &&
                                            frontSetting.value
                                                .currency_symbol,
                                            data.product_cost
                                        )}
                                    </td>
                                    <td className="py-4">
                                        {currencySymbolHandling(
                                            allConfigData,
                                            frontSetting.value &&
                                            frontSetting.value
                                                .currency_symbol,
                                            data.product_price
                                        )}
                                    </td>

                                    <td className="py-4">
                                        {data.order_tax
                                            ? data.order_tax
                                            : 0}
                                        %
                                    </td>
                                    <td className="py-4">
                                        {data.stock_alert}
                                    </td>
                                    <td className="py-4">
                                        <div className="text-center">
                                            <button title={placeholderText('globally.view.tooltip.label')}
                                                className='btn text-success px-2 fs-3 ps-0 border-0'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openWareHouseDetailModal(data)
                                                }}>
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button title={placeholderText('globally.view.tooltip.label')}
                                                className='btn text-primary px-2 fs-3 ps-0 border-0'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditSubProductModal(data)
                                                }}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            {product.attributes.product_type == 2 && allProducts.length > 1 &&
                                                <button title={placeholderText('globally.delete.tooltip.label')}
                                                    className='btn text-danger px-2 fs-3 ps-0 border-0'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onClickDeleteModel(data);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <DeleteProduct
                        onClickDeleteModel={onClickDeleteModel}
                        deleteModel={deleteModel}
                        onDelete={isDelete}
                    />
                    <CreateSubProductModal show={showCreateSubProductModal} setShow={setShowCreateSubProductModal} commonData={commonDataForNewProduct} />
                    <EditSubProductModal show={showEditSubProductModal} setShow={setShowEditSubProductModal} productData={productData} />
                    <WareHouseDetailsModal show={showWarehouseModal} productData={productData} setShow={setShowWarehouseModal} />
                </div>
            </div>}
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { products, isLoading, frontSetting, allConfigData } = state;
    return { products, isLoading, frontSetting, allConfigData };
};

export default connect(mapStateToProps, { fetchMainProduct })(ProductDetail);
