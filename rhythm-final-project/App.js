import { StatusBar } from 'expo-status-bar';
import React,{useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function App() {
  const Tap = createBottomTabNavigator();
  const [savedSongs, setSaved] = useState([]);

  return (
    <NavigationContainer>
      <Tap.Navigator initialRouteName="First">
        <Tap.Screen
          name="Search"
          component={SearchSong}
          options={{
              title: "",
              tabBarIcon:({color})=>(<MaterialIcons name="search" size={32} color="black" />)
            }}
        />
        <Tap.Screen
          name="Song"
          component={DisplaySong}
          options={{
            title: "",
            tabBarIcon:({color})=>(<MaterialIcons name="library-music" size={32} color="black" />)
          }}
        />
      </Tap.Navigator>
    </NavigationContainer>
  )
}

// Display multiple search result?
  // potentially using functionailty like from weather app
  // allow them to be clickable and when click call for the song details and change page to show that
  // song details should show a lot of the features like music video, lyrics, song title, artist, etc.
  

// Component for the Search Songs Screen
function SearchSong(props){

  function SearchPanel(props){

    const [input, setInput] = useState("");
    const [songID, setSongID] = useState("");
  
    let getText = (text)=>{
      setInput(text)
    }
  
    let getSongID = async()=>{
      let inputStr = input;
      console.log("input: "+input);
      let inputFormatted = inputStr.toString().replace(/\s+/g,'%').toLowerCase();
      console.log("input formatted: "+inputFormatted);
      
      const response = await fetch("https://shazam.p.rapidapi.com/search?term="+inputFormatted+"&locale=en-US&offset=0&limit=5", {
                                      "method": "GET",
                                      "headers": {
                                        "x-rapidapi-host": "shazam.p.rapidapi.com",
                                        "x-rapidapi-key": "220b18ef4fmsha8bfdf4e9be32a4p146066jsnc3e0d1bf20b3"
                                      }
                                  })
     
      const result = await response.json();
  
      let id = result.tracks.hits[0].track.key;
      let idStr = id.toString();
      
      console.log(id.toString());
      setSongID(idStr);
      console.log(songID);
      return result
    }
  
    console.log("After setSongID: "+ songID);
  
    let onPress = async() => {
      console.log("onPress: "+songID);
      const response = await fetch("https://shazam.p.rapidapi.com/songs/get-details?key="+songID+"&locale=en-US", {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "shazam.p.rapidapi.com",
          "x-rapidapi-key": "220b18ef4fmsha8bfdf4e9be32a4p146066jsnc3e0d1bf20b3"
        }
      })
  
      const result = await response.json();
      console.log(result);
  
      console.log(result.sections[1].text)
      // let newSong = 
      // setSaved([...savedSongs,newSong])
      return result
    } 
  
    return(
      <View style={styles.searchPanel}>
        <TextInput
          style={styles.input}
          onChangeText={getText}
          value={input}
          placeholder="lyrics, song name, artist,..."
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={getSongID}>
          <Text style={styles.text}>Shazam: Get song ID</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onPress}>
          <Text style={styles.text}>Shazam: Get song details (lyrics,etc)</Text>
        </TouchableOpacity>
      </View>
  
      )
  }

  return(
    <View style={styles.container}>
      <SearchPanel></SearchPanel>
    </View>
  )
}

// Component for the Displaying Songs Screen
function DisplaySong(props){
  return(
    <View style={styles.container}>
      <Text> Display Song Page </Text>
      <FlatList
            data={savedSongs}
            renderItem={({item}) => <Text {...item} />}
            keyExtractor={item => item.id}
          />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },button:{
    backgroundColor: 'lightgray',
    padding:25,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    width:400,
    margin: 5,
  },searchPanel:{
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
