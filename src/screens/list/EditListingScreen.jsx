import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import GlassView from '../../components/GlassView';

const EditListingScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { listing } = route.params;

    // Initialize state with existing listing data
    const [title, setTitle] = useState(listing.title || '');
    const [price, setPrice] = useState(listing.price ? listing.price.toString() : '');
    const [description, setDescription] = useState('This is a detailed description of the item. It is in excellent condition and includes all original accessories.');
    const [images, setImages] = useState(listing.image ? [listing.image] : []);

    const handleSave = () => {
        // Here you would typically make an API call to update the listing
        Alert.alert("Success", "Listing updated successfully!", [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    const handleImageSelect = () => {
        // Mock add image
        Alert.alert("Info", "Image selection would open here.");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Listing</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
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
                            <Image key={index} source={{ uri: img }} style={styles.photoThumb} />
                        ))}
                        <TouchableOpacity style={styles.addPhotoBtn} onPress={handleImageSelect}>
                            <Camera size={24} color={colors.primary} />
                            <Text style={styles.addPhotoText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </ScrollView>
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
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)'
    },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },
    backButton: { padding: 8, marginLeft: -8 },
    saveText: { color: colors.primary, fontSize: 16, fontWeight: '600' },

    content: { padding: 20 },
    label: { color: '#888', marginBottom: 8, marginTop: 16, fontSize: 14 },
    inputWrapper: { width: '100%' },
    input: {
        padding: 16,
        color: '#FFF',
        fontSize: 16,
    },
    textArea: { height: 120 },

    photosGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
    photoThumb: { width: 90, height: 90, borderRadius: 12, marginRight: 12, marginBottom: 12 },
    addPhotoBtn: {
        width: 90,
        height: 90,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)'
    },
    addPhotoText: { color: colors.primary, fontSize: 12, marginTop: 4 },
});

export default EditListingScreen;
