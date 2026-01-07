import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Calendar, User, MapPin, Receipt, ArrowRight } from 'lucide-react-native';

const BookingDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { booking } = route.params;

    const handleItemPress = () => {
        navigation.navigate('ItemDetail', { 
            product: booking.product,
            hideRentOption: true 
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking Details</Text>
                <TouchableOpacity style={styles.receiptButton}>
                    <Receipt size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Status Banner */}
                    <View style={styles.statusBanner}>
                        <Text style={styles.statusTitle}>Booking Confirmed</Text>
                        <Text style={styles.statusSub}>Reference ID: #BK-{booking.id}5892</Text>
                    </View>

                    {/* Item Card - Clickable */}
                    <Text style={styles.sectionTitle}>Rented Item</Text>
                    <TouchableOpacity style={styles.itemCard} onPress={handleItemPress}>
                        <Image source={{ uri: booking.product.image }} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>{booking.product.title}</Text>
                            <View style={styles.locationRow}>
                                <MapPin size={12} color="#888" />
                                <Text style={styles.locationText}>{booking.product.location}</Text>
                            </View>
                            <View style={styles.viewDetailsRow}>
                                <Text style={styles.viewDetailsText}>View Item Details</Text>
                                <ArrowRight size={14} color="#FF5A5F" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Timeline */}
                    <View style={styles.timelineSection}>
                         <View style={styles.timelineItem}>
                            <View style={styles.timelineIconBg}>
                                <Calendar size={20} color="#FFF" />
                            </View>
                            <View>
                                <Text style={styles.timelineLabel}>Start Date</Text>
                                <Text style={styles.timelineValue}>{booking.dates.split('-')[0].trim()}</Text>
                                <Text style={styles.timelineTime}>10:00 AM</Text>
                            </View>
                         </View>
                         <View style={styles.timelineConnector} />
                         <View style={styles.timelineItem}>
                            <View style={[styles.timelineIconBg, { backgroundColor: '#333' }]}>
                                <Calendar size={20} color="#888" />
                            </View>
                            <View>
                                <Text style={styles.timelineLabel}>End Date</Text>
                                <Text style={styles.timelineValue}>{booking.dates.split('-')[1].trim()}</Text>
                                <Text style={styles.timelineTime}>10:00 AM</Text>
                            </View>
                         </View>
                    </View>

                    {/* Lender Info */}
                    <Text style={styles.sectionTitle}>Lender Details</Text>
                    <View style={styles.lenderCard}>
                         <Image source={{ uri: booking.product.owner.avatar }} style={styles.lenderAvatar} />
                         <View style={styles.lenderInfo}>
                              <Text style={styles.lenderName}>{booking.product.owner.name}</Text>
                              <Text style={styles.lenderSub}>Lender • {booking.product.owner.rating} ★</Text>
                         </View>
                         <TouchableOpacity 
                             style={styles.msgBtn}
                             onPress={() => navigation.navigate('Chat', { owner: booking.product.owner })}
                         >
                              <Text style={styles.msgBtnText}>Message</Text>
                         </TouchableOpacity>
                    </View>

                    {/* Payment Summary */}
                    <Text style={styles.sectionTitle}>Payment Summary</Text>
                    <View style={styles.billContainer}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Total Amount Paid</Text>
                            <Text style={styles.billValue}>₹{booking.totalPrice}</Text>
                        </View>
                         <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Payment Method</Text>
                            <Text style={styles.billValue}>UPI</Text>
                        </View>
                    </View>

                </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A1A' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    headerTitle: { fontSize: 18, color: '#FFF', fontWeight: '600' },
    backButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
    receiptButton: { padding: 8 },
    scrollContent: { padding: 20 },

    statusBanner: { backgroundColor: 'rgba(92, 209, 137, 0.15)', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(92, 209, 137, 0.3)' },
    statusTitle: { color: '#5CD189', fontSize: 18, fontWeight: '700', marginBottom: 4 },
    statusSub: { color: '#5CD189', opacity: 0.8 },

    sectionTitle: { fontSize: 16, color: '#888', fontWeight: '600', marginBottom: 12, marginTop: 8 },

    itemCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 12, marginBottom: 24 },
    itemImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#333' },
    itemInfo: { marginLeft: 16, flex: 1, justifyContent: 'center' },
    itemTitle: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 4 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    locationText: { color: '#888', fontSize: 12, marginLeft: 4 },
    viewDetailsRow: { flexDirection: 'row', alignItems: 'center' },
    viewDetailsText: { color: '#FF5A5F', fontSize: 12, fontWeight: '600', marginRight: 4 },

    timelineSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingVertical: 10 },
    timelineItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    timelineIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF5A5F', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    timelineLabel: { color: '#888', fontSize: 12 },
    timelineValue: { color: '#FFF', fontWeight: '700', fontSize: 14, marginVertical: 2 },
    timelineTime: { color: '#666', fontSize: 12 },
    timelineConnector: { width: 1, backgroundColor: '#333', marginHorizontal: 10 },

    lenderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 16, marginBottom: 24 },
    lenderAvatar: { width: 40, height: 40, borderRadius: 20 },
    lenderInfo: { marginLeft: 12, flex: 1 },
    lenderName: { color: '#FFF', fontWeight: '600', fontSize: 16 },
    lenderSub: { color: '#888', fontSize: 12 },
    msgBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    msgBtnText: { color: '#FFF', fontSize: 12, fontWeight: '500' },

    billContainer: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16 },
    billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    billLabel: { color: '#888' },
    billValue: { color: '#FFF', fontWeight: '600' }
});

export default BookingDetailScreen;
