import { Pressable, StyleSheet, Text, View, Button, Image, SafeAreaView, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors"


// Endpoints for authorizing with Spotify
// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};


const Song = (name, albumImage) => {
  return(
    <View>
      <Text>{name}</Text>
      <Image source={{ uri: albumImage}}/>
    </View>
    
    //         <Text style= {{color:'white'}}> {name} </Text>

  );
}

let contentDisplayed = null;
export default function App() {
  

  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);


  const renderSong = (item) => (
      <Song
        name = {item.name}
        albumImage={item.album.images[0].url}
      />

  )

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    const fetchTracks = async () => {
      // TODO: Comment out which one you don't want to use
      // myTopTracks or albumTracks

      const res = await myTopTracks(token);
      //const res = await albumTracks('0FHpjWlnUmplF5ciL84Wpa?si=LW1QU1cdTHOPM74faZse9Q', token);
      setTracks(res);
      console.log(tracks);

    };

    const SpotifyAuthButton = () => {
      return (
        //<Button title = "work" onPress={()=>promptAsync()}>

        //</Button>
        
        <Pressable 
                  onPress={() => {
                    promptAsync();
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? '#1ED760'
                        : '#1DB954',
                        borderRadius: 9999,
                        height: 30,
                        width: 200,
                    },
                    styles.wrapperCustom
                  ]}>
    
                  {({ pressed }) => (
                    <View style = {{display: 'flex', flexDirection: "row", justifyContent: 'center', alignItems:'center'}}>
                    <Image style= {{width:15,height: 15, marginTop:7}} source={require("./assets/spotify-logo.png")}/>
                    <Text style={{paddingLeft: 7, color: 'white', fontWeight: 'bold', marginTop:7}}>
                      {pressed ? 'CONNECT WITH SPOTIFY' : 'CONNECT WITH SPOTIFY'}
                    </Text>
                    
    
                    </View>
                    
                  )}
                  
              </Pressable>
      );
    }
    
    if (token) {
      
      // Authenticated, make API request
      
      fetchTracks();

     contentDisplayed = <FlatList
                data={tracks}
                renderSong={({ item }) => renderSong(item)}
                keyExtractor={(item) => item.id}
      />

      
    }else{
      contentDisplayed = <SpotifyAuthButton/>
    }
  }, [token]);

  return (

    <SafeAreaView style={styles.container}>
      {contentDisplayed}
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  text: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  homeScreen: {
    alignItems: 'center', 
    justifyContent: 'center',
  },
  homeScreenText: {
    fontSize: 12,
  },
});
