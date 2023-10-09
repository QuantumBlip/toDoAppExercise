import { StatusBar } from 'expo-status-bar';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const STORAGE_KEY = 'todos'

export default function App() {
  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState([])

  const storeData = async(value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  const getData = async() => {
    try {
      return AsyncStorage.getItem(STORAGE_KEY)
      .then(req => JSON.parse(req))
      .then(json => {
        if (json === null){
          json = []
        }
        setTodos(json)
      })
    }catch (error) {
      console.log(error)
    }
  }

  const addTodo = () => {
    const newKey = String(todos.length)
    const object = {key: newKey, description: newTodo}
    const newTodos = [...todos, object]
    storeData(newTodos)
    setTodos(newTodos)
    setNewTodo('')
  }

  useEffect(() => {
    //AsyncStorage.clear()
    getData()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>ToDos</Text>
      <TextInput
        style={styles.input}
        placeholder='Enter new todo...'  
        value={newTodo}
        onChangeText={text => setNewTodo(text)}
        returnKeyType='done'
        onSubmitEditing={() => addTodo()}
      />
      <FlatList 
        style={styles.list}
        data={todos}
        renderItem={({item}) => 
          <Text>{item.description}</Text>
        }
      />

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderColor: '#fafafa',
    height: 40,
    margin: 8,
  },
  list: {
    margin: 8
  }
});

