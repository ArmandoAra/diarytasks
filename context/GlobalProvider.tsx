import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { formatDate, formatDateToString } from '@/Utils/helpFunctions';
import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';


interface GlobalContextProps {
    isLogged: boolean;
    user: string;
    loading: boolean;
    day: string;
    tasks: CreateTaskProps[];
    setUser: React.Dispatch<React.SetStateAction<string>>;
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setDay: React.Dispatch<React.SetStateAction<string>>;

    setTasks: React.Dispatch<React.SetStateAction<CreateTaskProps[]>>;
}


const GlobalContext = createContext<GlobalContextProps>({
    isLogged: false,
    user: "",
    loading: true,
    day: "",
    tasks: [],
    setUser: () => { },
    setIsLogged: () => { },
    setLoading: () => { },
    setDay: () => { },
    setTasks: () => { },
});

export const useGlobalContext = () => useContext(GlobalContext);

interface GlobalProviderProps {
    children: ReactNode;
}



export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {

    const [isLogged, setIsLogged] = useState<boolean>(false);
    const [user, setUser] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [day, setDay] = useState<string>(formatDate(new Date))
    const [tasks, setTasks] = useState<CreateTaskProps[]>([])

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                user,
                loading,
                day,
                tasks,
                setUser,
                setIsLogged,
                setDay,
                setLoading,
                setTasks,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
