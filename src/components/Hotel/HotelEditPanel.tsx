
import { useState } from "react";
import styles from "./HotelEditPanel.module.css"
import { TextField } from "@mui/material";

type HotelEditProp ={
    name:string,
    description:string,
    location:string,
    telephone:string,
    email:string,
    photoURL:string,   
}

export default function HotelEditPanel({name,description,location,telephone,email,photoURL}:HotelEditProp){
    
    const [hotelName,setHotel] = useState(name);
    const [hotelDescription,setDescription] = useState(description);
    const [hotelLocation,setLocation] = useState(location);
    const [hotelTelephone,setTelephone] = useState(telephone);
    const [hotelEmail, setEmail] = useState(email);
    const [hotelPhotoURL, setPhotoURL] = useState(photoURL);
    
    return(
        <div className={styles.StyleWrapper}>
                <h1>
                    <input type="text" onChange={(e)=>setHotel(e.target.value)} value={hotelName}/>
                </h1>
                <div className={styles.ContentWrapper}>
                    <div className={styles.ImageWrapper}>
                        {/*TODO :: add </Image> when the backend has been edited*/}
                        <strong>hotelPhotoURL</strong>
                    </div>
                    <div className={styles.InformationWrapper}>
                        <h2>📍 <input type="text" onChange={(e)=>setLocation(e.target.value)} value={hotelLocation}/></h2>
                        <h2>📞 <input type="tel" onChange={(e)=>setTelephone(e.target.value)} value={hotelTelephone}/></h2>
                        <h2>✉️ <input type="email" onChange={(e)=>setEmail(e.target.value)} value={hotelEmail}/></h2>
                        <p><textarea onChange={(e)=>setDescription(e.target.value)} value={hotelDescription}/></p>
                    </div>
                </div>
                
            </div>
    )
}