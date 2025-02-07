import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { formatDate, formatDateToString } from '@/Utils/helpFunctions';
import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';

interface User {
    id: string;
    name: string;
}

interface GlobalContextProps {
    user: User;
    loading: boolean;
    day: string;
    tasks: CreateTaskProps[];
    dayNotes: CreateNoteProps[];
    settingsOpen: boolean;
    setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setDay: React.Dispatch<React.SetStateAction<string>>;
    setTasks: React.Dispatch<React.SetStateAction<CreateTaskProps[]>>;
    setDayNotes: React.Dispatch<React.SetStateAction<CreateNoteProps[]>>;
}


const GlobalContext = createContext<GlobalContextProps>({
    user: {
        id: "",
        name: ""
    },
    loading: true,
    day: "",
    tasks: [],
    dayNotes: [],
    settingsOpen: false,
    setSettingsOpen: () => { },
    setUser: () => { },
    setLoading: () => { },
    setDay: () => { },
    setTasks: () => { },
    setDayNotes: () => { },
});

export const useGlobalContext = () => useContext(GlobalContext);

interface GlobalProviderProps {
    children: ReactNode;
}



export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User>({ id: "", name: "" });
    const [day, setDay] = useState<string>(formatDate(new Date))
    const [tasks, setTasks] = useState<CreateTaskProps[]>([])
    const [dayNotes, setDayNotes] = useState<CreateNoteProps[]>([])
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)

    return (
        <GlobalContext.Provider
            value={{
                user,
                loading,
                day,
                tasks,
                dayNotes,
                settingsOpen,
                setSettingsOpen,
                setUser,
                setDay,
                setLoading,
                setTasks,
                setDayNotes,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
