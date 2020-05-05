import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import AuthContext from '../constants/AuthContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import { windowHeight, windowWidth } from '../constants/Dimensions';
import { TouchableOpacity } from "react-native-gesture-handler";


export default function Profile({navigation}) {

    //const {signOut} = React.useContext(AuthContext)

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
                        // height: 300,
                        height: hp('35%'),
                    }}
                />

                <TouchableOpacity style = {styles.settingsIcon} onPress={() => { signOut() }}>
                    <Feather name = "log-out" size = {23} color = "black"/>
                </TouchableOpacity>
                
                {/* Profile Image  */}
                <View style = {[styles.center, {marginTop: 8}]}>
                    <View style = {styles.profileImage}>
                        <Image source={require("../assets/images/profile_pic.jpg")} style = {styles.profileImage}></Image>
                    </View>
                </View>
                {/* Name */}
                <View style = {[styles.center, {marginTop: 30}, {marginBottom: 15}]}>
                    <Text style = {[{fontSize: 30}, { fontWeight: '400' }]}>John Doe</Text>
                </View>
            </View>
       
                {/* Bio  */}
                <View style = {styles.statsContainer}>
                    <View style = {[{marginTop: hp('1.5%')}]}>
                        <Text style = {[{fontSize: 15}, { fontWeight: '700' }]}>Bio </Text>
                    </View>
                </View>

                <View style = {styles.centerBio}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt enim quis laoreet dapibus. Nulla lacinia posuere diam aliquam tincidunt. Vivamus commodo ligula quis nisl placerat laoreet.</Text>
                </View>
                {/* Stats Container */}
                <View style = {styles.statsContainer}>
                    <View style = {[{marginTop: hp('1.5%')}]}>
                        <Text style = {[{fontSize: 15}, { fontWeight: '700' }]}>100 </Text>
                        <Text style = {[{fontSize: 10}, { fontWeight: '700' }, {color: 'grey'}]}>Posts</Text>
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

    // Properties to center Bio for profile
    centerBio: {
        alignSelf: 'center',
        marginTop: hp('3%'),
        marginBottom: hp('3%'),
        marginLeft: wp('3%'),
        marginRight: wp('3%'),
    },

    // Stats = Number of posts container 
    statsContainer: {
        flexDirection: 'row',
        marginLeft: wp('3%'),
        marginRight: wp('3%'),
        borderBottomWidth: 1.5,
        paddingBottom: 5
    },

    // Sets margin for image container 
    pictureContainer: {
        marginTop: hp('3%'),
        marginBottom: hp('3%')
    },

    // Container for images 
    mediaImage: {
        width: wp('47%'),
        height: hp('25%'),
        borderRadius: 12,
        overflow: 'hidden',
        marginHorizontal: wp('3.5%')
    },

    // Properties for images(posts) 
    image : {
        flex: 1,
        width: undefined,
        height: undefined
    }
})