import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, Upload, Check, Camera, MapPin, Laptop, Car, Shirt, Home as HomeIcon, Dumbbell } from 'lucide-react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

const AddItemScreen = () => {
    const navigation = useNavigation();
    const [step, setStep] = useState(1);

    // Form State
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState([]);

    // Data
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

    // Reset form when screen loses focus
    useFocusEffect(
        useCallback(() => {
            return () => {
                setStep(1);
                setCategory(null);
                setSubCategory(null);
                setTitle('');
                setDescription('');
                setPrice('');
                setLocation('');
                setImages([]);
            };
        }, [])
    );

    // Handlers
    const handleNext = () => {
        if (step === 1 && (!category || !subCategory)) return;
        if (step === 2 && (!title || !description || !location)) return;
        if (step === 3 && (!price || images.length === 0)) return;

        if (step < 4) setStep(step + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigation.goBack();
    };

    const handleImageSelect = () => {
        const mockImages = [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1579829366248-204da8419767?q=80&w=1000&auto=format&fit=crop'
        ];
        setImages([...images, mockImages[images.length % mockImages.length]]);
    };

    const handleSubmit = () => {
        navigation.navigate('Ads');
    };

    // Render Category Card with proper styling
    const renderCategoryCard = (cat) => {
        const isSelected = category === cat.name;
        const IconComponent = cat.icon;
        
        return (
            <TouchableOpacity
                key={cat.id}
                style={[styles.catCard, isSelected && styles.catCardSelected]}
                onPress={() => { setCategory(cat.name); setSubCategory(null); }}
                activeOpacity={0.8}
            >
                <View style={[styles.catIconContainer, isSelected && styles.catIconSelected]}>
                    <IconComponent size={28} color={isSelected ? '#FF5A5F' : '#888'} />
                </View>
                <Text style={[styles.catText, isSelected && styles.catTextSelected]}>{cat.name}</Text>
                {isSelected && (
                    <View style={styles.checkBadge}>
                        <Check size={12} color="#FFF" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    // Render Steps
    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Choose a Category</Text>
            <View style={styles.gridContainer}>
                {categories.map(renderCategoryCard)}
            </View>

            {category && (
                <>
                    <Text style={[styles.stepTitle, { marginTop: 24 }]}>Select Sub-Category</Text>
                    <View style={styles.subCatContainer}>
                        {subCategories[category].map((sub, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSubCategory(sub)}
                                style={[styles.subButton, subCategory === sub && styles.subButtonSelected]}
                            >
                                <Text style={[styles.subText, subCategory === sub && styles.subTextSelected]}>{sub}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Item Details</Text>

            <Text style={styles.label}>Title</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Sony Alpha a7 Camera"
                    placeholderTextColor="#666"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <Text style={styles.label}>Description</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your item..."
                    placeholderTextColor="#666"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                />
            </View>

            <Text style={styles.label}>Location</Text>
            <View style={styles.inputWrapper}>
                <MapPin size={20} color="#888" style={{ marginRight: 10 }} />
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter pickup location"
                    placeholderTextColor="#666"
                    value={location}
                    onChangeText={setLocation}
                />
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Pricing & Photos</Text>

            <Text style={styles.label}>Price per day (₹)</Text>
            <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="800"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />
                <Text style={styles.perDay}>/day</Text>
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>Add Photos</Text>
            <View style={styles.photosGrid}>
                {images.map((img, index) => (
                    <Image key={index} source={{ uri: img }} style={styles.photoThumb} />
                ))}
                <TouchableOpacity style={styles.addPhotoBtn} onPress={handleImageSelect}>
                    <Camera size={24} color="#FF5A5F" />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep4 = () => (
        <View style={[styles.stepContainer, { alignItems: 'center', justifyContent: 'center', paddingTop: 40 }]}>
            <View style={styles.successIcon}>
                <Check size={40} color="#FFF" />
            </View>
            <Text style={styles.successTitle}>Ready to Post!</Text>
            <Text style={styles.successSub}>Your ad for "{title}" is ready to go live.</Text>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryRow}>Category: <Text style={styles.summaryVal}>{category} {'>'} {subCategory}</Text></Text>
                <Text style={styles.summaryRow}>Location: <Text style={styles.summaryVal}>{location}</Text></Text>
                <Text style={styles.summaryRow}>Price: <Text style={styles.summaryVal}>₹{price}/day</Text></Text>
                <Text style={styles.summaryRow}>Photos: <Text style={styles.summaryVal}>{images.length} uploaded</Text></Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2B2D42', '#1A1A2E', '#16161E']}
                style={StyleSheet.absoluteFill}
            />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{step === 4 ? 'Review' : `Step ${step} of 4`}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${step * 25}%` }]} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </KeyboardAvoidingView>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[
                        styles.nextButton,
                        ((step === 1 && (!category || !subCategory)) ||
                         (step === 2 && (!title || !description || !location)) ||
                         (step === 3 && (!price || images.length === 0))) && styles.nextButtonDisabled
                    ]} 
                    onPress={handleNext}
                >
                    <Text style={styles.nextBtnText}>{step === 4 ? 'Post Now' : 'Next'}</Text>
                    {step !== 4 && <ChevronRight size={20} color="#FFF" />}
                </TouchableOpacity>
            </View>
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
        paddingBottom: 20 
    },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },
    backButton: { 
        width: 40, 
        height: 40, 
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', width: '100%' },
    progressFill: { height: '100%', backgroundColor: '#FF5A5F' },

    scrollContent: { padding: 20, paddingBottom: 120 },
    stepContainer: { flex: 1 },
    stepTitle: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 20 },

    // Category Cards
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    catCard: { 
        width: '48%', 
        marginBottom: 12, 
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    catCardSelected: { 
        backgroundColor: 'rgba(255,90,95,0.1)',
        borderColor: '#FF5A5F',
    },
    catIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    catIconSelected: {
        backgroundColor: 'rgba(255,90,95,0.2)',
    },
    catText: { color: '#888', fontSize: 14, fontWeight: '500', textAlign: 'center' },
    catTextSelected: { color: '#FFF', fontWeight: '600' },
    checkBadge: { 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        backgroundColor: '#FF5A5F', 
        borderRadius: 10, 
        padding: 3, 
    },

    // Subcategories
    subCatContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
    subButton: { 
        paddingHorizontal: 16, 
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    subButtonSelected: { 
        backgroundColor: 'rgba(255,90,95,0.15)',
        borderColor: '#FF5A5F',
    },
    subText: { color: '#888', fontSize: 14 },
    subTextSelected: { color: '#FFF', fontWeight: '600' },

    // Form Inputs
    label: { color: '#888', marginBottom: 8, marginTop: 16, fontSize: 14 },
    inputWrapper: { 
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    input: { 
        paddingVertical: 16, 
        color: '#FFF', 
        fontSize: 16,
        flex: 1,
    },
    textArea: { height: 120, textAlignVertical: 'top' },
    currencySymbol: { color: '#FF5A5F', fontSize: 18, fontWeight: '700' },
    perDay: { color: '#888', fontSize: 14 },

    // Photos
    photosGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
    photoThumb: { width: 100, height: 100, borderRadius: 12, marginRight: 12, marginBottom: 12 },
    addPhotoBtn: { 
        width: 100, 
        height: 100, 
        borderRadius: 12, 
        borderWidth: 2, 
        borderColor: '#FF5A5F', 
        borderStyle: 'dashed', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(255,90,95,0.05)',
    },
    addPhotoText: { color: '#FF5A5F', fontSize: 11, marginTop: 4, fontWeight: '500' },

    // Success Step
    successIcon: { 
        width: 80, 
        height: 80, 
        borderRadius: 40, 
        backgroundColor: '#00D084', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 20 
    },
    successTitle: { fontSize: 28, fontWeight: '700', color: '#FFF', marginBottom: 10 },
    successSub: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 30 },
    summaryCard: { 
        width: '100%', 
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    summaryRow: { color: '#888', marginBottom: 12, fontSize: 15 },
    summaryVal: { color: '#FFF', fontWeight: '600' },

    // Footer
    footer: { 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20, 
        paddingBottom: 40,
        backgroundColor: '#1A1A1A',
    },
    nextButton: { 
        backgroundColor: '#FF5A5F', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 16, 
        borderRadius: 30 
    },
    nextButtonDisabled: {
        backgroundColor: '#444',
    },
    nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginRight: 8 },
});

export default AddItemScreen;
