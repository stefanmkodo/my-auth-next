const params = () => {
    return new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    })
};

export default function getParam(param) {
    return params()[param];
}
