import { StyleSheet, useColorScheme, TouchableOpacity, Switch } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { intervalToStr } from '@/components/utils/ListingUtils';
import { interval } from 'date-fns';

interface AvailabilityItem {
  day: string,
  availableHours: string[],
  isAvailable: boolean,
}

export type Availability = AvailabilityItem[]

export function AvailabilityWidget({onChange, init}: 
  {onChange: (props: Interval[])=>void, init:Interval[]}) 
  {
  const themeColors = Colors[useColorScheme() || "light"];
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const  weekStart = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));
  const [intervals, setIntervals] = useState<Array<Interval>>(init);

  useEffect(() => {
    onChange(intervals);
  }, [intervals]);

  const [showTimePicker, setShowTimePicker] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [availIndex, setAvailIndex] = useState(0);
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
    const newInterval = interval(startTime, event.nativeEvent.timestamp);
    setIntervals([...intervals, newInterval]);
    setShowTimePicker(0);

  }

  const handleRemoveAvailability = (interval: Interval) => {
    setIntervals(intervals.filter((value, i) => value != interval));
  }

  const getIntervalStr = (interval: Interval) => {
    
  }

  const handleToggleAvailability = (index: number) => {
    // setAvailability(availability.map((value, i) => {
    //   if (i != index) return value;
    //   return {
    //     ...value,
    //     isAvailable: !value.isAvailable,
    //   }
    // }))
  }

return (<View>
<Text weight="semibold" style={{ color: themeColors.third }}> Availability </Text>
        <View style={styles.availabilityView}>
          {weekDays.flatMap((day, index) => {
            return (
              <View key={index} style={{flexDirection: "row", justifyContent: "flex-start", marginLeft: 0}}>
                <TouchableOpacity
                  style={[styles.button,
                  {backgroundColor: themeColors.secondary}]}
                  onPress={()=>{setAvailIndex(index); setShowTimePicker(1); }}
                >
                  <Text style={{ ...styles.buttonText, ...styles.availabilityButtonText, color: themeColors.header,}}>{day[0] + day[1]}</Text>
                </TouchableOpacity>
                {intervals.filter((interval) => interval.start.getDay() == index).flatMap((interval, subIndex) => 
                  <TouchableOpacity
                    key={subIndex}
                    style={styles.button}
                    onPress={() => handleRemoveAvailability(interval)}
                  >
                    <Text style={{ ...styles.buttonText, ...styles.availabilityButtonText, color: themeColors.secondary,}}>{intervalToStr(interval)}</Text>
                  </TouchableOpacity>
                )}
                
              </View>
            )
          })}
        </View>
        {showTimePicker === 1 && <RNDateTimePicker
          key={1} 
          value={new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + availIndex)} 
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