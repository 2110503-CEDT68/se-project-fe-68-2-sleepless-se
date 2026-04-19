import React from "react";
import styles from "./HotelEditModal.module.css"

type EditModal = {
  isOpen: boolean;
  children: React.ReactNode;

}

export default function HotelEditModal({isOpen, children}:EditModal){
    if(!isOpen) return null;
    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
            <div className={`${styles.content} w-full max-w-3xl h-[75%]`}>
                {children}
            </div>
        </div>
    )
}