import { ThemedText, ThemedView } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { CreateGameRequest, gamesApi } from "@/services/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Add this helper above your component
const formatLocalISOWithoutTimezone = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const MM = pad(date.getMinutes());
  const SS = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}`;
};

export default function CreateGameScreen() {
  const [name, setName] = useState("");
  const [openingDateTime, setOpeningDateTime] = useState<Date | null>(null);
  const [closingDateTime, setClosingDateTime] = useState<Date | null>(null);

  const [showOpeningDatePicker, setShowOpeningDatePicker] = useState(false);
  const [showOpeningTimePicker, setShowOpeningTimePicker] = useState(false);
  const [showClosingDatePicker, setShowClosingDatePicker] = useState(false);
  const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const colors = Colors.light;

  const formatDisplay = (d: Date | null) => {
    if (!d) return "Not set";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const onPickOpeningDate = (_: any, date?: Date) => {
    setShowOpeningDatePicker(false);
    if (!date) return;
    setOpeningDateTime((prev) => {
      const base = prev ?? new Date();
      const updated = new Date(base);
      updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return updated;
    });
  };

  const onPickOpeningTime = (_: any, date?: Date) => {
    setShowOpeningTimePicker(false);
    if (!date) return;
    setOpeningDateTime((prev) => {
      const base = prev ?? new Date();
      const updated = new Date(base);
      updated.setHours(date.getHours(), date.getMinutes(), 0, 0);
      return updated;
    });
  };

  const onPickClosingDate = (_: any, date?: Date) => {
    setShowClosingDatePicker(false);
    if (!date) return;
    setClosingDateTime((prev) => {
      const base = prev ?? new Date();
      const updated = new Date(base);
      updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return updated;
    });
  };

  const onPickClosingTime = (_: any, date?: Date) => {
    setShowClosingTimePicker(false);
    if (!date) return;
    setClosingDateTime((prev) => {
      const base = prev ?? new Date();
      const updated = new Date(base);
      updated.setHours(date.getHours(), date.getMinutes(), 0, 0);
      return updated;
    });
  };

  const setAllToCurrent = () => {
    const now = new Date();
    const plusHour = new Date(now.getTime() + 60 * 60 * 1000);
    setOpeningDateTime(now);
    setClosingDateTime(plusHour);
  };

  const handleCreateGame = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a game name");
      return;
    }
    if (!openingDateTime) {
      Alert.alert("Error", "Please select opening date and time");
      return;
    }
    if (!closingDateTime) {
      Alert.alert("Error", "Please select closing date and time");
      return;
    }
    if (closingDateTime <= openingDateTime) {
      Alert.alert("Error", "Closing time must be after opening time");
      return;
    }

    // ✅ Convert both to local naive ISO format (no Z)
    const openingTimeIso = formatLocalISOWithoutTimezone(openingDateTime);
    const closingTimeIso = formatLocalISOWithoutTimezone(closingDateTime);

    try {
      setLoading(true);
      const gameData: CreateGameRequest = {
        name: name.trim(),
        openingTime: openingTimeIso,
        closingTime: closingTimeIso,
      };
      await gamesApi.createGame(gameData);
      Alert.alert("Success", "Game created successfully!", [
        {
          text: "OK",
          onPress: () => {
            setName("");
            setOpeningDateTime(null);
            setClosingDateTime(null);
            router.push("/(tabs)/games");
          },
        },
      ]);
    } catch (error) {
      console.error("Create Game Error:", error);
      Alert.alert("Error", "Failed to create game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <IconSymbol name="chevron-back" size={24} color="#FF6B35" />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.title}>
              Create New Game
            </ThemedText>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              <TouchableOpacity
                style={[
                  styles.quickSetButton,
                  { backgroundColor: "rgba(255, 107, 53, 0.12)" },
                ]}
                onPress={setAllToCurrent}
              >
                <IconSymbol name="time" size={20} color="#FF6B35" />
                <ThemedText style={[styles.quickSetText, { color: "#FF6B35" }]}>
                  Set All to Current Time
                </ThemedText>
              </TouchableOpacity>

              {/* Game Name */}
              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold" style={styles.label}>
                  Game Name *
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: "rgba(255, 107, 53, 0.25)",
                      color: colors.text,
                    },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter game name"
                  placeholderTextColor={colors.text + "60"}
                  maxLength={100}
                />
              </View>

              {/* Opening Date/Time */}
              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold" style={styles.label}>
                  Opening *
                </ThemedText>
                <View style={styles.rowBetween}>
                  <TouchableOpacity
                    style={[
                      styles.pillButton,
                      { backgroundColor: "rgba(255, 107, 53, 0.1)" },
                    ]}
                    onPress={() => setShowOpeningDatePicker(true)}
                  >
                    <IconSymbol name="calendar" size={16} color="#FF6B35" />
                    <ThemedText style={[styles.pillText, { color: "#FF6B35" }]}>
                      Pick Date
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pillButton,
                      { backgroundColor: "rgba(255, 107, 53, 0.1)" },
                    ]}
                    onPress={() => setShowOpeningTimePicker(true)}
                  >
                    <IconSymbol name="time" size={16} color="#FF6B35" />
                    <ThemedText style={[styles.pillText, { color: "#FF6B35" }]}>
                      Pick Time
                    </ThemedText>
                  </TouchableOpacity>
                </View>
                <ThemedText type="default" style={styles.selectedText}>
                  {formatDisplay(openingDateTime)}
                </ThemedText>
              </View>

              {/* Closing Date/Time */}
              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold" style={styles.label}>
                  Closing *
                </ThemedText>
                <View style={styles.rowBetween}>
                  <TouchableOpacity
                    style={[
                      styles.pillButton,
                      { backgroundColor: "rgba(255, 107, 53, 0.1)" },
                    ]}
                    onPress={() => setShowClosingDatePicker(true)}
                  >
                    <IconSymbol name="calendar" size={16} color="#FF6B35" />
                    <ThemedText style={[styles.pillText, { color: "#FF6B35" }]}>
                      Pick Date
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pillButton,
                      { backgroundColor: "rgba(255, 107, 53, 0.1)" },
                    ]}
                    onPress={() => setShowClosingTimePicker(true)}
                  >
                    <IconSymbol name="time" size={16} color="#FF6B35" />
                    <ThemedText style={[styles.pillText, { color: "#FF6B35" }]}>
                      Pick Time
                    </ThemedText>
                  </TouchableOpacity>
                </View>
                <ThemedText type="default" style={styles.selectedText}>
                  {formatDisplay(closingDateTime)}
                </ThemedText>
              </View>

              {/* Native Pickers */}
              {showOpeningDatePicker && (
                <DateTimePicker
                  value={openingDateTime ?? new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={onPickOpeningDate}
                />
              )}
              {showOpeningTimePicker && (
                <DateTimePicker
                  value={openingDateTime ?? new Date()}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onPickOpeningTime}
                />
              )}
              {showClosingDatePicker && (
                <DateTimePicker
                  value={closingDateTime ?? new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={onPickClosingDate}
                />
              )}
              {showClosingTimePicker && (
                <DateTimePicker
                  value={closingDateTime ?? new Date()}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onPickClosingTime}
                />
              )}

              {/* Info */}
              <View style={styles.infoContainer}>
                <ThemedText type="subtitle" style={styles.infoTitle}>
                  GAME DETAILS
                </ThemedText>
                <ThemedText type="default" style={styles.infoText}>
                  Game Name: {name}
                </ThemedText>
                <ThemedText type="default" style={styles.infoText}>
                  Opening Time: {formatDisplay(openingDateTime)}
                </ThemedText>
                <ThemedText type="default" style={styles.infoText}>
                  Closing Time: {formatDisplay(closingDateTime)} (UTC)
                </ThemedText>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.createButton,
                { backgroundColor: "#FF6B35" },
                loading && styles.createButtonDisabled,
              ]}
              onPress={handleCreateGame}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <IconSymbol name="add-circle" size={20} color="white" />
                  <ThemedText style={styles.createButtonText}>
                    Create Game
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  backButton: { marginRight: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  content: { flex: 1 },
  formContainer: { padding: 20 },
  quickSetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  quickSetText: { fontSize: 16, fontWeight: "600", marginLeft: 8 },
  inputGroup: { marginBottom: 24 },
  label: { marginBottom: 8, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pillButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  pillText: { fontSize: 14, fontWeight: "600", marginLeft: 8 },
  selectedText: { marginTop: 8, opacity: 0.8 },
  infoContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    marginTop: 8,
  },
  infoTitle: { marginBottom: 8, fontWeight: "600" },
  infoText: {
    marginBottom: 4,
    lineHeight: 20,
    fontSize: 15,
    fontWeight: "500",
  },
  footer: { padding: 20, paddingTop: 10, width: "90%", alignSelf: "center" },
  createButton: {
    marginBottom: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonDisabled: { opacity: 0.6 },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
