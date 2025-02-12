import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Pressable, BackHandler, Alert } from 'react-native';

// Components
import Header from '@/components/header/header';
import TasksContainer from '../../containers/tasksContainer/tasks';
import NotesContainer from '../../containers/notesContainer/notesContainer';

// Context
import { useGlobalContext } from '@/context/GlobalProvider';
import { getTasksByDate } from '@/db/taskDb';
import { getNotesByDate } from '@/db/noteDb';

export default function Home() {
  const {
    day,
    setTasks,
    loading,
    setDayNotes,
  } = useGlobalContext();


  return (
    <View style={{ flex: 1, gap: 3 }}  >
      <Header />
      <TasksContainer />
      <NotesContainer />
    </View>
  );
}

