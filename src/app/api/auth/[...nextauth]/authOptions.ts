import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userLogIn from "@/libs/userLogIn";
// 1. Import ฟังก์ชันดึง Profile เข้ามาด้วย
import getUserProfile from "@/libs/getUserProfile"; 

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        
        // 2. ยิง API ล็อกอิน เพื่อเอา Token ก่อน
        const user = await userLogIn(credentials.email, credentials.password);

        // เช็คว่าถ้าล็อกอินผ่าน และมี token ส่งกลับมา (API ของคุณน่าจะส่งกลับมาเป็น user.token)
        if (user && user.token) {
          
          try {
            // 3. เอา Token ที่ได้ แวะไปดึงข้อมูลชื่อจาก API /auth/me
            const profile = await getUserProfile(user.token);

            // 4. จับข้อมูลจากทั้ง 2 API มัดรวมกัน แล้วส่งให้ NextAuth เก็บไว้
            return {
              id: profile.data?._id || profile.data?.id || profile.id || "1", 
              name: profile.data?.name || profile.name, // ดึงชื่อมาใส่ตรงนี้แหละครับ!
              email: credentials.email,
              token: user.token,
              role: profile.data?.role || profile.role  
            } as any;

          } catch (error) {
            console.error("Error fetching profile in NextAuth:", error);
            // ถ้าดึงโปรไฟล์พัง ก็ยังให้ล็อกอินผ่านได้ แต่มีแค่ email กับ token
            return { email: credentials.email, token: user.token } as any; 
          }

        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout'
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token._id = (user as any)._id || user.id;
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    }
  }
};