import {useState} from 'react'
import useCheckStatus from "../hooks/useCheckStatus.js";
import {Footer} from "./Footer.jsx";
import {Header} from "./Header.jsx";
import TabSelector from "@/components/TabSelector";
import QRCodeView from "@/components/QRCodeView";

function App() {
    const [view, setView] = useState("QR Codes");
    const status = useCheckStatus();
    
    return (
        <div id={"root"}>
            <Header/>
            <TabSelector items={["QR Codes", "Audio"]} currentTab={view} onSelect={setView} />
            {view === "QR Codes" && <QRCodeView status={status} />}
            <Footer status={status}/>
        </div>
    )
}

export default App;
