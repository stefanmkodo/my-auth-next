import React from 'react';
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

const GattServicesView = ({services, onRead, onNotificationsStart }) => {
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
                                {c.properties.read && <button className={`${styles.button} ${styles.table}`} onClick={() => onRead(service.uuid, c.uuid)}>READ</button>}
                                {c.properties.notify && <button className={`${styles.button} ${styles.table}`} onClick={() => onNotificationsStart(service.uuid, c.uuid)}>NOTIFY</button>}
                        </div>})}
                    </ul>
                </div>
            })}
        </>
    )
}

export default GattServicesView;
