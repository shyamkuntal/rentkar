import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, Alert, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Edit2, Trash2, Eye, MapPin, Tag, Calendar, MoreHorizontal } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';

const { width } = Dimensions.get('window');

const MyAdDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { listing } = route.params;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeletePress = () => {
      setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
      console.log('Deleting listing:', listing.id);
      setDeleteModalVisible(false);
      navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: listing.image }} style={styles.image} resizeMode="cover" />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.statusBadgeImg}>
            <Text style={styles.statusTextImg}>{listing.status === 'active' ? 'Active' : 'Rented'}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
             <View style={{flex: 1}}>
                <Text style={styles.title}>{listing.title}</Text>
                <Text style={styles.date}>{listing.date}</Text>
             </View>
             <Text style={styles.price}>₹{listing.price}<Text style={styles.perTime}>/day</Text></Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
                <Eye size={20} color={colors.primary} />
                <Text style={styles.statValue}>{listing.views}</Text>
                <Text style={styles.statLabel}>Total Views</Text>
            </View>
            <View style={styles.statCard}>
                <Calendar size={20} color={colors.primary} />
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Days Listed</Text>
            </View>
            <View style={styles.statCard}>
                <Tag size={20} color={colors.primary} />
                <Text style={styles.statValue}>Electronics</Text>
                <Text style={styles.statLabel}>Category</Text>
            </View>
          </View>

          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Description</Text>
             <Text style={styles.description}>
                This is a detailed description of the {listing.title}. It is in excellent condition and includes all original accessories. Perfect for professionals and enthusiasts alike.
             </Text>
          </View>
          
          <View style={{height: 100}} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditListing', { listing })}>
              <Edit2 size={20} color="#FFF" />
              <Text style={styles.btnText}>Edit Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
              <Trash2 size={20} color="#FF4545" />
          </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <GlassView style={styles.modalContent} intensity={40} borderRadius={24}>
                <View style={styles.modalIconContainer}>
                    <Trash2 size={32} color="#FF4545" />
                </View>
                <Text style={styles.modalTitle}>Delete Listing?</Text>
                <Text style={styles.modalDescription}>Are you sure you want to delete this listing? This action cannot be undone.</Text>
                
                <View style={styles.modalActions}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setDeleteModalVisible(false)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </GlassView>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 300,
    width: '100%',
    backgroundColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeImg: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusTextImg: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  contentContainer: {
    padding: 20,
    marginTop: -20,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
    marginRight: 10,
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  perTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#CCC',
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flex: 1,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteButton: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 69, 69, 0.15)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 69, 0.3)',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      modalContent: {
        width: '100%',
        maxWidth: 340,
        padding: 24,
        alignItems: 'center',
      },
      modalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 69, 69, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 69, 69, 0.3)',
      },
      modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 12,
      },
      modalDescription: {
        fontSize: 15,
        color: '#CCC',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
      },
      modalActions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
      },
      cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginRight: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
      },
      deleteBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#FF4545',
        marginLeft: 10,
        alignItems: 'center',
        shadowColor: '#FF4545',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      },
      cancelText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
      },
      deleteText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
      },
});

export default MyAdDetailScreen;
