import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

interface EditProps {
    isOpen: boolean,
    id: string
}

interface DeletingProps {
    isOpen: boolean,
    id: string,
    type: "Task" | "Note" | null
}

interface StatesContextProps {
    loading: boolean;
    dbLoaded: boolean;
    settingsOpen: boolean;
    createTaskOpen: boolean;
    createNoteOpen: boolean;
    editTaskOpen: EditProps;
    editNoteOpen: EditProps;
    deletingOpen: DeletingProps;

    setDbLoaded: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCreateTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCreateNoteOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDeletingOpen: React.Dispatch<React.SetStateAction<DeletingProps>>;
    setEditTaskOpen: React.Dispatch<React.SetStateAction<EditProps>>;
    setEditNoteOpen: React.Dispatch<React.SetStateAction<EditProps>>;
}

const StatesContext = createContext<StatesContextProps>({
    settingsOpen: false,
    createTaskOpen: false,
    createNoteOpen: false,
    deletingOpen: { isOpen: false, id: "", type: null },
    editTaskOpen: { isOpen: false, id: "" },
    editNoteOpen: { isOpen: false, id: "" },
    loading: false,
    dbLoaded: false,

    setLoading: () => { },
    setDbLoaded: () => { },
    setSettingsOpen: () => { },
    setCreateTaskOpen: () => { },
    setCreateNoteOpen: () => { },
    setDeletingOpen: () => { },
    setEditTaskOpen: () => { },
    setEditNoteOpen: () => { },
});

export const useStatesContext = () => useContext(StatesContext);

interface StatesProviderProps {
    children: ReactNode;
}

export const StatesProvider: FC<StatesProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [dbLoaded, setDbLoaded] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [createTaskOpen, setCreateTaskOpen] = useState<boolean>(false);
    const [createNoteOpen, setCreateNoteOpen] = useState<boolean>(false);
    const [editTaskOpen, setEditTaskOpen] = useState<EditProps>({ isOpen: false, id: "" });
    const [editNoteOpen, setEditNoteOpen] = useState<EditProps>({ isOpen: false, id: "" });
    const [deletingOpen, setDeletingOpen] = useState<DeletingProps>({ isOpen: false, id: "", type: null });

    return (
        <StatesContext.Provider
            value={{
                loading,
                dbLoaded,
                settingsOpen,
                createTaskOpen,
                createNoteOpen,
                editTaskOpen,
                editNoteOpen,
                deletingOpen,
                setLoading,
                setDbLoaded,
                setSettingsOpen,
                setCreateTaskOpen,
                setCreateNoteOpen,
                setEditTaskOpen,
                setEditNoteOpen,
                setDeletingOpen,
            }}
        >
            {children}
        </StatesContext.Provider>
    );
};
