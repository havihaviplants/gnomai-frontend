import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Share, TextInput } from 'react-native';
// @ts-ignore
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getUserId } from '@/utils/getUserId';

export default function TabTwoScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ UUID 로딩
  useEffect(() => {
  (async () => {
    const id = await getUserId();
    if (id && id.length > 10) {
      console.log("✅ userId 세팅:", id);
      setUserId(id);
    } else {
      console.warn("❌ 유효하지 않은 userId:", id);
    }
  })();
}, []);


  // 광고 보고 해제 (현재는 바로 해제)
  const showRewardedAdAndUnlock = () => {
    setIsUnlocked(true);
    Alert.alert("🔓 해제 완료", "분석 기능이 잠금 해제되었습니다.");
  };

  // ✅ 감정 분석 요청
  const callAnalysisAPI = async () => {
    console.log("📡 '분석하기' 버튼 클릭됨");
    console.log("🧾 현재 userId:", userId);

   if (!userId || userId.length < 10) {
      Alert.alert("유저 정보 오류", "유저 정보 로딩 중입니다. 잠시 후 다시 시도해 주세요.");
    return;
    }


    if (!isUnlocked) {
      console.log("🔒 아직 해제 안 됨");
      Alert.alert('해제 필요', '광고를 보고 감정 분석을 해제하세요.');
      return;
    }

    try {
      setIsLoading(true);
      console.log("🚀 POST 요청 전송 중...");

      const response = await axios.post('https://gnom-backend.onrender.com/analyze', {
        user_id: userId,
        message: message || '나는 너에게 실망했어',
        relationship: '전 연인',
      });

      console.log('🧠 분석 응답:', response.data);
      setAnalysisResult(response.data.summary || '결과 없음');
    } catch (error: any) {
      console.error('❌ 분석 에러:', error?.message || error);
      Alert.alert('분석 실패', '서버 응답이 없거나 네트워크 문제입니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 결과 공유
  const handleShare = async (resultData: any) => {
    try {
      const response = await axios.post('https://gnom-backend.onrender.com/share', {
        ...resultData,
        user_id: userId,
      });
      const shareUrl = response.data.share_url;

      await Share.share({ message: `상대 감정 분석 결과 👉 ${shareUrl}` });
      await Clipboard.setStringAsync(shareUrl);
      Alert.alert('공유 링크가 복사되었어요!');
    } catch (err) {
      Alert.alert('공유에 실패했어요');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
        />
      }
    >
      <ThemedView style={{ padding: 16 }}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="감정을 입력해 주세요"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        />

        {!isUnlocked && (
          <ThemedView
            style={{
              padding: 16,
              backgroundColor: '#f2f2f2',
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <ThemedText style={{ textAlign: 'center', marginBottom: 8 }}>
              🔒 분석 결과 보기
            </ThemedText>
            <Button title="해제하기" onPress={showRewardedAdAndUnlock} />
          </ThemedView>
        )}

        <Button
          title="분석하기"
          onPress={callAnalysisAPI}
          disabled={!isUnlocked || isLoading}
        />

        {isLoading && <ThemedText style={{ marginTop: 12 }}>분석 중...</ThemedText>}

        {isUnlocked && analysisResult && (
          <ThemedView style={{ marginTop: 16 }}>
            <ThemedText style={{ fontSize: 16, marginBottom: 8 }}>
              {analysisResult}
            </ThemedText>
            <Button
              title="결과 공유하기"
              onPress={() => handleShare({ result: analysisResult })}
            />
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}
