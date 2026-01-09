import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Calendar, User, MapPin, Receipt, ArrowRight, CheckCircle, XCircle, Star } from 'lucide-react-native';
import { createChat } from '../../services/chatService';
import { createReview, getBookingReviews } from '../../services/reviewService';
import { updateBookingStatus } from '../../services/bookingService';

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

    // State for existing reviews
    const [existingReviews, setExistingReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const startDate = formatDate(booking.startDate);
    const endDate = formatDate(booking.endDate);
    const startTime = formatTime(booking.startDate);
    const endTime = formatTime(booking.endDate);

    const [accepting, setAccepting] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(null); // 'success' or 'error'
    const [modalMessage, setModalMessage] = useState('');
    
    // Review modal state
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    // Cancellation modal state
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);

    // Determine display status based on booking status and dates

    const getDisplayStatus = () => {
        const now = new Date();
        const bookingEndDate = new Date(booking.endDate);
        const bookingStartDate = new Date(booking.startDate);
        
        if (booking.status === 'rejected' || booking.status === 'cancelled') {
            return booking.status;
        }
        
        if (booking.status === 'completed') {
            return 'completed';
        }
        
        if (booking.status === 'confirmed') {
            if (bookingEndDate < now) {
                return 'expired';
            } else if (bookingStartDate <= now && bookingEndDate >= now) {
                return 'ongoing';
            } else {
                return 'confirmed';
            }
        }
        
        if (booking.status === 'pending') {
            if (bookingStartDate < now) {
                return 'expired';
            }
            return 'pending';
        }
        
        return booking.status;
    };

    const displayStatus = getDisplayStatus();

    const showAcceptance = isOwnerView && booking.status === 'pending' && displayStatus !== 'expired';
    const canReview = !isOwnerView && (displayStatus === 'confirmed' || displayStatus === 'ongoing' || displayStatus === 'expired' || displayStatus === 'completed') && displayStatus !== 'cancelled';
    const canCancel = (
        displayStatus !== 'expired' && 
        displayStatus !== 'completed' && 
        displayStatus !== 'cancelled' && 
        displayStatus !== 'rejected' &&
        (isOwnerView 
            ? booking.status === 'confirmed' 
            : (booking.status === 'pending' || booking.status === 'confirmed')
        )
    );

    const handleCancelBooking = async () => {
        console.log('Cancel Reason:', cancelReason);
        if (!cancelReason.trim()) {
            // Replaced Alert.alert with custom modal
            setModalType('error');
            setModalMessage('Please provide a reason for cancellation');
            setModalVisible(true);
            return;
        }
        
        setCancelling(true);
        try {
            await updateBookingStatus(booking.id, 'cancelled', cancelReason);
            setCancelModalVisible(false);
            setModalType('success');
            setModalMessage('Booking cancelled successfully');
            setModalVisible(true);
        } catch (error) {
            console.error(error);
            setCancelModalVisible(false);
            setModalType('error');
            setModalMessage(error.message || 'Failed to cancel booking');
            setModalVisible(true);
        } finally {
            setCancelling(false);
        }
    };

    // Get the lender (owner) for user review
    const lender = booking.owner || product.owner || {};

    // Fetch existing reviews for this booking
    useEffect(() => {
        const fetchExistingReviews = async () => {
            try {
                const response = await getBookingReviews(booking.id);
                setExistingReviews(response.reviews || []);
            } catch (error) {
                console.log('Error fetching reviews:', error);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchExistingReviews();
    }, [booking.id]);

    // Check if user has already reviewed
    const itemReview = existingReviews.find(r => r.targetType === 'item');
    const userReview = existingReviews.find(r => r.targetType === 'user');
    const hasReviewed = existingReviews.length > 0;

    const handleSubmitReview = async () => {
        if (reviewRating === 0) {
            setModalType('error');
            setModalMessage('Please rate the item');
            setModalVisible(true);
            return;
        }
        
        setReviewSubmitting(true);
        try {
            // Submit item review
            await createReview(booking.id, 'item', product.id, reviewRating, reviewComment);
            
            // Submit user review if user rating is provided
            if (userRating > 0 && lender.id) {
                await createReview(booking.id, 'user', lender.id, userRating, userComment);
            }
            
            setReviewModalVisible(false);
            setReviewRating(0);
            setReviewComment('');
            setUserRating(0);
            setUserComment('');
            setModalType('success');
            setModalMessage('Review submitted successfully!');
            setModalVisible(true);
        } catch (error) {
            setModalType('error');
            setModalMessage(error.message || 'Failed to submit review');
            setModalVisible(true);
        } finally {
            setReviewSubmitting(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        setAccepting(true);
        try {
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
        // Determine the correct owner (lender) to display
        // If I am the owner (isOwnerView), then I am the owner.
        // If I am the renter, then the booking owner is the owner.
        const itemOwner = isOwnerView ? user : (booking.owner || product.owner || {});

        // Merge owner info into product for ItemDetailScreen
        const productWithOwner = {
            ...product,
            owner: itemOwner,
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

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Status Banner */}
                <View style={[
                    styles.statusBanner,
                    displayStatus === 'rejected' || displayStatus === 'cancelled'
                        ? styles.statusBannerRejected
                        : displayStatus === 'expired'
                            ? styles.statusBannerExpired
                            : displayStatus === 'ongoing'
                                ? styles.statusBannerOngoing
                                : displayStatus === 'confirmed' || displayStatus === 'completed'
                                    ? styles.statusBannerConfirmed
                                    : styles.statusBannerPending
                ]}>
                    <Text style={[
                        styles.statusTitle,
                        displayStatus === 'rejected' || displayStatus === 'cancelled'
                            ? styles.statusTitleRejected
                            : displayStatus === 'expired'
                                ? styles.statusTitleExpired
                                : displayStatus === 'ongoing'
                                    ? styles.statusTitleOngoing
                                    : displayStatus === 'confirmed' || displayStatus === 'completed'
                                        ? styles.statusTitleConfirmed
                                        : styles.statusTitlePending
                    ]}>Booking {displayStatus}</Text>
                    <Text style={[
                        styles.statusSub,
                        displayStatus === 'rejected' || displayStatus === 'cancelled' || displayStatus === 'expired'
                            ? styles.statusSubRejected
                            : null
                    ]}>Reference ID: #{booking.trackingId || booking.id?.slice(-8).toUpperCase()}</Text>
                </View>

                {/* Cancellation Details */}
                {(displayStatus === 'cancelled' || booking.status === 'cancelled') && (
                    <View style={styles.cancellationCard}>
                        <Text style={styles.cancellationTitle}>Cancellation Details</Text>
                        <Text style={styles.cancellationText}>
                            Cancelled by: <Text style={{fontWeight: 'bold'}}>{booking.cancelledBy === user?.id ? 'You' : (booking.cancelledBy === booking.ownerId ? 'Lender' : 'Renter')}</Text>
                        </Text>
                        {booking.cancellationReason && (
                            <Text style={styles.cancellationText}>Reason: {booking.cancellationReason}</Text>
                        )}
                    </View>
                )}

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
                            <MapPin size={12} color="#FF5A5F" />
                            <Text style={styles.locationText} numberOfLines={1}>{booking.pickupAddress || product.location || 'N/A'}</Text>
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
                            <Text style={styles.timelineTime}>{startTime}</Text>
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
                            <Text style={styles.timelineTime}>{endTime}</Text>
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
                        <Text style={styles.lenderRole}>{isOwnerView ? 'Renter' : 'Lender'}</Text>
                        <View style={styles.lenderRatingRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star}
                                    size={14} 
                                    color="#FFD700" 
                                    fill={star <= Math.round(contactPerson.rating || 0) ? '#FFD700' : 'transparent'}
                                />
                            ))}
                            <Text style={styles.lenderRatingText}>
                                {contactPerson.rating ? `${contactPerson.rating.toFixed(1)}/5` : 'No ratings'}
                            </Text>
                        </View>
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
                            onPress={() => handleUpdateStatus('confirmed')}
                            disabled={accepting}
                        >
                            {accepting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.acceptText}>Accept Booking</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Review Section - Show existing review or leave review button */}
                {/* Cancel Booking Button */}
                {canCancel && (
                    <TouchableOpacity 
                        style={styles.cancelBtn}
                        onPress={() => {
                            console.log("Cancel Booking Pressed");
                            setCancelModalVisible(true);
                        }}
                    >
                        <Text style={styles.cancelBtnText}>Cancel Booking</Text>
                    </TouchableOpacity>
                )}

                {/* Review Section - Show existing review or leave review button */}
                {canReview && !reviewsLoading && (
                    <View>
                        {hasReviewed ? (
                            <View style={styles.existingReviewContainer}>
                                <Text style={styles.reviewSectionHeader}>Your Review</Text>
                                
                                {/* Item Review */}
                                {itemReview && (
                                    <View style={styles.existingReviewCard}>
                                        <Text style={styles.existingReviewLabel}>Item Rating</Text>
                                        <View style={styles.existingReviewStars}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star 
                                                    key={star}
                                                    size={20} 
                                                    color="#FFD700" 
                                                    fill={star <= itemReview.rating ? '#FFD700' : 'transparent'}
                                                />
                                            ))}
                                            <Text style={styles.existingRatingText}>{itemReview.rating}/5</Text>
                                        </View>
                                        {itemReview.comment && (
                                            <Text style={styles.existingReviewComment}>"{itemReview.comment}"</Text>
                                        )}
                                    </View>
                                )}

                                {/* User/Lender Review */}
                                {userReview && (
                                    <View style={styles.existingReviewCard}>
                                        <Text style={styles.existingReviewLabel}>Lender Rating</Text>
                                        <View style={styles.existingReviewStars}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star 
                                                    key={star}
                                                    size={20} 
                                                    color="#FFD700" 
                                                    fill={star <= userReview.rating ? '#FFD700' : 'transparent'}
                                                />
                                            ))}
                                            <Text style={styles.existingRatingText}>{userReview.rating}/5</Text>
                                        </View>
                                        {userReview.comment && (
                                            <Text style={styles.existingReviewComment}>"{userReview.comment}"</Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        ) : (
                            <TouchableOpacity 
                                style={styles.reviewBtn} 
                                onPress={() => setReviewModalVisible(true)}
                            >
                                <Star size={18} color="#FFD700" fill="#FFD700" style={{ marginRight: 8 }} />
                                <Text style={styles.reviewBtnText}>Leave a Review</Text>
                            </TouchableOpacity>
                        )}
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
                            {modalType === 'success' ? 'Success!' :
                                modalType === 'rejected' ? 'Booking Rejected' : 'Error'}
                        </Text>
                        <Text style={styles.modalDescription}>{modalMessage}</Text>

                        <TouchableOpacity style={styles.modalOkBtn} onPress={closeModalAndGoBack}>
                            <Text style={styles.modalOkText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Review Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={reviewModalVisible}
                onRequestClose={() => setReviewModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <ScrollView contentContainerStyle={styles.reviewModalScroll}>
                        <View style={styles.reviewModalBox}>
                            <Text style={styles.reviewModalTitle}>Rate Your Experience</Text>
                            
                            {/* Item Review Section */}
                            <View style={styles.reviewSection}>
                                <Text style={styles.reviewSectionTitle}>Rate the Item</Text>
                                <Text style={styles.reviewModalSubtitle}>{product.title}</Text>
                                
                                <View style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity 
                                            key={star} 
                                            onPress={() => setReviewRating(star)}
                                            style={styles.starButton}
                                        >
                                            <Star 
                                                size={32} 
                                                color={star <= reviewRating ? '#FFD700' : '#444'} 
                                                fill={star <= reviewRating ? '#FFD700' : 'transparent'}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <Text style={styles.ratingLabel}>
                                    {reviewRating === 0 ? 'Tap to rate (required)' : 
                                     reviewRating === 1 ? 'Poor' :
                                     reviewRating === 2 ? 'Fair' :
                                     reviewRating === 3 ? 'Good' :
                                     reviewRating === 4 ? 'Very Good' : 'Excellent!'}
                                </Text>

                                <View style={styles.commentContainer}>
                                    <TextInput
                                        style={styles.commentInput}
                                        placeholder="Comment about the item (optional)"
                                        placeholderTextColor="#666"
                                        value={reviewComment}
                                        onChangeText={(text) => setReviewComment(text.slice(0, 100))}
                                        multiline
                                        maxLength={100}
                                    />
                                    <Text style={styles.charCount}>{reviewComment.length}/100</Text>
                                </View>
                            </View>

                            {/* Lender Review Section */}
                            {lender.id && (
                                <View style={styles.reviewSection}>
                                    <Text style={styles.reviewSectionTitle}>Rate the Lender</Text>
                                    <View style={styles.lenderReviewRow}>
                                        <Image 
                                            source={{ uri: lender.avatar || 'https://via.placeholder.com/40' }} 
                                            style={styles.lenderReviewAvatar} 
                                        />
                                        <Text style={styles.lenderReviewName}>{lender.name || 'Lender'}</Text>
                                    </View>
                                    
                                    <View style={styles.starsContainer}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <TouchableOpacity 
                                                key={star} 
                                                onPress={() => setUserRating(star)}
                                                style={styles.starButton}
                                            >
                                                <Star 
                                                    size={32} 
                                                    color={star <= userRating ? '#FFD700' : '#444'} 
                                                    fill={star <= userRating ? '#FFD700' : 'transparent'}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    <Text style={styles.ratingLabel}>
                                        {userRating === 0 ? 'Tap to rate (optional)' : 
                                         userRating === 1 ? 'Poor' :
                                         userRating === 2 ? 'Fair' :
                                         userRating === 3 ? 'Good' :
                                         userRating === 4 ? 'Very Good' : 'Excellent!'}
                                    </Text>

                                    <View style={styles.commentContainer}>
                                        <TextInput
                                            style={styles.commentInput}
                                            placeholder="Comment about the lender (optional)"
                                            placeholderTextColor="#666"
                                            value={userComment}
                                            onChangeText={(text) => setUserComment(text.slice(0, 100))}
                                            multiline
                                            maxLength={100}
                                        />
                                        <Text style={styles.charCount}>{userComment.length}/100</Text>
                                    </View>
                                </View>
                            )}

                            {/* Actions */}
                            <View style={styles.reviewModalActions}>
                                <TouchableOpacity 
                                    style={styles.reviewCancelBtn} 
                                    onPress={() => {
                                        setReviewModalVisible(false);
                                        setReviewRating(0);
                                        setReviewComment('');
                                        setUserRating(0);
                                        setUserComment('');
                                    }}
                                >
                                    <Text style={styles.reviewCancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.reviewSubmitBtn, reviewRating === 0 && styles.reviewSubmitDisabled]} 
                                    onPress={handleSubmitReview}
                                    disabled={reviewRating === 0 || reviewSubmitting}
                                >
                                    {reviewSubmitting ? (
                                        <ActivityIndicator color="#FFF" size="small" />
                                    ) : (
                                        <Text style={styles.reviewSubmitText}>Submit Review</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
            
            {/* Cancel Booking Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={cancelModalVisible}
                onRequestClose={() => setCancelModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Cancel Booking</Text>
                        <Text style={styles.modalDescription}>Are you sure you want to cancel this booking? This action cannot be undone.</Text>
                        
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Reason for cancellation (required)"
                            placeholderTextColor="#888"
                            multiline
                            numberOfLines={3}
                            value={cancelReason}
                            onChangeText={setCancelReason}
                        />

                        <TouchableOpacity 
                            style={[styles.modalOkBtn, { backgroundColor: '#FF5A5F', marginTop: 16 }]} 
                            onPress={handleCancelBooking}
                            disabled={cancelling}
                        >
                            {cancelling ? <ActivityIndicator color="#FFF" /> : <Text style={styles.modalOkText}>Confirm Cancellation</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.modalCancelBtn} 
                            onPress={() => setCancelModalVisible(false)}
                            disabled={cancelling}
                        >
                            <Text style={styles.modalCancelText}>Go Back</Text>
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
    statusBannerExpired: { backgroundColor: 'rgba(128, 128, 128, 0.15)', borderColor: 'rgba(128, 128, 128, 0.3)' },
    statusBannerOngoing: { backgroundColor: 'rgba(76, 175, 80, 0.15)', borderColor: 'rgba(76, 175, 80, 0.3)' },

    statusTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4, textTransform: 'capitalize' },
    statusTitlePending: { color: '#FFC107' },
    statusTitleConfirmed: { color: '#5CD189' },
    statusTitleRejected: { color: '#FF5A5F' },
    statusTitleExpired: { color: '#888' },
    statusTitleOngoing: { color: '#4CAF50' },

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
    lenderAvatar: { width: 48, height: 48, borderRadius: 24 },
    lenderInfo: { marginLeft: 12, flex: 1 },
    lenderName: { color: '#FFF', fontWeight: '600', fontSize: 16, marginBottom: 2 },
    lenderRole: { color: '#888', fontSize: 12, marginBottom: 4 },
    lenderRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    lenderRatingText: { color: '#FFD700', fontSize: 12, fontWeight: '600', marginLeft: 6 },
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

    acceptText: { color: '#000', fontWeight: '700', fontSize: 16 },

    cancelBtn: { backgroundColor: 'rgba(255, 90, 95, 0.1)', borderWidth: 1, borderColor: '#FF5A5F', marginTop: 24, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
    cancelBtnText: { color: '#FF5A5F', fontWeight: '600', fontSize: 16 },

    cancellationCard: { backgroundColor: 'rgba(255, 90, 95, 0.1)', padding: 16, borderRadius: 12, marginBottom: 24, marginTop: -12, borderLeftWidth: 3, borderLeftColor: '#FF5A5F' },
    cancellationTitle: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 8 },
    cancellationText: { color: '#ddd', fontSize: 14, lineHeight: 20 },
    
    modalInput: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFF', padding: 12, borderRadius: 8, height: 100, textAlignVertical: 'top', marginTop: 12, width: '100%' },
    modalCancelBtn: { marginTop: 16, padding: 10 },
    modalCancelText: { color: '#888', fontSize: 14 },

    // Existing review styles
    existingReviewContainer: { marginTop: 16 },
    reviewSectionHeader: { color: '#FFF', fontSize: 18, fontWeight: '700', marginBottom: 12 },
    existingReviewCard: { backgroundColor: 'rgba(255, 215, 0, 0.08)', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.2)' },
    existingReviewLabel: { color: '#888', fontSize: 12, marginBottom: 6 },
    existingReviewStars: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
    existingRatingText: { color: '#FFD700', fontSize: 14, fontWeight: '600', marginLeft: 8 },
    existingReviewComment: { color: '#CCC', fontSize: 14, fontStyle: 'italic', lineHeight: 20 },

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

    // Review button
    reviewBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'rgba(255, 215, 0, 0.15)', 
        paddingVertical: 16, 
        borderRadius: 12, 
        marginTop: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    reviewBtnText: { color: '#FFD700', fontWeight: '600', fontSize: 16 },

    // Review Modal styles
    reviewModalScroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    reviewModalBox: { 
        width: '100%', 
        maxWidth: 360, 
        padding: 24, 
        backgroundColor: '#2A2A30', 
        borderRadius: 24,
        alignSelf: 'center',
    },
    reviewModalTitle: { 
        fontSize: 22, 
        fontWeight: '700', 
        color: '#FFF', 
        textAlign: 'center',
        marginBottom: 20,
    },
    reviewSection: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    reviewSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 8,
    },
    reviewModalSubtitle: { 
        fontSize: 14, 
        color: '#888', 
        marginBottom: 16,
    },
    lenderReviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    lenderReviewAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    lenderReviewName: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: '500',
    },
    starsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: 8,
        marginBottom: 8,
    },
    starButton: { 
        padding: 4,
    },
    ratingLabel: { 
        textAlign: 'center', 
        color: '#FFD700', 
        fontSize: 14, 
        fontWeight: '600',
        marginBottom: 20,
    },
    commentContainer: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        padding: 12,
        marginBottom: 20,
    },
    commentInput: { 
        color: '#FFF', 
        fontSize: 14, 
        minHeight: 80,
        textAlignVertical: 'top',
    },
    charCount: { 
        textAlign: 'right', 
        color: '#666', 
        fontSize: 12,
        marginTop: 4,
    },
    reviewModalActions: { 
        flexDirection: 'row', 
        gap: 12,
    },
    reviewCancelBtn: { 
        flex: 1, 
        paddingVertical: 14, 
        borderRadius: 12, 
        backgroundColor: 'rgba(255,255,255,0.08)', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    reviewCancelText: { 
        color: '#FFF', 
        fontWeight: '600', 
        fontSize: 16,
    },
    reviewSubmitBtn: { 
        flex: 1, 
        paddingVertical: 14, 
        borderRadius: 12, 
        backgroundColor: '#FFD700', 
        alignItems: 'center',
    },
    reviewSubmitDisabled: {
        backgroundColor: '#444',
    },
    reviewSubmitText: { 
        color: '#000', 
        fontWeight: '700', 
        fontSize: 16,
    },
});

export default BookingDetailScreen;
