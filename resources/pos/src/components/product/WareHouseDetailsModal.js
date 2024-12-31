import React, { useEffect, useState } from "react";
import { Image, Modal, Table } from "react-bootstrap-v5";
import { getFormattedMessage } from "../../shared/sharedMethod";

const WareHouseDetailsModal = (props) => {

    const { show, productData, setShow } = props;
    const [warehouse, setWarehouse] = useState([]);
    const [product, setProduct] = useState([]);

    useEffect(() => {
        if (show) {
            const warehouse =
                productData &&
                productData.warehouse &&
                productData.warehouse.map((item) => item);
            setWarehouse(warehouse);
            setProduct(productData);
        }
    }, [show]);

    const clearField = () => {
        setShow(false);
    }

    return <Modal show={show} size="xl"
        onHide={clearField}
        keyboard={true}
    >
        <Modal.Header closeButton>
            <Modal.Title>{getFormattedMessage("products.warehouse.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="col-md-12">
                <div className="text-center">
                    <Image
                        src={
                            product &&
                            product.barcode_url
                        }
                        alt={
                            product &&
                            product.name
                        }
                        className="product_brcode"
                    />
                    <div className="mt-3">
                        {product &&
                            product.code}
                    </div>
                </div>
            </div>

            <div className="mt-2">
                <div>
                    <Table responsive="md">
                        <thead>
                            <tr>
                                <th>
                                    {getFormattedMessage(
                                        "dashboard.stockAlert.warehouse.label"
                                    )}
                                </th>
                                <th>
                                    {getFormattedMessage(
                                        "dashboard.stockAlert.quantity.label"
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {warehouse && warehouse.length ? (
                                warehouse.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="py-4">
                                                {item.name}
                                            </td>
                                            <td className="py-4">
                                                <div>
                                                    <div className="badge bg-light-info me-2">
                                                        <span>
                                                            {
                                                                item.total_quantity
                                                            }
                                                        </span>
                                                    </div>
                                                    {(product.product_unit ===
                                                        "1" && (
                                                            <span className="badge bg-light-success me-2">
                                                                <span>
                                                                    {getFormattedMessage(
                                                                        "unit.filter.piece.label"
                                                                    )}
                                                                </span>
                                                            </span>
                                                        )) ||
                                                        (product.product_unit ===
                                                            "2" && (
                                                                <span className="badge bg-light-primary me-2">
                                                                    <span>
                                                                        {getFormattedMessage(
                                                                            "unit.filter.meter.label"
                                                                        )}
                                                                    </span>
                                                                </span>
                                                            )) ||
                                                        (product.product_unit ===
                                                            "3" && (
                                                                <span className="badge bg-light-warning me-2">
                                                                    <span>
                                                                        {getFormattedMessage(
                                                                            "unit.filter.kilogram.label"
                                                                        )}
                                                                    </span>
                                                                </span>
                                                            ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })) :
                                <tr>
                                    <td colSpan="2" className="text-center">
                                        {getFormattedMessage(
                                            "react-data-table.no-record-found.label"
                                        )}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        </Modal.Body>
    </Modal>;
}

export default WareHouseDetailsModal;
