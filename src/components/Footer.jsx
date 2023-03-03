export function Footer({status}) {
    return (
        <footer className={"footer"}>
            {status !== "passed" && <Circle/>}
        </footer>)
}


export function Circle() {
    return (
        <svg className="footerSmallCircLeft parallax-curve" width="35" height="35" viewBox="0 0 35 35" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M17.5 35C27.165 35 35 27.165 35 17.5C35 7.83502 27.165 0 17.5 0C7.83502 0 0 7.83502 0 17.5C0 27.165 7.83502 35 17.5 35ZM17.5 26.7459C22.6064 26.7459 26.746 22.6064 26.746 17.5C26.746 12.3936 22.6064 8.25403 17.5 8.25403C12.3936 8.25403 8.25409 12.3936 8.25409 17.5C8.25409 22.6064 12.3936 26.7459 17.5 26.7459Z"
                  fill="#EE1753"></path>
        </svg>
    )
}


export function Loader() {
    return (
        <div className="lds-hourglass"></div>
    )
}
