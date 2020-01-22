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

export function dateInput(size, name, value, setter) {
    return (
        <Form.Group as={Col} sm={size}>
            <Form.Label>{name}</Form.Label>
            <Form.Control
                value={value}
                onChange={event => setter(event.target.value)}
                type={"date"}
            />
        </Form.Group>);
}

export function timeInput(size, name, value, setter) {
    return (
        <Form.Group as={Col} sm={size}>
            <Form.Label>{name}</Form.Label>
            <Form.Control
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
                    {React.Children.toArray(children).filter(
                        child =>
                            !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    },
);

export async function toBase64(file) {
    return new Promise((resolve, reject) => {
        if (file === "") {
            resolve(null);
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        }
    });
}