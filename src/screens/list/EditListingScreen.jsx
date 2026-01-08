import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, Modal, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Camera, X, Check, Laptop, Car, Shirt, Home as HomeIcon, Dumbbell } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';
import { updateItem } from '../../services/itemService';

const EditListingScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { listing } = route.params;

    // Data for Categories
    const categories = [
        { id: '1', name: 'Electronics', icon: Laptop },
        { id: '2', name: 'Vehicles', icon: Car },
        { id: '3', name: 'Fashion', icon: Shirt },
        { id: '4', name: 'Home & Garden', icon: HomeIcon },
        { id: '5', name: 'Sports', icon: Dumbbell },
    ];

    const subCategories = {
        'Electronics': ['Mobile Phones', 'Laptops', 'Cameras', 'Audio', 'Drones'],
        'Vehicles': ['Cars', 'Bikes', 'Scooters', 'Accessories'],
        'Fashion': ['Men', 'Women', 'Kids', 'Watches', 'Shoes'],
        'Home & Garden': ['Furniture', 'Decor', 'Tools', 'Garden'],
        'Sports': ['Gym Equipment', 'Camping', 'Cycling', 'Team Sports'],
    };

    // Initialize state with existing listing data
    const [title, setTitle] = useState(listing.title || '');
    const [price, setPrice] = useState(listing.price ? listing.price.toString() : '');
    const [description, setDescription] = useState(listing.description || '');
    const [location, setLocation] = useState(listing.location || '');

    // Handle images array or single image fallback
    const initialImages = listing.images && listing.images.length > 0
        ? listing.images
        : (listing.image ? [listing.image] : []);
    const [images, setImages] = useState(initialImages);

    const [category, setCategory] = useState(listing.category || null);
    const [subCategory, setSubCategory] = useState(listing.subCategory || null);

    const [loading, setLoading] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    // Mock images pool
    const mockImages = [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000', // Camera
        'https://images.unsplash.com/photo-1579829366248-204da8419767?q=80&w=1000&auto=format&fit=crop', // Laptop
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000', // Headphones
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000', // Shoes
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=1000', // Polaroid
        'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=1000', // Furniture
        'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1000', // Car
    ];

    const handleSave = async () => {
        if (!title || !price || !description || !location || !category || images.length === 0) {
            Alert.alert('Error', 'Please fill all required fields and add at least one image.');
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                title,
                price: parseFloat(price),
                description,
                location,
                category,
                subCategory,
                images
            };

            await updateItem(listing.id, updateData);
            setSuccessModalVisible(true);
        } catch (error) {
            console.error('Error updating listing:', error);
            Alert.alert('Error', 'Failed to update listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setSuccessModalVisible(false);
        navigation.goBack();
    };

    const handleImageSelect = () => {
        // Pick random image
        const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
        setImages([...images, randomImage]);
    };

    const handleDeleteImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    // Category Selector Component (Simple Horizontal Scroll)
    const renderCategorySelector = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {categories.map((cat) => {
                const isSelected = category === cat.name;
                const Icon = cat.icon;
                return (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.catChip, isSelected && styles.catChipSelected]}
                        onPress={() => { setCategory(cat.name); setSubCategory(null); }}
                    >
                        <Icon size={16} color={isSelected ? '#FFF' : '#888'} />
                        <Text style={[styles.catChipText, isSelected && styles.catChipTextSelected]}>{cat.name}</Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    const renderSubCategorySelector = () => {
        if (!category || !subCategories[category]) return null;
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                {subCategories[category].map((sub, idx) => {
                    const isSelected = subCategory === sub;
                    return (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.catChip, isSelected && styles.catChipSelected]}
                            onPress={() => setSubCategory(sub)}
                        >
                            <Text style={[styles.catChipText, isSelected && styles.catChipTextSelected]}>{sub}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2B2D42', '#1A1A2E', '#16161E']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Listing</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={colors.primary} size="small" />
                    ) : (
                        <Text style={styles.saveText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

                    <Text style={styles.label}>Title</Text>
                    <GlassView style={styles.inputWrapper} borderRadius={12}>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#666"
                        />
                    </GlassView>

                    <Text style={styles.label}>Category</Text>
                    {renderCategorySelector()}

                    {category && (
                        <>
                            <Text style={styles.label}>Sub-Category</Text>
                            {renderSubCategorySelector()}
                        </>
                    )}

                    <Text style={styles.label}>Daily Price (₹)</Text>
                    <GlassView style={styles.inputWrapper} borderRadius={12}>
                        <TextInput
                            style={styles.input}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                            placeholderTextColor="#666"
                        />
                    </GlassView>

                    <Text style={styles.label}>Location</Text>
                    <GlassView style={styles.inputWrapper} borderRadius={12}>
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                            placeholderTextColor="#666"
                            placeholder="City, Area"
                        />
                    </GlassView>

                    <Text style={styles.label}>Description</Text>
                    <GlassView style={styles.inputWrapper} borderRadius={12}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            placeholderTextColor="#666"
                        />
                    </GlassView>

                    <Text style={styles.label}>Photos</Text>
                    <View style={styles.photosGrid}>
                        {images.map((img, index) => (
                            <View key={index} style={styles.photoContainer}>
                                <Image source={{ uri: img }} style={styles.photoThumb} />
                                <TouchableOpacity
                                    style={styles.deletePhotoBtn}
                                    onPress={() => handleDeleteImage(index)}
                                >
                                    <X size={14} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.addPhotoBtn} onPress={handleImageSelect}>
                            <Camera size={24} color={colors.primary} />
                            <Text style={styles.addPhotoText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={successModalVisible}
                onRequestClose={handleSuccessClose}
            >
                <View style={styles.modalOverlay}>
                    <GlassView style={styles.modalContent} intensity={40} borderRadius={24}>
                        <View style={styles.centeredModalWrapper}>
                            <View style={[styles.modalIconContainer, { borderColor: 'rgba(76, 175, 80, 0.3)', backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                                <Check size={32} color="#4CAF50" />
                            </View>
                            <Text style={styles.modalTitle}>Success!</Text>
                            <Text style={styles.modalDescription}>Your listing has been updated successfully.</Text>

                            <TouchableOpacity style={styles.successBtn} onPress={handleSuccessClose}>
                                <Text style={styles.successBtnText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A1A' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.2)', // Slight bg for header
    },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    saveText: { color: colors.primary, fontSize: 16, fontWeight: '600' },

    content: { padding: 20, paddingBottom: 50 },
    label: { color: '#888', marginBottom: 8, marginTop: 20, fontSize: 14, fontWeight: '500' },
    inputWrapper: { width: '100%', backgroundColor: 'rgba(255,255,255,0.05)' },
    input: {
        padding: 16,
        color: '#FFF',
        fontSize: 16,
    },
    textArea: { height: 120 },

    // Category Chips
    catScroll: { flexDirection: 'row', marginBottom: 5 },
    catChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    catChipSelected: {
        backgroundColor: 'rgba(255, 90, 95, 0.15)',
        borderColor: '#FF5A5F',
    },
    catChipText: { color: '#888', marginLeft: 6, fontSize: 14 },
    catChipTextSelected: { color: '#FFF', fontWeight: '600' },

    // Photos
    photosGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
    photoContainer: { position: 'relative', marginRight: 12, marginBottom: 12 },
    photoThumb: { width: 90, height: 90, borderRadius: 12 },
    deletePhotoBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#FF4545',
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1A1A1A'
    },
    addPhotoBtn: {
        width: 90,
        height: 90,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 90, 95, 0.05)'
    },
    addPhotoText: { color: colors.primary, fontSize: 12, marginTop: 4 },

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
    },
    centeredModalWrapper: {
        alignItems: 'center',
        width: '100%',
    },
    modalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        alignSelf: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 15,
        color: '#CCC',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    successBtn: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    successBtnText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default EditListingScreen;
