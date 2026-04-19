
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown";

import styles from "./PrivacyPolicy.module.css";

export default function PrivacyPolicy(){

    const [content, setContent ] = useState("");
    
    useEffect(()=>{
        fetch("/content/privacy-policy.md").then((res)=>res.text()).then((text)=>setContent(text));
    },[])

    return(
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-md border border-slate-200 flex flex-col h-full min-h-[300px]">
            <div className="text-left flex flex-col flex-1 min-h-0">
                <h1 className="text-3xl font-bold text-sky-900 mb-2">Privacy Policy</h1>
                <p className="text-slate-500 text-sm">Last Updated: 17/04/2026 </p>
                <div className={styles.TOSContainer}>
                    <div className={styles.TOS}>
                        <div className="prose">
                            <ReactMarkdown
                                components={{
                                    h2: ({ children }) => (
                                    <h2 className="text-2xl font-bold text-sky-900 ">
                                        {children}
                                    </h2>
                                    ),
                                    p: ({ children }) => (
                                    <p className="text-gray-700 mb-4 leading-relaxed">
                                        {children}
                                    </p>
                                    ),
                                    ul: ({ children }) => (
                                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                                        {children}
                                    </ul>
                                    ),
                                    li: ({ children }) => (
                                    <li className="mb-1">
                                        {children}
                                    </li>
                                    ),
                                    hr: () => (
                                    <hr className="my-6 mx-4 border-[#9ea1a6]" />
                                    ),
                                    strong: ({ children }) => (
                                    <strong className="font-semibold text-gray-900">
                                        {children}
                                    </strong>
                                    ),
                                }}
                            >{content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


}