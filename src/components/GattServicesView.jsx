import React, {useState} from 'react';
import styles from "@/components/BluetoothView.module.css";
import BLUETOOTH_CHARACTERISTICS from "./characteristics.json";
import BLUETOOTH_SERVICES from "./services.json";

export function getServiceName(serviceUuid) {
    const uuidToFind = serviceUuid.split("-")[0].slice(-4);
    return BLUETOOTH_SERVICES.find((s) => s.uuid.toLowerCase() === uuidToFind)?.name ?? serviceUuid;
}

export function getCharacteristicName(characteristicUuid) {
    const uuidToFind = characteristicUuid.split("-")[0].slice(-4);
    return BLUETOOTH_CHARACTERISTICS.find((c) => c.uuid.toLowerCase() === uuidToFind)?.name ?? characteristicUuid;
}

function formatUUID(uuid) {
    return uuid.endsWith("-0000-1000-8000-00805f9b34fb") ? `0x${uuid.split("-")[0].slice(-4)}` : uuid;
}

const GattServicesView = ({services, onRead, onNotificationsStart, onWrite}) => {
    const [writeValue, setWriteValue] = useState({serviceUuid: null, characteristicUuid: null, value: ""});
    const [isWritePopupVisible, setIsWritePopupVisible] = useState(false);

    function onWriteClick(serviceUuid, characteristicUuid) {
        setWriteValue({...writeValue, serviceUuid, characteristicUuid});
        setIsWritePopupVisible(true);
    }

    function onWriteConfirm() {
        onWrite(writeValue.serviceUuid, writeValue.characteristicUuid, writeValue.value);
        setWriteValue({serviceUuid: null, characteristicUuid: null, value: ""});
        setIsWritePopupVisible(false);
    }

    return (
        <>
            <h2>Available GATT Services</h2>
            {services.map((service, index) => {
                return <div key={index} className={styles.btListContainer}>
                    <ul className={styles.btList}>
                        <li className={styles.btListHeading}>{`${getServiceName(service.uuid)} (${formatUUID(service.uuid)})`}</li>
                        {service.characteristics && service.characteristics.map((c) => {
                            return <div key={c.uuid} className={`${styles.btListItem} ${styles.characteristicRow}`}>
                                <span>{`${getCharacteristicName(c.uuid)} (${formatUUID(c.uuid)})`}</span>
                                {c.properties.read && <button className={`${styles.button} ${styles.table}`}
                                                              onClick={() => onRead(service.uuid, c.uuid)}>READ</button>}
                                {c.properties.notify && <button className={`${styles.button} ${styles.table}`}
                                                                onClick={() => onNotificationsStart(service.uuid, c.uuid)}>NOTIFY</button>}
                                {(c.properties.write || c.properties.writeWithoutResponse) &&
                                    <button className={`${styles.button} ${styles.table}`}
                                            onClick={() => onWriteClick(service.uuid, c.uuid)}>WRITE</button>}
                            </div>
                        })}
                    </ul>
                </div>
            })}
            {isWritePopupVisible && (
                <div className={styles.writePopupContainer}>
                    <div className={styles.writePopup}>
                        <h2>Write a new value to a characteristic</h2>
                        <input type={"text"} value={writeValue.value} style={{ width: "100%" }}
                               onChange={(e) => setWriteValue({...writeValue, value: e.target.value})}/>
                        <div style={{display: "flex", gap: "8px" }}>
                            <button className={styles.button} onClick={onWriteConfirm}>
                                CONFIRM
                            </button>
                            <button className={styles.button} onClick={() => setIsWritePopupVisible(false)}>
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default GattServicesView;
