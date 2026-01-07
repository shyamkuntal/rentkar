import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Calendar as CalendarIcon, Info } from 'lucide-react-native';

const RentBookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Product data passed from previous screen
  const product = route.params?.product || { 
      title: 'DJI Mavic Air 2 Drone', 
      price: 800, 
      image: 'https://images.unsplash.com/photo-1579829366248-204da8419767?q=80&w=1000' 
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // --- Calendar Logic ---
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

  // --- Price Calculation ---
  const calculateTotal = () => {
      if (!startDate || !endDate) return 0;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include start day
      return diffDays * product.price;
  };
  
  const totalDays = (startDate && endDate) ? (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24) + 1 : 0;
  const totalPrice = calculateTotal();
  const serviceFee = Math.round(totalPrice * 0.05); // 5% fee
  const grandTotal = totalPrice + serviceFee;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Dates</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Mini Summary */}
        <View style={styles.productSummary}>
            <Image source={{ uri: product.image }} style={styles.miniImage} />
            <View style={{ flex: 1 }}>
                <Text style={styles.miniTitle}>{product.title}</Text>
                <Text style={styles.miniPrice}>₹{product.price}<Text style={{color:'#888', fontSize:12}}>/day</Text></Text>
            </View>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarContainer}>
            <Calendar
                onDayPress={handleDayPress}
                markingType={'period'}
                markedDates={markedDates}
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

        {/* Bill Summary */}
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

      {/* Footer Action */}
      <View style={styles.footer}>
          <View>
              <Text style={styles.footerLabel}>Total</Text>
              <Text style={styles.footerPrice}>₹{startDate && endDate ? grandTotal : 0}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.bookBtn, (!startDate || !endDate) && styles.disabledBtn]}
            disabled={!startDate || !endDate}
          >
              <Text style={styles.bookBtnText}>Confirm Booking</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
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
  bookBtn: { backgroundColor: '#FF5A5F', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30 },
  disabledBtn: { backgroundColor: '#444' },
  bookBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});

export default RentBookingScreen;