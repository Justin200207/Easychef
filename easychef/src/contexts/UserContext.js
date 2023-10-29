import { createContext, useState } from "react";

export const useUserContext = () => {
    const [user, setUser] = useState({
        email: '',
        phone_number: '',
        first_name: '',
        last_name: '',
        profile_pic: '',
        password: '',
    })

    return {
        user,
        setUser,
    }
}

const UserContext = createContext({
    user: {
        email: '',
        phone_number: '',
        first_name: '',
        last_name: '',
        profile_pic: '',
        password: '',
    },
    setUser: () => {},
});

export default UserContext
