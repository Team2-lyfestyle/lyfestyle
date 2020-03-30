import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TouchableHighlight} from "react-native";
import { Ionicons, MaterialIcons, AntDesign, FontAwesome, Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile({navigation}) {
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
                        height: 300,
                    }}
                />
                <TouchableHighlight style = {styles.settingsIcon} onPress={() => navigation.navigate('Home')}>
                    <Feather name = "log-out" size = {23} color = "black"/>
                </TouchableHighlight>
                
                {/* Profile Image  */}
                <View style = {[styles.center, {marginTop: 8}]}>
                    <View style = {styles.profileImage}>
                        <Image source={require("../assets/images/profile_pic.jpg")} style = {styles.profileImage}></Image>
                    </View>
                </View>
                {/* Name */}
                <View style = {[styles.center, {marginTop: 30}, {marginBottom: 15}]}>
                    <Text style = {[{fontSize: 30}, { fontWeight: '400' }]}>John Doe</Text>
                    {/* Followers Count  */}
                    {/* <View style = {[{marginTop: 15}, {alignItems: 'center'}]}>
                        <Text style = {{fontSize: 15}}>150</Text>
                        <Text style = {{fontSize: 10}, {color: '#AEB5BC'}}>Followers</Text>
                    </View> */}
                </View>
            </View>
       
                {/* Bio  */}
                <View style = {styles.statsContainer}>
                    <View style = {[{marginTop: 10}]}>
                        <Text style = {[{fontSize: 15}, { fontWeight: 'bold' }]}>Bio </Text>
                    </View>
                </View>

                <View style = {styles.centerBio}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt enim quis laoreet dapibus. Nulla lacinia posuere diam aliquam tincidunt. Vivamus commodo ligula quis nisl placerat laoreet.</Text>
                </View>
                {/* Stats Container */}
                <View style = {styles.statsContainer}>
                    <View style = {[{marginTop: 10}]}>
                        <Text style = {[{fontSize: 15}, { fontWeight: 'bold' }]}>100 </Text>
                        <Text style = {[{fontSize: 10}, { fontWeight: 'bold' }, {color: 'grey'}]}>Posts</Text>
                    </View>
                </View>
                {/* Picture Container  */}
                <View style = {styles.pictureContainer}>
                    {/* Scroll pictures in the horizontal direction  */}
                    <ScrollView horizontal = {true} showsHorizontalScrollIndicator = {false}>
                        <View style = {styles.mediaImage}>
                            <Image source = {require("../assets/images/1.jpg")} style = {styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style = {styles.mediaImage}>
                            <Image source = {require("../assets/images/2.jpg")} style = {styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style = {styles.mediaImage}>
                            <Image source = {require("../assets/images/3.jpg")} style = {styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style = {styles.mediaImage}>
                            <Image source = {require("../assets/images/4.jpg")} style = {styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style = {styles.mediaImage}>
                            <Image source = {require("../assets/images/5.jpg")} style = {styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style = {styles.mediaImage}>
                            <Image source = {require("../assets/images/6.jpg")} style = {styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style = {styles.mediaImage}>
                            <Image source = {require("../assets/images/7.jpg")} style = {styles.image} resizeMode="cover"></Image>
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEdF4'
    },

    // Properties for Header container 
    header: {
        paddingTop: 15,
        paddingBottom: 16,
        backgroundColor: '#204051',
        // alignItems: 'center',
        // justifyContent: 'center',
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
        marginTop: 25,
        marginRight: 20,
        alignItems: 'flex-end',
        flex: 1
    },

    // Properties for the profile picture 
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        shadowColor: '#202020',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 5,
    },

    // Properties to center Bio for profile
    centerBio: {
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
    },

    // Stats = Number of posts container 
    statsContainer: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 1.5,
        paddingBottom: 5
        // alignSelf: 'center'
    },

    // Sets margin for image container 
    pictureContainer: {
        marginTop: 30,
        marginBottom: 30
    },

    // Container for images 
    mediaImage: {
        width: 170,
        height: 190,
        borderRadius: 12,
        overflow: 'hidden',
        marginHorizontal: 12.5
    },

    // Properties for images(posts) 
    image : {
        flex: 1,
        width: undefined,
        height: undefined
    }
})