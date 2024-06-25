import React from 'react';
import styles from "@/components/BluetoothView.module.css";

const LogTable = ({log}) => {
    return (
        <div className={styles.btListContainer}>
            <h2>GATT Characteristic Value Log</h2>
            <table className={styles.logTable}>
                <thead>
                <tr className={styles.logTableHeader}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Method</th>
                    <th>Timestamp</th>
                </tr>
                </thead>
                <tbody>
                {log.map(({cName, cValue, cTimestamp, method}) => {
                    return <tr key={`${cName}-${cTimestamp}`} className={styles.logTableRow}>
                        <td className={styles.logTableData}>{cName}</td>
                        <td className={styles.logTableData}>{cValue}</td>
                        <td className={styles.logTableData}>{method}</td>
                        <td className={styles.logTableData}>{cTimestamp}</td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    )
}

export default LogTable;