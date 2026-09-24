import React, { FC, ReactNode, useEffect, useState } from 'react';
import { View, Alert, BackHandler } from 'react-native';

import { loadDatabase } from '@/db/db';
import { getUser } from '@/db/userDb';
import { useGlobalContext } from './GlobalProvider';
import { useStatesContext } from './StatesProvider';
import Loader from '@/components/loader/loader';

interface AppBootstrapProps {
    children: ReactNode;
}

/**
 * Opens the database and loads the local user before the app renders.
 *
 * This used to live inside the Home screen, which meant the bootstrap only ran
 * because that screen happened to be the first tab. It belongs above the
 * navigator so it cannot be skipped.
 */
export const AppBootstrap: FC<AppBootstrapProps> = ({ children }) => {
    const { setUser } = useGlobalContext();
    const { setDbLoaded, editNoteOpen, editTaskOpen, deletingOpen,
        setEditNoteOpen, setEditTaskOpen, setDeletingOpen } = useStatesContext();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const start = async () => {
            try {
                const result = await loadDatabase();
                if (!result.success) {
                    Alert.alert('Could not open the diary', result.message);
                    return;
                }

                setUser(await getUser());
                setDbLoaded(true);
            } finally {
                setReady(true);
            }
        };

        start();
    }, [setUser, setDbLoaded]);

    // Android back closes whichever overlay is open before leaving the app.
    useEffect(() => {
        const onBack = () => {
            if (editNoteOpen.isOpen || editTaskOpen.isOpen || deletingOpen.isOpen) {
                setEditNoteOpen({ isOpen: false, id: '' });
                setEditTaskOpen({ isOpen: false, id: '' });
                setDeletingOpen({ isOpen: false, id: '', type: null });
                return true;
            }

            Alert.alert('Wait!!', 'Are you sure you want to exit?', [
                { text: 'Cancel', onPress: () => null, style: 'cancel' },
                { text: 'YES', onPress: () => BackHandler.exitApp() },
            ]);
            return true;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
        return () => subscription.remove();
    }, [editNoteOpen, editTaskOpen, deletingOpen, setEditNoteOpen, setEditTaskOpen, setDeletingOpen]);

    if (!ready) {
        return (
            <View style={{ flex: 1 }}>
                <Loader />
            </View>
        );
    }

    return <>{children}</>;
};
