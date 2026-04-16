import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BookingItem {
    nameLastname: string;
    tel: string;
    hotel: string;      // เปลี่ยนจาก venue เป็น hotel
    bookDate: string;   // วันที่ Check-in
    nights: number;     // จำนวนคืนที่พัก (เดี๋ยวเราไปดักไม่ให้เกิน 3 คืนในหน้าฟอร์ม)
}

type BookingState = {
    bookItems: BookingItem[];
};

const initialState: BookingState = {
    bookItems: [],
};

export const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        addBooking: (state, action: PayloadAction<BookingItem>) => {
            // เช็คว่าเคยจองโรงแรมนี้ไปหรือยัง (เปลี่ยนเป็น action.payload.hotel)
            const index = state.bookItems.findIndex(item => item.hotel === action.payload.hotel);
            
            if (index !== -1) {
                state.bookItems[index] = action.payload; // แทนที่อันเก่า
            } else {
                state.bookItems.push(action.payload); // เพิ่มอันใหม่
            }
        },
        removeBooking: (state, action: PayloadAction<BookingItem>) => {
            state.bookItems = state.bookItems.filter(item => 
                item.nameLastname !== action.payload.nameLastname
            );
        }
    }
});

export const { addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;