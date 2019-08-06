import { AuthStatusState } from "../reducers/authStatusReducer";
import AppClient from '../httpClients/appClient';
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { FormErrorState } from "../reducers/formErrorReducer";
import { push } from 'connected-react-router';
import {AnyAction} from "redux";
import {routes} from "../routes/Route";

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

type State = void | AuthStatusState;
type ThunkResult<R> = ThunkAction<R, State, undefined, AnyAction>

export function postLoginAction(accountName: string, password: string): ThunkResult<void> {
    return (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        AppClient.post('/login', {
            account_name: accountName,
            password: password,
        })
            .then((response: Response) => {
                if (response.status !== 200) {
                    throw new Error('HTTP status not 200');
                }

                return response.json();
            })
            .then((body) => {
                dispatch(loginSuccessAction({
                    userId: body.id,
                    accountName: body.account_name,
                    address: body.address,
                }));
                dispatch(push(routes.top.path))
            })
            .catch((err: Error) => {
                dispatch(loginFailAction({
                    error: err.message,
                }))
            })
    };
}

export interface LoginSuccessAction {
    type: typeof LOGIN_SUCCESS,
    payload: AuthStatusState,
}

export function loginSuccessAction(newAuthState: AuthStatusState): LoginSuccessAction {
    return {
        type: LOGIN_SUCCESS,
        payload: newAuthState,
    };
}

export interface LoginFailAction {
    type: typeof LOGIN_FAIL,
    payload: FormErrorState,
}

export function loginFailAction(newErros: FormErrorState): LoginFailAction {
    return {
        type: LOGIN_FAIL,
        payload: newErros,
    };
}
