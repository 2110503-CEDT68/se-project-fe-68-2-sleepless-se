export interface VenueItem {
    _id: string,
    name: string,
    address: string,
    district: string,
    province: string,
    postalcode: string,
    tel: string,
    picture: string,
    dailyrate: number,
    __v: number,
    id: string
  }
  
export interface VenueJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: VenueItem[]
  }

export interface BookingItem {
    nameLastname: string;
    tel: string;
    venue: string;
    bookDate: string;
  }

export interface Hotel {
    _id: string;
    hotel_name: string;
    address: string;
    telephone: string;
}

export interface BookingFormProps {
  initialHotelId: string;
}

export interface FormErrors {
  name?: string;
  tel?: string;
  submit?: string;
}