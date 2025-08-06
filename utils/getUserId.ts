import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const getUserId = async (): Promise<string> => {
  try {
    const existingId = await AsyncStorage.getItem('userId');
    if (existingId) {
      console.log('✅ 기존 userId 로드:', existingId);
      return existingId;
    }

    const newId = uuidv4();
    await AsyncStorage.setItem('userId', newId);
    console.log('🎯 새 userId 생성:', newId);
    return newId;
  } catch (error) {
    console.error('❌ userId 로딩 오류:', error);
    return '';
  }
};
