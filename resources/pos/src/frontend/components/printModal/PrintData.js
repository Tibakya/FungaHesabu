import React from "react";
import { Table, Image } from "react-bootstrap-v5";
import { calculateProductCost } from "../../shared/SharedMethod";
import "../../../assets/scss/frontend/pdf.scss";
import {
    currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
class PrintData extends React.PureComponent {
    render() {
        const paymentPrint = this.props.updateProducts;
        const allConfigData = this.props.allConfigData;
        const paymentType = this.props.paymentType;
        const currency =
            paymentPrint.settings &&
            paymentPrint.settings.attributes &&
            paymentPrint.settings.attributes.currency_symbol;
        return (
            <div
                className="print-data"
                style={{
                    padding: "none !important",
                }}
            >
                <div className="mt-4 mb-4 text-black text-center">
                    {paymentPrint.settings &&
                    paymentPrint.settings.attributes.show_logo_in_receipt ===
                        "1" ? (
                        <img
                            src={
                                paymentPrint.frontSetting &&
                                paymentPrint.frontSetting.value.logo
                            }
                            alt=""
                            width="100px"
                        />
                    ) : (
                        ""
                    )}
                </div>
                <div
                    className="mt-4 mb-4 text-black text-center"
                    style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        marginBottom: "15px !important",
                    }}
                >
                    {paymentPrint.frontSetting &&
                        paymentPrint.frontSetting.value.company_name}
                </div>

                <section className="product-border">
                    <div
                        style={{
                            marginBottom: "4px",
                        }}
                    >
                        <span className="fw-bold me-2">
                            {getFormattedMessage(
                                "react-data-table.date.column.label"
                            )}
                            :
                        </span>
                        <span>
                            {getFormattedDate(
                                new Date(),
                                allConfigData && allConfigData
                            )}
                        </span>
                    </div>
                    <div
                        style={{
                            marginBottom: "4px",
                        }}
                    >
                        <span className="fw-bold me-2">
                            {getFormattedMessage(
                                "supplier.table.address.column.title"
                            )}
                            :
                        </span>
                        <span>
                            {paymentPrint.frontSetting &&
                                paymentPrint.frontSetting.value.address}
                        </span>
                    </div>
                    <div
                        style={{
                            marginBottom: "4px",
                        }}
                    >
                        <span className="fw-bold me-2">
                            {getFormattedMessage("globally.input.email.label")}:
                        </span>
                        <span>
                            {paymentPrint.frontSetting &&
                                paymentPrint.frontSetting.value.email}
                        </span>
                    </div>
                    <div
                        style={{
                            marginBottom: "4px",
                        }}
                    >
                        <span className="fw-bold me-2">
                            {getFormattedMessage("pos-sale.detail.Phone.info")}:
                        </span>
                        <span>
                            {paymentPrint.frontSetting &&
                                paymentPrint.frontSetting.value.phone}
                        </span>
                    </div>
                    <div style={{}}>
                        <span className="fw-bold me-2">
                            {getFormattedMessage(
                                "dashboard.recentSales.customer.label"
                            )}
                            :
                        </span>
                        <span>
                            {paymentPrint.customer_name &&
                            paymentPrint.customer_name[0]
                                ? paymentPrint.customer_name[0].label
                                : paymentPrint.customer_name &&
                                  paymentPrint.customer_name.label}
                        </span>
                    </div>
                </section>

                <section className="mt-3">
                    {paymentPrint.products &&
                        paymentPrint.products.map((productName, index) => {
                            return (
                                <div key={index + 1}>
                                    <div className="p-0">
                                        {productName.name}{" "}
                                        <span>({productName.code})</span>
                                    </div>
                                    <div className="product-border">
                                        <div className="border-0 d-flex justify-content-between">
                                            <span className="text-black">
                                                {productName.quantity.toFixed(
                                                    2
                                                )}{" "}
                                                {(productName.product_unit ===
                                                    "3" &&
                                                    "Kg") ||
                                                    (productName.product_unit ===
                                                        "1" &&
                                                        "Pc") ||
                                                    (productName.product_unit ===
                                                        "2" &&
                                                        "M")}{" "}
                                                X{" "}
                                                {calculateProductCost(
                                                    productName
                                                ).toFixed(2)}
                                            </span>
                                            <span className="text-end">
                                                {currencySymbolHandling(
                                                    allConfigData,
                                                    currency,
                                                    productName.quantity *
                                                        calculateProductCost(
                                                            productName
                                                        )
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </section>

                <section className="mt-3 product-border">
                    <div className="d-flex">
                        <div
                            style={{
                                fontWeight: "500",
                                color: "#000000",
                            }}
                        >
                            {getFormattedMessage("pos-total-amount.title")}:
                        </div>
                        <div className="text-end ms-auto">
                            {currencySymbolHandling(
                                allConfigData,
                                currency,
                                paymentPrint.subTotal
                                    ? paymentPrint.subTotal
                                    : "0.00"
                            )}
                        </div>
                    </div>
                    <div className="d-flex">
                        <div
                            style={{
                                fontWeight: "500",
                                color: "#000000",
                            }}
                        >
                            {getFormattedMessage("globally.detail.order.tax")}:{" "}
                            {Number(paymentPrint.tax) > 0
                                ? paymentPrint
                                    ? `(${Number(paymentPrint.tax).toFixed(
                                          2
                                      )}%)`
                                    : "(0.00%)"
                                : null}
                        </div>
                        <div className="text-end ms-auto">
                            {currencySymbolHandling(
                                allConfigData,
                                currency,
                                paymentPrint.taxTotal
                                    ? paymentPrint.taxTotal
                                    : "0.00"
                            )}
                        </div>
                    </div>
                    <div className="d-flex">
                        <div
                            style={{
                                fontWeight: "500",
                                color: "#000000",
                            }}
                        >
                            {getFormattedMessage("globally.detail.discount")}:
                        </div>
                        <div className="text-end ms-auto">
                            {currencySymbolHandling(
                                allConfigData,
                                currency,
                                paymentPrint ? paymentPrint.discount : "0.00"
                            )}
                        </div>
                    </div>
                    <div className="d-flex">
                        <div
                            style={{
                                fontWeight: "500",
                                color: "#000000",
                            }}
                        >
                            {getFormattedMessage("globally.detail.shipping")}:
                        </div>
                        <div className="text-end ms-auto">
                            {currencySymbolHandling(
                                allConfigData,
                                currency,
                                paymentPrint ? paymentPrint.shipping : "0.00"
                            )}
                        </div>
                    </div>
                    <div className="d-flex">
                        <div
                            style={{
                                fontWeight: "500",
                                color: "#000000",
                            }}
                        >
                            {getFormattedMessage("globally.detail.grand.total")}
                            :
                        </div>
                        <div className="text-end ms-auto">
                            {currencySymbolHandling(
                                allConfigData,
                                currency,
                                paymentPrint.grandTotal
                            )}
                        </div>
                    </div>
                </section>

                <Table
                    style={{
                        padding: "none !important",
                        marginTop: "20px !important",
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                padding: "none !important",
                            }}
                        >
                            <th
                                className="fw-bold"
                                style={{
                                    textAlign: "start",
                                    padding: "8px 15px",

                                    color: "#000000",
                                }}
                            >
                                {getFormattedMessage(
                                    "pos-sale.detail.Paid-bt.title"
                                )}
                            </th>
                            <th
                                className="fw-bold"
                                style={{
                                    textAlign: "center",
                                    padding: "8px 15px",

                                    color: "#000000",
                                }}
                            >
                                {getFormattedMessage(
                                    "expense.input.amount.label"
                                )}
                            </th>
                            <th
                                className="fw-bold"
                                style={{
                                    textAlign: "end",
                                    padding: "8px 15px",

                                    color: "#000000",
                                }}
                            >
                                {getFormattedMessage("pos.change-return.label")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            style={{
                                padding: "none !important",
                            }}
                        >
                            <td
                                style={{
                                    padding: "8px 15px",
                                    color: "#000000",
                                }}
                            >
                                {paymentType}
                            </td>
                            <td
                                style={{
                                    textAlign: "center",
                                    padding: "8px 15px",
                                    color: "#000000",
                                }}
                            >
                                {currencySymbolHandling(
                                    allConfigData,
                                    currency,
                                    paymentPrint.grandTotal
                                )}
                            </td>
                            <td
                                style={{
                                    textAlign: "end",
                                    padding: "8px 15px",
                                    color: "#000000",
                                }}
                            >
                                {currencySymbolHandling(
                                    allConfigData,
                                    currency,
                                    paymentPrint.changeReturn
                                )}
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {/*note section*/}
                {paymentPrint && paymentPrint.note ? (
                    <Table>
                        <tbody>
                            <tr
                                style={{
                                    border: "0",
                                }}
                            >
                                <td
                                    scope="row"
                                    style={{
                                        padding: "none !important",
                                        fontSize: "15px",
                                    }}
                                >
                                    <span
                                        style={{
                                            padding: "none !important",
                                            fontSize: "15px",
                                            verticalAlign: "top",
                                            display: "inline-block",
                                            color: "#000000",
                                        }}
                                    >
                                        {getFormattedMessage(
                                            "globally.input.notes.label"
                                        )}{" "}
                                        :
                                    </span>
                                    <p
                                        style={{
                                            fontSize: "15px",
                                            verticalAlign: "top",
                                            display: "inline-block",
                                            padding: "none !important",
                                            color: "#000000",
                                        }}
                                    >
                                        {paymentPrint && paymentPrint.note}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                ) : (
                    ""
                )}
                <h3
                    style={{
                        textAlign: "center",
                        color: "#000000",
                        padding: "none !important",
                    }}
                >
                    {getFormattedMessage("pos-thank.you-slip.invoice")}.
                </h3>
                <div className="text-center d-block">
                    <Image
                        src={paymentPrint && paymentPrint.barcode_url}
                        alt={paymentPrint && paymentPrint.reference_code}
                        height={25}
                        width={100}
                    />
                    <span
                        className="d-block"
                        style={{
                            color: "#000000",
                            padding: "none !important",
                        }}
                    >
                        {paymentPrint && paymentPrint.reference_code}
                    </span>
                </div>
            </div>
        );
    }
}

export default PrintData;
