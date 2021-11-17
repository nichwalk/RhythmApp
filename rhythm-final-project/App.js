import { StatusBar } from 'expo-status-bar';
import React,{useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Keyboard } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SearchSongs">
        <Stack.Screen
          name="Search"
          component={SearchSongs}
          // options={{
          //     title: "",
          //     tabBarIcon:({color})=>(<MaterialIcons name="search" size={32} color="black" />)
          //   }}
        />
        <Stack.Screen
          name="Song"
          component={DisplaySong}
          // options={{
          //   title: "",
          //   tabBarIcon:({color})=>(<MaterialIcons name="library-music" size={32} color="black" />)
          // }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// Display multiple search result?
  // potentially using functionailty like from weather app
  // allow them to be clickable and when click call for the song details and change page to show that
  // song details should show a lot of the features like music video, lyrics, song title, artist, etc.


/* Component for the Search Songs screen */
function SearchSongs(props){

  const [songHits, setSongHits] = useState([]);
  const [song, setSong] = useState("");

  const getSongHits = async(songSearch)=>{
    const response = await fetch("https://shazam.p.rapidapi.com/search?term="+songSearch+"&locale=en-US&offset=0&limit=5", {
                                      "method": "GET",
                                      "headers": {
                                        "x-rapidapi-host": "shazam.p.rapidapi.com",
                                        'x-rapidapi-key': '55a5bf3b8cmsh3d96fd7314bde17p1b7de7jsn3a872e28fec0'
                                      }
                                  })
    
    const result = await response.json();

    console.log(result)
    return result
  }

  const searchSong = (songFormatted)=>{
    getSongHits(songFormatted).then(result=>{
      let newHits = []
    
      for (var i=0; i< result.tracks.hits.length; i++){
        newHits.push({
          title: result.tracks.hits[i].track.title,
          artist: result.tracks.hits[i].track.subtitle,
          coverart: result.tracks.hits[i].track.images.coverart,
          id: result.tracks.hits[i].track.key,
        })
      }
      setSongHits(newHits)
      Keyboard.dismiss()
    })
  }

  const getSongDetails = async(songID)=>{
    const response = await fetch("https://shazam.p.rapidapi.com/songs/get-details?key="+songID+"&locale=en-US", {
                                  "method": "GET",
                                  "headers": {
                                    "x-rapidapi-host": "shazam.p.rapidapi.com",
                                    'x-rapidapi-key': '55a5bf3b8cmsh3d96fd7314bde17p1b7de7jsn3a872e28fec0'
                                  }
                                })
    
    const result = await response.json();

    console.log(result)
    return result
  }

  const searchDetails = (songID)=>{
    if(songID != ""){
      getSongDetails(songID).then(result=>{
        // let song 
      
        // for (var i=0; i< result.tracks.hits.length; i++){
        //   newHits.push({
        //     title: result.tracks.hits[i].track.title,
        //     artist: result.tracks.hits[i].track.subtitle,
        //     coverart: result.tracks.hits[i].track.images.coverart,
        //     id: result.tracks.hits[i].track.key,
        //   })
        // }
        // setSongHits(newHits)
        console.log("Test title: "+result.title)
        console.log(result)
        props.navigation.navigate('Song', {data: result},)
      })
    }
    
  }

  return(
    <View style={styles.container}>
      {/* <KeyboardAvoidingView behavior="padding" style={styles.innerView}> */}
          <SearchPanel onClick={searchSong}/>
          <FlatList
            data={songHits}
            renderItem={({item}) => <SongPanel onPress={searchDetails} {...item} />}
            keyExtractor={item => item.id}
            style={styles.innerView}
          />
        {/* </KeyboardAvoidingView> */}
    </View>
    )
}

function SearchPanel(props){
    const [song, setSong] = useState("");
    
    let getText = (text)=>{
        setSong(text)
    }
  
    return(
      <View style={styles.searchPanel}>
        <TextInput
          style={styles.input}
          onChangeText={getText}
          value={song}
          placeholder="lyrics, song name, artist,..."
        />
  
        <TouchableOpacity
          style={styles.button}
          onPress={
            ()=>{
              props.onClick(song.replace(/\s+/g,'%').toLowerCase())
              setSong("")
            }
          }
        >
          <MaterialIcons name="search" size={32} color="black" />
        </TouchableOpacity>
      </View>
      )
  }


function SongPanel(props){

  return(
    <TouchableOpacity 
      style={styles.songPanel}
      onPress={()=>{
        props.onPress(props.id)
        
      }}
    >
      <Text>{props.title}</Text>
      <Text>{props.artist}</Text>
      <Image source={{uri:props.coverart}} style={styles.coverart}/>
      
    </TouchableOpacity>
    )
}


// Component for the Displaying Songs Screen
function DisplaySong(props){
  let songData =props.route.params.data;
  console.log(songData)
  return(
    <View style={styles.container}>
      <Text>Song Title: {songData.title} </Text>
      {/* <FlatList
            data={savedSongs}
            renderItem={({item}) => <Text {...item} />}
            keyExtractor={item => item.id}
          /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width:"100%",
    height:"100%",
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40
  },button:{
    backgroundColor: 'lightgray',
    padding:5,
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
    width:"70%",
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
  },songPanel:{
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 3,
    margin: 5,
    flexDirection: 'column', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },coverart:{
    width:100,
    height:100
  }, innerView:{
    width:"80%"
  }
});
