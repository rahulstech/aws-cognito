import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import FloatingLabelPasswordControl from './FloatingLabelPasswordControl'
import { useRef } from 'react'
import { VerificationComponent } from './Verification'
import { useRequestResetPasswordCodeMutation, useResetPasswordMutation } from '../services/api'
import { useLocation, useNavigate } from 'react-router'


export function ForgetPassword() {

    const [requestResetPasswordCode, { error, isLoading, data }] = useRequestResetPasswordCodeMutation();
    const refEmail = useRef();
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            return;
        }
        
        const email = refEmail.current.value;
        requestResetPasswordCode(email);
    }

    if (!isLoading && data) {
        navigate('/verify/password', { state: { email: refEmail.current.value }})
        return null;
    }

    return (
        <div className='pt-4'>
            <Form onSubmit={handleSubmit} className='col-sm-6 mx-auto card'>
                <fieldset disabled={isLoading} className='card-body'>
                    <p className='mb-2'>Enter your current email</p>

                    <Form.Group className='mb-3'>
                        <Form.Control ref={refEmail} type='email' required placeholder='' className={ !isLoading && error?.email && 'is-invalid'} />
                        {
                            !isLoading && error?.email && <Form.Control.Feedback type='invalid'>{error?.email}</Form.Control.Feedback>
                        }
                    </Form.Group>

                    <Button type='submit' variant='primary' className='w-100'>Send Code</Button>
                </fieldset>
            </Form>
        </div>
    )
}

export function PasswordVerification() {
    const { state } = useLocation();
    const navigate = useNavigate();

    function handleSubmit(code) {
        const email = state?.email;
        navigate('/resetpassword', { state: { email, code }});
        return null;
    }

    return <VerificationComponent email={state?.email} onSubmit={handleSubmit} />
}

export function ResetPassword() {

    const [resetPassword,{error, isLoading, data}] = useResetPasswordMutation();
    const navigate = useNavigate();
    const { state } = useLocation();
    const refPassword = useRef();

    function handleSubmit(e) {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            return;
        }

        const email = state?.email;
        const code = state?.code;
        const newPassword = refPassword.current.value;
        resetPassword({ email,code,newPassword });
    }

    if (!isLoading && data) {
        navigate('/');
        return null;
    }

    return (
        <div className='pt-4'>
            <Form onSubmit={handleSubmit} className='card col-sm-6 mx-auto'>
                <fieldset className='card-body'>
                    <Stack direction='vertical' gap={3}>
                        <FloatingLabelPasswordControl ref={refPassword} required label='New Password' feedback={ error?.newPassword }/>

                        <Button type='submit'>Change</Button>
                    </Stack>
                </fieldset>
            </Form>
        </div>
    )
}