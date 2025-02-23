import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { formatDate } from '@/Utils/helpFunctions';
import React, { createContext, useContext, useState, ReactNode, FC } from 'react';


interface User {
    id: string;
    name: string;
}

interface GlobalContextProps {
    user: User;
    day: string;
    tasks: CreateTaskProps[];
    dayNotes: CreateNoteProps[];
    setUser: React.Dispatch<React.SetStateAction<User>>;
    setDay: React.Dispatch<React.SetStateAction<string>>;
    setTasks: React.Dispatch<React.SetStateAction<CreateTaskProps[]>>;
    setDayNotes: React.Dispatch<React.SetStateAction<CreateNoteProps[]>>;
}

const GlobalContext = createContext<GlobalContextProps>({
    user: { id: "", name: "" },
    day: '',
    tasks: [],
    dayNotes: [],
    setUser: () => { },
    setDay: () => { },
    setTasks: () => { },
    setDayNotes: () => { },
});

export const useGlobalContext = () => useContext(GlobalContext);

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>({ id: "", name: "" });
    const [day, setDay] = useState<string>(formatDate(new Date()));
    const [tasks, setTasks] = useState<CreateTaskProps[]>([])
    const [dayNotes, setDayNotes] = useState<CreateNoteProps[]>([])

    return (
        <GlobalContext.Provider
            value={{
                user,
                day,
                tasks,
                dayNotes,
                setUser,
                setDay,
                setTasks,
                setDayNotes,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
