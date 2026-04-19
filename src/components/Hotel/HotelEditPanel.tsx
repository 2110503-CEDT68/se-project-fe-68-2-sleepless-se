
import { useState } from "react";
import styles from "./HotelEditPanel.module.css"

export default function HotelEditPanel(){
    
    const [Name,set] = useState("Dummy");
    const [Description,setDescription] = useState("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ");
    const [Location,setLocation] = useState("dummy Location");
    const [Telephone,setTelephone] = useState("+66xxxxxxxxxxx");
    const [Email, setEmail] = useState("Dummy Email");
    const [PhotoURL, setPhotoURL] = useState("Photo");
    
    return(
        <div className={styles.StyleWrapper}>
            
        </div>
    )
}