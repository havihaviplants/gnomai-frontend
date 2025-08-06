import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function ExploreScreen() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  const handleAnalyze = async () => {
    try {
      const response = await axios.post('https://gnom-backend.onrender.com/analyze', {
        message: inputText,
        relationship: '전 애인', // or '친구', '동료' 등 - 추후 선택 가능하게
      });
      setResult(response.data.result);
    } catch (error: any) {
      setResult('❌ 분석 실패: ' + (error?.message || '알 수 없는 오류'));
    }
  };

  useEffect(() => {
    axios.get('https://gnom-backend.onrender.com/')
      .then(() => console.log('🔌 서버 깨움'))
      .catch(console.error);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="메시지를 입력하세요"
        value={inputText}
        onChangeText={setInputText}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <Button title="분석하기" onPress={handleAnalyze} />
      <Text style={{ marginTop: 20 }}>{result}</Text>
    </View>
  );
}
