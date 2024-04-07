import React, { useRef, useMemo, useCallback } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { View, Text, TouchableOpacity } from "react-native";

export default function ModalScreen() {
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints} onChange={handleSheetChanges}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text>Swipe down to close</Text>
        </View>
      </BottomSheet>
    </View>
  );
};
