import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, TextInput, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Calendar as CalendarIcon, Clock, Info } from 'lucide-react-native';
import { createBooking } from '../../services/bookingService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RentBookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const product = route.params?.product || { 
      title: 'Unknown Item', 
      price: 0, 
      image: 'https://via.placeholder.com/400' 
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(new Date(new Date().setHours(10, 0, 0, 0)));
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(18, 0, 0, 0)));
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const handleDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (day.dateString < startDate) {
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    }
  };

  const markedDates = useMemo(() => {
    let marks = {};
    if (startDate) {
      marks[startDate] = { startingDay: true, color: '#FF5A5F', textColor: 'white' };
      if (endDate) {
        let currentDate = new Date(startDate);
        let stopDate = new Date(endDate);
        while (currentDate <= stopDate) {
            let dateStr = currentDate.toISOString().split('T')[0];
            if (dateStr === startDate) {
                marks[dateStr] = { startingDay: true, color: '#FF5A5F', textColor: 'white' };
            } else if (dateStr === endDate) {
                marks[dateStr] = { endingDay: true, color: '#FF5A5F', textColor: 'white' };
            } else {
                marks[dateStr] = { color: 'rgba(255, 90, 95, 0.2)', textColor: 'white' };
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }
    return marks;
  }, [startDate, endDate]);

  const calculateTotal = () => {
      if (!startDate || !endDate) return 0;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays * product.price;
  };
  
  const totalDays = (startDate && endDate) ? (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24) + 1 : 0;
  const totalPrice = calculateTotal();
  const serviceFee = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + serviceFee;

  // Combine date and time into a single Date object
  const combineDateAndTime = (dateString, time) => {
    const date = new Date(dateString);
    date.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return date;
  };

  const handleConfirmBooking = async () => {
    if (!startDate || !endDate) return;

    if (!pickupAddress.trim()) {
      Alert.alert('Required', 'Please enter a pickup address');
      return;
    }

    setLoading(true);
    try {
      const fullStartDate = combineDateAndTime(startDate, startTime);
      const fullEndDate = combineDateAndTime(endDate, endTime);

      const bookingData = {
        itemId: product.id,
        startDate: fullStartDate.toISOString(),
        endDate: fullEndDate.toISOString(),
        totalPrice: grandTotal,
        pickupAddress,
        dropAddress: dropAddress || pickupAddress,
        notes
      };

      const response = await createBooking(bookingData);
      
      navigation.replace('BookingConfirmation', {
        booking: {
          ...response.booking,
          startDate: fullStartDate.toISOString(),
          endDate: fullEndDate.toISOString(),
          totalAmount: grandTotal,
          pickupAddress,
          dropAddress: dropAddress || pickupAddress,
          notes
        },
        product: product
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Dates</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.productSummary}>
            <Image 
              source={{ uri: product.images?.[0] || product.image || 'https://via.placeholder.com/100' }} 
              style={styles.miniImage} 
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.miniTitle}>{product.title}</Text>
                <Text style={styles.miniPrice}>₹{product.price}<Text style={{color:'#888', fontSize:12}}>/day</Text></Text>
            </View>
        </View>

        <View style={styles.calendarContainer}>
            <Calendar
                onDayPress={handleDayPress}
                markingType={'period'}
                markedDates={markedDates}
                minDate={new Date().toISOString().split('T')[0]}
                theme={{
                    backgroundColor: 'transparent',
                    calendarBackground: 'transparent',
                    textSectionTitleColor: '#888',
                    selectedDayBackgroundColor: '#FF5A5F',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#FF5A5F',
                    dayTextColor: '#ffffff',
                    textDisabledColor: '#333',
                    monthTextColor: '#ffffff',
                    arrowColor: '#FF5A5F',
                    textDayFontWeight: '400',
                    textMonthFontWeight: '700',
                    textDayHeaderFontWeight: '500',
                }}
            />
        </View>

        {/* Time Selection */}
        {startDate && endDate && (
          <View style={styles.timeSection}>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Pickup Time</Text>
                <TouchableOpacity 
                  style={styles.timeButton}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Clock size={18} color="#FF5A5F" />
                  <Text style={styles.timeValue}>{formatTime(startTime)}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Return Time</Text>
                <TouchableOpacity 
                  style={styles.timeButton}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Clock size={18} color="#FF5A5F" />
                  <Text style={styles.timeValue}>{formatTime(endTime)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartTimeChange}
          />
        )}

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndTimeChange}
          />
        )}

        <View style={styles.addressSection}>
             <Text style={styles.sectionTitle}>Details</Text>
             
             <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>Pickup Address</Text>
                 <TextInput
                     style={styles.input}
                     placeholder="Where will you pick this up?"
                     placeholderTextColor="#666"
                     value={pickupAddress}
                     onChangeText={setPickupAddress}
                 />
             </View>

             <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>Drop Address (Optional)</Text>
                 <TextInput
                     style={styles.input}
                     placeholder="Same as pickup if empty"
                     placeholderTextColor="#666"
                     value={dropAddress}
                     onChangeText={setDropAddress}
                 />
             </View>

             <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>Notes (Optional)</Text>
                 <TextInput
                     style={[styles.input, styles.textArea]}
                     placeholder="Any special requests?"
                     placeholderTextColor="#666"
                     value={notes}
                     onChangeText={setNotes}
                     multiline
                 />
             </View>
        </View>

        {startDate && endDate && (
            <View style={styles.billContainer}>
                <Text style={styles.billTitle}>Price Details</Text>
                
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>₹{product.price} x {totalDays} days</Text>
                    <Text style={styles.billValue}>₹{totalPrice}</Text>
                </View>
                
                <View style={styles.billRow}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                         <Text style={styles.billLabel}>Service Fee </Text>
                         <Info size={12} color="#666" />
                    </View>
                    <Text style={styles.billValue}>₹{serviceFee}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.billRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>₹{grandTotal}</Text>
                </View>
            </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
          <View>
              <Text style={styles.footerLabel}>Total</Text>
              <Text style={styles.footerPrice}>₹{startDate && endDate ? grandTotal : 0}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.bookBtn, (!startDate || !endDate || loading) && styles.disabledBtn]}
            disabled={!startDate || !endDate || loading}
            onPress={handleConfirmBooking}
          >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.bookBtnText}>Confirm Booking</Text>
              )}
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },

  productSummary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#25252A', padding: 12, borderRadius: 16, marginBottom: 20 },
  miniImage: { width: 60, height: 60, borderRadius: 12, marginRight: 15 },
  miniTitle: { color: '#FFF', fontWeight: '600', fontSize: 16, marginBottom: 4 },
  miniPrice: { color: '#FF5A5F', fontWeight: '700' },

  calendarContainer: { backgroundColor: '#25252A', borderRadius: 20, padding: 10, marginBottom: 20 },
  
  billContainer: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 20 },
  billTitle: { color: '#FFF', fontSize: 18, fontWeight: '600', marginBottom: 15 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billLabel: { color: '#AAA', fontSize: 14 },
  billValue: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 10 },
  totalLabel: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  totalValue: { color: '#FF5A5F', fontSize: 18, fontWeight: '700' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#1E1E23', padding: 20, paddingBottom: 40, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  footerLabel: { color: '#888', fontSize: 12 },
  footerPrice: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  bookBtn: { backgroundColor: '#FF5A5F', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30, minWidth: 160, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#444' },
  bookBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  
  addressSection: { marginBottom: 24 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: '600', marginBottom: 12 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { color: '#AAA', fontSize: 14, marginBottom: 8 },
  input: {
      backgroundColor: '#25252A',
      borderRadius: 12,
      padding: 12,
      color: '#FFF',
      fontSize: 15,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
  },
  textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
  },
  
  // Time picker styles
  timeSection: {
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25252A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 10,
  },
  timeValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RentBookingScreen;