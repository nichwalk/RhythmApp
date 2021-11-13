import { StatusBar } from 'expo-status-bar';
import React,{useState, useEffect} from 'react';
import { StyleSheet, Text, View,TouchableOpacity,TextInput } from 'react-native';

export default function App() {
  const [input, setInput] = useState("")

  let getText = (text)=>{
    setInput(text)
  }

  let onPress = () => {
    fetch("https://shazam.p.rapidapi.com/search?term=kiss%20the%20rain&locale=en-US&offset=0&limit=5", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "shazam.p.rapidapi.com",
		"x-rapidapi-key": "220b18ef4fmsha8bfdf4e9be32a4p146066jsnc3e0d1bf20b3"
	}
    })
    .then(response => {
	    console.log(response.json());
    })
    .catch(err => {
	    console.error(err);
    });
  }
  return (
    <View style={styles.container}>
      <SearchPanel/>
    </View>
  );
}

function SearchPanel(props){

  const [input, setInput] = useState("")
  const [songID, setSongID] = useState("")

  let getText = (text)=>{
    setInput(text)
  }

  let getSongID = async(input)=>{
    
    const response = await fetch("https://shazam.p.rapidapi.com/search?term=kiss%20the%20rain&locale=en-US&offset=0&limit=5", {
                                    "method": "GET",
                                    "headers": {
                                      "x-rapidapi-host": "shazam.p.rapidapi.com",
                                      "x-rapidapi-key": "220b18ef4fmsha8bfdf4e9be32a4p146066jsnc3e0d1bf20b3"
                                    }
                                })
   
    const result = await response.json();

    console.log(result.tracks.hits[0].track.key);
    setSongID(result.tracks.hits[0].track.key);
    console.log(songID);
    return result
  }

  console.log(songID);

  let onPress = async(songID) => {
    console.log(songID);
    const response = await fetch("https://shazam.p.rapidapi.com/songs/get-details?key=40333609&locale=en-US", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "shazam.p.rapidapi.com",
        "x-rapidapi-key": "220b18ef4fmsha8bfdf4e9be32a4p146066jsnc3e0d1bf20b3"
      }
    })

    const result = await response.json();

    console.log(result)
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
