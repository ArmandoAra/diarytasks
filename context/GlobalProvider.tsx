import { CreateNoteProps } from '@/interfaces/NotesInterfaces';
import { CreateTaskProps } from '@/interfaces/TasksInterfaces';
import { formatDate, formatDateToString } from '@/Utils/helpFunctions';
import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    name: string;
}

interface EditProps {
    isOpen: boolean,
    id: string
}

interface GlobalContextProps {
    user: User;
    loading: boolean;
    day: string;
    editTaskOpen: EditProps;
    editNoteOpen: EditProps;
    tasks: CreateTaskProps[];
    dayNotes: CreateNoteProps[];
    setUser: React.Dispatch<React.SetStateAction<User>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setDay: React.Dispatch<React.SetStateAction<string>>;
    setEditTaskOpen: React.Dispatch<React.SetStateAction<EditProps>>;
    setEditNoteOpen: React.Dispatch<React.SetStateAction<EditProps>>;
    setTasks: React.Dispatch<React.SetStateAction<CreateTaskProps[]>>;
    setDayNotes: React.Dispatch<React.SetStateAction<CreateNoteProps[]>>;
}


const GlobalContext = createContext<GlobalContextProps>({
    user: {
        id: "",
        name: ""
    },
    loading: true,
    day: '',
    editTaskOpen: {
        isOpen: false,
        id: ""
    },
    editNoteOpen: {
        isOpen: false,
        id: ""
    },
    tasks: [],
    dayNotes: [],
    setUser: () => { },
    setLoading: () => { },
    setDay: () => { },
    setEditTaskOpen: () => { },
    setEditNoteOpen: () => { },
    setTasks: () => { },
    setDayNotes: () => { },
});

export const useGlobalContext = () => useContext(GlobalContext);

interface GlobalProviderProps {
    children: ReactNode;
}



export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User>({ id: "", name: "" });
    const [day, setDay] = useState<string>(formatDate(new Date()));
    const [tasks, setTasks] = useState<CreateTaskProps[]>([])
    const [dayNotes, setDayNotes] = useState<CreateNoteProps[]>([])
    const [editTaskOpen, setEditTaskOpen] = useState<EditProps>({ isOpen: false, id: "" });
    const [editNoteOpen, setEditNoteOpen] = useState<EditProps>({ isOpen: false, id: "" });


    return (
        <GlobalContext.Provider
            value={{
                user,
                loading,
                day,
                editTaskOpen,
                editNoteOpen,
                tasks,
                dayNotes,
                setUser,
                setDay,
                setEditTaskOpen,
                setEditNoteOpen,
                setLoading,
                setTasks,
                setDayNotes,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
