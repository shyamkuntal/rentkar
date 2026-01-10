import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, Modal, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Camera, X, Check, ChevronDown } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';
import LinearGradient from 'react-native-linear-gradient';
import { updateItem } from '../../services/itemService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '../../config/categories';
import { getCategoryIcon } from '../../utils/categoryIcons';

// Helper to find case-insensitive match in array (defined outside component)
const findMatch = (arr, val) => {
    if (!val || !arr) return val;
    
    // Handle "SubCategory - Brand" format (extract just the subcategory name)
    const baseName = val.includes(' - ') ? val.split(' - ')[0].trim() : val;
    
    const match = arr.find(item => {
        const itemStr = typeof item === 'object' ? item.name : item;
        return itemStr.toLowerCase() === baseName.toLowerCase();
    });
    return match ? (typeof match === 'object' ? match.name : match) : val;
};

const EditListingScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { listing } = route.params;
    const insets = useSafeAreaInsets();

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

    // Calculate initial values synchronously using useMemo so they are available for useState
    const initialValues = useMemo(() => {
        // 1. Category
        let initCategory = listing.category;
        const catMatch = CATEGORIES.find(c => c.name.toLowerCase() === (initCategory || '').toLowerCase());
        if (catMatch) initCategory = catMatch.name;

        // 2. SubCategory
        let initSubCategory = listing.subCategory;
        let finalSubCategory = initSubCategory;
        
        if (initCategory) {
            const catObj = CATEGORIES.find(c => c.name === initCategory);
            if (catObj?.subCategories) {
                finalSubCategory = findMatch(catObj.subCategories, initSubCategory);
            }
        }

        // 3. Brand
        let initBrand = listing.brand;
        if (!initBrand && listing.attributes && typeof listing.attributes === 'object') {
            const brandKeys = Object.keys(listing.attributes).filter(k => 
                k.toLowerCase().includes('brand') || k.toLowerCase().includes('type') || k.toLowerCase().includes('company')
            );
            if (brandKeys.length > 0) initBrand = listing.attributes[brandKeys[0]];
        }
        
        let finalBrand = initBrand;
        if (initCategory && finalSubCategory) {
            const catObj = CATEGORIES.find(c => c.name === initCategory);
            const subObj = catObj?.subCategories?.find(s => (typeof s === 'object' ? s.name : s) === finalSubCategory);
            if (subObj && typeof subObj === 'object' && subObj.data) {
                finalBrand = findMatch(subObj.data, initBrand);
            }
        }

        // 4. Model
        let initModel = listing.model;
        if (!initModel && listing.attributes && typeof listing.attributes === 'object') {
            const modelKeys = Object.keys(listing.attributes).filter(k => 
                k.toLowerCase().includes('model')
            );
            if (modelKeys.length > 0) initModel = listing.attributes[modelKeys[0]];
        }

        return {
            category: initCategory,
            subCategory: finalSubCategory,
            brand: finalBrand || '',
            model: initModel || ''
        };
    }, [listing]);

    const [category, setCategory] = useState(initialValues.category);
    const [subCategory, setSubCategory] = useState(initialValues.subCategory);
    const [brand, setBrand] = useState(initialValues.brand);
    const [model, setModel] = useState(initialValues.model);

    const [loading, setLoading] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    // Get current category object
    const currentCategoryObj = useMemo(() => {
        return CATEGORIES.find(c => c.name === category);
    }, [category]);

    // Get subcategories for current category
    const currentSubCategories = useMemo(() => {
        if (!currentCategoryObj) return [];
        return currentCategoryObj.subCategories || [];
    }, [currentCategoryObj]);

    // Get current subcategory object
    const currentSubCategoryObj = useMemo(() => {
        if (!subCategory || !currentSubCategories.length) return null;
        return currentSubCategories.find(sc => 
            (typeof sc === 'object' ? sc.name : sc) === subCategory
        );
    }, [subCategory, currentSubCategories]);

    // Get brands/types for current subcategory
    const currentBrands = useMemo(() => {
        if (!currentSubCategoryObj || typeof currentSubCategoryObj !== 'object') return [];
        return currentSubCategoryObj.data || [];
    }, [currentSubCategoryObj]);

    // Get models for current brand (if brand is an object with data)
    const currentModels = useMemo(() => {
        if (!brand || !currentBrands.length) return [];
        const brandObj = currentBrands.find(b => (typeof b === 'object' ? b.name : b) === brand);
        if (brandObj && typeof brandObj === 'object' && brandObj.data) {
            return brandObj.data;
        }
        return [];
    }, [brand, currentBrands]);

    // Mock images pool
    const mockImages = [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1579829366248-204da8419767?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
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
                brand,
                model,
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
        const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
        setImages([...images, randomImage]);
    };

    const handleDeleteImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleCategoryChange = (catName) => {
        setCategory(catName);
        setSubCategory(null);
        setBrand('');
        setModel('');
    };

    const handleSubCategoryChange = (subCatName) => {
        setSubCategory(subCatName);
        setBrand('');
        setModel('');
    };

    const handleBrandChange = (brandName) => {
        setBrand(brandName);
        setModel('');
    };

    // Render Category Selector with Icons
    const renderCategorySelector = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORIES.map((cat) => {
                const isSelected = category === cat.name;
                const IconComponent = getCategoryIcon(cat.name);
                return (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.catChip, isSelected && styles.catChipSelected]}
                        onPress={() => handleCategoryChange(cat.name)}
                    >
                        <IconComponent size={16} color={isSelected ? '#FFF' : '#888'} />
                        <Text style={[styles.catChipText, isSelected && styles.catChipTextSelected]} numberOfLines={1}>
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    // Render SubCategory Selector
    const renderSubCategorySelector = () => {
        if (!category || !currentSubCategories.length) return null;
        return (
            <>
                <Text style={styles.label}>Sub-Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                    {currentSubCategories.map((sub, idx) => {
                        const subName = typeof sub === 'object' ? sub.name : sub;
                        const isSelected = subCategory === subName;
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.catChip, isSelected && styles.catChipSelected]}
                                onPress={() => handleSubCategoryChange(subName)}
                            >
                                <Text style={[styles.catChipText, isSelected && styles.catChipTextSelected]}>{subName}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </>
        );
    };

    // Render Brand/Type Selector
    const renderBrandSelector = () => {
        if (!subCategory || !currentBrands.length) return null;
        const label = currentSubCategoryObj?.label || 'Brand';
        return (
            <>
                <Text style={styles.label}>{label}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                    {currentBrands.map((b, idx) => {
                        const brandName = typeof b === 'object' ? b.name : b;
                        const isSelected = brand === brandName;
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.catChip, isSelected && styles.catChipSelected]}
                                onPress={() => handleBrandChange(brandName)}
                            >
                                <Text style={[styles.catChipText, isSelected && styles.catChipTextSelected]}>{brandName}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </>
        );
    };

    // Render Model Selector
    const renderModelSelector = () => {
        if (!brand || !currentModels.length) return null;
        const brandObj = currentBrands.find(b => (typeof b === 'object' ? b.name : b) === brand);
        const label = (brandObj && typeof brandObj === 'object' && brandObj.label) || 'Model';
        return (
            <>
                <Text style={styles.label}>{label}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                    {currentModels.map((m, idx) => {
                        const isSelected = model === m;
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.catChip, isSelected && styles.catChipSelected]}
                                onPress={() => setModel(m)}
                            >
                                <Text style={[styles.catChipText, isSelected && styles.catChipTextSelected]}>{m}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2B2D42', '#1A1A2E', '#16161E']}
                style={StyleSheet.absoluteFill}
            />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
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
                            placeholder="What are you renting?"
                        />
                    </GlassView>

                    <Text style={styles.label}>Category</Text>
                    {renderCategorySelector()}

                    {renderSubCategorySelector()}
                    {renderBrandSelector()}
                    {renderModelSelector()}

                    <Text style={styles.label}>Daily Price (₹)</Text>
                    <GlassView style={styles.inputWrapper} borderRadius={12}>
                        <TextInput
                            style={styles.input}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                            placeholderTextColor="#666"
                            placeholder="0"
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
                            placeholder="Describe your item..."
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

                    <View style={{ height: 50 }} />
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
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
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
    label: { color: '#888', marginBottom: 8, marginTop: 16, fontSize: 14, fontWeight: '500' },
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
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    catChipSelected: {
        backgroundColor: 'rgba(255, 90, 95, 0.15)',
        borderColor: '#FF5A5F',
    },
    catChipText: { color: '#888', marginLeft: 6, fontSize: 13 },
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
