import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import Button from "react-bootstrap/esm/Button"
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FloatingLabel from "react-bootstrap/esm/FloatingLabel"


export function PasswordRule() {
    return (
        <ol className="mt-2 small">
            <li>Minimum length: 8 characters</li>
            <li>At least one uppercase letter (A-Z)</li>
            <li>At least one lowercase letter (a-z)</li>
            <li>At least one digit (0-9)</li>
            <li>At least one special character from: {" !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"}</li>
        </ol>
    );
}



const FloatingLabelPasswordControl = forwardRef(({ required, showRule = true, label, controlId, feedback } , ref) => {

    const [ inputValue, setInputValue ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);

    useImperativeHandle(ref, () => ({
        value: inputValue,
    }), [inputValue]);

    let feedbackClassName;
    let buttonBorderColor;
    if (feedback) {
        feedbackClassName = 'is-invalid';
        buttonBorderColor = 'dorder-danger';
    }
    
    return (
        <>
            <InputGroup>
                <FloatingLabel label={label} controlId={controlId} className={feedbackClassName}>
                    <Form.Control required={Boolean(required)} className={` border-end-0 ${feedbackClassName}`}
                    type={ showPassword ? 'text' : 'password' } placeholder="" onChange={e => setInputValue(e.target.value)} />
                </FloatingLabel>
                <Button className={`bg-transparent text-secondary fs-4 border-start-0 rounded-end-3 ${buttonBorderColor || 'border-secondary-subtle'}`} onClick={() => setShowPassword(!showPassword)}>
                    <i className={ showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill" } />
                </Button>
                { feedback && <Form.Control.Feedback type='invalid'>{feedback}</Form.Control.Feedback> }
            </InputGroup>
            { showRule && <PasswordRule /> }
        </>
    )
})

export default FloatingLabelPasswordControl