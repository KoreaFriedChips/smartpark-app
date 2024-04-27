import { StyleSheet, useColorScheme, TouchableOpacity, Switch } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";


interface AvailabilityItem {
  day: string,
  availableHours: string[],
  isAvailable: boolean,
}

export type Availability = AvailabilityItem[]

export default function AvailabilityWidget({onChange}: {onChange: (props: Availability)=>void}) {
  const themeColors = Colors[useColorScheme() || "light"];
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const [availability, setAvailability] = useState<Array<AvailabilityItem>>(weekDays.map((value, index) => { return {
    day: value,
    availableHours: [],
    isAvailable: false
  }}));
  useEffect(() => {
    onChange(availability);
  }, [availability]);
  const [showTimePicker, setShowTimePicker] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [availIndex, setAvailIndex] = useState(0);
  const timeToStr = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`
  }
  const handleTimePickStart = (event: DateTimePickerEvent) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(0);
      return;
    }
    setStartTime(event.nativeEvent.timestamp);
    setShowTimePicker(2);
  }

  const handleTimePickEnd = (event: DateTimePickerEvent) => {
    if (event.type === "dismissed"){
      setShowTimePicker(0);
      return;
    }
    let newAvailability = availability;
    const start = timeToStr(startTime);
    const end = timeToStr(event.nativeEvent.timestamp);
    newAvailability[availIndex].availableHours.push(`${start}-${end}`);
    newAvailability[availIndex].isAvailable = true;
    setAvailability(newAvailability);
    setShowTimePicker(0);

  }

  const handleRemoveAvailability = (index: number, interval: string) => {
    setAvailability(availability.map((value, i) => {
      if (i != index) return value;
      return {
        day: value.day,
        isAvailable: value.isAvailable,
        availableHours: value.availableHours.filter((entry) => entry != interval)
      }
    }));
  }

  const handleToggleAvailability = (index: number) => {
    setAvailability(availability.map((value, i) => {
      if (i != index) return value;
      return {
        ...value,
        isAvailable: !value.isAvailable,
      }
    }))
  }

return (<View>
<Text weight="semibold" style={{ color: themeColors.third }}> Availability </Text>
        <View style={styles.availabilityView}>
          {weekDays.flatMap((day, index) => {
            return (
              <View key={index} style={{flexDirection: "row", justifyContent: "flex-start", marginLeft: 0}}>
                <Switch
                  onValueChange={() => handleToggleAvailability(index)}
                  value={availability[index].isAvailable}
                />
                <TouchableOpacity
                  style={[styles.button,
                  {backgroundColor: themeColors.secondary}]}
                  onPress={()=>{setAvailIndex(index); setShowTimePicker(1); }}
                >
                  <Text style={{ ...styles.buttonText, ...styles.availabilityButtonText, color: themeColors.header,}}>{day[0] + day[1]}</Text>
                </TouchableOpacity>
                {availability[index].availableHours.flatMap((item, subIndex) => 
                  <TouchableOpacity
                    key={subIndex}
                    style={styles.button}
                    onPress={() => handleRemoveAvailability(index, item)}
                  >
                    <Text style={{ ...styles.buttonText, ...styles.availabilityButtonText, color: themeColors.secondary,}}>{item}</Text>
                  </TouchableOpacity>
                )}
                
              </View>
            )
          })}
        </View>
        {showTimePicker === 1 && <RNDateTimePicker
          key={1} 
          value={new Date(0)} 
          textColor={Colors['light'].primary}
          accentColor={Colors['accent']}
          mode="time"
          onChange={handleTimePickStart}
        />}
        {showTimePicker === 2 && <RNDateTimePicker 
          key={2}
          value={new Date(startTime)} 
          textColor={Colors['light'].primary}
          accentColor={Colors['accent']}
          mode="time"
          onChange={handleTimePickEnd}
        />}
</View>);}


const styles = StyleSheet.create({
  availabilityView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "flex-start",
    justifyContent: 'space-evenly',
    width: '100%',
  },
  availabilityButtonText: {
   
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 4,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
  },
})