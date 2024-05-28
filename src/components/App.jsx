import {useState} from 'react'
import useCheckStatus from "../hooks/useCheckStatus.js";
import {Footer} from "./Footer.jsx";
import {Header} from "./Header.jsx";
import TabSelector from "@/components/TabSelector";
import QRCodeView from "@/components/QRCodeView";
import AudioView from "@/components/AudioView";
import BluetoothView from "@/components/BluetoothView";

function App() {
    const [view, setView] = useState("QR Codes");
    const status = useCheckStatus();
    
    return (
        <div id={"root"}>
            <Header/>
            <TabSelector items={["QR Codes", "Audio", "Bluetooth"]} currentTab={view} onSelect={setView} />
            {view === "QR Codes" && <QRCodeView status={status} />}
            {view === "Audio" && <AudioView />}
            {view === "Bluetooth" && <BluetoothView />}
            <Footer status={status}/>
        </div>
    )
}

export default App;
