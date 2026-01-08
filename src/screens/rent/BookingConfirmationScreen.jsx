import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle, Calendar, Home } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import GlassView from '../../components/GlassView';

const BookingConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking, product } = route.params || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2B2D42', '#1A1A2E', '#16161E']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color="#4CAF50" />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your rental request has been submitted</Text>

        {/* Booking Details Card */}
        <GlassView style={styles.detailsCard} borderRadius={20}>
          {product && (
            <View style={styles.productRow}>
              <Image 
                source={{ uri: product.images?.[0] || product.image || 'https://via.placeholder.com/100' }} 
                style={styles.productImage} 
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                <Text style={styles.productPrice}>₹{product.price}<Text style={styles.perDay}>/day</Text></Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Calendar size={18} color="#888" />
            <Text style={styles.detailLabel}>Rental Period</Text>
          </View>
          <Text style={styles.dateRange}>
            {formatDate(booking?.startDate)} - {formatDate(booking?.endDate)}
          </Text>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{booking?.totalAmount || 0}</Text>
          </View>
        </GlassView>

        <Text style={styles.infoText}>
          The owner will review your request and confirm availability. You'll receive a notification once approved.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('HomeTabs', { screen: 'Bookings' })}
        >
          <Text style={styles.secondaryBtnText}>View My Rentals</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('HomeTabs')}
        >
          <Home size={20} color="#FFF" />
          <Text style={styles.primaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1A1A1A' 
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
  },
  detailsCard: {
    width: '100%',
    padding: 20,
    marginBottom: 24,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#333',
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF5A5F',
  },
  perDay: {
    fontSize: 12,
    color: '#888',
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    marginLeft: 8,
  },
  dateRange: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#888',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  secondaryBtn: {
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: '#FF5A5F',
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingConfirmationScreen;
