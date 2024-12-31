import React from "react";
import { Form } from "react-bootstrap-v5";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getFormattedMessage } from "../sharedMethod";

const animatedComponents = makeAnimated();

const ReactMultiSelect = ({
    title,
    isRequired,
    placeholder,
    value = null,
    defaultValue = null,
    onChange,
    errors = "",
    option,
}) => {
    return (
        <Form.Group className="form-group w-100" controlId="formBasic">
            {title ? <Form.Label>{title} :</Form.Label> : ""}
            {isRequired ? "" : <span className="required" />}
            <Select
                placeholder={placeholder}
                components={animatedComponents}
                isMulti
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                options={option}
                noOptionsMessage={() => getFormattedMessage("no-option.label")}
            />
            {errors ? (
                <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors ? errors : null}
                </span>
            ) : null}
        </Form.Group>
    );
};

export default ReactMultiSelect;
