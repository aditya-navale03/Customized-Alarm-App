package com.example.alarmapp;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;
import android.app.TimePickerDialog;
import java.util.Calendar;
import android.os.Build;
import android.provider.Settings;
import android.net.Uri;

public class MainActivity extends AppCompatActivity {

    Button addAlarmBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        addAlarmBtn = findViewById(R.id.addAlarmBtn);

        addAlarmBtn.setOnClickListener(v -> {

            Calendar now = Calendar.getInstance();

            int hour = now.get(Calendar.HOUR_OF_DAY);
            int minute = now.get(Calendar.MINUTE);

            TimePickerDialog timePicker = new TimePickerDialog(
                    MainActivity.this,
                    (view, selectedHour, selectedMinute) -> {

                        Calendar alarmTime = Calendar.getInstance();
                        alarmTime.set(Calendar.HOUR_OF_DAY, selectedHour);
                        alarmTime.set(Calendar.MINUTE, selectedMinute);
                        alarmTime.set(Calendar.SECOND, 0);

                        if (alarmTime.before(Calendar.getInstance())) {
                            alarmTime.add(Calendar.DAY_OF_MONTH, 1);
                        }

                        setAlarm(alarmTime.getTimeInMillis());

                    },
                    hour,
                    minute,
                    true
            );

            timePicker.show();

        });

    }
    @SuppressLint("ScheduleExactAlarm")
    private void setAlarm(long triggerTime) {

        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);

        if (alarmManager == null) {
            Toast.makeText(this, "AlarmManager error", Toast.LENGTH_SHORT).show();
            return;
        }

        // 🔥 NEW CODE (IMPORTANT)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            if (!alarmManager.canScheduleExactAlarms()) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                startActivity(intent);
                Toast.makeText(this, "Please allow exact alarm permission", Toast.LENGTH_LONG).show();
                return;
            }
        }

        Intent intent = new Intent(MainActivity.this, AlarmReceiver.class);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                getApplicationContext(),
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        alarmManager.setExact(
                AlarmManager.RTC_WAKEUP,
                triggerTime,
                pendingIntent
        );

        Toast.makeText(this, "Alarm Set!", Toast.LENGTH_SHORT).show();
    }
}