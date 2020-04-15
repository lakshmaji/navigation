import React, { useContext } from 'react';
import { NavigationContext } from 'react-navigation'
const isQueryParam = new RegExp('^qp_generic_mpra_')

const filterParams = (params = {}, removeQueryParams = false) => {
    return Object.keys(params).reduce((acc, key) => {
        if (removeQueryParams) {
            if (isQueryParam.test(key)) return acc;
            acc[key] = params[key];
        } else {
            if (!isQueryParam.test(key)) return acc;
            acc[key.replace(isQueryParam, '')] = params[key];
        }
        return acc;
    }, {});
}
const getStateAndParams = (data) => ({
    pathname: data.routeName,
    params: filterParams(data.params, true),
    search: filterParams(data.params),
    state: {}
});

export const useNavigation = () => {
    const { navigate, goBack, getParam, } = useContext(NavigationContext);
    const navCxt = useContext(NavigationContext);


    const navigateTo = (url, state = {}, queryParams = null) => {
        const params = {
            ...(state && { ...state }),
            ...(Object.keys(queryParams || {}).reduce((acc, eParam) => {
                return {
                    ...acc, [`qp_generic_mpra_${eParam}`]: queryParams[eParam]
                }
            }, {}))
        }

        navigate({
            routeName: url,
            params
        });

    };

    const navigateBack = () => {
        goBack();
    };

    return {
        navigateTo,
        navigateBack,
        getState: filterParams(navCxt.state.params, true),
        getStateByKey: (key) => getParam(key),
        routeDetails: getStateAndParams(navCxt.state),
        isWeb: false,
        getRouteParam: (key) => getParam(key),
        getRouteParams: filterParams(navCxt.state.params, true),
        getQueryParam: (key) => getParam(`qp_generic_mpra_${key}`),
        getQueryParams: filterParams(navCxt.state.params)

    }
};
