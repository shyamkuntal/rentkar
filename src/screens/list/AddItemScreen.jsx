import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, Upload, Check, Camera, Image as ImageIcon } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';

const AddItemScreen = () => {
    const navigation = useNavigation();
    const [step, setStep] = useState(1);

    // Form State
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);

    // Data
    const categories = [
        { id: '1', name: 'Electronics', icon: 'zap' },
        { id: '2', name: 'Vehicles', icon: 'truck' },
        { id: '3', name: 'Fashion', icon: 'shirt' },
        { id: '4', name: 'Home & Garden', icon: 'home' },
        { id: '5', name: 'Sports', icon: 'activity' },
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
                // This cleanup function runs when the screen loses focus
                setStep(1);
                setCategory(null);
                setSubCategory(null);
                setTitle('');
                setDescription('');
                setPrice('');
                setImages([]);
            };
        }, [])
    );

    // Handlers
    const handleNext = () => {
        if (step === 1 && (!category || !subCategory)) return;
        if (step === 2 && (!title || !description)) return;
        if (step === 3 && (!price || images.length === 0)) return;

        if (step < 4) setStep(step + 1);
        else handleSubmit(); // Submit on last step
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigation.goBack();
    };

    const handleImageSelect = () => {
        // Mock image selection
        const mockImages = [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1579829366248-204da8419767?q=80&w=1000&auto=format&fit=crop'
        ];
        // Just add a dummy image for now
        setImages([...images, mockImages[images.length % mockImages.length]]);
    };

    const handleSubmit = () => {
        // Submit logic would go here
        // For now, reset and go to Home or My Ads
        navigation.navigate('Ads');
        // Reset state (optional if unmounting)
    };


    // Render Steps
    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Choose a Category</Text>
            <View style={styles.gridContainer}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.catCardWrapper, category === cat.name && styles.catCardSelectedWrapper]}
                        onPress={() => { setCategory(cat.name); setSubCategory(null); }}
                    >
                        <GlassView style={styles.catCard} borderRadius={16} intensity={category === cat.name ? 40 : 20}>
                            <Text style={[styles.catText, category === cat.name && styles.catTextSelected]}>{cat.name}</Text>
                            {category === cat.name && (
                                <View style={styles.checkIconWrapper}>
                                    <Check size={14} color="#FFF" />
                                </View>
                            )}
                        </GlassView>
                    </TouchableOpacity>
                ))}
            </View>

            {category && (
                <>
                    <Text style={[styles.stepTitle, { marginTop: 20 }]}>Select Sub-Category</Text>
                    <View style={styles.subCatContainer}>
                        {subCategories[category].map((sub, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSubCategory(sub)}
                                style={{ marginBottom: 10, marginRight: 10 }}
                            >
                                <GlassView style={[styles.subButton, subCategory === sub && styles.subButtonSelected]} borderRadius={20} intensity={subCategory === sub ? 40 : 20}>
                                    <Text style={[styles.subText, subCategory === sub && styles.subTextSelected]}>{sub}</Text>
                                </GlassView>
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
            <Text style={styles.label}>Title</Text>
            <GlassView style={styles.inputWrapper} borderRadius={12}>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Sony Alpha a7 Camera"
                    placeholderTextColor="#666"
                    value={title}
                    onChangeText={setTitle}
                />
            </GlassView>

            <Text style={styles.label}>Description</Text>
            <Text style={styles.label}>Description</Text>
            <GlassView style={styles.inputWrapper} borderRadius={12}>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your item... Condition, features, inclusions etc."
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={6}
                    value={description}
                    onChangeText={setDescription}
                    textAlignVertical="top"
                />
            </GlassView>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Price & Photos</Text>

            <Text style={styles.label}>Daily Price (₹)</Text>
            <Text style={styles.label}>Daily Price (₹)</Text>
            <GlassView style={styles.inputWrapper} borderRadius={12}>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />
            </GlassView>

            <Text style={styles.label}>Photos</Text>
            <View style={styles.photosGrid}>
                {images.map((img, index) => (
                    <Image key={index} source={{ uri: img }} style={styles.photoThumb} />
                ))}

                <TouchableOpacity style={styles.addPhotoBtn} onPress={handleImageSelect}>
                    <Camera size={24} color={colors.primary} />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep4 = () => (
        <View style={[styles.stepContainer, { alignItems: 'center', justifyContent: 'center' }]}>
            <View style={styles.successIcon}>
                <Check size={40} color="#FFF" />
            </View>
            <Text style={styles.successTitle}>Ready to Post!</Text>
            <Text style={styles.successSub}>Your ad for "{title}" is ready to go live.</Text>

            <GlassView style={styles.summaryCard} borderRadius={20}>
                <Text style={styles.summaryRow}>Category: <Text style={styles.summaryVal}>{category} {'>'} {subCategory}</Text></Text>
                <Text style={styles.summaryRow}>Price: <Text style={styles.summaryVal}>₹{price}/day</Text></Text>
                <Text style={styles.summaryRow}>Photos: <Text style={styles.summaryVal}>{images.length} uploaded</Text></Text>
            </GlassView>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Nav Header */}
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

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </KeyboardAvoidingView>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextBtnText}>{step === 4 ? 'Post Now' : 'Next'}</Text>
                    {step !== 4 && <ChevronRight size={20} color="#FFF" />}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A1A' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },
    backButton: { width: 40, alignItems: 'flex-start' },

    progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', width: '100%' },
    progressFill: { height: '100%', backgroundColor: colors.primary },

    scrollContent: { padding: 20 },
    stepContainer: { flex: 1 },
    stepTitle: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 20 },

    // Step 1 Styles
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    catCardWrapper: { width: '48%', marginBottom: 12 },
    catCard: { padding: 16, alignItems: 'center', justifyContent: 'center', height: 100 },
    catCardSelectedWrapper: {},
    catText: { color: '#CCC', fontSize: 16, fontWeight: '500' },
    catTextSelected: { color: '#FFF', fontWeight: '700', color: colors.primary },
    checkIconWrapper: { position: 'absolute', top: 10, right: 10, backgroundColor: colors.primary, borderRadius: 10, padding: 2 },

    subCatContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
    subButton: { paddingHorizontal: 16, paddingVertical: 10 },
    subButtonSelected: { backgroundColor: 'rgba(108, 99, 255, 0.2)' },
    subText: { color: '#CCC' },
    subTextSelected: { color: '#FFF', fontWeight: '600' },

    // Step 2 & 3 Styles
    label: { color: '#888', marginBottom: 8, marginTop: 10 },
    inputWrapper: { width: '100%', marginBottom: 10 },
    input: { padding: 16, color: '#FFF', fontSize: 16 },
    textArea: { height: 120 },

    photosGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    photoThumb: { width: 100, height: 100, borderRadius: 12, marginRight: 12, marginBottom: 12 },
    addPhotoBtn: { width: 100, height: 100, borderRadius: 12, borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
    addPhotoText: { color: colors.primary, fontSize: 12, marginTop: 4 },

    // Step 4
    successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success || '#4CAF50', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    successTitle: { fontSize: 28, fontWeight: '700', color: '#FFF', marginBottom: 10 },
    successSub: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 30 },
    summaryCard: { width: '100%', padding: 20 },
    summaryRow: { color: '#CCC', marginBottom: 8, fontSize: 15 },
    summaryVal: { color: '#FFF', fontWeight: '600' },

    footer: { padding: 20, paddingBottom: 100 },
    nextButton: { backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 30 },
    nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginRight: 8 },
});

export default AddItemScreen;
