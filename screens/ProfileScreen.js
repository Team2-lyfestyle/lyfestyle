import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView} from "react-native";
import { Ionicons, MaterialIcons} from '@expo/vector-icons'

export default function App() {
    return (
        <SafeAreaView style = {styles.container}>
            {/* Allow for scroll on profile page */}
            <ScrollView showsVerticalScrollIndicator = {false}>
                {/* Profile Image  */}
                <View style = {[styles.centerThing, {marginTop: 30}]}>
                    <View style = {styles.profileImage}>
                        <Image source={require("../assets/images/profile_pic.jpg")} style = {styles.profileImage}></Image>
                    </View>
                </View>
                {/* Name */}
                <View style = {[styles.centerThing, {marginTop: 30}, {marginBottom: 15}]}>
                    <Text style = {[{fontSize: 30}, { fontWeight: '200' }]}>John Doe</Text>
                    <View style = {[{marginTop: 15}, {alignItems: 'center'}]}>
                        <Text style = {{fontSize: 15}}>150</Text>
                        <Text style = {{fontSize: 10}, {color: '#AEB5BC'}}>Followers</Text>
                    </View>
                </View>
                {/* Bio  */}
                <View style = {styles.centerThing2}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt enim quis laoreet dapibus. Nulla lacinia posuere diam aliquam tincidunt. Vivamus commodo ligula quis nisl placerat laoreet.</Text>
                </View>
                {/* Stats Container; NOT WORKING  */}
                <View style = {styles.statsContainer}>
                    <View style = {[{alignItems: 'center'}, {marginTop: 10}]}>
                        <Text style = {{fontSize: 15}}>100</Text>
                        <Text style = {{fontSize: 10}, {color: '#AEB5BC'}}>Posts</Text>
                    </View>
                </View>
                <View style = {styles.pictureContainer}>
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

    centerThing: {
        alignSelf: 'center',
    },

    centerThing2: {
        alignSelf: 'center',
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
    },

    // Properties for the profile picture 
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        // overflow: 'hidden'
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
        // margin: 20
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