import { createPortal } from "react-dom";


const Portal = ({ children }: {children: JSX.Element | JSX.Element[] }) => {

    const portal = document.getElementById('portal');

    if(!portal) return null;

    return createPortal(children, portal);

}

export default Portal;