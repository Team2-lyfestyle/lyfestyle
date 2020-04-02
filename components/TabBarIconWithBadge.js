import * as React from 'react';
import { View } from 'react-native';
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
                backgroundColor: 'red',
                borderRadius: 6,
                width: 12,
                height: 12,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {props.badgeCount > 0 && <Text>{props.badgeCount}</Text>}
            </View>
        )}
        <TabBarIcon {...props}/>
    </View>
  );
}