import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, CreditCard, Check, Calendar, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { product, dates, totalPrice } = route.params || {
    product: { title: 'Sample Product', price: 500, image: 'https://via.placeholder.com/100' },
    dates: { start: 'Jan 15', end: 'Jan 18' },
    totalPrice: 1500
  };
  
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: '₹' },
    { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard size={20} color="#FFF" /> },
    { id: 'wallet', label: 'Wallet', icon: '💳' },
  ];

  const handlePayment = () => {
    Alert.alert('Payment Successful', 'Your booking has been confirmed!', [
      { text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'Bookings' }) }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.card}>
          <View style={styles.productRow}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
              <Text style={styles.productPrice}>₹{product.price}/day</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Calendar size={16} color="#888" />
              <Text style={styles.dateLabel}>From</Text>
              <Text style={styles.dateValue}>{dates.start}</Text>
            </View>
            <View style={styles.dateItem}>
              <Clock size={16} color="#888" />
              <Text style={styles.dateLabel}>To</Text>
              <Text style={styles.dateValue}>{dates.end}</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          {paymentMethods.map((method, index) => (
            <TouchableOpacity 
              key={method.id}
              style={[styles.paymentOption, index < paymentMethods.length - 1 && styles.borderBottom]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentLeft}>
                <View style={styles.paymentIcon}>
                  {typeof method.icon === 'string' ? (
                    <Text style={styles.iconText}>{method.icon}</Text>
                  ) : method.icon}
                </View>
                <Text style={styles.paymentLabel}>{method.label}</Text>
              </View>
              <View style={[styles.radioOuter, selectedPayment === method.id && styles.radioSelected]}>
                {selectedPayment === method.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Breakdown */}
        <Text style={styles.sectionTitle}>Price Details</Text>
        <View style={styles.card}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Rental Fee</Text>
            <Text style={styles.priceValue}>₹{totalPrice - 100}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>₹100</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{totalPrice}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total Amount</Text>
          <Text style={styles.bottomPrice}>₹{totalPrice}</Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
    marginTop: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 16,
  },
  productRow: {
    flexDirection: 'row',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  productInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#FF5A5F',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateItem: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  dateValue: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    marginTop: 2,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
    color: '#FFF',
  },
  paymentLabel: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#FF5A5F',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF5A5F',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#888',
  },
  priceValue: {
    fontSize: 14,
    color: '#FFF',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF5A5F',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(26,26,26,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  bottomLabel: {
    fontSize: 12,
    color: '#888',
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  payButton: {
    backgroundColor: '#FF5A5F',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CheckoutScreen;
