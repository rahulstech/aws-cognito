import { Outlet, useLocation, useNavigate } from 'react-router'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/esm/Button';
import { useResendSignupCodeMutation, useVerifySignupMutation } from '../services/api';
import { useRef } from 'react';

export function VerificationComponent({ email, disabled, onSubmit, canResendCode = false, onResendCode, feedback }) {

    const refCodeInput = useRef();

    function handleSubmitVerificationCode(e) {
        e.preventDefault();
        if (onSubmit) {
            const code = refCodeInput.current.value;
            onSubmit(code);
        }
    }

    function handleResendCode(e) {
        e.preventDefault()
        if (onResendCode) {
            onResendCode();
        }
    }

    return (
        <div className='pt-4'>
            <Form onSubmit={handleSubmitVerificationCode} className='col-md-6 card mx-auto' noValidate={true}>
                <fieldset disabled={disabled}>
                    <Stack gap="3" className='card-body'>
                        <FloatingLabel label='Email'>
                            <input className='form-control-plaintext' readOnly value={email} />
                        </FloatingLabel>

                        <p>Enter the code send to the above email</p>

                        <Form.Group>
                            <FloatingLabel label='Code' className={ feedback && 'is-invalid' }>
                                <Form.Control ref={refCodeInput} required type='text' placeholder='' className={ feedback && 'is-invalid' } />
                            </FloatingLabel>
                            { feedback && <Form.Control.Feedback type='invalid'>{feedback}</Form.Control.Feedback> }
                            
                        </Form.Group>
                        {
                            canResendCode && <a onClick={handleResendCode} role='button' className='text-end'>Resend Code</a>
                        }
                        <Button type='submit' variant='primary'>Verify</Button>
                    </Stack>
                </fieldset>
            </Form>
        </div>
    )
}

export function Verification() {
    return <Outlet />
}
