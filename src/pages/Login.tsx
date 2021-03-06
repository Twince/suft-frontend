import styled from 'styled-components';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import cogoToast from 'cogo-toast';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Helmet } from 'react-helmet';
import LoginHeaderText from '../components/Login/LoginHeaderText';
import LabelText from '../atomics/Typography/LabelText';
import Input from '../atomics/Input';
import SquareButton from '../atomics/SquareButton';
import LoginFooterText from '../components/Login/LoginFooterText';
import DefaultLayout from '../layouts/DefaultLayout';
import CenterContainer from '../utils/ContainerUtils/CenterContainer';
import TokenUtil from '../api/TokenUtil';
import { getGraphQLError } from '../api/errorHandler';

const MenuLoginWrapStyle = styled.div`
    margin: 32px auto;
`;

const LOGIN = gql`
    mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`;

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login] = useMutation(LOGIN);

    const userLogin = () => {
        if (email === '' || password === '') {
            cogoToast.warn('빈 칸이 존재합니다.');
            return;
        }

        login({
            variables: {
                email,
                password
            }
        })
            .then((res) => {
                TokenUtil.set(res.data.login.token);
                window.location.reload();
            })
            .catch((err) => {
                const gerror = getGraphQLError(err);
                if (!gerror) return;
                cogoToast.error(gerror[1]);
            });
    };

    const onEnterKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            userLogin();
        }
    };

    const onEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const onPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    return (
        <DefaultLayout>
            <Helmet>
                <title>로그인 - 수프트</title>
            </Helmet>

            <CenterContainer>
                <div>
                    <LoginHeaderText />

                    <MenuLoginWrapStyle>
                        <LabelText>이메일</LabelText>
                        <Input
                          value={email}
                          type="email"
                          placeholder="이메일을 입력해주세요."
                          onChange={onEmailInputChange}
                          onKeyPress={onEnterKeyPress}
                        />

                        <LabelText>비밀번호</LabelText>
                        <Input
                          value={password}
                          type="password"
                          placeholder="비밀번호를 입력해주세요."
                          onChange={onPasswordInputChange}
                          onKeyPress={onEnterKeyPress}
                        />
                    </MenuLoginWrapStyle>

                    <SquareButton onClick={userLogin}>
                        <FontAwesomeIcon icon={faDoorOpen} /> 로그인
                    </SquareButton>

                    <LoginFooterText />
                </div>
            </CenterContainer>
        </DefaultLayout>
    );
};

export default Login;
