import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { t } from '../../../../locales/i18n';
import { Svg, Path } from 'react-native-svg';
const { width } = Dimensions.get('window');

const PlaylistIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2}>
        <Path d="M9 3L15 21l4-12 4 12L9 3z" />
    </Svg>
);

interface CreatePlaylistButtonProps {
    minute: number | string;
    hasSelection: boolean;
    createPlaylist: () => void;
}

export const CreatePlaylistButton = ({ minute, hasSelection, createPlaylist }: CreatePlaylistButtonProps) => {
    const handlePress = () => {
        createPlaylist();
    };

    const isDisabled = !minute || !hasSelection;

    return (
        <TouchableOpacity
            style={[styles.createButton, isDisabled && styles.buttonDisabled]}
            disabled={isDisabled}
            onPress={handlePress}
        >
            <PlaylistIcon />
            <Text style={styles.createButtonText}>{t('form.createPlaylist')}</Text>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    createButton: {
        flex: 1,
        backgroundColor: '#FF5500',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: Math.min(16, width * 0.04), // レスポンシブなフォントサイズ
        fontWeight: 'bold',
    },
});
