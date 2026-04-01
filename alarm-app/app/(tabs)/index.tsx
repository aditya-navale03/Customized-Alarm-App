import {
  View,
  Text,
  Button,
  Platform,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

let Notifications: any = null;

if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
}
export default function App() {
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
  if (Platform.OS !== 'web') {
    Notifications?.requestPermissionsAsync();

    // ✅ ADD THIS
    Notifications?.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}, []);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || time;
    setShow(Platform.OS === 'ios');
    setTime(currentDate);
  };

const scheduleAlarm = async () => {
  try {
    const now = new Date();
    const seconds = Math.floor((time.getTime() - now.getTime()) / 1000);

    if (seconds <= 0) {
      alert("Select future time");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alarm 🔔",
        body: "Wake up!",
      },
      trigger: {
        channelId: 'default',
        seconds: seconds,
        repeats: false,
      } as any
    });

    alert("Alarm set!");
  } catch(error){
    console.log(error);
    alert("Failed to set alarm");
  }
};

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Title */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: isDark ? '#fff' : '#000',
          marginBottom: 30,
        }}
      >
        ⏰ Alarm 
      </Text>

      {/* Time Display */}
      <Text
        style={{
          fontSize: 32,
          color: isDark ? '#fff' : '#000',
          marginBottom: 20,
        }}
      >
        {time.toLocaleTimeString()}
      </Text>

      {/* Pick Time Button */}
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          backgroundColor: '#4CAF50',
          padding: 12,
          borderRadius: 10,
          width: 200,
          alignItems: 'center',
          marginBottom: 15,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>
          Pick Time
        </Text>
      </TouchableOpacity>

      {show && Platform.OS !== 'web' && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      {/* Set Alarm Button */}
      <TouchableOpacity
        onPress={scheduleAlarm}
        style={{
          backgroundColor: '#2196F3',
          padding: 12,
          borderRadius: 10,
          width: 200,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>
          Set Alarm
        </Text>
      </TouchableOpacity>
    </View>
  );
}