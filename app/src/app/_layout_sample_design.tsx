import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path, Line, Polyline, Circle } from 'react-native-svg';
const { width } = Dimensions.get('window');

// 最大幅の定数を定義
const MAX_CONTAINER_WIDTH = 400; // コンテナの最大幅
const MAX_INPUT_WIDTH = 360;     // 入力フィールドの最大幅
const MIN_ARTIST_ITEM_SIZE = 100; // アーティストアイテムの最小サイズ
const MAX_ARTIST_ITEM_SIZE = 120; // アーティストアイテムの最大サイズ

// 画面サイズに応じたアーティストアイテムのサイズを計算
const calculateArtistItemSize = () => {
  const containerWidth = Math.min(width - 48, MAX_CONTAINER_WIDTH);
  const calculatedSize = (containerWidth - 16) / 3;
  return Math.min(Math.max(calculatedSize, MIN_ARTIST_ITEM_SIZE), MAX_ARTIST_ITEM_SIZE);
};

const ARTIST_ITEM_SIZE = calculateArtistItemSize();

const LogoutIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}>
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2}>
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

const PlaylistIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2}>
    <Path d="M9 3L15 21l4-12 4 12L9 3z" />
  </Svg>
);

const TrashIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2}>
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Line x1="10" y1="11" x2="10" y2="17" />
    <Line x1="14" y1="11" x2="14" y2="17" />
  </Svg>
);

const ArtistIcon = ({ colors, imageUrl }) => {
  if (imageUrl) {
    return (
      <View style={styles.artistImageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.artistImage}
          defaultSource={require('../../assets/icon.png')} // プレースホルダー画像を用意してください
        />
      </View>
    );
  }

  // 画像URLがない場合は従来のアイコンを表示
  return (
    <Svg width={32} height={32} viewBox="0 0 40 40">
      <Circle cx="20" cy="20" r="20" fill={colors[0]} />
      <Circle cx="20" cy="15" r="6" stroke="#FFFFFF" strokeWidth="2" fill="none" />
      <Path
        d="M8 34 C8 26 32 26 32 34"
        stroke="#FFFFFF"
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  );
};

