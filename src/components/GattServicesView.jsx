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

const GattServicesView = ({services, onCharacteristicClick}) => {
    return (
        <>
            <h2>Available GATT Services</h2>
            {services.map((service, index) => {
                return <div key={index} className={styles.btListContainer}>
                    <ul className={styles.btList}>
                        <li className={styles.btListHeading}>{getServiceName(service.uuid)}</li>
                        {service.characteristics && service.characteristics.map((c) => {
                            return <button onClick={() => onCharacteristicClick(service.uuid, c)} key={c} className={styles.btListItem}>
                            <span>{getCharacteristicName(c)}</span>
                        </button>})}
                    </ul>
                </div>
            })}
        </>
    )
}

export default GattServicesView;
