import React from "react";
import styles from "./PrivacyPolicyContainer.module.css"

type PrivacyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onAccept: ()=> void;
}

export default function PrivacyPolicyContainer({isOpen, onClose, onAccept, children}:PrivacyModalProps){
    if(!isOpen) return null;
    return(
        <div className="fixed left-0 top-0 w-full h-full flex flex-col justify-center items-center bg-black/50 z-[1000] transition-all duration-200">
            <div className="flex-1 min-h-0 w-[90%] h-[75%] flex flex-col items-center justify-center">
                <div className="text-white text-2xl w-full text-right">
                    <button onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.content}>
                    {children}
                </div>

                <button className="bg-sky-600 text-white w-1/2 max-w-[300px] py-3.5 text-base font-bold rounded-xl shadow-none transition-all duration-200 mt-4 normal-case border-0 cursor-pointer"
                onClick={onAccept}
                >
                    I agree
                </button>
            </div>
        </div>
    )
}