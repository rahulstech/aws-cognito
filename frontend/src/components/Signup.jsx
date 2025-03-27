import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLable from 'react-bootstrap/FloatingLabel'
import Stack from 'react-bootstrap/Stack'
import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useResendSignupCodeMutation, useSignupMutation, useVerifySignupMutation } from '../services/api'
import FloatingLabelPasswordControl from './FloatingLabelPasswordControl'
import { VerificationComponent } from './Verification'

export default function Signup() {

    const [signup, { error, isLoading, data }] = useSignupMutation();

    const refEmail = useRef();
    const refPassword = useRef();
    const refName = useRef();
    const navigate = useNavigate();

    function handleSignup(e) {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            return;
        }

        const email = refEmail.current.value;
        const password = refPassword.current.value;
        const name = refName.current.value;

        signup({ email, password, name });
    }

    if (!isLoading && data) {
        navigate('/verify', { state: { email: refEmail.current.value }});
        return null;
    }

    return (
        <Form onSubmit={handleSignup} noValidate={true}>
            <fieldset disabled={isLoading}>
                <Stack direction='vertical' gap={3}>
                    <Form.Group>
                        <FloatingLable label='Email' className={!isLoading && error?.email && 'is-invalid'}>
                            <Form.Control ref={refEmail} className={!isLoading && error?.email && 'is-invalid'} type='email' placeholder='Email' required />
                        </FloatingLable>
                        {
                            error?.email  && <Form.Control.Feedback type='invalid'>{error?.email}</Form.Control.Feedback>
                        }
                        
                    </Form.Group>

                    <FloatingLabelPasswordControl ref={refPassword} required label='Password' controlId='signupPassword'
                        feedback={error?.password} isValid={ !isLoading && error?.password && false } />

                    <Form.Group>
                        <FloatingLable label='Name'>
                            <Form.Control ref={refName} type='personname' placeholder='Name' required />
                        </FloatingLable>
                    </Form.Group>
                </Stack>
                <Button type='submit' className='mt-4 w-100'>Signup</Button>
            </fieldset>
        </Form>
    )
}


export function SigupVerification() {
    const [ verifySignup, { error, isLoading, data }] = useVerifySignupMutation();
    const [ resendSignupCode, { error: resendError, isLoading: isLoadingResend, data: resendData }] = useResendSignupCodeMutation();
    const { state } = useLocation();
    const navigate = useNavigate();

    function handleSubmit(code) {
        const  email = state?.email;
        verifySignup({email, code});
    }

    function handleResendCode() {
        const email = state?.email;
        resendSignupCode(email);
    }

    if (!isLoading && data) {
        // signup verification successful, now login required
        navigate('/');
        return null;
    }
    else if (!isLoadingResend) {
        if (resendData) {
            // code send successfully
            alert('code sent successfully');
        }
        else if (resendError) {
            alert('code not sent please try again');
        }
    }

    return <VerificationComponent disabled={isLoading} email={state?.email} onSubmit={handleSubmit} 
                canResendCode={true} onResendCode={handleResendCode} feedback={error?.code} />
}