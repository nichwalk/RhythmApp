/* Component for the Search Songs screen */
function SearchSongs(props){

  const [songHits, setSongHits] = useState([]);
  const [song, setSong] = useState("");

  const getSongHits = async(songSearch)=>{
    const response = await fetch("https://shazam.p.rapidapi.com/search?term="+songSearch+"&locale=en-US&offset=0&limit=5", {
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

  const searchSong = (newCity)=>{
    getSongHits(songFormatted).then(result=>{
      let newHits = []
    
      for (var i=0; i< result.data.length; i++){
        newHits.push({
          title: result.tracks.hits[i].track.title,
          artist: result.tracks.hits[i].track.subtitle,
          coverart: result.tracks.hits[i].track.images.coverart,
          id: result.tracks.hits[i].track.key,
        })
      }
      setSongHits(newHits)
    })
  }

  return(
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.innerView}>
          <SearchPanel onClick={searchSong}/>
          <Text>{city}</Text>
          <FlatList
            data={songHits}
            renderItem={({item}) => <SongPanel {...item} />}
            keyExtractor={item => item.id}
          />
        </KeyboardAvoidingView>
    </View>
    )
}

function SearchPanel(props){

    const [cityname, setCityname] = useState("")
    const [song, setSong] = useState("");
    
    let getText = (text)=>{
        //let inputStr = input;
        //console.log("input: "+input);
        let inputFormatted = text.replace(/\s+/g,'%').toLowerCase();
        console.log("input formatted: "+inputFormatted);
        setSong(inputFormatted)
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
              props.onClick(song)
              setSong("")
            }
          }
        >
          <Octicons name="diff-added" size={20} color="gray" />
        </TouchableOpacity>
      </View>
      )
  }

{/* <View style={styles.searchPanel}>
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
</View> */}

function SongPanel(props){

  return(
    <View style={styles.songPanel}>
      <Text>{props.title}</Text>
      <Text>{props.artist}</Text>
      <Image source={{uri:props.coverart}} style={styles.coverart}/>
    </View>
    )
}
