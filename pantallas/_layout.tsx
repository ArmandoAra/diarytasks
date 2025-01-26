
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { useFonts } from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';


import { useColorScheme } from '@/hooks/useColorScheme';
import { GlobalProvider } from '@/context/GlobalProvider';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { Stack } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();




export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SQLiteProvider databaseName='diaryTasks.db' >
        <GlobalProvider>
          <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>

            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{
                headerShown: false,
                headerTitle: "",
                headerShadowVisible: false,
                headerStyle: { backgroundColor: "#003b35" },
              }} />
              <Stack.Screen name="(home)" options={{ headerShown: false }} />

              <Stack.Screen name="(createTask)" options={{ headerShown: true, headerTitle: 'Create Task', headerTitleAlign: 'center' }} />
              <Stack.Screen name="(createNote)" options={{ headerShown: true, headerTitle: 'Create Note', headerTitleAlign: 'center' }} />
              <Stack.Screen name="(editTask)" options={{ headerShown: true, headerTitle: 'Edit Task', headerTitleAlign: 'center' }} />
              <Stack.Screen name="(editNote)" options={{ headerShown: true, headerTitle: 'Edit Note', headerTitleAlign: 'center' }} />

              <Stack.Screen name="+not-found" />
            </Stack >

          </ThemeProvider>
        </GlobalProvider>
      </SQLiteProvider>
    </SafeAreaView>
  );
}
