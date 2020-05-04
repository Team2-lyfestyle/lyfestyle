import React from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import AuthContext from '../constants/AuthContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import queries from '../util/firebase_queries';

export default function Profile({post}) {
    //Used for sign out icon
    const {signOut} = React.useContext(AuthContext);
    // const [updateCurrentUser] = React.useState(false);
    const [postsByUser, setPostsByUser] = React.useState(false);
    const [nameOfUser, setnameOfUser] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [picture, setPicture] = React.useState('');

    React.useEffect(() => {
        async function askPermission() {
            if (Constants.platform.ios) {
                const { statusRoll } = await Permissions.aAsync(Permissions.CAMERA_ROLL);
                const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
                CAMERA
                if (statusRoll !== 'granted' && statusCamera !== 'granted') {
                  console.log("Gimme Permission")
                }
            };
        }
        getCurrentUserPost();
        getCurrUser();
        // console.log(user);
    }, []);

    // Photo library 
    let handlePostPhotoLibrary = () => {
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
          allowsEditing: true,
        }).then(async (result) => {
          await queries.updateCurrentUser({bio: 'My name is Israel Perez and I attend California State University, Fresno. I am studying computer science and will graduate in 1.5 years. I enjoy playing video games, eating, and going outdoors.'},result.uri);
        });
    };

    // User information 
    let getCurrUser = async () => {
        let callback = (snapshot) => {
            setnameOfUser(snapshot.name)
            setBio(snapshot.bio)
            setPicture(snapshot.media)
        }
        await queries.getCurrentUser(callback)
        // console.log(user)
    }

    // Gets user posts 
    let getCurrentUserPost = async () => {

        let callback = (snapshot) => {
            let postArray = []
            Object.keys(snapshot).forEach(key => {
                let temp = snapshot[key]
                temp.id = key
                postArray.push(temp)
            })
            
            setPostsByUser(postArray);
            setnameOfUser(postArray[0].displayName);
            // console.log(postArray[1].description);
        }
        await queries.getCurrUserPosts(callback)
    }
    console.log(postsByUser)
    // Function that flat list uses to render posts 
    renderPost = (post) => {
        return (
            <View style = {styles.pictureContainer}>
                <ScrollView horizontal = {true} showsHorizontalScrollIndicator = {false}>
                    <View style = {styles.mediaImage}>
                        <Image
                            source={{uri:post.media}}
                            style={styles.postImage}
                            resizeMode='contain'
                        />
                    </View>
                </ScrollView>
            </View>
      );
    }
    renderProfilePic = () => {
        if(picture)
            return (<Image source={{uri: picture}} style = {styles.profileImage}></Image>)
        else    
            return (<Image source={require("../assets/images/doctor.png")} style = {styles.profileImage}></Image>)

    }
    

    return (
        <View style = {styles.container}>
        <ScrollView showsVerticalScrollIndicator = {false}>
            <View style = {styles.header}>
                <LinearGradient
                    colors={['rgba(rgba(0, 254, 212, 1))', 'transparent']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: hp('35%'),
                    }}
                />

                <TouchableOpacity style = {styles.settingsIcon} onPress={() => { signOut() }}>
                    <Feather 
                        name = "log-out" 
                        size = {23} 
                        color = "black"
                    />
                </TouchableOpacity>
                
                {/* Profile Image  */}
                <View style = {[styles.center, {marginTop: 8}]}>
                    <View style = {styles.profileImage}>
                        {renderProfilePic()}
                    </View>
                    {/* Edit profile picture icon  */}
                    <TouchableOpacity style = {styles.edit}>
                        <Feather 
                            name = "edit-2" 
                            size = {25} 
                            color = "black"
                            onPress={() => handlePostPhotoLibrary()}
                        />
                    </TouchableOpacity>
                </View>
                {/* Name */}
                <View style = {[styles.center, {marginTop: 30}, {marginBottom: 15}]}>
                    <Text style = {[{fontSize: 30}, { fontWeight: '400' }]}>{nameOfUser}</Text>
                </View>
            </View>
        
                {/* Bio Title */}
                <View style = {[styles.statsContainerBio, {justifyContent:'space-between'}]}>
                    <View style = {{marginTop: hp('1.5%')}}>
                        <Text style = {[{fontSize: 15}, { fontWeight: '700' }]}>Bio </Text>
                    </View>
                    <TouchableOpacity style = {styles.editBio}>
                        <Feather 
                            name = "edit-2" 
                            size = {22} 
                            color = "black"
                            onPress={() => handlePostPhotoLibrary()}
                        />
                    </TouchableOpacity>
                </View>
                {/* Bio  */}
                <View style = {styles.centerBio}>
                    <Text>{bio}</Text>
                </View>

                {/* Stats Container */}
                <View style = {styles.statsContainer}>
                    <View style = {[{marginTop: hp('1.5%')}]}>
                        <Text style = {[{fontSize: 15}, { fontWeight: '700' }]}>Posts</Text>
                    </View>
                </View>
                {/* Flat list for images (posts) */}
                <FlatList
                    horizontal
                    style={styles.feed}
                    data={postsByUser}
                    renderItem={({ item }) => renderPost(item)}
                    keyExtractor={(item) => item.id}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    //Container for profile page
    container: {
        flex: 1,
        backgroundColor: '#EFEdF4',
    },

    // Properties for Header container 
    header: {
        paddingTop: 15,
        paddingBottom: 16,
        backgroundColor: '#204051',
        borderBottomWidth: 1,
        borderBottomColor: '#EBECF4',
        shadowColor: '#454D65',
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    
    center: {
        alignSelf: 'center',
    },

    // Properties for Settings icon 
    settingsIcon: {
        width: wp('6%'),
        height: hp('3%'),
        marginTop: hp('3%'),
        marginRight: wp('3%'),
        marginLeft: wp('90%'),
        flex: 1
    },

    // Properties for the profile picture 
    profileImage: {
        width: wp('35%'),
        height: hp('16%'),
        borderRadius: 100,
        shadowColor: '#202020',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 5,
    },

    // Edit icon for profile picture 
    edit: {
        backgroundColor: "#EFEdF4",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: wp('11%'),
        height: hp('5%'),
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },

    // Stats = Number of posts container 
    statsContainerBio: {
        flexDirection: 'row',
        marginLeft: wp('3%'),
        marginRight: wp('3%'),
        borderBottomWidth: 1.5,
        paddingBottom: 5,
    },

    // Properties to center Bio for profile
    centerBio: {
        // backgroundColor: 'white',
        // width: wp('90%'),
        // height: hp('10%'),
        // borderRadius: 20,
        alignSelf: 'center',
        // alignItems: 'center',
        // justifyContent: 'center',
        padding: 8,
        // marginTop: hp('3%'),
        // marginBottom: hp('3%'),
        marginVertical: hp('3%'),
        // marginLeft: wp('3%'),
        // marginRight: wp('3%'),
        marginHorizontal: wp('3%')
    },

    //Edit icon for bio
    editBio: {
        position: 'relative',
        width: wp('10%'),
        height: hp('4%'),
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },

    // Stats = Number of posts container 
    statsContainer: {
        flexDirection: 'row',
        marginLeft: wp('3%'),
        marginRight: wp('3%'),
        borderBottomWidth: 1.5,
        paddingBottom: 10,
    },

    // Margin horizontal for post feed 
    feed: {
        marginHorizontal: 0,
    },

    // Sets margin for image container 
    pictureContainer: {
        marginTop: hp('0%'),
        marginBottom: hp('0%')
    },

    // Container for each image
    mediaImage: {
        width: wp('57%'),
        height: hp('35%'),
        // borderRadius: 30,
        overflow: 'hidden',
        marginHorizontal: wp('3.5%')
    },

    //Properties for images (posts)
    postImage: {
        flex: 1,
        borderRadius: 15
      },
})