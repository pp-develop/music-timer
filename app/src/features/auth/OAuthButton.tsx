import React, { useState } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import {axios} from '../../lib/axos';

export const OAuthButton = () => {
    // const { title = 'Save' } = props;
    const [isLogin, setIsLogin] = useState(false);

    const onPress = () => {
        axios.get('/authz-url', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }
        })
            .then(function (response) {
                console.log(response);
                console.log(response.data.url);
                setIsLogin(true);
                window.location.href = response.data.url;
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    };

    if (isLogin) {
        return (
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.text}>Logout</Text>
            </Pressable>
        )
    } else {
        return (
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.text}>Login</Text>
            </Pressable>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    text: {
        fontSize: 35,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});