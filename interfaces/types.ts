// navigation/types.ts
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type BottomTabParamList = {
    Home: undefined;
    HomeTab: undefined;
    Timeline: undefined;
    Notes: undefined;
    Favorites: undefined;
    Gallery: undefined;
    Map: undefined;
};

// Tipo para usar en useNavigation() en los componentes(Home, CreateTask, CreateNote, Favorites, Map)
export type BottomTabNavProps = BottomTabNavigationProp<BottomTabParamList>;


export type RootStackParamList = {
    Home: undefined;
    Timeline: undefined;
    Notes: undefined;
    Gallery: undefined;
    EditNote: { id: string };
    EditTask: { id: string };
    CreateTask: undefined;
    CreateNote: undefined;
    Favorites: undefined;
    Map: undefined;
    Settings: undefined;
    HomeTab: undefined;
};

