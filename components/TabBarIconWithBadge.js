import * as React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from './TabBarIcon';
import Colors from '../constants/Colors';

export default function TabBarIconWithBadge(props) {
  return (
    <View style={{ width: 24, height: 24, margin: 5}}>
        {props.badgeCount > 0 && (
            <View style={{
                position: 'absolute',
                right: -6,
                top: -3, 
                zIndex: 1,
                backgroundColor: 'red',
                borderRadius: 10,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {props.badgeCount > 0 && <Text style={{color: 'white'}}>{props.badgeCount < 10 ? props.badgeCount : '9+'}</Text>}
            </View>
        )}
        <TabBarIcon {...props}/>
    </View>
  );
}