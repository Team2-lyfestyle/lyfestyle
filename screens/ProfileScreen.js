import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TouchableHighlight} from "react-native";
import { Ionicons, MaterialIcons, AntDesign, FontAwesome} from '@expo/vector-icons'
// import { Header } from "react-native/Libraries/NewAppScreen";

export default function Profile({navigation}) {
    return (
        <SafeAreaView style = {styles.container}>
            {/* Allow for scroll on profile page */}
            <ScrollView showsVerticalScrollIndicator = {false}>
                <TouchableHighlight style = {styles.settingsIcon} onPress={() => navigation.navigate('Home')}>
                    <Ionicons name = "md-more" size = {32} color = "grey"/>
                </TouchableHighlight>
                
                {/*
                <View style = {[{marginTop: 20}, {marginRight: 20}, {alignItems: 'flex-end'}]}>
                    <Ionicons name = "md-more" size = {32} color = "grey"/>
                    <AntDesign name = "setting" size = {32} color = "grey"/> 
                </View>
                */}
                
                {/* Profile Image  */}
                <View style = {[styles.center, {marginTop: 10}]}>
                    <View style = {styles.profileImage}>
                        <Image source={require("../assets/images/profile_pic.jpg")} style = {styles.profileImage}></Image>
                    </View>
                </View>
                {/* Name */}
                <View style = {[styles.center, {marginTop: 30}, {marginBottom: 15}]}>
                    <Text style = {[{fontSize: 30}, { fontWeight: '200' }]}>John Doe</Text>
                    {/* Followers Count  */}
                    {/* <View style = {[{marginTop: 15}, {alignItems: 'center'}]}>
                        <Text style = {{fontSize: 15}}>150</Text>
                        <Text style = {{fontSize: 10}, {color: '#AEB5BC'}}>Followers</Text>
                    </View> */}
                </View>
                {/* Bio  */}
                <View style = {styles.centerBio}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt enim quis laoreet dapibus. Nulla lacinia posuere diam aliquam tincidunt. Vivamus commodo ligula quis nisl placerat laoreet.</Text>
                </View>
                {/* Stats Container */}
                <View style = {styles.statsContainer}>
                    <View style = {[{alignItems: 'center'}, {marginTop: 10}]}>
                        <Text style = {[{fontSize: 15}, { fontWeight: '200' }]}>100</Text>
                        <Text style = {[{fontSize: 10}, { fontWeight: '200' }, {color: 'grey'}]}>Posts</Text>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    center: {
        alignSelf: 'center',
    },

    settingsIcon: {
        marginTop: 10,
        marginRight: 20,
        alignItems: 'flex-end'
    },

    // Properties to center Bio for profile
    centerBio: {
        alignSelf: 'center',
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
    },

    // Properties for the profile picture 
    profileImage: {
        width: 180,
        height: 180,
        borderRadius: 90,
    },

    // Stats = Number of posts container 
    statsContainer: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 2,
        paddingBottom: 5
        // alignSelf: 'center'
    },

    // Sets margin for image container 
    pictureContainer: {
        marginTop: 20,
        marginBottom: 20
    },

    // Container for images 
    mediaImage: {
        width: 130,
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
        marginHorizontal: 10
    },

    // Properties for images(posts) 
    image : {
        flex: 1,
        width: undefined,
        height: undefined
    }
})