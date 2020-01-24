import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import React from "react";
import FormControl from "react-bootstrap/FormControl";

export function inputField(size, name, placeholder, value, setter) {
    return (
        <Form.Group as={Col} sm={size}>
            <Form.Label>{name}</Form.Label>
            <Form.Control
                placeholder={placeholder}
                value={value}
                onChange={event => setter(event.target.value)}
            />
        </Form.Group>
    );
}

export function textField(size, name, placeholder, value, setter) {
    return (
        <Form.Group as={Col} sm={size}>
            <Form.Label>{name}</Form.Label>
            <Form.Control
                placeholder={placeholder}
                as="textarea"
                rows="8"
                value={value}
                onChange={event => setter(event.target.value)}
            />
        </Form.Group>);
}

// dateinput for from-date
export function minDateInput(size, name, value, minDate, maxDate, setter) {
    return (
        <Form.Group as={Col} sm={size}>
            <Form.Label>{name}</Form.Label>
            <Form.Control
                max={maxDate}
                min={minDate}
                value={value}
                onChange={event => setter(event.target.value)}
                type={"date"}
            />
        </Form.Group>);
}

// dateinput for to-date
export function maxDateInput(size, name, value, minDate, setter) {
    return (
        <Form.Group as={Col} sm={size}>
            <Form.Label>{name}</Form.Label>
            <Form.Control
                min={minDate}
                value={value}
                onChange={event => setter(event.target.value)}
                type={"date"}
            />
        </Form.Group>);
}

// timeinput for from-time
export function fromTimeInput(size, name, value, maxTime, setter) {
    return (
        <Form.Group as={Col} sm={size}>
            <Form.Label>{name}</Form.Label>
            <Form.Control
                max={maxTime}
                value={value}
                onChange={event => setter(event.target.value)}
                type={"time"}

            />
        </Form.Group>);
}

// time input for to-time
export function toTimeInput(size, name, value, minTime, setter) {
    return (
        <Form.Group as={Col} sm={size}>
            <Form.Label>{name}</Form.Label>
            <Form.Control
                min={minTime}
                value={value}
                onChange={event => setter(event.target.value)}
                type={"time"}

            />
        </Form.Group>);
}

export const CustomMenu = React.forwardRef(
    ({children, style, className, 'aria-labelledby': labeledBy}, ref) => {
        const [value, setValue] = React.useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={e => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled">
                    {
                        React.Children.toArray(children).filter(
                            child =>
                                !value || child.props.children.toLowerCase().startsWith(value.toLowerCase()),
                        )}
                </ul>
            </div>
        );
    },
);