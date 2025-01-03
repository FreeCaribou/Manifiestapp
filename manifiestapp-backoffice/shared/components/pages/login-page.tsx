'use client'

import axios from 'axios';
import { useState } from 'react';

export function LoginPage() {
    const [loginFormPassword, setLoginFormPassword] = useState('');

    function login() {
        // axios.post(`${window.location.origin}/api/login`, { password: loginFormPassword }).then(d => {
        //     console.log('data of post', d)
        //     // TODO the else, show what happen
        //     if (!d.data?.error) {
        //         document.cookie = `auth=${d.data?.token}`;
        //         window.location.replace(`${window.location.origin}/admin`);
        //     }
        // });
    }

    return (
        <>
            <h2>Login Page</h2>
            <form action={login}>
            <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                <input
                    className='form-control'
                    type="password"
                    placeholder="azerty0123"
                    onChange={e => setLoginFormPassword(e.target.value)}
                />
                <button type="submit" className='btn btn-primary'>Login</button>
            </form>
        </>
    )
}