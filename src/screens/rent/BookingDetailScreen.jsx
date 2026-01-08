import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Calendar, User, MapPin, Receipt, ArrowRight, CheckCircle, XCircle } from 'lucide-react-native';
import { createChat } from '../../services/chatService';

const BookingDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { booking, viewMode } = route.params;

    // Handle data structure differences (backend population vs simple object)
    const product = booking.item || booking.product || {};

    // For owner view (Requests tab): show renter as the contact person
    // For renter view (My Rentals): show owner as the contact person
    const { user } = React.useContext(require('../../context/AuthContext').AuthContext);
    const isOwnerView = viewMode === 'requests' || (booking.ownerId === user?.id);

    // Contact person is the other party
    const contactPerson = isOwnerView
        ? (booking.renter || {})  // Owner views renter info
        : (booking.owner || product.owner || {});  // Renter views owner info

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const startDate = formatDate(booking.startDate);
    const endDate = formatDate(booking.endDate);

    const [accepting, setAccepting] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalType, setModalType] = React.useState(null); // 'success' or 'error'
    const [modalMessage, setModalMessage] = React.useState('');

    const showAcceptance = isOwnerView && booking.status === 'pending';

    const handleUpdateStatus = async (newStatus) => {
        setAccepting(true);
        try {
            const { updateBookingStatus } = require('../../services/bookingService');
            await updateBookingStatus(booking.id, newStatus);
            setModalType(newStatus === 'confirmed' ? 'success' : 'rejected');
            setModalMessage(`Booking ${newStatus === 'confirmed' ? 'Accepted' : 'Rejected'} successfully!`);
            setModalVisible(true);
        } catch (error) {
            setModalType('error');
            setModalMessage('Failed to update booking. Please try again.');
            setModalVisible(true);
        } finally {
            setAccepting(false);
        }
    };

    const closeModalAndGoBack = () => {
        setModalVisible(false);
        navigation.goBack();
    };

    const handleItemPress = () => {
        // Merge owner info into product for ItemDetailScreen
        const productWithOwner = {
            ...product,
            owner: contactPerson,
        };
        navigation.navigate('ItemDetail', {
            product: productWithOwner,
            hideRentOption: true,
            hideChatOption: true
        });
    };

    const handleMessageContact = async () => {
        if (!contactPerson.id) {
            console.log('Missing contact ID. Contact object:', contactPerson);
            setModalType('error');
            setModalMessage(`Cannot message ${isOwnerView ? 'renter' : 'lender'}: Contact details missing`);
            setModalVisible(true);
            return;
        }
        try {
            const response = await createChat(product.id, contactPerson.id);
            const chat = response.chat;
            navigation.navigate('ChatScreen', {
                chatId: chat.id,
                recipientId: contactPerson.id,
                recipientName: contactPerson.name,
                recipientAvatar: contactPerson.avatar,
                product: product
            });
        } catch (error) {
            console.error('Error starting chat:', error);
            setModalType('error');
            setModalMessage('Failed to start chat. Please try again.');
            setModalVisible(true);
        }
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
                <View style={[
                    styles.statusBanner,
                    booking.status === 'rejected' || booking.status === 'cancelled'
                        ? styles.statusBannerRejected
                        : booking.status === 'confirmed'
                            ? styles.statusBannerConfirmed
                            : styles.statusBannerPending
                ]}>
                    <Text style={[
                        styles.statusTitle,
                        booking.status === 'rejected' || booking.status === 'cancelled'
                            ? styles.statusTitleRejected
                            : booking.status === 'confirmed'
                                ? styles.statusTitleConfirmed
                                : styles.statusTitlePending
                    ]}>Booking {booking.status}</Text>
                    <Text style={[
                        styles.statusSub,
                        booking.status === 'rejected' || booking.status === 'cancelled'
                            ? styles.statusSubRejected
                            : null
                    ]}>Reference ID: #{booking.trackingId || booking.id?.slice(-8).toUpperCase()}</Text>
                </View>

                {/* Item Card - Clickable */}
                <Text style={styles.sectionTitle}>Rented Item</Text>
                <TouchableOpacity style={styles.itemCard} onPress={handleItemPress}>
                    <Image
                        source={{ uri: product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/100') }}
                        style={styles.itemImage}
                    />
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{product.title}</Text>
                        <View style={styles.locationRow}>
                            <MapPin size={12} color="#888" />
                            <Text style={styles.locationText}>{product.location}</Text>
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
                            <Text style={styles.timelineValue}>{startDate}</Text>
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
                            <Text style={styles.timelineValue}>{endDate}</Text>
                            <Text style={styles.timelineTime}>10:00 AM</Text>
                        </View>
                    </View>
                </View>

                {/* Address & Notes */}
                {(booking.pickupAddress || booking.notes) && (
                    <View style={styles.addressCard}>
                        {booking.pickupAddress && (
                            <View style={styles.addressRow}>
                                <View style={styles.iconBox}>
                                    <MapPin size={18} color="#FF5A5F" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.addrLabel}>Pickup Address</Text>
                                    <Text style={styles.addrValue}>{booking.pickupAddress}</Text>
                                </View>
                            </View>
                        )}

                        {booking.dropAddress && booking.dropAddress !== booking.pickupAddress && (
                            <View style={[styles.addressRow, { marginTop: 16 }]}>
                                <View style={styles.iconBox}>
                                    <MapPin size={18} color="#FF5A5F" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.addrLabel}>Drop Address</Text>
                                    <Text style={styles.addrValue}>{booking.dropAddress}</Text>
                                </View>
                            </View>
                        )}

                        {booking.notes && (
                            <View style={[styles.addressRow, { marginTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 12 }]}>
                                <View style={[styles.iconBox, { backgroundColor: '#333' }]}>
                                    <Receipt size={18} color="#FFF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.addrLabel}>Notes to Lender</Text>
                                    <Text style={styles.addrValue}>{booking.notes}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* Contact Person Info */}
                <Text style={styles.sectionTitle}>{isOwnerView ? 'Renter Details' : 'Lender Details'}</Text>
                <View style={styles.lenderCard}>
                    <Image source={{ uri: contactPerson.avatar || 'https://via.placeholder.com/50' }} style={styles.lenderAvatar} />
                    <View style={styles.lenderInfo}>
                        <Text style={styles.lenderName}>{contactPerson.name || 'Unknown'}</Text>
                        <Text style={styles.lenderSub}>{isOwnerView ? 'Renter' : 'Lender'} • {contactPerson.rating || 'N/A'} ★</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.msgBtn}
                        onPress={handleMessageContact}
                    >
                        <Text style={styles.msgBtnText}>Message</Text>
                    </TouchableOpacity>
                </View>

                {/* Payment Summary */}
                <Text style={styles.sectionTitle}>Payment Summary</Text>
                <View style={styles.billContainer}>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Total Amount Paid</Text>
                        <Text style={styles.billValue}>₹{booking.totalPrice || booking.totalAmount || 0}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Payment Method</Text>
                        <Text style={styles.billValue}>UPI</Text>
                    </View>
                </View>

                {/* Owner Actions */}
                {showAcceptance && (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.rejectBtn]}
                            onPress={() => handleUpdateStatus('rejected')}
                            disabled={accepting}
                        >
                            <Text style={styles.rejectText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.acceptBtn]}
                            onPress={() => handleUpdateStatus('confirmed')} // backend uses 'confirmed' or 'accepted'? Schema said status string. usually 'confirmed'.
                            disabled={accepting}
                        >
                            {accepting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.acceptText}>Accept Booking</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 40 }} />

            </ScrollView>
            
            {/* Success/Error Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModalAndGoBack}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <View style={[
                            styles.modalIconContainer,
                            modalType === 'success' ? styles.modalIconSuccess :
                            modalType === 'rejected' ? styles.modalIconRejected :
                            styles.modalIconError
                        ]}>
                            {modalType === 'success' ? (
                                <CheckCircle size={32} color="#5CD189" />
                            ) : (
                                <XCircle size={32} color="#FF5A5F" />
                            )}
                        </View>
                        <Text style={styles.modalTitle}>
                            {modalType === 'success' ? 'Booking Accepted!' :
                             modalType === 'rejected' ? 'Booking Rejected' : 'Error'}
                        </Text>
                        <Text style={styles.modalDescription}>{modalMessage}</Text>
                        
                        <TouchableOpacity style={styles.modalOkBtn} onPress={closeModalAndGoBack}>
                            <Text style={styles.modalOkText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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

    statusBanner: { padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1 },
    statusBannerPending: { backgroundColor: 'rgba(255, 193, 7, 0.15)', borderColor: 'rgba(255, 193, 7, 0.3)' },
    statusBannerConfirmed: { backgroundColor: 'rgba(92, 209, 137, 0.15)', borderColor: 'rgba(92, 209, 137, 0.3)' },
    statusBannerRejected: { backgroundColor: 'rgba(255, 90, 95, 0.15)', borderColor: 'rgba(255, 90, 95, 0.3)' },

    statusTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4, textTransform: 'capitalize' },
    statusTitlePending: { color: '#FFC107' },
    statusTitleConfirmed: { color: '#5CD189' },
    statusTitleRejected: { color: '#FF5A5F' },

    statusSub: { color: '#5CD189', opacity: 0.8 },
    statusSubRejected: { color: '#FF5A5F' },

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

    addressCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 24 },
    addressRow: { flexDirection: 'row', alignItems: 'flex-start' },
    iconBox: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255, 90, 95, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    addrLabel: { color: '#888', fontSize: 12, marginBottom: 2 },
    addrValue: { color: '#FFF', fontSize: 14, lineHeight: 20 },

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
    billValue: { color: '#FFF', fontWeight: '600' },

    actionContainer: { flexDirection: 'row', marginTop: 24, gap: 12 },
    actionBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    rejectBtn: { backgroundColor: 'rgba(255, 90, 95, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 90, 95, 0.3)' },
    acceptBtn: { backgroundColor: '#5CD189' },
    rejectText: { color: '#FF5A5F', fontWeight: '600', fontSize: 16 },
    acceptText: { color: '#000', fontWeight: '700', fontSize: 16 },
    
    // Modal styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalBox: { width: '100%', maxWidth: 340, padding: 24, backgroundColor: '#2A2A30', borderRadius: 24, alignItems: 'center' },
    modalIconContainer: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    modalIconSuccess: { backgroundColor: 'rgba(92, 209, 137, 0.15)', borderWidth: 1, borderColor: 'rgba(92, 209, 137, 0.3)' },
    modalIconRejected: { backgroundColor: 'rgba(255, 90, 95, 0.15)', borderWidth: 1, borderColor: 'rgba(255, 90, 95, 0.3)' },
    modalIconError: { backgroundColor: 'rgba(255, 90, 95, 0.15)', borderWidth: 1, borderColor: 'rgba(255, 90, 95, 0.3)' },
    modalTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 12, textAlign: 'center' },
    modalDescription: { fontSize: 15, color: '#CCC', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
    modalOkBtn: { width: '100%', paddingVertical: 14, borderRadius: 14, backgroundColor: '#FF5A5F', alignItems: 'center' },
    modalOkText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});

export default BookingDetailScreen;