const SpotifyTimerApp = () => {
  const [minutes, setMinutes] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);

  const truncateText = (text) => {
    if (text.length > 20) {
      return text.substring(0, 20);
    }
    return text;
  };

  const artists = [
    { name: 'PAS TASTA', colors: ['#3B82F6', '#1D4ED8'], imageUrl: 'https://example.com/pastasta.jpg' },
    { name: 'lilbesh ramkolilbesh', colors: ['#8B5CF6', '#6D28D9'], imageUrl: 'https://example.com/lilbesh.jpg' },
    { name: 'Bill Evans', colors: ['#6B7280', '#374151'], imageUrl: 'https://example.com/billevans.jpg' },
    { name: 'キツネDJ', colors: ['#22C55E', '#15803D'], imageUrl: 'https://example.com/kitsunedj.jpg' },
    { name: 'PSG', colors: ['#EF4444', '#B91C1C'], imageUrl: 'https://example.com/psg.jpg' },
    { name: 'EVISBEATS', colors: ['#6366F1', '#4338CA'], imageUrl: 'https://example.com/evisbeats.jpg' }
  ];

  const toggleArtistSelection = (artistName) => {
    setSelectedArtists(prev =>
      prev.includes(artistName)
        ? prev.filter(name => name !== artistName)
        : [...prev, artistName]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#111827', '#000000']}
        style={styles.gradient}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>音楽タイマー</Text>
              <TouchableOpacity>
                <LogoutIcon />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={minutes}
                onChangeText={setMinutes}
                placeholder="再生時間"
                placeholderTextColor="#6B7280"
                keyboardType="number-pad"
              />
              <Text style={styles.unitText}>分</Text>
            </View>

            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.artistGrid}>
                {artists.map((artist) => (
                  <TouchableOpacity
                    key={artist.name}
                    onPress={() => toggleArtistSelection(artist.name)}
                    activeOpacity={0.7}
                    style={styles.artistItem}
                  >
                    <LinearGradient
                      colors={selectedArtists.includes(artist.name) ? artist.colors : ['#374151', '#374151']}
                      style={styles.artistButton}
                    >
                      {selectedArtists.includes(artist.name) && (
                        <View style={styles.checkmark}>
                          <CheckIcon />
                        </View>
                      )}
                      <ArtistIcon
                        colors={selectedArtists.includes(artist.name) ? artist.colors : ['#4B5563', '#4B5563']}
                        imageUrl={artist.imageUrl}
                      />
                      <Text
                        style={[
                          styles.artistName,
                          { color: selectedArtists.includes(artist.name) ? '#FFFFFF' : '#9CA3AF' }
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {truncateText(artist.name)}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.createButton, (!minutes || selectedArtists.length === 0) && styles.buttonDisabled]}
                disabled={!minutes || selectedArtists.length === 0}
              >
                <PlaylistIcon />
                <Text style={styles.createButtonText}>プレイリスト作成</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton}>
                <TrashIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center', // 中央寄せを追加
  },
  contentWrapper: {
    width: '100%',
    maxWidth: MAX_CONTAINER_WIDTH,
    flex: 1,
  },
  // content: {
  //   flex: 1,
  //   padding: 24,
  //   backgroundColor: 'rgba(31, 41, 55, 1)'

  // },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    maxWidth: MAX_INPUT_WIDTH,
    alignSelf: 'stretch',
  },
  title: {
    fontSize: Math.min(28, width * 0.07), // レスポンシブなフォントサイズ
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    maxWidth: MAX_INPUT_WIDTH,
    alignSelf: 'stretch',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: Math.min(24, width * 0.06), // レスポンシブなフォントサイズ
    padding: 0,
  },
  unitText: {
    color: '#9CA3AF',
    fontSize: Math.min(20, width * 0.05), // レスポンシブなフォントサイズ
    marginLeft: 8,
  },
  // artistGrid: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   gap: 8,
  //   marginBottom: 24,
  //   justifyContent: 'center', // 中央寄せを追加
  // },
  // artistButton: {
  //   width: ARTIST_ITEM_SIZE,
  //   height: ARTIST_ITEM_SIZE,
  //   borderRadius: 16,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 8,
  // },
  // artistName: {
  //   fontSize: Math.min(14, ARTIST_ITEM_SIZE * 0.12), // アイテムサイズに応じたフォントサイズ
  //   fontWeight: '600',
  //   textAlign: 'center',
  // },
  // checkmark: {
  //   position: 'absolute',
  //   top: 8,
  //   right: 8,
  //   backgroundColor: 'rgba(255, 255, 255, 0.2)',
  //   borderRadius: 10,
  //   padding: 4,
  // },
  // buttonContainer: {
  //   flexDirection: 'row',
  //   gap: 12,
  //   maxWidth: MAX_INPUT_WIDTH,
  //   alignSelf: 'stretch',
  // },
  createButton: {
    flex: 1,
    backgroundColor: '#059669',
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
  deleteButton: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
  },
  artistScrollContainer: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    gap: 12,
    flexDirection: 'row',
  },
  // artistItem: {
  //   width: 120,
  // },
  // artistButton: {
  //   width: '100%',
  //   aspectRatio: 1,
  //   borderRadius: 16,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 12,
  //   gap: 8,
  // },
  // artistName: {
  //   fontSize: 14,
  //   fontWeight: '600',
  //   textAlign: 'center',
  //   marginTop: 4,
  // },
  // checkmark: {
  //   position: 'absolute',
  //   top: 8,
  //   right: 8,
  //   backgroundColor: 'rgba(255, 255, 255, 0.2)',
  //   borderRadius: 10,
  //   padding: 4,
  // },
  content: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(31, 41, 55, 1)',
    display: 'flex',
    flexDirection: 'column',
  },

  scrollContainer: {
    flex: 1,
    marginBottom: 24,
  },

  scrollContentContainer: {
    flexGrow: 1,
  },

  artistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },

  artistItem: {
    width: `${(100 - 8) / 3}%`, // 3列表示（8%は2つのgapの合計）
  },

  artistButton: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },

  artistName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    width: '100%', // テキストの最大幅を設定
    paddingHorizontal: 4, // テキストの左右のパディング
  },

  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 4,
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    maxWidth: MAX_INPUT_WIDTH,
    alignSelf: 'stretch',
  },

  artistImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },

  artistImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default SpotifyTimerApp;