import './App.css';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React from 'react'
import Amplify from 'aws-amplify'
import awsExports from "./aws-exports";
import { useMediaQuery } from "react-responsive";
import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import Manage from './components/Manage.jsx';
import Member from './components/Member.jsx';
import WorkRegist from './components/WorkRegist.jsx';
import WorkIndex from './components/WorkIndex.jsx';
import { Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

Amplify.configure(awsExports);

const AWS = require('aws-sdk');

const App = () => {


    const cognito = new AWS.CognitoIdentityServiceProvider({
        region: "ap-northeast-1", UserPoolId: 'ap-northeast-1_uaYr8XVpl'
    });

    const params = {
        UserPoolId: 'ap-northeast-1_uaYr8XVpl',

    };

    const cognitoResponse = cognito.listUsersInGroup({
        GroupName: "general", UserPoolId: 'ap-northeast-1_uaYr8XVpl'
    }).promise()


    const client = new CognitoIdentityProviderClient({
        region: "ap-northeast-1",
        credentials: {
            accessKeyId: 'AKIA2TBGQV36MBUFIBMP',
            secretAccessKey: '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',
        },
    });
    const command = new ListUsersCommand({ UserPoolId: "ap-northeast-1_uaYr8XVpl" });

    async function test() {
        try {
            const data = await client.send(command);
            return this.setUsers({ users: data });

        } catch (error) {
            console.error(error);
        } finally {
        }
    }
    const data = client.send(command);

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

                        ] : ((isTablet || isPc || isMobile) && user.signInUserSession.accessToken.payload['cognito:groups'][0] === 'general' ?
                            [
                                <button className="signButton" onClick={signOut}>Sign out</button>,
                                <h1>{user.username}様</h1>,
                                <br />,
                                <Member username={user.username} />,
                            ] : [<button className="signButton" onClick={signOut}>Sign out</button>,
                            <h1>{user.username}様</h1>])
                    }
                </div>
            )}
        </Authenticator>
    );
}

export default App
