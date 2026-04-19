
import { useEffect, useState } from "react";
import styles from "./HotelEditPanel.module.css"
import { TextField } from "@mui/material";

type HotelEditProp = {
    name: string;
    description: string;
    location: string;
    telephone: string;
    email: string;
    photoURL: string;

    onSave: (data: {
        name: string;
        description: string;
        location: string;
        telephone: string;
        email: string;
        photoURL: string;
    }) => void;

    onCancel: () => void;
};

export default function HotelEditPanel({name,description,location,telephone,email,photoURL,onSave,onCancel}:HotelEditProp){
    
    const [hotelName, setHotel] = useState(name || "");
const [hotelDescription, setDescription] = useState(description || "");
const [hotelLocation, setLocation] = useState(location || "");
const [hotelTelephone, setTelephone] = useState(telephone || "");
const [hotelEmail, setEmail] = useState(email || "");
const [hotelPhotoURL, setPhotoURL] = useState(photoURL || "");

    useEffect(() => {
  setHotel(name || "");
  setDescription(description || "");
  setLocation(location || "");
  setTelephone(telephone || "");
  setEmail(email || "");
  setPhotoURL(photoURL || "");
}, [name, description, location, telephone, email, photoURL]);
    
    return(
        <div className={styles.StyleWrapper}>
                <h1>
                    <div className={styles.InputWrapper}>
                        <input type="text" onChange={(e)=>setHotel(e.target.value)} value={hotelName}/>
                        <img  className={styles.EditIcon} src="/edit.svg" /> 
                    </div>
                </h1>
                <div className={styles.ContentWrapper}>
                    <div className={styles.ImageWrapper}>
                        {/*TODO :: add </Image> when the backend has been edited*/}
                        <strong>hotelPhotoURL</strong>
                        
                    </div>
                    <div className={styles.InformationWrapper}>
                        <h2> <div className={styles.InputWrapper}>📍 <input type="text" onChange={(e)=>setLocation(e.target.value)} value={hotelLocation}/><img  className={styles.EditIcon} src="/edit.svg" /> </div></h2>
                        <h2> <div className={styles.InputWrapper}>📞 <input type="tel" onChange={(e)=>setTelephone(e.target.value)} value={hotelTelephone}/><img  className={styles.EditIcon} src="/edit.svg" /> </div></h2>
                        <h2>✉️ {hotelEmail}</h2>
                        <p><textarea onChange={(e)=>setDescription(e.target.value)} value={hotelDescription}/></p>
                        <div className={styles.ButtonWrapper}>
                            <button onClick={onCancel} className={styles.CancelButton}>
                                Cancel
                                </button>
                            <button
                                onClick={() =>
                                    onSave({
                                    name: hotelName,
                                    description: hotelDescription,
                                    location: hotelLocation,
                                    telephone: hotelTelephone,
                                    email: hotelEmail,
                                    photoURL: hotelPhotoURL,
                                    })
                                }
                                >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
    )
}