import React from 'react'
import styles from './rise.module'

export default function ({name = 'user'}) {
    return <div className={styles.super_box}>
               <h2 className={styles.alert}>Hello {name}</h2>
               <p>Welcome to site!</p>
           </div>
}