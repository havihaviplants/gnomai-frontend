import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';

export default function ExploreScreen() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ 하드코딩된 userId (테스트용)
  const userId = 'test-user';

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      Alert.alert('입력 필요', '메시지를 입력해주세요.');
      return;
    }

    setLoading(true);
    setResult(''); // 이전 결과 초기화

    try {
      const response = await axios.post('https://gnom-backend.onrender.com/analyze', {
        userId,
        message: inputText,
        relationship: '전 애인', // TODO: 추후 선택형으로 변경
      });

      setResult(response.data.result || '⚠️ 결과 없음');
    } catch (error: any) {
      console.error('분석 오류:', error);
      const msg = error?.response?.data?.detail || error?.message || '알 수 없는 오류';
      setResult('❌ 분석 실패: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .head('https://gnom-backend.onrender.com/analyze') // 🎯 의미 있는 엔드포인트로 깨움
      .then(() => console.log('🔌 백엔드 서버 활성화 완료'))
      .catch((err) => console.warn('⚠️ 서버 깨우기 실패:', err.message));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="메시지를 입력하세요"
        value={inputText}
        onChangeText={setInputText}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />
      <Button title={loading ? '분석 중...' : '분석하기'} onPress={handleAnalyze} disabled={loading} />
      {result ? (
        <Text style={{ marginTop: 20, fontSize: 16 }}>{result}</Text>
      ) : null}
    </View>
  );
}
