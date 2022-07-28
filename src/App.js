import './App.css';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React from 'react'
import Amplify from 'aws-amplify'
import awsExports from "./aws-exports";
import { useMediaQuery } from "react-responsive";
import Manage from './components/Manage.jsx';
import Member from './components/Member.jsx';

Amplify.configure(awsExports);

const App = () => {
    const isPc = useMediaQuery({
        query: "(min-width:1024px)"
    });
    const isTablet = useMediaQuery({
        query: "(min-width:768px) and (max-width:1023px)"
    });
    const isMobile = useMediaQuery({
        query: "(max-width:767px)"
    });
    return (
        <Authenticator hideSignUp={true}>
            {({ signOut, user }) => (
                <div className="container">
                    {/*ログイン情報が管理者の場合 */}
                    {(isTablet || isPc || isMobile) && user.signInUserSession.accessToken.payload['cognito:groups'][0] === 'administor' ?
                        [
                            <button className="signButton" onClick={signOut}>Sign out</button>,
                            <h1>{user.username}様</h1>,
                            <br />,
                            <Manage />,
                        ] :
                        ((isTablet || isPc || isMobile) && user.signInUserSession.accessToken.payload['cognito:groups'][0] === 'general' ?
                        [
                        <button className="signButton" onClick={signOut}>Sign out</button>,
                        <h1>{user.username}様</h1>,
                        <br />,
                        <Member username={user.username} />,
                        ] :
                        [
                        <button className="signButton" onClick={signOut}>Sign out</button>,
                        <h1>{user.username}様</h1>
                        ])
                    }
                </div>
            )}
        </Authenticator>
    );
}

export default App
